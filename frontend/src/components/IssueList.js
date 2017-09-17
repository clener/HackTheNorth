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
//var io = require('socket.io-client');
//var socket = io();

//socket.connect('http://34.229.167.116/:3000');

class IssueList extends Component {
  
  constructor(props){
    super();
    this.state = {};

    props.socket.on('connectToSessionRes', (res) => {
      if (res) {
        console.log('can connect to session')
      }
    })
  }
  componentWillReceiveProps(nextProps) {
    this.setState({issues: nextProps.issues});
  }

  cellClicked(row, column){
    var issue = this.state.issues[row];
    this.connectToSession(issue.uuid)
  }

  connectToSession(uuid) {
    this.props.socket.emit('connectToSessionReq', uuid)
    console.log("SDfsadf")
    
  }

  render() {
    var issues = []

    if (this.state.issues) {
      issues = this.state.issues
    }

    return (
      <Table onCellClick={(row, column) => this.cellClicked(row, column)}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow> 
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Issue</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
        {
          issues.map((issue) => {
              return (
                <TableRow>
                  <Link to="/android">
                  <TableRowColumn>{issue.name}</TableRowColumn>
                  <TableRowColumn>{issue.problem}</TableRowColumn>
                </TableRow>
                )
            }) 
        }
          </TableBody>
        </Table>
      </MuiThemeProvider>
    );
  }
}

export default IssueList;
