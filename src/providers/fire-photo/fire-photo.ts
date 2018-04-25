import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import firebase from 'firebase';
import { FireAuthProvider } from './../fire-auth/fire-auth';
import { User } from '../../models/user';
import { Photo } from '../../models/photo';

@Injectable()
export class FirePhotoProvider {
  user = {} as User;
  photosRef: AngularFireList<Photo>;

  constructor(
    private fireAuth: FireAuthProvider,
    private afDB: AngularFireDatabase
  ) {
    this.user = this.fireAuth.getUserSession();
  }

  public listAllFromFirebase() {
    return (this.photosRef = this.afDB.list(`photos`, ref =>
      ref.orderByChild(`createdAt`)
    ));
  }

  public listbyUserFromFirebase() {
    return (this.photosRef = this.afDB.list(`photos`, ref =>
      ref.orderByChild(`user/pseudo`).equalTo(this.user.pseudo)
    ));
  }

  public addPhotoInFirebase(picture: string) {
    const currentDate = new Date();
    const photoRef = firebase
      .storage()
      .ref(`photos/${this.user.uid}/photo-${currentDate.getTime()}.jpg`);

    photoRef
      .putString(picture, 'base64', { contentType: 'image/jpeg' })
      .then(savedPicture => {
        firebase
          .database()
          .ref(`photos`)
          .push({
            createdAt: currentDate.toJSON(),
            pictureURL: savedPicture.downloadURL,
            user: {
              avatarURL: this.fireAuth.getUserSession().avatarURL,
              pseudo: this.fireAuth.getUserSession().pseudo,
              uid: this.user.uid
            }
          });
      });
  }
}
