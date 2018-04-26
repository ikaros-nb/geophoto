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
    const timestamp = new Date().getTime();
    const pictureName = `photo-${this.user.uid}-${timestamp}.jpg`;
    const photoRef = firebase
      .storage()
      .ref(`photos/${this.user.uid}/${pictureName}`);

    photoRef
      .putString(picture, 'base64', { contentType: 'image/jpeg' })
      .then(savedPicture => {
        let metadata = {
          customMetadata: {
            title: 'My super capture!',
            location: 'Yosemite, CA, USA'
          }
        };
        photoRef.updateMetadata(metadata);

        firebase
          .database()
          .ref(`photos`)
          .push({
            name: savedPicture.metadata.name,
            pictureURL: savedPicture.downloadURL,
            createdAt: savedPicture.metadata.timeCreated,
            user: {
              uid: this.user.uid,
              pseudo: this.fireAuth.getUserSession().pseudo,
              avatarURL: this.fireAuth.getUserSession().avatarURL
            }
          });
      });
  }

  public deletePhotoInStorage(photo: Photo) {
    const photoRef = firebase
      .storage()
      .ref(`photos/${photo.user.uid}/${photo.name}`);

    return photoRef.delete();
  }

  public deletePhotoInFirebase() {}

  public getPhotoMetadataInFirebase(photo: Photo) {
    const photoRef = firebase
      .storage()
      .ref(`photos/${photo.user.uid}/${photo.name}`);

    return photoRef.getMetadata();
  }

  public updatePhotoMetadataInFirebase(photo: Photo) {
    const photoRef = firebase
      .storage()
      .ref(`photos/${photo.user.uid}/${photo.name}`);

    let newMetadata = {
      customMetadata: {
        title: photo.metadata.title == '' ? null : photo.metadata.title,
        location: photo.metadata.location == '' ? null : photo.metadata.location
      }
    };

    return photoRef.updateMetadata(newMetadata);
  }
}
