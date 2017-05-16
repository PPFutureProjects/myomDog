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

  constructor(public http: Http) {
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
  registToken(token){
    this.currentUser = firebase.auth().currentUser;
    let strArr = this.currentUser.email.split('.');
    let uid = strArr[0]+'-'+strArr[1];

    firebase.database().ref('userData/').child(uid).set({
      pushToken: token
    });
  }

  addDog(dogName: String){
    this.currentUser = firebase.auth().currentUser;
    console.log(this.currentUser);

     let strArr = this.currentUser.email.split('.');
     firebase.database().ref('userData/'+strArr[0]+'-'+strArr[1]+'/groups').push({
      groupName: "exampleName"
     }).then((groupKey)=>{
      firebase.database().ref('userData/'+strArr[0]+'-'+strArr[1]+'/groups/'+groupKey.key+'/dogs').push({
        name: dogName
      }).then((newDogKey)=> {
           firebase.database().ref('dogData/').child(newDogKey.key).set(
            {name: "STRONG",
            super: this.currentUser.email
            });
        });
     });
     /*
     firebase.database().ref('userData/'+strArr[0]+strArr[1]+'/dogs').set({
       newDogkey: {
        name: dogName
       }
     });*/
  }

  invite(receiver, dog){
    this.currentUser = firebase.auth().currentUser;
    let strArr = this.currentUser.email.split('.');
    let user_id = strArr[0]+'-'+strArr[1];
    let strArr2 = receiver.split('.');
    firebase.database().ref('userData/'+strArr2[0]+'-'+strArr2[1]+'/invitation').push({
      sender: user_id,
      dog_id: dog
    });
  }

  getMyGroups():any {
    this.currentUser = firebase.auth().currentUser;
    let strArr = this.currentUser.email.split('.');
    let user_id = strArr[0]+'-'+strArr[1];
    
    return firebase.database().ref('/userData/'+user_id+'groups').once('value');  //return groups snapshot
  }

  getDogs(group): any {
    this.currentUser = firebase.auth().currentUser;
    let strArr = this.currentUser.email.split('.');
    let user_id = strArr[0]+'-'+strArr[1];
    return firebase.database().ref('/userData/'+user_id+'groups/'+group).once('value'); //return dogs of group snapshot
  }

}
