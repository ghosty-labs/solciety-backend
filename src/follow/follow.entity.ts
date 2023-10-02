export enum FollowLogPrefix {
  FollowUser = 'FOLLOWUSER',
  UnfollowUser = 'UNFOLLOWUSER',
}

export enum FollowJobNameEnum {
  Follow = 'FOLLOW',
  Unfollow = 'UNFOLLOW',
}

export class FollowUserLogData {
  signature: string;
  user: string;
  key: string;
  following: string;
  timestamp: number;
}

export class UnfollowUserLogData {
  signature: string;
  user: string;
  key: string;
  unfollowing: string;
  timestamp: number;
}

export class FollowPayloadData {
  signature: string;
  user: string;
  following: string;
}

export class UnfollowPayloadData {
  user: string;
  following: string;
}
