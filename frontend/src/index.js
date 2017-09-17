import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import IssueList from './components/IssueList';
import Android from './components/AndroidRenderer'
import registerServiceWorker from './registerServiceWorker';
import App from './App'

var io = require('socket.io-client');

console.log("starting up"); 
var socket = io.connect("http://34.229.167.116:3000");

ReactDOM.render(<App/>, 
  document.getElementById('root'));
registerServiceWorker();
