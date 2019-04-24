import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {

  Published_at: string = null
  DeviceID: string = null
  LocationID: string = null
  DeviceType: string = null
  State: string = null
  Rpm: string = null
  Distance: string = null
  Mov_f: string = null
  Mov_s: string = null

  Published_at_m: string = null
  DeviceID_m: string = null
  LocationID_m: string = null
  DeviceType_m: string = null
  Signal_m: string = null

  Published_at_d: string = null
  DeviceID_d: string = null
  LocationID_d: string = null
  DeviceType_d: string = null
  Signal_d: string = null

  LocationID_st: string = null
  Published_at_st: string = null
  State_st: string = null
  
  LocationID_sesh: string = null
  SessionID_sesh: string = null
  Start_time_sesh: string = null
  End_time_sesh: string = null
  State_sesh: string = null
  Od_flag: string = null
  Duration_sesh: string = null
  Still_counter: string = null
  Chatbot_state: string = null
  Notes_sesh: string = null
  IncidentType_sesh: string = null


  Timer_sesh: string = '0'


  constructor(/*private data: DataService*/) { }

  ngOnInit(): void {
    const socket = io('https://odetect-dev.brave.coop/');

    socket.on('Hello', (data) => {
      console.log(data);
    });

    socket.on('xethrustatedata', (data) => {
      console.log(data)
      this.Published_at = data.data.published_at;
      this.LocationID = data.data.locationid;
      this.DeviceID = data.data.deviceid;
      this.DeviceType = data.data.devicetype;
      this.State = data.data.state;
      this.Rpm = data.data.rpm;
      this.Distance = data.data.distance;
      this.Mov_f = data.data.mov_f;
      this.Mov_s = data.data.mov_s;
    });

    socket.on('motionstatedata', (datam) => {
      console.log(datam)
      this.Published_at_m = datam.data.published_at;
      this.LocationID_m = datam.data.locationid;
      this.DeviceID_m = datam.data.deviceid;
      this.DeviceType_m = datam.data.devicetype;
      this.Signal_m = datam.data.signal;
    });

    socket.on('doorstatedata', (datad) => {
      console.log(datad)
      this.Published_at_d = datad.data.published_at;
      this.LocationID_d = datad.data.locationid;
      this.DeviceID_d = datad.data.deviceid;
      this.DeviceType_d = datad.data.devicetype;
      this.Signal_d = datad.data.signal;
    });

    socket.on('statedata', (datast) => {
      console.log(datast)
      this.LocationID_st = datast.data.locationid;
      this.Published_at_st = datast.data.published_at;
      this.State_st = datast.data.state;
    });

    
    socket.on('sessiondata', (datasesh) => {
      console.log(datasesh)
      this.LocationID_sesh = datasesh.data.locationid;
      this.SessionID_sesh = datasesh.data.sessionid;
      this.Start_time_sesh = datasesh.data.start_time;
      this.End_time_sesh = datasesh.data.end_time;
      this.State_sesh = datasesh.data.state;
      this.Od_flag = datasesh.data.od_flag;
      this.Duration_sesh = datasesh.data.duration;
      this.Still_counter = datasesh.data.still_counter;
      this.Chatbot_state = datasesh.data.chatbot_state;
      this.Notes_sesh = datasesh.data.notes;
      this.IncidentType_sesh = datasesh.data.incidenttype;
    });

        
    socket.on('timerdata', (datasesh) => {
      console.log(datasesh)
      this.Timer_sesh = datasesh.data;
    });
  } 

  ResetClick(): void {
    const socket = io('https://odetect-dev.brave.coop/');
    console.log("Reset Cliked");
    //io.sockets.emit('timerdata', {data: sessionDuration});
    socket.emit("resetbutton");
  }
  


}
