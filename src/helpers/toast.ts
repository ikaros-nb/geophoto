import { Injectable } from "@angular/core";
import { ToastController } from "ionic-angular";

@Injectable()
export class ToastHelper {
  constructor(private toast: ToastController) {}

  display(message: string, duration: number = 3000): void {
    this.toast.create({ message, duration }).present();
  }
}
