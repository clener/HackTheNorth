import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField'
import MouseTracker from './MouseTracker'
import List from "material-ui/List"
import ListItem from "material-ui/List"
import Divider from 'material-ui/Divider';
import '../App.css';

class AndroidRenderer extends Component{

    renderElement(element, offset){
        if(element == null)
            return null

        var children = [];
        
        var style = {
            height: Math.ceil(element.height/4) + "px",
            width: Math.ceil(element.width/4) + "px",
            position: "absolute",
            top: (element.y - offset)/4 + "px",
            left: element.x/4 + "px",
            fontSize: element.textSize/4,
            //color: element.textColor,
            //backgroundColor: element.backgroundColor
        }

        switch(element.type){
            case "group":
                if(element.children != null && element.children.length > 0){
                    element.children.forEach((child) => {
                        children.push(this.renderElement(child, offset));
                        console.log(child);
                    });
                }

                return (<div style={style}>{children.map((child, index) => { return (<div id={index}>{child}</div>);})}</div>)
            case "list":
                if(element.children != null && element.children.length > 0){
                    element.children.forEach((child) => {
                        children.push(this.renderListItem(child, offset));
                        console.log(child);
                    });
                }

                return (<MouseTracker style={style}><List>{children.map((child, index) => { return (<div id={index}>{child}</div>);})}</List></MouseTracker>)
            case "button":
                var placementStyle = {
                    position: "absolute",
                    top: (element.y - offset)/4 + "px",
                    left: element.x/4 + "px",
                    fontSize: element.textSize/4,
                }

                var buttonStyle = { }


                if(element.backgroundColor)
                    placementStyle.background = element.backgroundColor;
                if(element.textColor)
                    placementStyle.color = element.textColor;

                return <RaisedButton labelColor={element.textColor} backgroundColor={element.backgroundColor} style={placementStyle} buttonStyle={buttonStyle}>{element.text}</RaisedButton>
            case "input":
                var inputStyle = {}

                if(element.backgroundColor)
                    inputStyle.background = element.backgroundColor;
                if(element.textColor)
                    inputStyle.color = element.textColor;

                return <TextField id={element.id} value={element.text} placeholder={element.hint} style={style} inputStyle={inputStyle}></TextField>
            case "text":
                return <text style={style}>{element.text}</text>
            default:
                return <div style={style}>???</div>
        }       
    }

    renderListItem(element, offset){
        var style = {
            height: Math.ceil(element.height/4) + "px",
            width: Math.ceil(element.width/4) + "px",
            position: "absolute",
            top: (element.y - offset)/4 + "px",
            left: element.x/4 + "px",
            fontSize: element.textSize/4,
        }

        return (<div style={style}><ListItem>{element.text}</ListItem><Divider/></div>)
    }

    render(){
        var data = this.props.data;

        if(data == null)
            return null;

        return (<div id="rendererCanvas" style={{position: "static"}}>{this.renderElement(data, data.y)}</div>);

    }
}
export default AndroidRenderer; 