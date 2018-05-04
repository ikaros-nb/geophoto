import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@models/user';
import { HomePage } from '@pages/home/home';
import { RegisterPage } from '@pages/register/register';
import { ToastHelper } from '@helpers/toast';
import { FireAuthProvider } from '@providers/fire-auth';
import { EmailValidator } from '@validators/email';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  user = {} as User;
  loginForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fireAuth: FireAuthProvider,
    private toast: ToastHelper,
    private formBuilder: FormBuilder
  ) {
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        Validators.compose([Validators.required, EmailValidator.isValid])
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ]
    });
  }

  login() {
    let formValue = this.loginForm.value;
    if (this.loginForm.valid) {
      this.user.email = formValue.email;
      this.user.password = formValue.password;

      this.fireAuth
        .login(this.user)
        .then(user => this.navCtrl.setRoot(HomePage))
        .catch(error => {
          this.loginForm.reset();
          this.toast.display(
            `There is no user corresponding to this credentials. The user may have been deleted.`
          );
        });
    } else {
      if (!formValue.email || !formValue.password) {
        this.loginForm.reset();
        this.toast.display(`Email and password must not be empty.`);
      } else this.toast.display(`Email and password must be valid.`);
    }
  }

  register() {
    this.navCtrl.setRoot(RegisterPage);
  }
}
