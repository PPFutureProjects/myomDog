import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AngularFireDatabase } from 'angularfire2/database';
import firebase  from 'firebase';
/*
  Generated class for the ManageService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ManageService {

  currentUser: any = null;
  userKey: string;
  //groups: FirebaseObjectObservable<any>;
  constructor(public http: Http, db: AngularFireDatabase) {
  }

  setUser(user){
    this.currentUser = user;
    let str = user.email.split('.');
    this.userKey = str[0]+'-'+str[1];
  }

  registToken(token){
    console.log("pushtoken: "+token);
    this.currentUser = firebase.auth().currentUser;
    let strArr = this.currentUser.email.split('.');
    let uid = strArr[0]+'-'+strArr[1];

    return firebase.database().ref('userData/' + uid).update({
      pushToken: token
    });
  }

  addDog(dogName: String, groupName: String, gender: string, birth: Date){
    this.currentUser = firebase.auth().currentUser;
    console.log(this.currentUser);

     let strArr = this.currentUser.email.split('.');
     
     firebase.database().ref('userData/'+strArr[0]+'-'+strArr[1]+'/groups').push({
      groupName: groupName
     }).then((groupKey)=>{
      firebase.database().ref('userData/'+strArr[0]+'-'+strArr[1]+'/groups/'+groupKey.key+'/dogs').push({
        name: dogName,
        super: this.currentUser.email,
        birth: birth,
        gender: gender
      }).then((newDogKey)=> {
          firebase.database().ref('dogData/').child(newDogKey.key).set({
            name: dogName,
            gender: gender,
            birth: birth,
            super: strArr[0]+strArr[1]
          });
          firebase.database().ref('userData/'+strArr[0]+'-'+strArr[1]).once('value').then((snap)=>{
            if(snap.val().first===false){
              console.log(snap.val().first);
              let maindogKey = newDogKey.key;
              let updates = {};
              updates['/userData/'+strArr[0]+'-'+strArr[1]] = {
                email: this.currentUser.email,
                first: true,
                mainDog: maindogKey,
                groups: snap.val().groups
              }
              firebase.database().ref().update(updates);
            }
          });
        });
     });
  }

  invite(receiver, dog){
    let strArr2 = receiver.split('.');
    firebase.database().ref('userData/'+strArr2[0]+'-'+strArr2[1]+'/invitation').push({
      sender: this.userKey,
      dog_id: dog
    });
  }

  addHistory(category: string, icon: string, name: string, time: Date, dogs: any, content?:any){ // category, icon, name, time(date), content?:any
    console.log("category: "+category+" icon: "+icon+ " date: "+time+" name: "+name+" walked time : "+content+" dogs: "+dogs);
    dogs.forEach((dog)=>{
      console.log("dog: "+dog);
      firebase.database().ref('/dogData/'+dog+'/history').push({
        category: 'walk',
        icon: 'paw',
        name: '산책',
        time: time.toString(),
        content: content
      }) 
    })
  }

}
