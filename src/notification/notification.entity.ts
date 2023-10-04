export enum NotificationType {
  Follow = 'FOLLOW',
  Like = 'LIKE',
}

export class FindNotificationPayloadData {
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
