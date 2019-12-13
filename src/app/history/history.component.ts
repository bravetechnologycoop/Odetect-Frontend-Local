import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder} from '@angular/forms';
import * as io from 'socket.io-client';
import helpers from '../app.functions'
import { of } from 'rxjs';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})

export class HistoryComponent implements OnInit {

  HistoryForm: FormGroup = null;
  locations = [];


  Location: string = ""
  Entries: string = "15"

  constructor(private formBuilder: FormBuilder) {
    this.HistoryForm = this.formBuilder.group({
      locations: [''],
      NumEntries: '15'
    });


    of(this.getLocations()).subscribe(locations => {
      this.locations = locations;
      this.HistoryForm.controls.locations.patchValue(Location);
      this.HistoryForm.controls.locations.patchValue('15');
    });
  }
  ngOnInit(): void {
    const socket = io('https://odetect-dev2.brave.coop/');
    socket.emit('getLocations')


    socket.on('Hello', (data) => {
      console.log(data);
    });

    socket.on('getLocations', (locationArray) => {
      console.log('getLocations socket endpoint was hit')
      this.locations = locationArray.data;
      this.HistoryForm.controls.locations.patchValue(this.locations[0]);
    });
    
    socket.on('sendHistory', (datasesh) => {
      console.log('socket hit for history')
      console.log(datasesh.data)
      // Deletes the old table to replace it with the new selection 
      let oldTable = <HTMLTableElement>document.getElementById('sessionsHistory');
      for(var x = oldTable.rows.length; x > 1; x--)
        {
         oldTable.deleteRow(x-1);
        }

      var i;
        for(i = 0; datasesh.data[i] != null; i++) {
          let table = <HTMLTableElement>document.getElementById('sessionsHistory');
          let row = table.insertRow(i+1);

          let location = row.insertCell(0);
          location.className = "historyCell";
          location.innerHTML = datasesh.data[i].locationid;

          let sessionid = row.insertCell(1);
          sessionid.className = 'historyCell';
          sessionid.innerHTML = datasesh.data[i].sessionid;

          let starttime = row.insertCell(2);
          starttime.className = 'historyCell';
          starttime.innerHTML = helpers.formatDate(datasesh.data[i].start_time);

          let endtime = row.insertCell(3);
          endtime.className = 'historyCell';
          endtime.innerHTML = helpers.formatDate(datasesh.data[i].end_time);

          let state = row.insertCell(4);
          state.className = 'historyCell';
          state.innerHTML = datasesh.data[i].state.split(':')[0];

          let duration = row.insertCell(5);
          duration.className = 'historyCell';
          duration.innerHTML = datasesh.data[i].duration;

          let chatbotstate = row.insertCell(6);
          chatbotstate.className = 'historyCell';
          chatbotstate.innerHTML = datasesh.data[i].chatbot_state;

          let incidenttype = row.insertCell(7);
          incidenttype.className = 'historyCell';
          incidenttype.innerHTML = datasesh.data[i].incidenttype;

          let notes = row.insertCell(8);
          notes.className = 'historyCell';
          notes.innerHTML = datasesh.data[i].notes;
        }
    });
  }
  
  getLocations(){
    const socket = io('https://odetect-dev2.brave.coop/');
    socket.emit('getLocations')
    return this.locations;
  }

  HistorySelector(){
    const socket = io('https://odetect-dev2.brave.coop/');
    this.Location = this.HistoryForm.value.locations
    this.Entries = this.HistoryForm.value.NumEntries
    socket.emit('getHistory', this.Location, this.Entries);
  }
}
