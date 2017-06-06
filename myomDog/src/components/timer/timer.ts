import { Component, EventEmitter,Input, Output } from '@angular/core';
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
  constructor() {
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
      this.outputProperty.emit(this.timer.timePassed);
      this.timeInSeconds = null;
      this.initTimer();
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
