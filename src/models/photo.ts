import { User } from '@models/user';
import { Metadata } from '@models/metadata';

export interface Photo {
  name: string;
  pictureURL: string;
  createdAt: string;
  user: User;
  metadata: Metadata;
}
