import React, { Component } from 'react';
//import logo from './logo.svg';
import '../App.css';
import Sortable from 'sortablejs'

class IssueList extends Component {
  componentDidMount() {
    var el = document.getElementById('items');
    //var sortable = Sortable.create(el);
    var sortable = new Sortable(el, {
      sort: false,
    });
  }
  render() {
    var issues = [{id: 12534, name: "bggob", uuid: "2345-gfdg-4t3f", problem:"i-dk"}, 
    {id: 4351, name: "ryan1", uuid: "5r63ygw-sdfg-brs", problem:"somet0hing"},
    {id: 42561, name: "tom1", uuid: "erge-gfrweadg-5647u", problem:"c9laudio"},
    {id: 12341, name: "bob1", uuid: "234v5-gfdg-4t3f", problem:"id8k"}, 
    {id: 4352, name: "ryan2", uuid: "563yngw-sdfg-brs", problem:"som7ething"},
    {id: 42562, name: "tom2", uuid: "ere-gufrweadg-5647u", problem:"c6laudio"},
    {id: 12342, name: "bob2", uuid: "2345-gifdg-4t3f", problem:"id5k"}, 
    {id: 4353, name: "ryan3", uuid: "563ygw-9sdfg-brs", problem:"so3mething"},
    {id: 42563, name: "tom3", uuid: "ere-gfrw8eadg-5647u", problem:"2claudio"},
    {id: 12343, name: "bob3", uuid: "2345-gfdg7-4t3f", problem:"idwk"}, 
    {id: 4354, name: "ryan4", uuid: "563ygw-sdf6g-brs", problem:"somsething"},
    {id: 42564, name: "tom4", uuid: "ere-gfrwead5g-5647u", problem:"cdlaudio"},
    {id: 12534, name: "bggob", uuid: "2345-gfdg-4t3f", problem:"i-dk"}, 
    {id: 4351, name: "ryan1", uuid: "5r63ygw-sdfg-brs", problem:"somet0hing"},
    {id: 42561, name: "tom1", uuid: "erge-gfrweadg-5647u", problem:"c9laudio"},
    {id: 12341, name: "bob1", uuid: "234v5-gfdg-4t3f", problem:"id8k"}, 
    {id: 4352, name: "ryan2", uuid: "563yngw-sdfg-brs", problem:"som7ething"},
    {id: 42562, name: "tom2", uuid: "ere-gufrweadg-5647u", problem:"c6laudio"},
    {id: 12342, name: "bob2", uuid: "2345-gifdg-4t3f", problem:"id5k"}, 
    {id: 4353, name: "ryan3", uuid: "563ygw-9sdfg-brs", problem:"so3mething"},
    {id: 42563, name: "tom3", uuid: "ere-gfrw8eadg-5647u", problem:"2claudio"},
    {id: 12343, name: "bob3", uuid: "2345-gfdg7-4t3f", problem:"idwk"}, 
    {id: 4354, name: "ryan4", uuid: "563ygw-sdf6g-brs", problem:"somsething"},
    {id: 42564, name: "tom4", uuid: "ere-gfrwead5g-5647u", problem:"cdlaudio"}] // get my list of issues
    
    var x = (
      /*<div className="IssueList">
        <div id="items">
          {issues.map((iss, i) => {
            return <div>{iss.name} {iss.issue}</div>
          })}
        </div>
      </div>*/
      <div className="container" style={{height: '520px'}}>
        <div data-force="30" className="layer block" style={{left: '14.5%', top: 0, width: '37%'}}>
          <div className="title">Listf A</div>
          <div className="vertical_scroll">
            <tr>
              {issues.map((iss, i) => {
                return <div><th>{iss.name}</th><th>{iss.problem}</th></div>
              })}
            </tr>
          </div>
        </div>
      </div>
    );

    return x;
  }
}

export default IssueList;
