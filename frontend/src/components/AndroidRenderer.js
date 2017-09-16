import React, { Component } from 'react';
import '../App.css';

class AndroidRenderer extends Component{

    renderElement(element, offset){
        if(element == null)
            return null

        var children = [];
        if(element.children != null && element.children.length > 0){
            element.children.forEach((child) => {
                children.push(this.renderElement(child, offset));
                console.log(child);
            });
        }

        var style = {
            height: Math.ceil(element.height/4) + "px",
            width: Math.ceil(element.width/4) + "px",
            position: "absolute",
            top: (element.y - offset)/4 + "px",
            left: element.x/4 + "px",
            fontSize: element.textSize/4,
        }

        switch(element.type){
            case "group":
                return (<div style={style}>{children.map((child, index) => { return (<div id={index}>{child}</div>);})}</div>)
            case "button":
                return <button style={style}>Button</button>
            case "input":
                return <input placeholder={element.hint} style={style}/>
            case "text":
                return <p style={style}>{element.text}</p>
            default:
                return <div style={style}>???</div>
        }       
    }

    render(){
        var data = this.props.data;

        if(data == null)
            return null;

        return (<div id="rendererCanvas" style={{position: "static"}}>{this.renderElement(data, data.y)}</div>);

    }
}
export default AndroidRenderer; 