import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import firebase from "firebase";
import { User } from "../../models/user";

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
    let avatarURL: string =
      "https://firebasestorage.googleapis.com/v0/b/geophoto-ocp10.appspot.com/o/users%2Fuser-0.png?alt=media&token=e2af5e42-8a2e-4783-9853-d945ec4e5b95";
    this.usersRef.child(user.uid).set({
      avatarURL: avatarURL,
      createdAt: new Date().toJSON(),
      email: user.email,
      pseudo: user.pseudo
    });
  }

  public getUserSession(): User {
    return this.userSession;
  }

  public setUserSession(user: User): void {
    this.userSession = user;
  }
}
