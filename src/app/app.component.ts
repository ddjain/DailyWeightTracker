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
  desc:string;
  date:Date;

  constructor(updates: SwUpdate, private data: DataService) {
    this.showWeights();
    updates.available.subscribe(event => {

      //this.update = true;
      updates.activateUpdate().then(() => document.location.reload());
      
    })
  }

  clear(){
    localStorage.setItem("history",JSON.stringify([]));
    this.showWeights()
  }
  register(){
    if(!localStorage.getItem("history")){
      localStorage.setItem("history",JSON.stringify([]));
    } 
    const myId = uuid.v4();
    if(!this.date){
      this.date=new Date();
    }
    if(!this.weight){
      alert("*Weight is required to add record");
      return
    }

    this.history=JSON.parse(localStorage.getItem("history"));
    this.history.push({"id":myId,"date":this.date,"weight":this.weight,"desc":this.desc});
    localStorage.setItem("history",JSON.stringify(this.history));

    this.date=null;
    this.weight=null;
    this.desc=null;
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
