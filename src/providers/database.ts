import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import { User } from '@models/user';
import { Photo } from '@models/photo';
import { Observable } from 'rxjs/Observable';
import image2base64 from 'image-to-base64';

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
      .catch(error => null);

    return Observable.fromPromise(like);
  }

  public toFavPhoto(photo: Photo) {
    let like = this.db
      .get(photo.name)
      .then(favPhoto => this.db.remove(favPhoto))
      .catch(error => {
        image2base64(photo.pictureURL)
          .then(response => {
            photo.pictureURL = `data:image/jpeg;base64,${response}`;
            this.db
              .put({ _id: photo.name, photo })
              .then(result => console.log('result', result))
              .catch(error => console.error('error', error));
          })
          .catch(error => console.log(error));
      });

    return Observable.fromPromise(like);
  }

  public removeFavPhoto(photo: Photo) {
    let like = this.db
      .get(photo.name)
      .then(favPhoto => this.db.remove(favPhoto))
      .catch(error => console.error('error', error));

    return Observable.fromPromise(like);
  }

  public listFavPhoto() {
    let likes = this.db
      .allDocs({ include_docs: true })
      .then(result => result.rows)
      .catch(error => console.error('error', error));

    return Observable.fromPromise(likes);
  }
}
