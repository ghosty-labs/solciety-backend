import { Module } from '@nestjs/common';
import { LogsWorkerService } from './logs-worker.service';

@Module({
  providers: [LogsWorkerService],
})
export class LogsWorkerModule {}
