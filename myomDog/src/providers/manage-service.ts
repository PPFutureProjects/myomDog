import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import firebase  from 'firebase';
/*
  Generated class for the ManageService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ManageService {

  currentUser: any = null;
  groups: any;
  user_name;
  user_email;
  user_id;

  constructor(public http: Http) {
    // console.log('Hello ManageService Provider');
    // this.currentUser = firebase.auth().currentUser;
    // if(this.currentUser!=null){
    //   this.user_name = this.currentUser.displayName;
    //   this.user_email = this.currentUser.email;
    //   this.user_id = this.currentUser.uid;
    //   console.log("name : " + this.user_name+" email : " + this.user_email + " uid : " + this.user_id);

      // var strArr = this.user_email.split('.');
      // if(firebase.database().ref('mockUserData/'+strArr[0]+'-'+strArr[1]) == null){
      //   firebase.database().ref('mockUserData/').push(this.user_email);
      // }else{
      //   console.log('==> ' + firebase.database().ref('mockUserData/'+strArr[0]+'-'+strArr[1]));
      // }
      //this.groups = firebase.database().ref('mockUserData/'+this.user_email);
    // }
  }

  addDog(){
    firebase.database().ref('mockDogData/').push(
      {name: "STRONG",
       super: this.user_id
     });
  }

}
