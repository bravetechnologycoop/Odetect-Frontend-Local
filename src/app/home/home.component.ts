import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder} from '@angular/forms';
import * as io from 'socket.io-client';
import * as moment from 'moment-timezone';
import helpers from '../app.functions';
import { of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {

  form: FormGroup = null;
  locations = [];


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

  Location: string = "" ;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      locations: ['']
    });


    of(this.getLocations()).subscribe(locations => {
      this.locations = locations;
      this.form.controls.locations.patchValue(Location);
    });
  }

  ngOnInit(): void {
    const socket = io('https://odetect-dev2.brave.coop/');
    moment.tz.setDefault("UTC");
    this.getLocations()
    socket.on('Hello', (data) => {
      console.log(data);
    });

    socket.on('xethrustatedata', (data) => {

      if(data.data.locationid == this.Location){

        //console.log(data)
        this.Published_at = helpers.formatDate(data.data.published_at);
        this.LocationID = data.data.locationid;
        this.DeviceID = data.data.deviceid;
        this.DeviceType = data.data.devicetype;
        this.State = data.data.state;
        this.Rpm = data.data.rpm;
        this.Distance = data.data.distance;
        this.Mov_f = helpers.formatMovementReading(data.data.mov_f);
        this.Mov_s = helpers.formatMovementReading(data.data.mov_s);
      }
    });

    socket.on('doorstatedata', (datad) => {
      if(datad.data.locationid == this.Location){
        //console.log(datad)
        this.Published_at_d = helpers.formatDate(datad.data.published_at);
        this.LocationID_d = datad.data.locationid;
        this.DeviceID_d = datad.data.deviceid;
        this.DeviceType_d = datad.data.devicetype;
        this.Signal_d = datad.data.signal;
      }
    });

    socket.on('statedata', (datast) => {
      if(datast.data.locationid == this.Location){
        //console.log(datast)
        this.LocationID_st = datast.data.locationid;
        this.Published_at_st = helpers.formatDate(datast.data.published_at);
        this.State_st = datast.data.state;
      }
    });

    
    socket.on('sessiondata', (datasesh) => {
      if(datasesh.data.locationid == this.Location){
        // console.log(datasesh)
        this.LocationID_sesh = datasesh.data.locationid;
        this.SessionID_sesh = datasesh.data.sessionid;
        this.Start_time_sesh = helpers.formatDate(datasesh.data.start_time);
        if(datasesh.data.end_time != null){
          this.End_time_sesh = helpers.formatDate(datasesh.data.end_time);
        }
        else{
          this.End_time_sesh = null;
        }
        this.State_sesh = datasesh.data.state;
        this.Od_flag = datasesh.data.od_flag;
        this.Duration_sesh = datasesh.data.duration;
        this.Still_counter = datasesh.data.still_counter;
        this.Chatbot_state = datasesh.data.chatbot_state;
        this.Notes_sesh = datasesh.data.notes;
        this.IncidentType_sesh = datasesh.data.incidenttype;
      }
    });
    
    socket.on('getLocations', (locationArray) => {
      console.log('getLocations socket endpoint was hit')
      this.locations = locationArray.data;
    });
        
    socket.on('timerdata', (datasesh) => {
      //console.log(datasesh)
      this.Timer_sesh = datasesh.data;
    });
  } 

  ResetClick(): void {
    const socket = io('https://odetect-dev2.brave.coop/');
    console.log("Reset Cliked");
    //io.sockets.emit('timerdata', {data: sessionDuration});
    socket.emit("resetbutton", this.Location);
    this.Timer_sesh = '0';
  }

  getLocations(){
    const socket = io('https://odetect-dev2.brave.coop/');
    socket.emit('getLocations')
    return this.locations;
  }

  LocationSelector(): void {
    this.getLocations();
    this.Location = this.form.value.locations
  }
}
