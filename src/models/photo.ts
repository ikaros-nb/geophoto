import { User } from './user';
import { Metadata } from './metadata';

export interface Photo {
  name: string;
  pictureURL: string;
  createdAt: string;
  user: User;
  metadata: Metadata;
}
