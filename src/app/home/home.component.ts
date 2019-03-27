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
  Device: string = null
  State: string = null
  Rpm: string = null
  Distance: string = null
  Mov_f: string = null
  Mov_s: string = null



  constructor(/*private data: DataService*/) { }

  ngOnInit(): void {
    const socket = io('http://Localhost:3000');

    socket.on('Hello', (data) => {
      console.log(data)
    });

    socket.on('xethrustatedata', (data) => {
      console.log(data)
      this.Published_at = data.data.published_at;
      this.Device = data.data.device
      this.State = data.data.state
      this.Rpm = data.data.rpm
      this.Distance = data.data.distance
      this.Mov_f = data.data.mov_f
      this.Mov_s = data.data.mov_s
    });
  } 
  


}
