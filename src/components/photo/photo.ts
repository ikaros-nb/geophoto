import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() photoEvent: EventEmitter<Photo> = new EventEmitter<Photo>();

  constructor(public navCtrl: NavController, private db: DatabaseProvider) {}

  ngOnInit() {
    this.getFavPhoto();
  }

  getFavPhoto() {
    this.db.getFavPhoto(this.photo).subscribe(favPhoto => {
      if (favPhoto) this.photo.like = true;
      else this.photo.like = false;
      this.photoEvent.emit(this.photo);
    });
  }

  favorites() {
    this.photo.like = !this.photo.like;
    this.photoEvent.emit(this.photo);
    this.db.toFavPhoto(this.photo).subscribe();
  }

  goToPhotoInfo() {
    this.navCtrl.push(PhotoInfoPage, { photo: this.photo });
  }
}
