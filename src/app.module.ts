import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostWorkerModule } from './post-worker/post-worker.module';
import { PostingModule } from './posting/posting.module';
import { CommentModule } from './comment/comment.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GlobalModule } from 'global.module';

@Module({
  imports: [
    GlobalModule,
    MongooseModule.forRoot(
      'mongodb://localhost:27017/?readPreference=primary&directConnection=true&ssl=false',
    ),
    PostWorkerModule,
    PostingModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
