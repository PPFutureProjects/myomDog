import { Component, EventEmitter,Input, Output } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { PTimer } from './PTimer';

/**
 * Generated class for the TimerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'timer',
  templateUrl: 'timer.html'
})
export class TimerComponent {

  @Input() dogSelected : boolean;
  @Output() timerStartTrigger = new EventEmitter<boolean>();
  @Output() outputProperty = new EventEmitter<number>();
  private timeInSeconds: number;
  public timer: PTimer;
  constructor(public alertCtrl:AlertController) {
    this.dogSelected = false;
  }

  ngOnInit() {
    this.initTimer();
  }
  updateParent(){
    console.log("dogSelected "+this.dogSelected);
    if (!this.dogSelected) {
      console.log("timer: dog select plz");
      this.timerStartTrigger.emit(true);
    }else{
      console.log("timer: time emit!");
      let confirm = this.alertCtrl.create({
       title: '확인창',
       message: '산책 데이터를 입력 하시겠습니까?',
       buttons: [
         {
           text: '아니오',
           cssClass: 'buttoncss',
           handler: () => {
           }
         },
         {
            text: '예',
            cssClass: 'buttoncss',
            handler: () => {
              this.outputProperty.emit(this.timer.timePassed);
              this.timeInSeconds = null;
              this.initTimer();
            }
          }
        ]
      });
      confirm.present();
    }
  }
  hasFinished() {
    return this.timer.hasFinished;
  }
  pauseTimer() {
    this.timer.runTimer = false;
  }
  resumeTimer() {
    this.startTimer();
  }
  refresh() {
    let confirm = this.alertCtrl.create({
     title: '확인창',
     message: '산책 타이머를 초기화 하시겠습니까?',
     buttons: [
       {
         text: '아니오',
         cssClass: 'buttoncss',
         handler: () => {
         }
       },
       {
         text: '예',
         cssClass: 'buttoncss',
         handler: () => {
           this.initTimer();
         }
       }
     ]
   });
   confirm.present();
  }
  initTimer() {
     if (!this.timeInSeconds) { this.timeInSeconds = 0; }

     this.timer = <PTimer>{
       time: this.timeInSeconds,
       runTimer: false,
       hasStarted: false,
       hasFinished: false,
       timePassed: this.timeInSeconds
     };
     this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.timePassed);
  }

  getSecondsAsDigitalClock(inputSeconds: number) {
    var sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    var hoursString = '';
    var minutesString = '';
    var secondsString = '';
    hoursString = (hours < 10) ? "0" + hours : hours.toString();
    minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
    secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
    return hoursString + ':' + minutesString + ':' + secondsString;
  }
  startTimer() {
    this.timer.hasStarted = true;
    this.timer.runTimer = true;
    this.timerTick();
  }

  timerTick(){
    setTimeout(()=>{
      if(!this.timer.runTimer) return;
      this.timer.timePassed++;
      this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.timePassed);
      this.timerTick();
    }, 1000);
  }

}
