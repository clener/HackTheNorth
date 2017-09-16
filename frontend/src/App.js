import React, { Component } from 'react';
//import logo from './logo.svg';
import TableExample from './components/IssueList'
import AndroidRenderer from './components/AndroidRenderer'
import './App.css';

class App extends Component {
  render() {
    var issues = {"id":"fec7426e-bbc4-468e-b50f-e7b8bd14151d","type":"group","children":[{"id":"f94958bc-cbb9-4748-932e-9a61fb9c1e99","type":"group","children":[{"id":"2e0a6470-91c3-4212-b743-e6bbf63e500c","type":"input","hint":"EditText Hint","text":"","textSize":63,"textColor":"rgba(0,0, 0, 222)","x":0,"y":281,"height":158,"width":1132},{"id":"b9c9efcf-9c6e-453c-b20b-1469209db794","type":"button","text":"Button","textSize":49,"textColor":"rgba(0,0, 0, 222)","x":1132,"y":280,"height":168,"width":308}],"backgroundColor":"rgba(0,0, 0, 0)","x":0,"y":280,"height":168,"width":1440},{"id":"213ba25a-b57b-492a-92c1-85a9e466eaad","type":"text","text":"Hello World!","textSize":49,"textColor":"rgba(0,0, 0, 138)","x":0,"y":448,"height":66,"width":265},{"id":"bb1920e7-790c-49cb-8e60-ab9a12a1828f","type":"button","text":"Button","textSize":49,"textColor":"rgba(255,136, 0, 255)","backgroundColor":"rgba(0,221, 255, 255)","x":0,"y":514,"height":168,"width":308},{"id":"2541e32e-27ff-44ef-8bfa-a0c033e0dc21","type":"input","text":"EditText Hint","textSize":63,"textColor":"rgba(255,255, 255, 255)","backgroundColor":"rgba(255,136, 0, 255)","x":0,"y":682,"height":85,"width":1440},{"id":"a6d34dd5-ba60-4b03-9544-217003395fce","type":"text","text":"HackTheNorth","textSize":116,"textColor":"rgba(255,64, 129, 255)","backgroundColor":"rgba(63,81, 181, 255)","x":0,"y":767,"height":155,"width":1440},{"id":"8346a277-4095-45ae-b7a3-ab4ae9cd8406","type":"list","children":[{"id":"bd286be7-5668-491e-ade6-ac32b4f44dc0","type":"text","text":"This","textSize":56,"textColor":"rgba(0,0, 0, 222)","x":0,"y":922,"height":168,"width":1440},{"id":"0ee71706-f469-4d24-8740-6773b39c20d3","type":"text","text":"list","textSize":56,"textColor":"rgba(0,0, 0, 222)","x":0,"y":1094,"height":168,"width":1440},{"id":"9e8b73aa-6387-4d04-a2c7-58cfcbac5ab8","type":"text","text":"took","textSize":56,"textColor":"rgba(0,0, 0, 222)","x":0,"y":1266,"height":168,"width":1440},{"id":"6eb9dfb6-fa70-4823-9310-d5b836020869","type":"text","text":"a","textSize":56,"textColor":"rgba(0,0, 0, 222)","x":0,"y":1438,"height":168,"width":1440},{"id":"455bcb7d-4b10-4706-8794-0b5818855848","type":"text","text":"long","textSize":56,"textColor":"rgba(0,0, 0, 222)","x":0,"y":1610,"height":168,"width":1440},{"id":"6dc2534a-e45b-4b6b-9a66-4044c13c910b","type":"text","text":"time","textSize":56,"textColor":"rgba(0,0, 0, 222)","x":0,"y":1782,"height":168,"width":1440},{"id":"14a8d146-3f29-4dfa-9fbb-1370972ff099","type":"text","text":"to","textSize":56,"textColor":"rgba(0,0, 0, 222)","x":0,"y":1954,"height":168,"width":1440},{"id":"e06fcfa6-ff86-4e91-ac97-4ad6e2a1b72c","type":"text","text":"come","textSize":56,"textColor":"rgba(0,0, 0, 222)","x":0,"y":2126,"height":168,"width":1440},{"id":"f547b6ab-98ad-4756-8aa7-3c6476a1b772","type":"text","text":"up","textSize":56,"textColor":"rgba(0,0, 0, 222)","x":0,"y":2298,"height":168,"width":1440}],"backgroundColor":"rgba(0,0, 0, 0)","x":0,"y":922,"height":1470,"width":1440}],"backgroundColor":"rgba(0,0, 0, 0)","x":0,"y":280,"height":2112,"width":1440};

    return (
      <div className="AndroidRenderer">
        <AndroidRenderer data={issues} />
        <TableExample />
      </div>
    );
  }
}

export default App;
