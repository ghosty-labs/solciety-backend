import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { NotificationDB } from 'schemas/notification.schema';
import { ProfileService } from 'src/profile/profile.service';
import {
  CreateNotificationPayloadData,
  FindNotificationPayloadData,
} from './notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(NotificationDB.name)
    private notificationModel: Model<NotificationDB>,

    private readonly profileService: ProfileService,
  ) {}

  async updateHasNotificationByUser(publicKey: string) {
    return await this.profileService.updateHasNotificationToFalse(publicKey);
  }

  async findNotifications(
    query: FindNotificationPayloadData,
    skip: number,
    limit: number,
  ) {
    const aggregations = [];

    if (query.type) {
      aggregations.push({
        $match: { type: query.type },
      });
    }

    aggregations.push({
      $match: { user: query.publicKey },
    });

    const aggregationMatches = [...aggregations];

    aggregations.push({ $skip: skip });
    aggregations.push({ $limit: limit });

    const [notifications, total] = await Promise.all([
      this.notificationModel.aggregate(aggregations),
      this.notificationModel.aggregate(
        aggregationMatches.concat([{ $count: 'count' }]),
      ),
    ]);

    return {
      results: notifications,
      total: total[0]?.count || 0,
      skip,
      limit,
    };
  }

  async createNotification(
    session: ClientSession,
    payload: CreateNotificationPayloadData,
  ) {
    await new this.notificationModel<NotificationDB>(payload).save({ session });
  }
}
