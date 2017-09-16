import React, { Component } from 'react';
//import logo from './logo.svg';
import '../App.css';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
class IssueList extends Component {

  render() {
    const {
      issues,
    } = this.props;
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Issue</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
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
