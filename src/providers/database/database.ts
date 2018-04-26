import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import { User } from '../../models/user';
import { Photo } from './../../models/photo';

@Injectable()
export class DatabaseProvider {
  private db: any;

  constructor() {}

  public get() {
    return this.db;
  }

  public setup(user: User) {
    this.db = new PouchDB(`geophoto_${user.uid}`);
  }

  public addFavPhoto(photo: Photo) {

  }
}
