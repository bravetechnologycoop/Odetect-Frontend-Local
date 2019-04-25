import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-about',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.scss']
})

export class SensorsComponent implements OnInit {

  LocationForm = new FormGroup({
    LocationID: new FormControl('')
  });

  LocationDataForm = new FormGroup({
    DeviceID: new FormControl(''),
    PhoneNumber: new FormControl(''),
    DetectionZone_min: new FormControl(''),
    DetectionZone_max: new FormControl(''),
    Sensitivity: new FormControl(''),
    LED: new FormControl(''),
    NoiseMap: new FormControl('')
  });

  updateSensitivity() {
    var sensitivity = document.getElementById('sensitivity');
    this.Sensitivity = sensitivity.value;
  }
  
  updateNoisemapValue() {
    var one = document.getElementById("noisemap1");
    var two = document.getElementById("noisemap2");
    var four = document.getElementById("noisemap4");
    var noisemap = document.getElementById("noisemap");

    var noisemapValue = 0;

    if(one.checked == true) {
      noisemapValue += 1;
    }
    if(two.checked == true) {
      noisemapValue += 2;
    }
    if(four.checked == true) {
      noisemapValue += 4;
    }

    noisemap.defaultvalue = noisemapValue;
    noisemap.value = noisemapValue;
  }

  onSubmitLocation() {
    // TODO: Use EventEmitter with form value
    console.log(this.LocationForm.value);
    const socket = io('https://odetect-dev.brave.coop/');
    socket.emit("SubmitLocation", this.LocationForm.value);
  }

  onSubmitLocationData(){
    var LocationID = this.LocationForm.value;
    var LocationData = this.LocationDataForm.value;
    var FullLocationData = {LocationID, LocationData}
    console.log(FullLocationData);
    const socket = io('https://odetect-dev.brave.coop/');
    socket.emit("SubmitLocationData", FullLocationData);
  }

  ngOnInit(){
    const socket = io('https://odetect-dev.brave.coop/');
    socket.on("LocationData", (data) => {
      if(typeof data.data !== 'undefined'){
        this.LocationDataForm.patchValue({
          DeviceID: data.data.deviceid,
          PhoneNumber: data.data.phonenumber,
          DetectionZone_min: data.data.detectionzone_min,
          DetectionZone_max: data.data.detectionzone_max,
          Sensitivity: data.data.sensitivity,
          LED: data.data.led,
          NoiseMap: data.data.noisemap,
        });
        this.Sensitivity = data.data.sensitivity;
        console.log(data.data.sensitivity);
        data = data.data.noisemap;
        parseNoisemap(data);
      }
      else{
        this.LocationForm.patchValue({
          LocationID: "LocationID Does Not Exist"
        });
        this.LocationDataForm.patchValue({
          DeviceID: null,
          PhoneNumber: null,
          DetectionZone_min: null,
          DetectionZone_max: null,
          Sensitivity: null,
          LED: null,
          NoiseMap: null,
        });
      }
    });
    var sensitivity = document.getElementById('sensitivity');
    this.Sensitivity = sensitivity.value;
  }
}

function parseNoisemap(data) {
  if(data%2 == 1) {
    document.getElementById("noisemap1").checked = true;
  }
  else {
    document.getElementById("noisemap1").checked = false;
  }
  console.log(data);
  data = Math.floor(data/2);
  if(data%2 == 1) {
    document.getElementById("noisemap2").checked = true;
  }
  else {
    document.getElementById("noisemap2").checked = false;
  }
  console.log(data);
  data = Math.floor(data/2);
  if(data%2 == 1) {
    document.getElementById("noisemap4").checked = true;
  }
  else {
    document.getElementById("noisemap4").checked = false;
  }
  console.log(data);
}
