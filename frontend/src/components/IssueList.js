import React, { Component } from 'react';
import '../App.css';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

// Setting up socket
var io = require('socket.io-client');
var socket = io();

class IssueList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      issues: []
    };
  }
  
  componentDidMount() {
    socket.on('fetchAllRes', (data) => {
      console.log("JSON data of DB %s", JSON.stringify(data));
      this.setState({
        issues: data,
      });
    });

    socket.emit('fetchAllReq');

    socket.on('updatedIssues', () => {
      socket.emit('fetchAllReq');
    })    
  };

  render() {
    const {
      issues,
    } = this.state;
    
    return (
      <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Issue</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {issues.map((issue, i) => {
            return (
              <TableRow>
                <TableRowColumn>{issue.name}</TableRowColumn>
                <TableRowColumn>{issue.problem}</TableRowColumn>
              </TableRow>)
          })}
        </TableBody>
      </Table>
    );
  }
}

export default IssueList;
