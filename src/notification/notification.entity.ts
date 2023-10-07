export enum NotificationType {
  Follow = 'FOLLOW',
  Like = 'LIKE',
  Comment = 'COMMENT',
}

export class FindNotificationPayloadData {
  type: string;
  publicKey: string;
}

export class CreateNotificationPayloadData {
  type: NotificationType;
  key: string;
  user: string;
  from: string;
  icon: string;
  data?: any;
}
