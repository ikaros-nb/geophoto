import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@models/user';
import { FireAuthProvider } from '@providers/fire-auth';
import { HomePage } from '@pages/home/home';
import { ToastHelper } from '@helpers/toast';
import { EmailValidator } from '@validators/email';
import { PasswordValidator } from '@validators/password';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  user = {} as User;
  registerForm: FormGroup;
  isExistingUser: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fireAuth: FireAuthProvider,
    private toast: ToastHelper,
    private formBuilder: FormBuilder
  ) {
    this.initRegisterFrom();
  }

  initRegisterFrom() {
    this.registerForm = this.formBuilder.group({
      pseudo: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ],
      email: [
        '',
        Validators.compose([Validators.required, EmailValidator.isValid])
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ],
      confirmPassword: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          PasswordValidator.equalToPassword
        ])
      ]
    });

    this.isExistingUser = false;
    this.existingUser();
  }

  existingUser() {
    this.registerForm.valueChanges.subscribe(registerForm => {
      this.fireAuth
        .existingPseudo(registerForm.pseudo)
        .then(user => {
          if (user.val()) {
            this.toast.display(`This pseudo you entered is already in use.`);
            this.isExistingUser = true;
          } else this.isExistingUser = false;
        })
        .catch(error => console.log(error));
    });
  }

  register() {
    let formValue = this.registerForm.value;
    if (this.registerForm.valid) {
      this.user.pseudo = formValue.pseudo;
      this.user.email = formValue.email;
      this.user.password = formValue.password;

      this.fireAuth
        .register(this.user)
        .then(user => {
          this.user.uid = user.uid;
          this.fireAuth.addUserRefInFirebase(this.user);
          this.fireAuth
            .login(this.user)
            .then(user => this.navCtrl.setRoot(HomePage))
            .catch(error => {
              this.registerForm.reset();
              this.toast.display(
                `There is no user corresponding to this credentials. The user may have been deleted.`
              );
            });
        })
        .catch(error => {
          this.toast.display(error.message);
        });
    } else {
      if (!formValue.pseudo || !formValue.email || !formValue.password) {
        this.registerForm.reset();
        this.toast.display(`Pseudo, email and password must not be empty.`);
      } else this.toast.display(`Pseudo, email and password must be valid.`);
    }
  }
}
