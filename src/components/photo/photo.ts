import { Component, Input, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PhotoInfoPage } from '@pages/photo-info/photo-info';
import { DatabaseProvider } from '@providers/database';
import { Photo } from '@models/photo';

@Component({
  selector: 'photo-component',
  templateUrl: 'photo.html'
})
export class PhotoComponent implements OnInit {
  @Input() photo: Photo;

  like: boolean;

  constructor(public navCtrl: NavController, private db: DatabaseProvider) {}

  ngOnInit() {
    this.getFavPhoto();
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

  goToPhotoInfo() {
    this.navCtrl.push(PhotoInfoPage, { photo: this.photo });
  }
}
