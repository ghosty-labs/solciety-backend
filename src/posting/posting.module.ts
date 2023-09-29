import { Module } from '@nestjs/common';
import { PostingService } from './posting.service';
import { PostingController } from './posting.controller';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports: [ProfileModule],
  providers: [PostingService],
  controllers: [PostingController],
  exports: [PostingService],
})
export class PostingModule {}
