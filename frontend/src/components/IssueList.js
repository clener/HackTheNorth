import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import style from '../App.css';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

class IssueList extends Component {
  
  constructor(props){
    super(props);
    this.state = {};
    this.socket = props.socket;

    this.socket.on('connectToSessionRes', (res) => {
      if (res) {
        console.log('can connect to session')
        props.showAndroidRender(this.selectedUuid);
      }else{
        console.log("Can't connect to session as requested by server");
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({issues: nextProps.issues});
  }

  componentDidMount(){
    this.socket.emit("fetchAllReq", {});
    this.socket.on("fetchAllRes", (data) => {
       console.log(data);
       this.setState({issues: data});
    });
  }

  cellClicked(row, column){
    var issue = this.state.issues[row];
    this.connectToSession(issue.uuid)
    this.selectedUuid = issue.uuid;
  }

  connectToSession(uuid) {
    this.socket.emit('connectToSessionReq', uuid)
    console.log("SDfsadf")
    
  }

  render() {
    var issues = []

    if (this.state.issues) {
      issues = this.state.issues
    }

    return (
      <div>
        <div className="title">App Title</div>
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
                    <TableRowColumn>{issue.name}</TableRowColumn>
                    <TableRowColumn>{issue.problem}</TableRowColumn>
                  </TableRow>
                  )
              }) 
          }
          </TableBody>
        </Table>
        </div>
    );
  }
}

export default IssueList;
