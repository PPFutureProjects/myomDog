import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import firebase  from 'firebase';
/*
  Generated class for the ManageService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ManageService {

  currentUser: any = null;
  groups: FirebaseObjectObservable<any>;

  constructor(public http: Http, db: AngularFireDatabase) {
    console.log("manage Service --> "+firebase.auth().currentUser);
    this.groups = db.object('/userData', {preserveSnapshot: true});
    this.groups.subscribe(snapshot => {
      console.log(snapshot.key)
      console.log(snapshot.val())
    });
  }

  registToken(token){
    console.log("pushtoken: "+token);
    this.currentUser = firebase.auth().currentUser;
    let strArr = this.currentUser.email.split('.');
    let uid = strArr[0]+'-'+strArr[1];

    return firebase.database().ref('userData/' + uid).set({
      pushToken: token
    });
  }

  getMyGroups():any {
    this.currentUser = firebase.auth().currentUser;
    let strArr = this.currentUser.email.split('.');
    let user_id = strArr[0]+'-'+strArr[1];

    /*console.log("start finding groups");
    return firebase.database().ref('/userData/'+user_id+'groups').once('value').then(function(snapshot){
      console.log("snapshot:  "+snapshot)
      snapshot.forEach(function(childsnap){
        console.log(childsnap);
      })
    });*/

  }

  addDog(dogName: String, groupName: String){
    this.currentUser = firebase.auth().currentUser;
    console.log(this.currentUser);

     let strArr = this.currentUser.email.split('.');
     firebase.database().ref('userData/'+strArr[0]+'-'+strArr[1]+'/groups').push({
      groupName: groupName
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
  }

  invite(receiver, dog){
    this.currentUser = firebase.auth().currentUser;
    let strArr = this.currentUser.email.split('.');
    let user_id = strArr[0]+'-'+strArr[1];
    let strArr2 = receiver.split('.');
    firebase.database().ref('userData/'+strArr2[0]+'-'+strArr2[1]+'/invitation').push({
      sender: user_id,
      dog_id: "dog"
    });
  }



  getDogs(group): any {
    this.currentUser = firebase.auth().currentUser;
    let strArr = this.currentUser.email.split('.');
    let user_id = strArr[0]+'-'+strArr[1];
    return firebase.database().ref('/userData/'+user_id+'groups/'+group).once('value'); //return dogs of group snapshot
  }

}

export class Group {

}
