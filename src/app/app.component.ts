import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { DataService } from './data.service';
import * as uuid from 'uuid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  update: boolean = false;
  joke: any;
  weight:string;
  history:any[];
  
  constructor(updates: SwUpdate, private data: DataService) {
    updates.available.subscribe(event => {

      //this.update = true;
      updates.activateUpdate().then(() => document.location.reload());
      debugger
      if(!localStorage.getItem("history")){
        localStorage.setItem("history",JSON.stringify([]));
      } 
    })
  }

  clear(){
    localStorage.setItem("history",JSON.stringify([]));
  }
  register(){
    if(!localStorage.getItem("history")){
      localStorage.setItem("history",JSON.stringify([]));
    } 
    const myId = uuid.v4();

    this.history=JSON.parse(localStorage.getItem("history"));
    this.history.push({"id":myId,"date":new Date,"weight":this.weight});
    localStorage.setItem("history",JSON.stringify(this.history));
  }

  showWeights(){
    if(!localStorage.getItem("history")){
      localStorage.setItem("history",JSON.stringify([]));
    } 
    this.history=JSON.parse(localStorage.getItem("history"));
  }

  getWeight(){
    if(!localStorage.getItem("history")){
     return [];
    } else {
      return JSON.parse(localStorage.getItem("history"));
    }
  }

  ngOnInit() {
    this.data.gimmeJokes().subscribe(res => {
      this.joke = res;
    })
  }

}
