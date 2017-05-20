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
  //groups: FirebaseObjectObservable<any>;
  myGroups: Array<Group> = null;
  myDogs: Array<Dog> = null;
  constructor(public http: Http, db: AngularFireDatabase) {
    /*
    console.log("manage Service --> "+firebase.auth().currentUser);
    this.groups = db.object('/userData', {preserveSnapshot: true});
    this.groups.subscribe(snapshot => {
      console.log(snapshot.key)
      console.log(snapshot.val())
    });
    */
    this.myGroups = new Array();
    this.myDogs = new Array();
  }

  syncData(){
    let email = this.currentUser.email;
    let strArr = email.split('.');
    let user_id = strArr[0]+'-'+strArr[1];
    firebase.database().ref('/userData/'+user_id+'/groups').once('value').then((snap)=>{
      snap.forEach((group)=>{
        let g = new Group();
        let g_key = group.key;
        
        firebase.database().ref('/userData/'+user_id+'/groups/'+g_key+'/dogs').once('value').then((dog)=>{
          let d = new Dog();
          let dogKey = dog.key;
          firebase.database().ref('/dogData/'+dogKey+'/managers').once('value').then((manager)=>{
            d.addManager(manager.key);
          });
          d.setSuperManager(dog.super);
          d.setDogKey(dog.key);
          d.setDogName(dog.val().name);
          g.addDog(d);
          this.myDogs.push(d);
        });
        g.setGroupKey(group.key);
        g.setGroupName(group.val().groupName);
        this.myGroups.push(g);
      });
    });
  }

  getMyGroupKeys(){
    let groups: Array<string> = new Array();
    for (let i in this.myGroups){
      groups.push(this.myGroups[i].getGroupKey());
    }
    return groups;
  }

  getDogsAreOnGroup(groupKey){
    let dogs: Array<Dog>;
    this.myGroups.forEach((group)=>{
      if(group.getGroupKey()==groupKey)
        dogs = (group.getDogs());
    });
    return dogs;
  }

  getOwnersOfDog(dogKey){
    this.myDogs.forEach((dog)=>{
      if(dog.getDogKey()==dogKey){
        return {
          super: dog.getSuperManager(),
          owners: dog.getManagers()
        };
      }
    });
  }

  setUser(user){
    this.currentUser = user;
    this.syncData();
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

}

export class Group {
  groupKey;
  groupName;
  dogs: Array<Dog>;

  constructor(){
    this.dogs = new Array();
  }
  setGroupKey(key){
    this.groupKey = key;
  }
  setGroupName(name){
    this.groupName = name;
  }
  setDogs(dog){
    this.dogs = dog;
  }

  addDog(dog){
    this.dogs.push(dog);
  }

  getGroupKey(){
    return this.groupKey;
  }
  getGroupName(){
    return this.groupName;
  }
  getDogs(){
    return this.dogs;
  }
}

export class Dog {
  dogKey;
  dogName;
  supermanager;
  managers

  constructor(){
    this.managers = new Array<string>();
  }

  setDogKey(key){
    this.dogKey = key;
  }
  setDogName(name){
    this.dogName = name;
  }
  setSuperManager(manager){
    this.supermanager = manager;
  }
  addManager(manager){
    this.managers.push(manager);
  }

  getDogKey(){
    return this.dogKey;
  }
  getManagers(){
    return this.managers;
  }
  getSuperManager(){
    return this.supermanager;
  }
}

