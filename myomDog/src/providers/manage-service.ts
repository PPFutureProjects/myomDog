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

  addDog(dogName: String, groupname: String, gender: string, birth: Date, mealtime?){
    this.currentUser = firebase.auth().currentUser;
    console.log(this.currentUser);

     firebase.database().ref('userData/'+this.userKey+'/groups').push({
      groupName: groupname
     }).then((groupKey)=>{
      firebase.database().ref('userData/'+this.userKey+'/groups/'+groupKey.key+'/dogs').push({
        name: dogName,
        super: {
          id: this.userKey,
          group: groupKey.key
        },
        birth: birth,
        gender: gender,
        lastmeal: 0,
        lastmealdate: ''
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
            },
            lastmeal: 0,
            lastmealdate: ''
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
              firebase.database().ref('userData/'+this.userKey).update({
                email: this.currentUser.email,
                first: true,
                mainDog: maindogKey,
                groups: snap.val().groups
              });
            }
          });
        });
     });
  }

  addDogToGroup(g, dogName, gender, birth, mealtime?){
    firebase.database().ref('dogData/').push({
      name: dogName,
      super: {
        id: this.userKey,
        group: g
      },
      birth: birth,
      gender: gender,
      lastmeal: 0,
      lastmealdate: ''
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
    console.log(receiver, dog);
    let strArr2 = receiver.split('.');
    firebase.database().ref('dogData/'+dog).once('value').then(snap=>{
      firebase.database().ref('userData/'+strArr2[0]+'-'+strArr2[1]+'/invitation').push({
        sender: this.userKey,
        dog_id: dog,
        dog_name: snap.val().name,
        gender: snap.val().gender,
        birth: snap.val().birth,
        super: snap.val().super,
        users: snap.val().users,
        lastmeal: snap.val().lastmeal,
        lastmealdate: snap.val().lastmealdate
      });
    })
  }
  /* 새로운 그룹에 초대받은 강아지를 추가 */
  receiveInvitation(group, invitation){
    console.log('groupname-->', group.groupname); //
    console.log(invitation);  //
    let invitationKey = invitation.$key;
    let dogid = invitation.dog_id;
    let dogname = invitation.dog_name;
    let gender = invitation.gender;
    let birth = invitation.birth;
    let superuser = invitation.super;
    let lastmeal = invitation.lastmeal;
    let lastmealdate = invitation.lastmealdate;
    firebase.database().ref('userData/'+this.userKey+'/groups').push({
      groupName: group.groupname
    }).then(newgroup=>{
        firebase.database().ref('/dogData/'+dogid+'/users').push({
          id: this.userKey,
          group: newgroup.key
        }).then((user)=>{
          console.log('user', user.key)
          firebase.database().ref('/dogData/'+dogid+'/users').once('value').then((snap)=>{
            firebase.database().ref('/userData/'+this.userKey+'/groups/'+newgroup.key+'/dogs/').child(dogid).update({
              name: dogname,
              gender: gender,
              birth: birth,
              lastmeal: lastmeal,
              lastmealdate: lastmealdate,
              users: snap.val()
            }).then((updatedog)=>{
              firebase.database().ref('/userData/'+this.userKey+'/invitation').child(invitationKey).set(null);
            })
          })
          
        })
    })
  }
/* 이미 존재하는 그룹에 초대받은 강아지를 추가 */
  receiveInvitationOnExists(group, invitation){
    console.log('group.groupname-->',group); //
    console.log(invitation);  //
    let invitationKey = invitation.$key;
    let dogid = invitation.dog_id;
    let dogname = invitation.dog_name;
    let gender = invitation.gender;
    let birth = invitation.birth;
    let superuser = invitation.super;
    let lastmeal = invitation.lastmeal;
    let lastmealdate = invitation.lastmealdate;
    firebase.database().ref('dogData/'+dogid+'/users/').push({
      id: this.userKey,
      group: group
    }).then((updatedog)=>{
      firebase.database().ref('/dogData/'+dogid+'/users').once('value').then((snap)=>{
        firebase.database().ref('/userData/'+this.userKey+'/groups/'+group+'/dogs').child(dogid).update({
          name: dogname,
          gender: gender,
          birth: birth,
          lastmeal: lastmeal,
          lastmealdate: lastmealdate,
          users: snap.val()
        }).then((up)=>{
          firebase.database().ref('/userData/'+this.userKey+'/invitation').child(invitationKey).set(null);
        })
      })
    })
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
          time: time, // 현재 시간을 찍으려면은 이거를 하래 서버 시간이라 정확함 : firebase.database.ServerValue.TIMESTAMP
        })
      }else{
        firebase.database().ref('/dogData/'+dog+'/history').push({
          category: category,
          icon: icon,
          name: name,
          time: time, // 현재 시간을 찍으려면은 이거를 하래 서버 시간이라 정확함 : firebase.database.ServerValue.TIMESTAMP
          content: content
        })
      }

    })

  }

  feedDogs(dogs, time,  sec, icon){
    let category = 'food';
    let name;
    console.log("dogs: ", dogs);
    console.log("type: ", typeof dogs);
    if(typeof dogs=='string'){
      console.log('한마리');
      if(icon=='nutrition'){
        name = '간식';
        firebase.database().ref('/dogData/'+dogs+'/history').push({
          category: category,
          icon: icon,
          name: name,
          time: time,
        });
      }else if(icon=='restaurant'){
        name = '식사';
        console.log('식사추가한마리');
        firebase.database().ref('/dogData/'+dogs).once('value').then((shot)=>{
          let currentLastmeal = parseInt(shot.val().lastmeal);
          console.log('current lastmeal: ', currentLastmeal);
          if(currentLastmeal < sec){
            firebase.database().ref('/dogData/'+dogs).update({
              lastmeal: sec,
              lastmealdate: time
            })
          }
          firebase.database().ref('/dogData/'+dogs+'/history').push({
            category: category,
            icon: icon,
            name: name,
            time: time,
            sec: sec
          }).then(()=>{
            console.log('모든유저에게 추가');
            firebase.database().ref('/dogData/'+dogs+'/users').once('value').then((users)=>{
              console.log('users-->')
              users.forEach((user)=>{
                console.log('user: ', user.val().id)
                firebase.database().ref('/userData/'+user.val().id+'/groups/'+user.val().group+'/dogs').child(dogs).update({
                  lastmeal: sec,
                  lastmealdate: time 
                })
              })
            })
          })
        })
      }
    }else{
      console.log('여러마리야~')
      if(icon=='nutrition'){
        console.log('간식')
        name = '간식';
        for(let i=0; i<dogs.length; i++){
          console.log(dogs[i]);
          firebase.database().ref('dogData/'+dogs[i]+'/history').push({
            category: category,
            icon: icon,
            name: name,
            time: time
          });
        }
      }else if(icon=='restaurant'){
        console.log('식사')
        name = '식사';
        for(let i=0; i<dogs.length; i++){
          console.log('=>', dogs[i])
          firebase.database().ref('dogData/'+dogs[i]+'/history').push({
            category: category,
            icon: icon,
            name: name,
            time: time,
            sec: sec
          });
          firebase.database().ref('/dogData/'+dogs[i]).once('value').then((dog)=>{
            let currentLastmeal = dog.val().lastmeal;
            if(sec > currentLastmeal){
              firebase.database().ref('/dogData/'+dogs[i]).once('value').then((shot)=>{
                let currentLastmeal = parseInt(shot.val().lastmeal);
                console.log('current lastmeal: ', currentLastmeal);
                if(currentLastmeal < sec){
                  firebase.database().ref('/dogData/'+dogs[i]).update({
                    lastmeal: sec,
                    lastmealdate: time
                  })
                }
                  firebase.database().ref('/dogData/'+dogs[i]+'/users').once('value').then((users)=>{
                    console.log('모든유저에게추가하기');
                    users.forEach((user)=>{
                      console.log('user: ', user.id)
                      firebase.database().ref('/userData/'+user.val().id+'/groups/'+user.val().group+'/dogs').child(dogs[i]).update({
                        lastmeal: sec,
                        lastmealdate: time 
                      })
                    })
                  })
               
              })
            }
          })
        }
      }
    }
  }

  changeMainDog(newMainDog) {
    firebase.database().ref('userData/'+this.userKey+'/').update({
      mainDog: newMainDog,
      first: true
    });
    console.log("mainDog changed to "+newMainDog);
  }

  changeInfo(name, gender, birth, meal?){

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
