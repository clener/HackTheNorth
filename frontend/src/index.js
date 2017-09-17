import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import IssueList from './components/IssueList';
import Android from './components/AndroidRenderer'
import registerServiceWorker from './registerServiceWorker';
import { IndexRoute, Router, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <div>
      <Route path="/" component={IssueList} />
      <Route path="/android" component={Android} />
    </div>
  </BrowserRouter>, 
  document.getElementById('root'));
registerServiceWorker();
