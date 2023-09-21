import { Injectable } from '@nestjs/common';
import { PostingLogData } from './posting.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PostDB, PostDocument } from 'schemas/post.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostingService {
  constructor(
    @InjectModel(PostDB.name)
    private postModel: Model<PostDocument>,
  ) {}

  async getPostingBySignature(signature: string) {
    return await this.postModel.findOne({ signature });
  }

  async createPosting(posting: PostingLogData) {
    const post = await this.getPostingBySignature(posting.signature);
    if (post) {
      console.error(`error.posting: signature alrady exist`);
      return;
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
