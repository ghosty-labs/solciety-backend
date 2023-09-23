export enum PostingLogPrefix {
  SendPost = 'SENDPOST',
  UpdatePost = 'UPDATEPOST',
  DeletePost = 'DELETEPOST',
}

export class PostingLogData {
  signature: string;
  key: string;
  user: string;
  tag: string;
  content: string;
  timestamp: number;
}

export class PostingPayloadData {
  user: string;
  tag: string;
  search: string;
}
