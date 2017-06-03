import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ManageService } from '../../providers/manage-service';
// import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Chart } from 'chart.js'

// import { History } from './History'

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
  shouldAnimate: boolean = true;
  graph: string = "week"; //탭에 처음 들어왔을 때 default 세그먼트 탭
  history: string = "total"; //탭에 처음 들어왔을 때 default 세그먼트 탭
  isAndroid: boolean = false;
  myMainDogKey: any;
  dogHistory: FirebaseListObservable<any[]>;
  segSubject: BehaviorSubject<any>;

  @ViewChild('lineCanvas') lineCanvas;
  lineChart: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public db: AngularFireDatabase,
              public manageService: ManageService)
    {
    this.isAndroid = platform.is('android');
    let firebaseData = db.object('userData/'+this.manageService.userKey, {preserveSnapshot: true});
    firebaseData.subscribe((snapshot)=>{
      if(snapshot.val().mainDog) {
        this.myMainDogKey = snapshot.val().mainDog;
        console.log("대표개: "+ this.myMainDogKey);
      }
      else {
        console.log("No 대표개");
      }

      this.dogHistory = db.list('/dogData/'+this.myMainDogKey+'/history', {
        query: {
          orderByChild: 'category',
          equalTo: this.segSubject
        }
      });
    });
    //this.myMainDogKey = '-Kkp6_SPSiCNeVWj1z5a';//하드코딩 : 공주 키 값

    this.segSubject = new BehaviorSubject(undefined);

    var subscription = this.segSubject.subscribe(
      function (x) {
        if(x){
          console.log('Next: ' + x.toString());
        }
        else {
          console.log('Next: total');
        }
      },
      function (err) {
          console.log('Error: ' + err);
      },
      function () {
          console.log('Completed');
      });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Health');
    this.lineChart = this.getLineChart([], []);
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

/*
loadUsers() {
	let dbRef = admin.database().ref('/users');
	let defer = new Promise((resolve, reject) => {
		dbRef.once('value', (snap) => {
			let data = snap.val();
      let users = [];
      for (var property in data) {
	      users.push(data[property]);
      }
			resolve(users);
		}, (err) => {
			reject(err);
		});
	});
	return defer;
}*/


/*
getTime() 은 밀리세컨드 단위로 변환하는 함수이기 때문에 이 차이에다가

1000을 나누면 초

60을 또 나누면 분

60을 또 나누면 시간

24를 또 나누면 일 단위의 차이가 되는것이다.

*/
  weekBTN(){
    let current = new Date();
    let labels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    let param = new Promise((resolve,reject)=>{
      this.dogHistory.subscribe(shots=>{
        let cnt = [0, 0, 0, 0, 0, 0, 0];
        shots.forEach(history=>{
          // 이번주인지확인...
          for(let i=0; i<7; i++){
            if(history.time.split(" ")[0]==labels[i]){
              cnt[i] += history.content;
            }
          }
        })
        resolve(cnt);
      }, err=>{
        reject(err);
      })
    }).then(dataArr=>{
      this.lineChart = this.getLineChart(labels, dataArr);
    });
    this.graph = "week";
  }

  monthBTN(){
    this.graph = "month"
    this.lineChart = this.getLineChart([],[]);
  }

  threemonthBTN(){
    this.graph = "3months"
    this.lineChart = this.getLineChart([],[]);
  }

  filterBy(segVal?: string) {
    this.segSubject.next(segVal);
  }

  editItem(history){
    console.log('edit item : ' + JSON.stringify(history));
  }

  deleteItem(history){
    console.log('delete item : ' + JSON.stringify(history));
    this.manageService.removeHistory(JSON.stringify(history), this.myMainDogKey);
  }

  getChart(context, chartType, data, options?) {
    return new Chart(context, {
      type: chartType,
      data: data,
      options: options
    });
  }

  getLineChart(l, c) {
    console.log(c);
   var data = {
     labels: l,//["January", "February", "March", "April", "May", "June", "July", "August"],
     datasets: [
       {
         label: "Initial Dataset",
         fill: false,
         lineTension: 0.1,
         backgroundColor: "rgba(75,192,192,0.4)",
         borderColor: "rgba(75,192,192,1)",
         borderCapStyle: 'butt',
         borderDash: [],
         borderDashOffset: 0.0,
         borderJoinStyle: 'miter',
         pointBorderColor: "rgba(75,192,192,1)",
         pointBackgroundColor: "#fff",
         pointBorderWidth: 1,
         pointHoverRadius: 5,
         pointHoverBackgroundColor: "rgba(75,192,192,1)",
         pointHoverBorderColor: "rgba(220,220,220,1)",
         pointHoverBorderWidth: 2,
         pointRadius: 1,
         pointHitRadius: 10,
         data: c,//[50, 15, 30, 21, 45,10,1],//[65, 59, 80, 81, 56, 55, 40, 32],
         spanGaps: false,
       }
     ]
   };

   return this.getChart(this.lineCanvas.nativeElement, "line", data);
 }

 // 추가 버튼 이벤트
 addFoodHistory(){
   console.log("addFoodHistory clicked");
 }
 addWalkHistory(){
   console.log("addWalkHistory clicked");
 }
 addEtcHistory(){
   console.log("addEtcHistory clicked");
 }

}
