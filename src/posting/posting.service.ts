import { Injectable } from '@nestjs/common';
import { PostingLogData, PostingPayloadData } from './posting.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PostDB, PostDocument } from 'schemas/post.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostingService {
  constructor(
    @InjectModel(PostDB.name)
    private postModel: Model<PostDocument>,
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
      $sort: { _id: -1 },
    });

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
      total: total[0].count || 0,
      skip,
      limit,
    };
  }

  async getPostingBySignature(signature: string) {
    return await this.postModel.findOne({ signature });
  }

  async createPosting(posting: PostingLogData) {
    const post = await this.getPostingBySignature(posting.signature);
    if (post) {
      throw new Error(`error.posting: signature alrady exist`);
    }

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
