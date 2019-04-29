import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})

export class HistoryComponent implements OnInit {

  constructor(/*private data: DataService*/) { }

  ngOnInit(): void {
    const socket = io('https://odetect-dev.brave.coop/');

 

    socket.on('Hello', (data) => {
      console.log(data);
    });
    
    socket.emit('getHistory', 'BraveOffice');


    // This value is here because the loop would be run multiple times
    // when there is navigation between the frontend tabs
    // which caused the table to get increasingly larger
    // This removes that issue by raising the flag after the first loop
    // preventing the loop from executing more times
    let singleGenFlag = 0;

    socket.on('sendHistory', (datasesh) => {
      var i;
      if(singleGenFlag == 0) {
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
          starttime.innerHTML = datasesh.data[i].start_time.slice(0,19);

          let endtime = row.insertCell(3);
          endtime.className = 'historyCell';
          endtime.innerHTML = datasesh.data[i].end_time.slice(0,19);

          let state = row.insertCell(4);
          state.className = 'historyCell';
          state.innerHTML = datasesh.data[i].state.split(':')[0];
          /*
          let odflag = row.insertCell(5);
          odflag.className = 'historyCell';
          odflag.innerHTML = datasesh.data[i].od_flag;
          */
          let duration = row.insertCell(5);
          duration.className = 'historyCell';
          duration.innerHTML = datasesh.data[i].duration;
          /*
          let stillcounter = row.insertCell(6);
          stillcounter.className = 'historyCell';
          stillcounter.innerHTML = datasesh.data[i].still_counter;
          */
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
        singleGenFlag = 1;
      }
    });
  } 
}
