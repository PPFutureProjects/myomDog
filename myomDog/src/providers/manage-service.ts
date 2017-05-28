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
  userKey: string;
  //groups: FirebaseObjectObservable<any>;
  myGroups: Array<Group> = null;
  myDogs: Array<Dog> = null;
  constructor(public http: Http, db: AngularFireDatabase) {
    this.myGroups = new Array();
    this.myDogs = new Array();
  }

  getMyGroupKeys(){
    let groups: Array<string> = new Array();
    for (let i in this.myGroups){
      groups.push(this.myGroups[i].getGroupKey());
    }
    return groups;
  }

  getGroupName(key){
    for (let i in this.myGroups){
      if(this.myGroups[i].getGroupKey()==key)
        return this.myGroups[i].getGroupName();
    }
  }

  getAllMyDogsToDict(){
    let groupNameAndDogs = {};
    this.myGroups.forEach((group)=>{
      let dogs: Array<Dog> = group.getDogs();
      groupNameAndDogs[group.getGroupName()] = dogs;
    });
    return groupNameAndDogs;
  }

  getAllMyDogs(){
    let mydogs: Array<Dog> = new Array();
    this.myGroups.forEach((group)=>{
      let d = group.getDogs()
      d.forEach((eachdog)=>{
        mydogs.push(eachdog);
      });
    });
    return mydogs;
  }



  getDogsAreOnGroup(groupKey){
    let dogs: Array<Dog>;
    this.myGroups.forEach((group)=>{
      if(group.getGroupKey()==groupKey)
        dogs = (group.getDogs());
    });
    console.log(dogs[0]);
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

  addDog(dogName: String, groupName: String){
    this.currentUser = firebase.auth().currentUser;
    console.log(this.currentUser);

     let strArr = this.currentUser.email.split('.');
     
     firebase.database().ref('userData/'+strArr[0]+'-'+strArr[1]+'/groups').push({
      groupName: groupName
     }).then((groupKey)=>{
      firebase.database().ref('userData/'+strArr[0]+'-'+strArr[1]+'/groups/'+groupKey.key+'/dogs').push({
        name: dogName,
        super: this.currentUser.email
      }).then((newDogKey)=> {
          firebase.database().ref('dogData/').child(newDogKey.key).set({
            name: dogName,
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
  getDogname(){
    return this.dogName;
  }
  getManagers(){
    return this.managers;
  }
  getSuperManager(){
    return this.supermanager;
  }
}

