import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
// import { Observable } from 'rxjs/Observable';

import  firebase  from 'firebase';

/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthService {

  // private authState: Observable<firebase.User>;
  // private currentUser: firebase.User;

  public fireAuth: any;
  public userData: any;
  public email: string;
  public inviteData: any;

  constructor(public http: Http, public afAuth: AngularFireAuth) {
    console.log('Hello AuthService Provider');
    // this.authState= afAuth.authState;
    // afAuth.subscribe((user: firebase.User) => {
    //   this.currentUser = user;
    // })
    this.fireAuth = firebase.auth();
    this.userData = firebase.database().ref('userData');
  }

  register(email: string, password: string): any {
    return this.fireAuth.createUserWithEmailAndPassword(email, password)
      .then((newUser) => {
        let id = newUser.email.split('.');
        let key = id[0]+'-'+id[1];
        this.userData.child(key)
        .set({email: email
        });
    });
  }

  resetPassword(email: string): any {
    return this.fireAuth.sendPasswordResetEmail(email);
  }

  doLogin(email: string, password: string): any {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  doLogout(): any {
    return this.fireAuth.signOut();
  }

}
