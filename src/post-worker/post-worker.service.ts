import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Connection, PublicKey } from '@solana/web3.js';
import { Queue } from 'bull';
import { CommentLogPrefix } from 'src/comment/comment.entity';
import { PostingLogData, PostingLogPrefix } from 'src/posting/posting.entity';

@Injectable()
export class PostWorkerService implements OnModuleInit {
  constructor(
    @InjectQueue('POST_LOGS_INDEXER_WORKER')
    private postLogsQueue: Queue,
  ) {}

  async onModuleInit() {
    const WSS_ENDPOINT =
      'wss://aged-cool-shard.solana-devnet.discover.quiknode.pro/63e5d459890844fd35c95e5872eb460332d8f25d/';
    const HTTP_ENDPOINT =
      'https://aged-cool-shard.solana-devnet.discover.quiknode.pro/63e5d459890844fd35c95e5872eb460332d8f25d/';

    const solanaConnection = new Connection(HTTP_ENDPOINT, {
      wsEndpoint: WSS_ENDPOINT,
    });

    const sleep = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    (async () => {
      const ACCOUNT_TO_WATCH = new PublicKey(
        '6sTexXR4daCeaGPL6dBpaVhadBMjU9fMkpUhSP4MGEEs',
      );
      const subscriptionId = solanaConnection.onLogs(
        ACCOUNT_TO_WATCH,
        async (result) => {
          const logs = result.logs || [];

          const contractLog = logs.find((log) => log.includes('SOLCIETYLOGS'));
          const [key, value] = contractLog.split('::');

          const keyPrefix = key.split('_')[1];

          switch (keyPrefix) {
            case PostingLogPrefix.SendPost:
              const stringValue = value.slice(3, -1).replace(/\\n/g, '');
              const objectValue = JSON.parse(stringValue);
              const postingData: PostingLogData = JSON.parse(objectValue);
              postingData['signature'] = result.signature;

              console.log('INI DI SWITCH CASE');
              await this.postLogsQueue.add(postingData);
              console.log('SETELAH ADD Q');
              break;

            case PostingLogPrefix.UpdatePost:
              //TODO handle
              break;

            case PostingLogPrefix.DeletePost:
              //TODO handle
              break;

            case CommentLogPrefix.SendComment:
              //TODO handle
              break;

            case CommentLogPrefix.UpdateComment:
              //TODO handle
              break;

            case CommentLogPrefix.DeleteComment:
              //TODO handle
              break;

            default:
              break;
          }
        },
      );
      console.log('Starting web socket, subscription ID: ', subscriptionId);
      await sleep(5000); //Wait 5 seconds for Socket Testing
    })();
  }
}
