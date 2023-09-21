import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostDB, PostSchema } from 'schemas/post.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PostDB.name,
        schema: PostSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class GlobalModule {}
