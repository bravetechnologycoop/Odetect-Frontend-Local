import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
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



  constructor(/*private data: DataService*/) { }

  ngOnInit(): void {
    const socket = io('http://Localhost:3000');

    socket.on('Hello', (data) => {
      console.log(data)
    });

    socket.on('xethrustatedata', (data) => {
      console.log(data)
      this.Published_at = data.data.published_at;
      this.LocationID = data.data.locationid
      this.DeviceID = data.data.deviceid
      this.DeviceType = data.data.devicetype
      this.State = data.data.state
      this.Rpm = data.data.rpm
      this.Distance = data.data.distance
      this.Mov_f = data.data.mov_f
      this.Mov_s = data.data.mov_s
    });

    socket.on('motionstatedata', (datam) => {
      console.log(datam)
      this.Published_at_m = datam.data.published_at;
      this.LocationID_m = datam.data.locationid
      this.DeviceID_m = datam.data.deviceid
      this.DeviceType_m = datam.data.devicetype
      this.Signal_m = datam.data.signal
    });

    socket.on('doorstatedata', (datad) => {
      console.log(datad)
      this.Published_at_d = datad.data.published_at;
      this.LocationID_d = datad.data.locationid
      this.DeviceID_d = datad.data.deviceid
      this.DeviceType_d = datad.data.devicetype
      this.Signal_d = datad.data.signal
    });

    socket.on('sessionstatedata', (data) => {
      console.log(data)
    });
  } 
  


}
