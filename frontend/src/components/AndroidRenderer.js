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

/*var p2p = require('socket.io-p2p');
var io = require('socket.io-client');
io.connect("34.229.167.116:3000")*/

/*var socket = io();
var opts = { numClients: 2 };
var p2pConnection = new p2p(socket, opts, function() {
    //p2pConnection.emit('p2pEstablished', "p2p socket ID: " + p2psocket.peerId)
})*/

// function to emit rendering to android
// function sendRenderToAndroid(data) {
//     console.log("Sending new updated Android view to phone.");
//     p2p.emit('reRenderRes', data);
// }

class AndroidRenderer extends Component {

    constructor(props){
        super(props);
        this.state = {}
    }

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
            //padding: element.padding.top/4 + "px " + element.padding.right/4 + "px " + element.padding.bottom/4 + "px " + element.padding.left/4 + "px"
        }   
        switch(element.type){
            case "group":
                if(element.children != null && element.children.length > 0){
                    element.children.forEach((child) => {
                        children.push(this.renderElement(child, offset));
                    });
                }

                return (<div id={element.id} style={placementStyle}>{children.map((child, index) => { return (<div id={index}>{child}</div>);})}</div>)
            case "list":
                if(element.children != null && element.children.length > 0){
                    element.children.forEach((child) => {
                        children.push(this.renderListItem(child, offset));
                    });
                }

                return (<MouseTracker style={placementStyle}><List id={element.id}>{children.map((child, index) => { return (<div id={index}>{child}</div>);})}</List></MouseTracker>)
            case "button":

                placementStyle.height = Math.ceil(element.height/4 - element.padding.top/4 - element.padding.bottom/4) + "px";
                //placementStyle.padding = null;

                var buttonStyle = {
                    lineHeight: Math.ceil(element.height/4 - element.padding.top/4 - element.padding.bottom/4) + "px",
                }

                if(element.textColor)
                    buttonStyle.color = element.textColor;

                return <RaisedButton labelColor={element.textColor} backgroundColor={element.backgroundColor} style={placementStyle} buttonStyle={buttonStyle}>{element.text}</RaisedButton>
            case "input":
                var inputStyle = {}
                
                var textToShow = element.text;
                if (this.state[element.id]) {
                    textToShow = this.state[element.id];
                }

                if(element.backgroundColor)
                    inputStyle.background = element.backgroundColor;
                if(element.textColor)
                    inputStyle.color = element.textColor;

                return <TextField id={element.id} onChange={(e, t) => this.inputChange(e, t, element.id)} value={textToShow} placeholder={element.hint} style={placementStyle} inputStyle={inputStyle}></TextField>
            case "text":
                var formatStyle = {};

                if(element.backgroundColor)
                    formatStyle.background = element.backgroundColor;
                if(element.textColor)
                    formatStyle.color = element.textColor;
                if(element.textSize)
                    formatStyle.fontSize = element.textSize/4;

                var textStyle = Object.assign(placementStyle, formatStyle);

                return <text id={element.id} style={textStyle}>{element.text}</text>
            default:
                return null;
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

        return (<div style={style}><ListItem id={element.id}>{element.text}</ListItem><Divider/></div>)
    }

    

componentDidMount() {
  /*p2p.on('reRenderReq', (data) => {
      console.log("JSON object of Android %s", JSON.stringify(data));
  });*/
};

    render(){
        var data = this.props.data;

        if(data == null)
            return null;

        return (<div id="rendererCanvas" style={{position: "static"}}>{this.renderElement(data, data.y)}</div>);
    }

    inputChange(event, value, id){
        //TODO SEND CHANGE OVER SOCKET
        var toUpdate = {}
        toUpdate[id] = value;
        this.setState(toUpdate);
    }
}

export default AndroidRenderer; 