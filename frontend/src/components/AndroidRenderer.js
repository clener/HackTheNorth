import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField'
import MouseTracker from './MouseTracker'
import List from "material-ui/List"
import ListItem from "material-ui/List"
import Divider from 'material-ui/Divider';
import '../App.css';

var p2p = require('socket.io-p2p');
var io = require('socket.io-client');

var socket = io();
var opts = { numClients: 2 };
var p2p = new p2p(socket, opts, () => {
    p2p.emit('p2pEstablished', "p2p socket ID: " + p2psocket.peerId)
})

// function to emit rendering to android
// function sendRenderToAndroid(data) {
//     console.log("Sending new updated Android view to phone.");
//     p2p.emit('reRenderRes', data);
// }

class AndroidRenderer extends Component {

    renderElement(element, offset){
        if(element == null)
            return null

        var children = [];
        
        var placementStyle = {
            height: Math.ceil(element.height/4) + "px",
            width: Math.ceil(element.width/4) + "px",
            position: "absolute",
            top: (element.y - offset)/4 + "px",
            left: element.x/4 + "px",
        }

        switch(element.type){
            case "group":
                if(element.children != null && element.children.length > 0){
                    element.children.forEach((child) => {
                        children.push(this.renderElement(child, offset));
                        console.log(child);
                    });
                }

                return (<div style={placementStyle}>{children.map((child, index) => { return (<div id={index}>{child}</div>);})}</div>)
            case "list":
                if(element.children != null && element.children.length > 0){
                    element.children.forEach((child) => {
                        children.push(this.renderListItem(child, offset));
                        console.log(child);
                    });
                }

                return (<MouseTracker style={placementStyle}><List>{children.map((child, index) => { return (<div id={index}>{child}</div>);})}</List></MouseTracker>)
            case "button":
                var placementStyle = {
                    position: "absolute",
                    top: (element.y - offset)/4 + "px",
                    left: element.x/4 + "px",
                    //fontSize: element.textSize/4,
                }

                return <RaisedButton labelColor={element.textColor} backgroundColor={element.backgroundColor} style={placementStyle}>{element.text}</RaisedButton>
            case "input":
                var inputStyle = {}

                if(element.backgroundColor)
                    inputStyle.background = element.backgroundColor;
                if(element.textColor)
                    inputStyle.color = element.textColor;

                return <TextField id={element.id} value={element.text} placeholder={element.hint} style={placementStyle} inputStyle={inputStyle}></TextField>
            case "text":
                var placementStyle = {
                    height: Math.ceil(element.height/4) + "px",
                    width: Math.ceil(element.width/4) + "px",
                    position: "absolute",
                    top: (element.y - offset)/4 + "px",
                    left: element.x/4 + "px",
                }

                if(element.backgroundColor)
                    placementStyle.background = element.backgroundColor;
                if(element.textColor)
                    placementStyle.color = element.textColor;
                if(element.textSize)
                    placementStyle.fontSize = element.textSize/4;

                return <text style={placementStyle}>{element.text}</text>
            default:
                

                return <div style={placementStyle}>???</div>
        }       
    }

    renderListItem(element, offset){
        var style = {
            height: Math.ceil(element.height/4) + "px",
            width: Math.ceil(element.width/4) + "px",
            position: "absolute",
            top: (element.y - offset)/4 + "px",
            left: element.x/4 + "px"
        }

        if (element.textSize) {
            //style = Object.assign(style, { fontSize: element.textSize/4 })
            style.fontSize = element.textSize/4;
        }

        return (<div style={style}><ListItem>{element.text}</ListItem><Divider/></div>)
    }

    

componentDidMount() {
  p2p.on('reRenderReq', (data) => {
      console.log("JSON object of Android %s", JSON.stringify(data));
  });
};

    render(){
        var data = this.props.data;

        if(data == null)
            return null;

        return (<div id="rendererCanvas" style={{position: "static"}}>{this.renderElement(data, data.y)}</div>);

    }
}

export default AndroidRenderer; 