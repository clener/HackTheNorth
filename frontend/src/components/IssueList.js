import React, { Component } from 'react';
//import logo from './logo.svg';
import '../App.css';
import Sortable from 'sortablejs'

class IssueList extends Component {
  componentDidMount() {
    var el = document.getElementById('items');
    var sortable = Sortable.create(el);
  }
  render() {
    response = [{name: "bob", issue:"idk"}]
    data = response.map(item => {a: item.name, b: item.issue})
    x = (
      <div className="IssueList">
        <div id="items">
          this.data.map((item, key) => {
            <div key={key}>{item.timeM} {item.description}</div>
          })
        </div>
      </div>
    );
  }
}

export default IssueList;
