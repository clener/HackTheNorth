import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
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
var socket = io.connect('http://34.229.167.116:3000');

//socket.connect('http://34.229.167.116/:3000');

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
    console.log("111111")
    console.log(issues)
    
    return (
      <MuiThemeProvider>
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
                  <Link to="/android">
                    <TableRowColumn>{issue.name}</TableRowColumn>
                    <TableRowColumn>{issue.problem}</TableRowColumn>
                  </Link>
                </TableRow>)
            })}
          </TableBody>
        </Table>
      </MuiThemeProvider>
    );
  }
}

export default IssueList;
