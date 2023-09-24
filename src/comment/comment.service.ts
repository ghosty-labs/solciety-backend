import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentDB, CommentDocument } from 'schemas/comment.schema';
import { CommentLogData, CommentPayloadData } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(CommentDB.name)
    private commentModel: Model<CommentDocument>,
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
    const creatingComment = new this.commentModel<CommentDB>({
      signature: comment.signature,
      key: comment.key,
      user: comment.user,
      post: comment.post,
      parent: comment.parent,
      content: comment.content,
    });

    await creatingComment.save();
  }
}
