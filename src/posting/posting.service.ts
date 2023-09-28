import { Injectable } from '@nestjs/common';
import { PostingLogData, PostingPayloadData } from './posting.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PostDB, PostDocument } from 'schemas/post.schema';
import { Model } from 'mongoose';
import { ProfileDB, ProfileDocument } from 'schemas/profile.schema';

@Injectable()
export class PostingService {
  constructor(
    @InjectModel(PostDB.name)
    private postModel: Model<PostDocument>,
    @InjectModel(ProfileDB.name)
    private profileModel: Model<ProfileDocument>,
  ) {}

  async findPosting(query: PostingPayloadData, skip: number, limit: number) {
    const aggregations = [];

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

    aggregations.push({
      $lookup: {
        from: 'comments',
        as: 'comments',
        localField: 'key',
        foreignField: 'post',
      },
    });
    aggregations.push({
      $addFields: { total_comment: { $size: '$comments' } },
    });
    aggregations.push({ $unset: 'comments' });

    aggregations.push({ $sort: { created_at: -1 } });

    const aggregationMatches = [...aggregations];

    aggregations.push({ $skip: skip });
    aggregations.push({ $limit: limit });

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

  async getNewPostingStatus(publicKey: string) {
    return await this.profileModel
      .findOne({ public_key: publicKey })
      .select({ _id: 0, has_new_post: 1 });
  }

  async createPosting(posting: PostingLogData) {
    const createPost = new this.postModel<PostDB>({
      signature: posting.signature,
      key: posting.key,
      user: posting.user,
      tag: posting.tag,
      content: posting.content,
      created_at: posting.timestamp,
    });
    await createPost.save();
  }
}
