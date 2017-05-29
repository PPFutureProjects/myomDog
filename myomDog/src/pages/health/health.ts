import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { ManageService } from '../../providers/manage-service';
// import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { History } from './History'

/**
 * Generated class for the Health page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-health',
  templateUrl: 'health.html'
})
export class HealthPage {

  graph: string = "week"; //탭에 처음 들어왔을 때 default 세그먼트 탭
  history: string = "total"; //탭에 처음 들어왔을 때 default 세그먼트 탭
  isAndroid: boolean = false;
  myMainDogKey: any;
  dogHistory: FirebaseListObservable<any[]>;
  segSubject: BehaviorSubject<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, db: AngularFireDatabase,
              public manageService: ManageService) 
    {
    this.isAndroid = platform.is('android');
    let firebaseData = db.object('userData/'+this.manageService.userKey, {preserveSnapshot: true});
    firebaseData.subscribe((snapshot)=>{
      console.log("대표개: "+snapshot.val().mainDog);
      if(snapshot.val().mainDog)
      this.myMainDogKey = snapshot.val().mainDog;
    });
    //this.myMainDogKey = '-Kkp6_SPSiCNeVWj1z5a';//하드코딩 : 공주 키 값

    this.segSubject = new BehaviorSubject(undefined);

    var subscription = this.segSubject.subscribe(
      function (x) {
        // if(x !== null || x !== undefined){
        //   console.log('Next: ' + x.toString());
        // }
        // else {
        //   console.log('Next: total');
        // }
      },
      function (err) {
          console.log('Error: ' + err);
      },
      function () {
          console.log('Completed');
      });

    this.dogHistory = db.list('/dogData/'+this.myMainDogKey+'/history', {
      query: {
        orderByChild: 'category',
        equalTo: this.segSubject
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Health');
  }

  ionViewWillLeave() {
    //초기화
    console.log('ionViewWillLeave Health');
    this.graph = "week";
    this.segSubject.next(undefined);
    this.history = "total";
  }

  // public get getHealthItems(){
  //   return this.dogHistory;
  // }

  // Null 을 넘겨야하므로 옵셔널
  filterBy(segVal?: string) {
    this.segSubject.next(segVal);
  }
}
