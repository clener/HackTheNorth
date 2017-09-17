import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import IssueList from './Components/IssueList';
import Android from './Components/AndroidRenderer'
import registerServiceWorker from './registerServiceWorker';
import { IndexRoute, Router, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(
  <BrowserRouter>
    <div>
      <Route path="/" component={MainScreen} />
      <Route path="/android" component={Android} />
    </div>
  </BrowserRouter>, 
  document.getElementById('root'));
registerServiceWorker();
