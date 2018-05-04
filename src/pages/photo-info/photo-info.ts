import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Photo } from '@models/photo';
import { Metadata } from '@models/metadata';
import { User } from '@models/user';
import { ToastHelper } from '@helpers/toast';
import { FireAuthProvider } from '@providers/fire-auth';
import { FirePhotoProvider } from '@providers/fire-photo';
import { DatabaseProvider } from '@providers/database';

@Component({
  selector: 'page-photo-info',
  templateUrl: 'photo-info.html'
})
export class PhotoInfoPage {
  photo = {} as Photo;
  user = {} as User;
  input: boolean;
  like: boolean;
  metadataForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private menuCtrl: MenuController,
    private fireAuth: FireAuthProvider,
    private firePhoto: FirePhotoProvider,
    private db: DatabaseProvider,
    private toast: ToastHelper,
    private formBuilder: FormBuilder
  ) {
    this.photo = this.navParams.get('photo');
    this.firePhoto
      .getPhotoMetadataInFirebase(this.photo)
      .then(metadata => (this.photo.metadata = metadata.customMetadata));
  }

  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
    this.user = this.fireAuth.getUserSession();
    this.getFavPhoto();
  }

  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(true);
  }

  initMetadataForm(metadata: Metadata) {
    this.metadataForm = this.formBuilder.group({
      title: [metadata.title, Validators.compose([Validators.required])],
      description: [
        metadata.description,
        Validators.compose([Validators.required])
      ]
    });
  }

  showInput() {
    this.input = !this.input;
    this.initMetadataForm(this.photo.metadata);
  }

  deletePhoto() {
    this.firePhoto
      .deletePhotoInStorage(this.photo)
      .then(() =>
        this.firePhoto
          .deletePhotoInFirebase(this.photo)
          .then(() => {
            this.db.removeFavPhoto(this.photo);
            this.toast.display(`Photo deleted!`);
            this.navCtrl.pop();
          })
          .catch(error => console.log('error', error))
      )
      .catch(error => console.log('error', error));
  }

  updateMetadata() {
    let formValue = this.metadataForm.value;
    if (this.metadataForm.valid) {
      this.photo.metadata.title = formValue.title;
      this.photo.metadata.description = formValue.description;

      this.firePhoto
        .updatePhotoMetadataInFirebase(this.photo)
        .then(() => (this.input = false))
        .catch(error => this.toast.display(`Error while trying to update!`));
    } else {
      if (!formValue.title || !formValue.description) {
        this.toast.display(`Title and description must not be empty.`);
      }
    }
  }

  getFavPhoto() {
    this.db.getFavPhoto(this.photo).subscribe(favPhoto => {
      if (favPhoto) this.like = true;
      else this.like = false;
    });
  }

  favorites() {
    this.like = !this.like;
    this.db.toFavPhoto(this.photo).subscribe();
  }
}
