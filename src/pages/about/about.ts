import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  keys : any = {
    1: {
      start: "FW"
    },
    2: {
      start: "LF"
    },
    3: {
      start: "STOP"
    },
    4: {
      start: "RI"
    },
    5: {
      start: "BW"
    }
  }
  ws: WebSocket;
  ip: string;
  connection_state = "NOT_CONNECTED";
  name:string = "Manan";
  color_r: number;
  color_g: number;
  color_b: number;
  led_on: boolean = true;

  colors = {
    Red: [255,0,0],
    Green: [0,255,0],
    Blue: [0,0,255],
    Yellow: [255,255,0]
  }
  color_keys : any;
  selectedColor: any;
  
  constructor(public navCtrl: NavController) {
    this.color_keys = Object.keys(this.colors);
    this.initWs();
  }
  reinitConnection(){
    if(this.ws.readyState === this.ws.OPEN || this.ws.readyState === this.ws.CONNECTING){
      this.ws.close();
    }
    this.initWs();
  }

  initWs(){
              this.connection_state = "CONNECTING";
              this.ws = new WebSocket("ws://"+this.ip+"/ws");
				
               this.ws.onopen = () => {
                  this.connection_state = "CONNECTED";
                  // Web Socket is connected, send data using send()
                  setTimeout(()=>{
                    // this.ws.send("Message to send");
                  }, 2000);
                  console.log("Connected");
                  
                  // alert("Message is sent...");
               };
				
               this.ws.onmessage =  (evt) => { 
                  var received_msg = evt.data;
                  console.log("Message is received...");
               };
				
               this.ws.onclose = () => { 
                this.connection_state = "NOT_CONNECTED";
                  // websocket is closed.
                  console.log("Connection is closed..."); 

                  setTimeout(()=>{
                    console.log("Retrying Connection");
                    this.initWs();
                  }, 1000);
               };

               this.ws.onerror = (e) => {
                 console.log("Error Occured in connection");
                //  this.initWs();
               }

  }

  touchstart(ev,key){
    this.sendMotorCommand(this.keys[key].start);

  }
  touchend(ev, key){
    this.sendMotorCommand("STOP");
  }

  sendAction(action: string){
    let command = null;
    switch (action){
      case "follow_line":
      command = {
        c: "MOT",
        act: "LINE"
      }
      break;
      default:
      break;
    }
    if(command){
      this.sendCommand(JSON.stringify(command));
    }
  }
  sendName(){
    let command = {
      c: "SCR",
      act: "SET_NAME",
      name: this.name
    }
    this.sendCommand(JSON.stringify(command));
    
  }
  changeLedColor(colors){
    let command = {
      c: "LED",
      act: "SET_COLOR",
      r: this.color_r,
      g: this.color_g,
      b: this.color_b
    }
    this.sendCommand(JSON.stringify(command));
  }
  setColor(key){
    let color = this.colors[key];
    let command = {
      c: "LED",
      act: "SET_COLOR",
      r: color[0],
      g: color[1],
      b: color[2],
    }
    this.sendCommand(JSON.stringify(command));
  }
  led_on_off(status: boolean){
      let command = {
        c: "LED",
        act: "ON_OFF",
        on_off: status ? 1: 0
      }
      this.led_on = !this.led_on;
      this.sendCommand(JSON.stringify(command));
  }

  sendMotorCommand(act: string){
    let command = {
      c: "MOT",
      act: act
    }
    this.sendCommand(JSON.stringify(command));
  }
  

  sendCommand(command: string){
    console.log(command);
    if(this.ws.readyState === this.ws.OPEN){
      this.ws.send(command);
    }else if(this.ws.readyState === this.ws.CLOSED){
      setTimeout(()=>{
        console.log("Retrying Connection");
        this.initWs();
      }, 1000);
    }
  }
  

}
