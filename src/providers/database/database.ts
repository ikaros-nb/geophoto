import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import { User } from '../../models/user';
import { Photo } from './../../models/photo';
import { Observable } from 'rxjs/Observable';

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

  public getFavPhoto(photo: Photo) {
    let like = this.db
      .get(photo.name)
      .then(favPhoto => favPhoto)
      .catch(error => console.log('error', error));

    return Observable.fromPromise(like);
  }

  public toFavPhoto(photo: Photo) {
    let like = this.db
      .get(photo.name)
      .then(favPhoto => {
        return this.db.remove(favPhoto);
      })
      .catch(error => {
        this.db
          .put({ _id: photo.name, photo })
          .then(result => console.log('result', result))
          .catch(error => console.log('error', error));
      });

    return Observable.fromPromise(like);
  }
}
