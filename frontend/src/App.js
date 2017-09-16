import React, { Component } from 'react';
//import logo from './logo.svg';
import IssueList from './components/IssueList'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="IssueList">
        <IssueList />
      </div>
    );
  }
}

export default IssueList;
