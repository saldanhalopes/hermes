import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateNotificationDto } from './notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('FIREBASE_ADMIN')
    private readonly firebaseAdmin: admin.app.App,
  ) {}

  private get firestore() {
    return this.firebaseAdmin.firestore();
  }

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = {
      ...createNotificationDto,
      read: false,
      createdAt: new Date().toISOString(),
    };

    const docRef = await this.firestore
      .collection('notifications')
      .add(notification);
    
    return { id: docRef.id, ...notification };
  }

  async findAllByUser(userId: string) {
    const snapshot = await this.firestore
      .collection('notifications')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async markAsRead(id: string) {
    await this.firestore
      .collection('notifications')
      .doc(id)
      .update({ read: true });
    
    return { success: true };
  }

  async markAllAsRead(userId: string) {
    const snapshot = await this.firestore
      .collection('notifications')
      .where('userId', '==', userId)
      .where('read', '==', false)
      .get();

    const batch = this.firestore.batch();
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });
    
    await batch.commit();
    return { count: snapshot.size };
  }
}
