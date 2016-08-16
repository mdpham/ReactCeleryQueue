import React from "react";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
var moment = require("moment");

class TaskRow extends React.Component {
  // Static method for TaskRow class
  static getStyle(status) {
    let style = {}; //'let' keyword since style will be mutated
    switch (status) {
      case "task-received": style.backgroundColor = "red"; break;
      case "task-started": style.backgroundColor = "yellow"; break;
      case "task-succeeded": style.backgroundColor = "green"; break;
    };
    return style;
  }
  constructor(props){
    super(props);
    // getStyle can be done equivalently with an arrow function
    // this.getStyle = () => {}
  }
  render(){
    const style = TaskRow.getStyle(this.props.task.get("status")); //'const' keyword for immutable value
    return (
      <TableRow style={style}>
        <TableRowColumn>{this.props.task.get("id")}</TableRowColumn>
        <TableRowColumn>{this.props.task.get("status")}</TableRowColumn>
        <TableRowColumn>{moment(this.props.task.get("datetime")).format("DD/MM/YYYY, h:mm a")}</TableRowColumn>
      </TableRow>
    );
  }
}

// Export for index.jsx to import
export default class TaskTable extends React.Component {
    constructor(props){
      super(props);
    }
    componentWillMount(){
      // Listen for server-sent events, similar event handling
      let eventSource = new EventSource("http://localhost:8080/tasks");
      eventSource.addEventListener("update", evt => {
        // Emit action on event to update table data
        this.props.updateTask(JSON.parse(evt.data))
      });
    }
    render(){
      return (
        <Table selectable={false} multiSelectable={false}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Task ID</TableHeaderColumn>
              <TableHeaderColumn>Task Status</TableHeaderColumn>
              <TableHeaderColumn>Datetime Submitted</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              this.props.tasks.valueSeq()
                .sort((t1,t2) => moment(t1.get("datetime")).isAfter(t2.get("datetime")) ? -1:1)
                .map(t => <TaskRow key={t.get("id")} task={t}/>)
            }
          </TableBody>
        </Table>
      );
    }
}
