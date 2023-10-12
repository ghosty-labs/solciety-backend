import { BadRequestException, Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { LikeDB, LikeDocument } from 'schemas/like.schema';
import { mongoWithTransaction } from 'utils/mongoWithTransaction';
import { PostingService } from 'src/posting/posting.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationType } from 'src/notification/notification.entity';
import { LikeData, LikePayloadData } from './like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(LikeDB.name)
    private likeModel: Model<LikeDocument>,

    @InjectConnection()
    private readonly mongooseConnection: Connection,

    @InjectQueue('NOTIFICATION_QUEUE')
    private notificationQueue: Queue,

    private readonly postingService: PostingService,
  ) {}

  async findLikes(query: LikePayloadData, skip: number, limit: number) {
    const aggregations = [];

    if (query.user) {
      aggregations.push({ $match: { user: query.user } });
    }

    aggregations.push({ $sort: { created_at: -1 } });

    const aggregationMatches = [...aggregations];

    aggregations.push({ $skip: skip });
    aggregations.push({ $limit: limit });

    if (query.likedBy) {
      aggregations.push(
        {
          $lookup: {
            from: 'likes',
            as: 'likes',
            let: {
              user: query.likedBy,
              post: '$post',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$user', '$$user'] },
                      { $eq: ['$post', '$$post'] },
                    ],
                  },
                },
              },
              { $project: { _id: 0, __v: 0, updated_at: 0 } },
            ],
          },
        },
        { $set: { likes: { $first: '$likes' } } },
      );
    }

    aggregations.push({
      $lookup: {
        from: 'posts',
        as: 'posts',
        localField: 'post',
        foreignField: 'key',
      },
    });
    aggregations.push({ $set: { posts: { $first: '$posts' } } });
    aggregations.push({
      $set: {
        'post_data.content': '$posts.content',
        'post_data.tag': '$posts.tag',
        'post_data.user': '$posts.user',
        'post_data.created_at': '$posts.created_at',
        'post_data.total_comment': '$posts.total_comment',
        'post_data.total_like': '$posts.total_like',
      },
    });
    aggregations.push({
      $lookup: {
        from: 'profiles',
        as: 'post_profiles',
        localField: 'post_data.user',
        foreignField: 'public_key',
      },
    });
    aggregations.push({
      $set: { post_profiles: { $first: '$post_profiles' } },
    });
    aggregations.push({
      $set: {
        'post_data.user_image': '$post_profiles.image',
        'post_data.user_alias': '$post_profiles.alias',
      },
    });
    aggregations.push({ $unset: ['posts', 'post_profiles'] });

    const [likes, total] = await Promise.all([
      this.likeModel.aggregate(aggregations),
      this.likeModel.aggregate(
        aggregationMatches.concat([{ $count: 'count' }]),
      ),
    ]);

    return {
      results: likes,
      total: total[0]?.count || 0,
      skip,
      limit,
    };
  }

  async createLike(publicKey: string, postPublicKey: string) {
    const like = await this.likeModel.findOne({
      user: publicKey,
      post: postPublicKey,
    });

    if (like)
      throw new BadRequestException(`error: you already liked this post`);

    await mongoWithTransaction(this.mongooseConnection, async (session) => {
      await new this.likeModel<LikeDB>({
        user: publicKey,
        post: postPublicKey,
      }).save({ session });
      await this.postingService.incrementTotalLikeWithSession(
        session,
        postPublicKey,
        1,
      );
    });

    await this.notificationQueue.add(NotificationType.Like, {
      user: publicKey,
      post: postPublicKey,
    } as LikeData);

    return true;
  }

  async deleteLike(publicKey: string, postPublicKey: string) {
    const like = await this.likeModel.findOne({
      user: publicKey,
      post: postPublicKey,
    });

    if (!like)
      throw new BadRequestException(`error: you have not liked this post`);

    await mongoWithTransaction(this.mongooseConnection, async (session) => {
      await this.likeModel.deleteOne({ user: publicKey, post: postPublicKey });
      await this.postingService.incrementTotalLikeWithSession(
        session,
        postPublicKey,
        -1,
      );
    });

    return true;
  }
}
