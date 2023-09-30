import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CommentDB, CommentDocument } from 'schemas/comment.schema';
import { CommentLogData, CommentPayloadData } from './comment.entity';
import { mongoWithTransaction } from 'utils/mongoWithTransaction';
import { PostingService } from 'src/posting/posting.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(CommentDB.name)
    private commentModel: Model<CommentDocument>,

    @InjectConnection()
    private readonly mongooseConnection: Connection,

    private readonly postingService: PostingService,
  ) {}

  async getCommentBySignature(signature: string) {
    return await this.commentModel.findOne({ signature });
  }

  async findComments(query: CommentPayloadData, skip: number, limit: number) {
    const aggregations = [];

    if (query.user) {
      aggregations.push({ $match: { user: query.user } });
    }
    if (query.post) {
      aggregations.push({ $match: { post: query.post } });
    }
    if (query.parent) {
      aggregations.push({ $match: { parent: query.parent } });
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

    const [comments, total] = await Promise.all([
      this.commentModel.aggregate(aggregations),
      this.commentModel.aggregate(
        aggregationMatches.concat([{ $count: 'count' }]),
      ),
    ]);

    return {
      results: comments,
      total: total[0]?.count || 0,
      skip,
      limit,
    };
  }

  async createComment(comment: CommentLogData) {
    await mongoWithTransaction(this.mongooseConnection, async (session) => {
      await new this.commentModel<CommentDB>({
        signature: comment.signature,
        key: comment.key,
        user: comment.user,
        post: comment.post,
        parent: comment.parent,
        content: comment.content,
      }).save({ session });
      await this.postingService.incrementTotalCommentWithSession(
        session,
        comment.post,
      );
    });
  }
}
