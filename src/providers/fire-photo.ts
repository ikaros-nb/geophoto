import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import firebase from 'firebase';
import { User } from '@models/user';
import { Photo } from '@models/photo';
import { Metadata } from '@models/metadata';

@Injectable()
export class FirePhotoProvider {
  photosRef: AngularFireList<Photo>;

  constructor(private afDB: AngularFireDatabase) {}

  public listAllFromFirebase() {
    return (this.photosRef = this.afDB.list(`photos`, ref =>
      ref.orderByChild(`createdAt`)
    ));
  }

  public listbyUserFromFirebase(user: User) {
    return (this.photosRef = this.afDB.list(`photos`, ref =>
      ref.orderByChild(`user/pseudo`).equalTo(user.pseudo)
    ));
  }

  public addPhotoInFirebase(user: User, picture: string, metadata: Metadata) {
    const timestamp = new Date().getTime();
    const pictureName = `photo-${user.uid}-${timestamp}.jpg`;
    const photoRef = firebase
      .storage()
      .ref(`photos/${user.uid}/${pictureName}`);

    photoRef
      .putString(picture, 'base64', { contentType: 'image/jpeg' })
      .then(savedPicture => {
        let newMetadata = {
          customMetadata: {
            title: metadata.title,
            latitude: metadata.latitude,
            longitude: metadata.longitude,
            location: metadata.location,
            description: metadata.description
          }
        };
        photoRef.updateMetadata(newMetadata);

        firebase
          .database()
          .ref(`photos`)
          .push({
            name: savedPicture.metadata.name,
            pictureURL: savedPicture.downloadURL,
            createdAt: savedPicture.metadata.timeCreated,
            user: {
              uid: user.uid,
              pseudo: user.pseudo,
              avatarURL: user.avatarURL
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

  public deletePhotoInFirebase(photo: Photo) {
    const photoRef = firebase
      .database()
      .ref(`photos`)
      .orderByChild(`name`)
      .equalTo(photo.name)
      .once('value', snapshot => {
        let updates = {};
        snapshot.forEach(child => (updates[child.key] = null));
        snapshot.ref.update(updates);
      });

    return photoRef;
  }

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
        location: photo.metadata.location == '' ? null : photo.metadata.location,
        description: photo.metadata.description == '' ? null : photo.metadata.description
      }
    };

    return photoRef.updateMetadata(newMetadata);
  }
}
