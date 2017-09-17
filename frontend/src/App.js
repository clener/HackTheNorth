import React, { Component } from 'react';
import IssueList from './components/IssueList'
import AndroidRenderer from './components/AndroidRenderer'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './App.css';

class App extends Component {

  constructor(props){
    super(props);

    this.state = { showAndroid: false};
    var io = require('socket.io-client');
    this.socket = io.connect("http://34.229.167.116:3000");
  }

  showAndroidRender(uuid){
    this.setState({showAndroid: true, uuid: uuid});
  }

  render() {
    //Default View
    //var view = {"id":"f24d2286-1f45-443a-82c4-7db7766e1599","type":"group","children":[{"id":"7fb2ecf1-4c3b-485a-afb7-be7336e6b5e1","type":"group","children":[{"id":"101c5a94-c648-4bad-b60f-2d067fc592a7","type":"input","hint":"EditText Hint","text":"","textSize":63,"textColor":"rgba(0,0,0,222)","padding":{"left":14,"top":35,"right":14,"bottom":38},"x":0,"y":281,"height":158,"width":1132},{"id":"dee2dd1a-f816-4309-b5ce-d9014844d03b","type":"button","text":"Button","textSize":49,"textColor":"rgba(0,0,0,222)","padding":{"left":42,"top":35,"right":42,"bottom":35},"x":1132,"y":280,"height":168,"width":308}],"backgroundColor":"rgba(0,0,0,0)","padding":{"left":0,"top":0,"right":0,"bottom":0},"x":0,"y":280,"height":168,"width":1440},{"id":"aea7c467-2761-4e82-b7b9-05695253574e","type":"text","text":"Hello World!","textSize":49,"textColor":"rgba(0,0,0,138)","padding":{"left":0,"top":0,"right":0,"bottom":0},"x":0,"y":448,"height":66,"width":265},{"id":"14af5e91-72b6-4b76-bee2-828cfb969d48","type":"button","text":"Button","textSize":49,"textColor":"rgba(255,136,0,255)","padding":{"left":0,"top":0,"right":0,"bottom":0},"backgroundColor":"rgba(0,221,255,255)","x":0,"y":514,"height":168,"width":308},{"id":"01df63de-69e6-4de0-9d8a-35aeab39a98f","type":"input","text":"EditText Hint","textSize":63,"textColor":"rgba(255,255,255,255)","padding":{"left":0,"top":0,"right":0,"bottom":0},"backgroundColor":"rgba(255,136,0,255)","x":0,"y":682,"height":85,"width":1440},{"id":"988f89aa-0dd0-451b-ab6c-de6d835e49ab","type":"text","text":"HackTheNorth","textSize":116,"textColor":"rgba(255,64,129,255)","padding":{"left":0,"top":0,"right":0,"bottom":0},"backgroundColor":"rgba(63,81,181,255)","x":0,"y":767,"height":155,"width":1440},{"id":"70550b22-93eb-4a0c-921d-3b21cf18b045","type":"list","children":[{"id":"1c3adb16-3b13-4736-87e4-9aebb0c43c12","type":"text","text":"This","textSize":56,"textColor":"rgba(0,0,0,222)","padding":{"left":56,"top":0,"right":56,"bottom":0},"x":0,"y":922,"height":168,"width":1440},{"id":"e3c65238-9a49-4f08-8e15-260c178e7f38","type":"text","text":"list","textSize":56,"textColor":"rgba(0,0,0,222)","padding":{"left":56,"top":0,"right":56,"bottom":0},"x":0,"y":1094,"height":168,"width":1440},{"id":"869e235c-5999-4108-bfa7-908cfd848c89","type":"text","text":"took","textSize":56,"textColor":"rgba(0,0,0,222)","padding":{"left":56,"top":0,"right":56,"bottom":0},"x":0,"y":1266,"height":168,"width":1440},{"id":"4185a70e-0c64-44ca-b719-5548ed8ef924","type":"text","text":"a","textSize":56,"textColor":"rgba(0,0,0,222)","padding":{"left":56,"top":0,"right":56,"bottom":0},"x":0,"y":1438,"height":168,"width":1440},{"id":"d3cbd394-f016-4f83-b3ac-4947466f4bab","type":"text","text":"long","textSize":56,"textColor":"rgba(0,0,0,222)","padding":{"left":56,"top":0,"right":56,"bottom":0},"x":0,"y":1610,"height":168,"width":1440},{"id":"7222d507-d8fa-454f-970a-3a3af72b561f","type":"text","text":"time","textSize":56,"textColor":"rgba(0,0,0,222)","padding":{"left":56,"top":0,"right":56,"bottom":0},"x":0,"y":1782,"height":168,"width":1440},{"id":"bd4dc2f3-4fe5-4cdd-bd3c-983141a34a52","type":"text","text":"to","textSize":56,"textColor":"rgba(0,0,0,222)","padding":{"left":56,"top":0,"right":56,"bottom":0},"x":0,"y":1954,"height":168,"width":1440},{"id":"27f2ccd5-98c2-4312-a482-4ed5ba978aca","type":"text","text":"come","textSize":56,"textColor":"rgba(0,0,0,222)","padding":{"left":56,"top":0,"right":56,"bottom":0},"x":0,"y":2126,"height":168,"width":1440},{"id":"e554d58e-397c-439b-8cc0-5f1b4a7e368a","type":"text","text":"up","textSize":56,"textColor":"rgba(0,0,0,222)","padding":{"left":56,"top":0,"right":56,"bottom":0},"x":0,"y":2298,"height":168,"width":1440}],"backgroundColor":"rgba(0,0,0,0)","padding":{"left":0,"top":0,"right":0,"bottom":0},"x":0,"y":922,"height":1470,"width":1440}],"backgroundColor":"rgba(0,0,0,0)","padding":{"left":0,"top":0,"right":0,"bottom":0},"x":0,"y":280,"height":2112,"width":1440};
    //Key board open
    //var issues = {"id":"0dda846a-31a0-4823-8a8b-0cea2fa7595d","type":"group","children":[{"id":"7e6953b7-7983-4f6d-8074-eff2b7eeccc6","type":"group","children":[{"id":"1a43fba0-fe5d-4d6e-8259-558ea5177fbd","type":"input","hint":"EditText Hint","text":"tsfredvbbhfjysyyfdhh","textSize":63,"textColor":"rgba(0,0,0,222)","padding":{"left":14,"top":35,"right":14,"bottom":38},"x":0,"y":281,"height":158,"width":1132},{"id":"89fe241e-c8e8-41ce-a449-9a65a6286685","type":"button","text":"Button","textSize":49,"textColor":"rgba(0,0,0,222)","padding":{"left":42,"top":35,"right":42,"bottom":35},"x":1132,"y":280,"height":168,"width":308}],"backgroundColor":"rgba(0,0,0,0)","padding":{"left":0,"top":0,"right":0,"bottom":0},"x":0,"y":280,"height":168,"width":1440},{"id":"4b566617-e2ec-434a-82ba-d6c9708ee1b7","type":"text","text":"Hello World!","textSize":49,"textColor":"rgba(0,0,0,138)","padding":{"left":0,"top":0,"right":0,"bottom":0},"x":0,"y":448,"height":66,"width":265},{"id":"d910403b-21dd-41d3-a148-53be36a81444","type":"button","text":"Button","textSize":49,"textColor":"rgba(255,136,0,255)","padding":{"left":0,"top":0,"right":0,"bottom":0},"backgroundColor":"rgba(0,221,255,255)","x":0,"y":514,"height":168,"width":308},{"id":"fc883851-0fb0-4647-ad77-ca9be837b52e","type":"input","text":"EditText Hint","textSize":63,"textColor":"rgba(255,255,255,255)","padding":{"left":0,"top":0,"right":0,"bottom":0},"backgroundColor":"rgba(255,136,0,255)","x":0,"y":682,"height":85,"width":1440},{"id":"cadaa014-1f8d-44b0-b228-b5d6813d2125","type":"text","text":"HackTheNorth","textSize":116,"textColor":"rgba(255,64,129,255)","padding":{"left":0,"top":0,"right":0,"bottom":0},"backgroundColor":"rgba(63,81,181,255)","x":0,"y":767,"height":155,"width":1440},{"id":"8eff806e-b9fe-4d17-a6bf-da4a79ecc341","type":"list","children":[{"id":"2db3d03d-3ba0-4364-93fd-8ffe953d8e73","type":"text","text":"come","textSize":56,"textColor":"rgba(0,0,0,222)","padding":{"left":56,"top":0,"right":56,"bottom":0},"x":0,"y":893,"height":168,"width":1440},{"id":"1b90fcba-8304-4241-aa03-a731f7a31ea6","type":"text","text":"up","textSize":56,"textColor":"rgba(0,0,0,222)","padding":{"left":56,"top":0,"right":56,"bottom":0},"x":0,"y":1065,"height":168,"width":1440},{"id":"ae3bb4c6-ae32-4c4d-9d23-71d4e6c7a835","type":"text","text":"with","textSize":56,"textColor":"rgba(0,0,0,222)","padding":{"left":56,"top":0,"right":56,"bottom":0},"x":0,"y":1237,"height":168,"width":1440}],"backgroundColor":"rgba(0,0,0,0)","padding":{"left":0,"top":0,"right":0,"bottom":0},"x":0,"y":922,"height":483,"width":1440}],"backgroundColor":"rgba(0,0,0,0)","padding":{"left":0,"top":0,"right":0,"bottom":0},"x":0,"y":280,"height":1125,"width":1440};
    
    //var issues = [ { name: "Bobby", problem: "How do you turn on a computer?" }, { name: "Sam", problem: "Where is the volume controls?" }, { name: "Frank", problem: "How do you turn on a phone?" }, { name: "Brad", problem: "Where is the volume controls?" }, { name: "Ryan", problem: "How do you turn on a phone?" }, { name: "Peter", problem: "Where is the volume controls?" }]
    var toRender = (<IssueList issues={this.state.data} socket={this.socket} showAndroidRender={(uuid) => this.showAndroidRender(uuid)}/>);

    if (this.state.showAndroid){
        toRender = (<AndroidRenderer uuid={this.state.uuid} socket={this.socket}/>);
    }

    return (
      <MuiThemeProvider>
      {toRender}
      </MuiThemeProvider>
    );
  }
}

export default App;
