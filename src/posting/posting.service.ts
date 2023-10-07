import { Injectable } from '@nestjs/common';
import { PostingLogData, PostingPayloadData } from './posting.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PostDB, PostDocument } from 'schemas/post.schema';
import { ClientSession, Model } from 'mongoose';

@Injectable()
export class PostingService {
  constructor(
    @InjectModel(PostDB.name)
    private postModel: Model<PostDocument>,
  ) {}

  async findPosting(query: PostingPayloadData, skip: number, limit: number) {
    const aggregations = [];

    if (query.key) {
      aggregations.push({ $match: { key: query.key } });
    }
    if (query.user) {
      aggregations.push({ $match: { user: query.user } });
    }
    if (query.tag) {
      aggregations.push({ $match: { user: query.tag } });
    }
    if (query.tag) {
      const searchPayload = new RegExp(
        query.search
          .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
          .replace(/-/g, '\\x2d'),
      );
      aggregations.push({
        $match: {
          $or: [
            { user: searchPayload },
            { tag: searchPayload },
            { content: searchPayload },
          ],
        },
      });
    }

    aggregations.push({ $sort: { created_at: -1 } });

    const aggregationMatches = [...aggregations];

    aggregations.push({ $skip: skip });
    aggregations.push({ $limit: limit });

    aggregations.push({
      $lookup: {
        from: 'profiles',
        as: 'profiles',
        localField: 'user',
        foreignField: 'public_key',
      },
    });
    aggregations.push({ $set: { profile: { $first: '$profiles' } } });
    aggregations.push({
      $set: { image: '$profile.image', alias: '$profile.alias' },
    });
    aggregations.push({ $unset: ['profiles', 'profile'] });

    if (query.likedBy) {
      aggregations.push(
        {
          $lookup: {
            from: 'likes',
            as: 'likes',
            let: {
              user: query.likedBy,
              post: '$key',
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

    const [posting, total] = await Promise.all([
      this.postModel.aggregate(aggregations),
      this.postModel.aggregate(
        aggregationMatches.concat([{ $count: 'count' }]),
      ),
    ]);

    return {
      results: posting,
      total: total[0]?.count || 0,
      skip,
      limit,
    };
  }

  async getPostingBySignature(signature: string) {
    return await this.postModel.findOne({ signature });
  }

  async getPostingByKey(key: string) {
    return await this.postModel.findOne({ key });
  }

  async createPosting(posting: PostingLogData) {
    const createPost = new this.postModel<PostDB>({
      signature: posting.signature,
      key: posting.key,
      user: posting.user,
      tag: posting.tag,
      content: posting.content,
      total_comment: 0,
      total_like: 0,
    });
    await createPost.save();
  }

  async incrementTotalCommentWithSession(
    session: ClientSession,
    postPublicKey: string,
  ) {
    await this.postModel.updateOne(
      { key: postPublicKey },
      { $inc: { total_comment: 1 } },
      { session },
    );
  }

  async incrementTotalLikeWithSession(
    session: ClientSession,
    postPublicKey: string,
    value: number,
  ) {
    await this.postModel.updateOne(
      { key: postPublicKey },
      { $inc: { total_like: value } },
      { session },
    );
  }
}
