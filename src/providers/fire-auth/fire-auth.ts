import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { User } from '../../models/user';

@Injectable()
export class FireAuthProvider {
  private userSession = {} as User;
  private usersRef: firebase.database.Reference = firebase
    .database()
    .ref(`users`);

  constructor(private afAuth: AngularFireAuth) {}

  public register(user: User) {
    return this.afAuth.auth.createUserWithEmailAndPassword(
      user.email,
      user.password
    );
  }

  public login(user: User) {
    return this.afAuth.auth.signInWithEmailAndPassword(
      user.email,
      user.password
    );
  }

  public logout() {
    this.afAuth.auth.signOut();
  }

  public addUserRefInFirebase(user: User) {
    this.usersRef.child(user.uid).set({
      pseudo: user.pseudo,
      email: user.email,
      createdAt: new Date().toJSON()
    });
  }

  public getUserSession(): User {
    return this.userSession;
  }

  public setUserSession(user: User): void {
    this.userSession = user;
  }
}
