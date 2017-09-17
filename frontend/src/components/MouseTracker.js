import React, { Component } from 'react';
import '../App.css';

class MouseTracker extends Component{

	handleTouchStart(e){
  	this.touchTime = Date.now();

  	var xCoord = e.touches[0].clientX;
  	var yCoord = e.touches[0].clientY;
  	this.touchStart = {
  		x: xCoord,
  		y: yCoord
  	};
  }

  handleTouchEnd(e){
  	if(isNaN(this.touchTime))
  		return;

    var now = Date.now();
    var totalTime = now - this.touchTime;
    var touchEnd = {
    	x: e.xCoord,
    	y: e.yCoord
    }

    //Send to socket

    this.touchTime = NaN;
  }

  handleClickStart(e){
  	this.clickTime = Date.now();
  	this.clickStart = {
  		x: e.xCoord,
  		y: e.yCoord
  	};
  }

  handleClickEnd(e){
  	if(isNaN(this.clickTime))
  		return;

  	var now = Date.now();
  	var totalTime = now - this.clickTime;
  	var clickEnd = {
  		x: e.xCoord,
  		y: e.yCoord
  	};

  	//TODO Send to socket
    //TODO Threshold

  	this.clickTime = NaN;
  }

  render() {
		return (
  		<div onTouchStart={(e) => this.handleTouchStart(e)} 
  						onTouchEnd={(e) => this.handleTouchEnd(e)}
  						onMouseDown={(e) => this.handleClickStart(e)}
  						onMouseUp={(e) => this.handleClickEnd(e)}
  						onMouseLeave={(e) => this.handleClickEnd(e)}
  						style={{MozUserSelect: "none", WebkitUserSelect: "none", MsUserSelect: "none", UserSelect: "none", OUserSelect: "none"}}>
  			{this.props.children}
  		</div>
  	)
  }
}

export default MouseTracker;