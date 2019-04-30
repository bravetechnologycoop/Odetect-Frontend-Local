import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-about',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.scss']
})

export class SensorsComponent implements OnInit {

  Max_Range: string = null
  Min_Range: string = null
  Sensitivity: string = null

  LocationForm = new FormGroup({
    LocationID: new FormControl('')
  });

  LocationDataForm = new FormGroup({
    DeviceID: new FormControl(''),
    PhoneNumber: new FormControl(''),
    RPM_Threshold: new FormControl(''),
    Still_Threshold: new FormControl(''),
    Duration_Threshold: new FormControl(''),
    Mov_Threshold: new FormControl(''),
    DetectionZone_min: new FormControl('0.4'),
    DetectionZone_max: new FormControl('5'),
    Sensitivity: new FormControl(''),
    LED: new FormControl(''),
    NoiseMap: new FormControl('0')
  });

  updateMaxRange() {
    var max = <HTMLInputElement>document.getElementById("max_range");
    var min = <HTMLInputElement>document.getElementById("min_range");

    if(max.value < min.value) {
      max.value = min.value;
    }
    this.Max_Range = max.value;
  }

  updateMinRange() {
    var max = <HTMLInputElement>document.getElementById("max_range");
    var min = <HTMLInputElement>document.getElementById("min_range");

    if(min.value > max.value) {
      min.value = max.value;
    }
    this.Min_Range = min.value;
  }

  updateSensitivity() {
    var sensitivity = <HTMLInputElement>document.getElementById('sensitivity');
    this.Sensitivity = sensitivity.value;
  }
  
  updateNoisemapValue() {
    var one = <HTMLInputElement>document.getElementById("noisemap1");
    var two = <HTMLInputElement>document.getElementById("noisemap2");
    var four = <HTMLInputElement>document.getElementById("noisemap4");

    var noisemapValue = 0;

    if(one.checked == true) {
      noisemapValue += parseInt(one.value, 10);
    }
    if(two.checked == true) {
      noisemapValue += parseInt(two.value, 10);
    }
    if(four.checked == true) {
      noisemapValue += parseInt(four.value, 10);
    }

    this.LocationDataForm.patchValue({
      NoiseMap: noisemapValue,
    });
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
          PhoneNumber: data.data.phonenumber.slice(2),
          RPM_Threshold: data.data.rpm_threshold,
          Still_Threshold: data.data.still_threshold,
          Duration_Threshold: data.data.duration_threshold,
          Mov_Threshold: data.data.mov_threshold,
          DetectionZone_min: data.data.detectionzone_min,
          DetectionZone_max: data.data.detectionzone_max,
          Sensitivity: data.data.sensitivity,
          LED: data.data.led,
          NoiseMap: data.data.noisemap,
        });
        this.Sensitivity = data.data.sensitivity;
        this.Min_Range = data.data.detectionzone_min;
        this.Max_Range = data.data.detectionzone_max;
        parseNoisemap(data.data.noisemap);
      }
      else{
        this.LocationForm.patchValue({
          LocationID: "LocationID Does Not Exist"
        });
        this.LocationDataForm.patchValue({
          DeviceID: null,
          PhoneNumber: null,
          RPM_Threshold: null,
          Still_Threshold: null,
          Duration_Threshold: null,
          Mov_Threshold: null,
          DetectionZone_min: null,
          DetectionZone_max: null,
          Sensitivity: null,
          LED: null,
          NoiseMap: null,
        });
      }
    });
    var sensitivity = <HTMLInputElement>document.getElementById('sensitivity');
    this.Sensitivity = sensitivity.value;
    this.Min_Range = "0.4";
    this.Max_Range = "5";
  }
}

function parseNoisemap(data) {
  if(data%2 == 1) {
    (<HTMLInputElement>document.getElementById("noisemap1")).checked = true;
  }
  else {
    (<HTMLInputElement>document.getElementById("noisemap1")).checked = false;
  }
  data = Math.floor(data/2);
  if(data%2 == 1) {
    (<HTMLInputElement>document.getElementById("noisemap2")).checked = true;
  }
  else {
    (<HTMLInputElement>document.getElementById("noisemap2")).checked = false;
  }
  data = Math.floor(data/2);
  if(data%2 == 1) {
    (<HTMLInputElement>document.getElementById("noisemap4")).checked = true;
  }
  else {
    (<HTMLInputElement>document.getElementById("noisemap4")).checked = false;
  }
}

