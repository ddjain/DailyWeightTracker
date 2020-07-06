import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { DataService } from './data.service';
import * as uuid from 'uuid';
import * as CanvasJS from '../assets/canvasjs.min';

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
    this.loadGraph(this.getDataPoints());
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


  edit(){

  }

  delete(){
    
  }


  loadGraph(dataPoints){
    let chart =  new CanvasJS.Chart("chartContainer",
    {
      theme: "dark2", //"light1", "dark1", "dark2"
      title:{
        text: ""
    },
    axisX:{
        title: "",
        gridThickness: 0.2
    },
    axisY: {
         gridThickness: 0.2,
         title: ""
    },
    data: [
    {        
        type: "line",
        dataPoints: dataPoints
    }
    ]
});

		chart.render();
  }

  ngOnInit() {
    this.data.gimmeJokes().subscribe(res => {
      this.joke = res;
    })


		
		
    this.loadGraph(this.getDataPoints())
  }

  getDataPoints(){
    let datapoints=[];
    this.history=this.getWeight();
    for(let i=0;i<this.history.length;i++){
      datapoints.push({"x":new Date(this.history[i].date),"y":this.history[i].weight,"desc":this.history[i].desc})
    }
    return datapoints;
  }

}
