export enum CommentLogPrefix {
  SendComment = 'SENDCOMMENT',
  UpdateComment = 'UPDATECOMMENT',
  DeleteComment = 'DELETECOMMENT',
}

export class CommentLogData {
  signature: string;
  key: string;
  user: string;
  post: string;
  content: string;
  parent: string;
  timestamp: number;
}

export class CommentPayloadData {
  user: string;
  post: string;
  parent: string;
}
