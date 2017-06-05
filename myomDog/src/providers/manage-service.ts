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

     firebase.database().ref('userData/'+this.userKey+'/groups').push({
      groupName: groupName
     }).then((groupKey)=>{
      firebase.database().ref('userData/'+this.userKey+'/groups/'+groupKey.key+'/dogs').push({
        name: dogName,
        super: {
          id: this.userKey,
          group: groupKey.key
        },
        birth: birth,
        gender: gender,
      }).then((newDogKey)=> {
          firebase.database().ref('userData/'+this.userKey+'/groups/'+groupKey.key+'/dogs/'+newDogKey.key+'/users').push({
            id: this.userKey,
            group: groupKey.key
          })
          firebase.database().ref('dogData/'+newDogKey.key).set({
            name: dogName,
            gender: gender,
            birth: birth,
            super: {
              id: this.userKey,
              group: groupKey.key
            }
          }).then(()=>{
            firebase.database().ref('dogData/'+newDogKey.key+'/users').push({
              id: this.userKey,
              group: groupKey.key
            });
          });
          firebase.database().ref('userData/'+this.userKey).once('value').then((snap)=>{
            if(snap.val().first===false){
              console.log(snap.val().first);
              let maindogKey = newDogKey.key;
              let updates = {};
              updates['/userData/'+this.userKey] = {
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

  addDogToGroup(g, dogName, gender, birth){
    firebase.database().ref('dogData/').push({
      name: dogName,
      super: {
        id: this.userKey,
        group: g
      },
      birth: birth,
      gender: gender
    }).then((newDog)=>{
      firebase.database().ref('dogData/'+newDog.key+'/users').push({
        id: this.userKey,
        group: g
      })
      firebase.database().ref('userData/'+this.userKey+'/groups/'+g+'/dogs/'+newDog.key).set({
        name: dogName,
        gender: gender,
        birth: birth,
        super: {
          id: this.userKey,
          group: g
        }
      }).then(()=>{
        firebase.database().ref('userData/'+this.userKey+'/groups/'+g+'/dogs/'+newDog.key+'/users').push({
          id: this.userKey,
          group: g
        });
      });
    });
  }
/* 초대하기 */
  invite(receiver, dog){
    let strArr2 = receiver.split('.');
    firebase.database().ref('dogData/'+dog).once('value').then(snap=>{
      firebase.database().ref('userData/'+strArr2[0]+'-'+strArr2[1]+'/invitation').push({
        sender: this.userKey,
        dog_id: dog,
        dog_name: snap.val().name,
        gender: snap.val().gender,
        birth: snap.val().birth,
        super: snap.val().super,
        users: snap.val().users
      });
    })
  }
  /* 새로운 그룹에 초대받은 강아지를 추가 */
  receiveInvitation(group, invitation){
    console.log(group); //  
    console.log(invitation);  //
    let invitationKey = invitation.$key;
    let dogid = invitation.dog_id;
    let dogname = invitation.dog_name;
    let gender = invitation.gender;
    let birth = invitation.birth;
    let superuser = invitation.super;
    new Promise(()=>{
      firebase.database().ref('/userData/'+this.userKey+'/groups').push({
        groupName: group
      }).then((newgroup)=>{
        firebase.database().ref('userData/'+this.userKey+'/groups/'+newgroup.key+'/dogs/'+dogid).update({
          name: dogname,
          super: {
            id: superuser.id,
            group: superuser.group
          },
          birth: birth,
          gender: gender
        }).then(()=>{
          firebase.database().ref('dogData/'+dogid+'/users').push({
            id: this.userKey,
            group: newgroup.key
          });
          firebase.database().ref('userData/'+this.userKey+'/groups/'+newgroup.key+'/dogs/'+dogid+'/users').push({
            id: this.userKey,
            group: newgroup.key
          });
        });
      });
    }).then(()=>{
      firebase.database().ref('/userData/'+this.userKey+'/invitation/'+invitation.$key).set(null);
    })
  }
/* 이미 존재하는 그룹에 초대받은 강아지를 추가 */
  receiveInvitationOnExists(group, invitation){
    console.log(group.groupname); //
    console.log(invitation);  //
    let invitationKey = invitation.$key;
    let dogid = invitation.dog_id;
    let dogname = invitation.dog_name;
    let gender = invitation.gender;
    let birth = invitation.birth;
    let superuser = invitation.super;
    firebase.database().ref('/userData/'+this.userKey+'/groups/'+group.groupname+'/dogs/'+dogid).set({
      birth: birth,
      gender: gender,
      name: dogname,
      super: {
        id: superuser.id,
        group: superuser.group
      }
    }).then(()=>{
      firebase.database().ref('/userData/'+this.userKey+'/groups/'+group.groupname+'/dogs/'+dogid+'/users').push({
        id: this.userKey,
        group: group.groupname
      })
      firebase.database().ref('/dogData/'+dogid+'/users').push({
        id: this.userKey,
        group: group.groupname
      })
    });
    
    firebase.database().ref('/userData/'+this.userKey+'/invitation/'+invitation.$key).set(null);
  }

  rejectInvitation(invitation){
    console.log(invitation);
    firebase.database().ref('userData/'+this.userKey+'/invitation/'+invitation.$key).set(null);
  }

  addHistory(category: string, icon: string, name: string, time: Date, dogs: any, content?:any){ // category, icon, name, time(date), content?:any
    console.log("category: "+category+" icon: "+icon+ " date: "+time+" name: "+name+" walked time : "+content+" dogs: "+dogs);
    dogs.forEach((dog)=>{
      console.log("dog: "+dog);
      if(!content){
        firebase.database().ref('/dogData/'+dog+'/history').push({
          category: category,
          icon: icon,
          name: name,
          time: time.toString(), // 현재 시간을 찍으려면은 이거를 하래 서버 시간이라 정확함 : firebase.database.ServerValue.TIMESTAMP
        })
      }else{
        firebase.database().ref('/dogData/'+dog+'/history').push({
          category: category,
          icon: icon,
          name: name,
          time: time.toString(), // 현재 시간을 찍으려면은 이거를 하래 서버 시간이라 정확함 : firebase.database.ServerValue.TIMESTAMP
          content: content
        })
      }
      
    })

  }

  feedDogs(dogs, time?){
    
  }

  changeMainDog(newMainDog) {
    firebase.database().ref('userData/'+this.userKey+'/').update({
      mainDog: newMainDog,
      first: true
    });
    console.log("mainDog changed to "+newMainDog);
  }

  goodbyeDog(key){
    firebase.database().ref('dogData/'+key+'/users').once('value').then((snapshots)=>{
      snapshots.forEach((snapshot)=>{
        if(snapshot.val().id==this.userKey){
          let groupKey = snapshot.val().group;
          firebase.database().ref('userData/'+this.userKey+'/groups/'+groupKey+'/dogs/'+key).set(null).then(()=>{
            firebase.database().ref('userData/'+this.userKey).once('value').then((userdata)=>{
              if(userdata.val().mainDog==key){
                firebase.database().ref('/userData/'+this.userKey).update({
                  first: false,
                  mainDog: null
                });
              }
            })
          });
          firebase.database().ref('/dogData/'+key+'/users/'+snapshot.key).set(null).then(()=>{
            firebase.database().ref('dogData/'+key+'/users').once('value').then((snaps)=>{
              if(snaps.numChildren()==0){
                firebase.database().ref('dogData/'+key).set(null);
              }
            })
          });
        }
      })
    });
    /*
    firebase.database().ref('userData/'+this.userKey+'/groups').once('value').then((snap)=>{
      snap.forEach((group)=>{
        console.log(group.val().dogs);
        let dogs = group.child('dogs');
        dogs.forEach((dog)=>{
          console.log("dogKey: "+dog.key);
          if(dog.key==key) {
            firebase.database().ref('userData/'+this.userKey+'/groups/'+group.key+'/dogs').child(key).set(null);
          }
        });
      });
    });
    firebase.database().ref('userData/'+this.userKey).once('value').then((snap)=>{
      if(snap.val().mainDog==key){
        firebase.database().ref('userData/'+this.userKey).update({
          mainDog: null,
          first: false
        });
      }

    })
    new Promise(()=>{
      firebase.database().ref('dogData/'+key+'users/').once('value').then(snap=>{
        snap.forEach(user=>{
          firebase.database().ref('/userData/'+user.id+'/groups/'+user.group+'/dogs/').child(key).set(null);
          firebase.database().ref('/userData/'+user.id).once('value').then((userinfo)=>{
            if(userinfo.val().mainDog==key){
              firebase.database().ref('userData/'+this.userKey).update({
                mainDog: null,
                first: false
              });
            }
          });
        });
      });
    }).then(()=>{
      firebase.database().ref('dogData/').child(key).set(null);
    });
    */
  }

  editGroupName(key, name){
    firebase.database().ref('/userData/'+this.userKey+'/groups/'+key).update({
      groupName: name
    });
  }

  removeGroup(key){
    firebase.database().ref('/userData/'+this.userKey+'/groups/'+key).set(null);
  }

  removeCheck(key):boolean{
    firebase.database().ref('/userData/'+this.userKey+'/groups/'+key+'/dogs').once('value').then((snapshot)=>{
      console.log(snapshot);
      console.log(snapshot.numChildren())
      if(snapshot.numChildren()==0){
        return true;
      }else{
        return false;
      }
    })
    return true;
  }

  removeHistory(key, dog){
    let strArr = key.split('"');
    console.log("dogData/"+dog+"/history/"+strArr[1]);
    firebase.database().ref('dogData/'+dog+'/history').child(strArr[1]).set(null);
  }

}
