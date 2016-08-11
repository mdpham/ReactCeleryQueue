import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import $ from "jquery";

export default class TaskButton extends React.Component {
    constructor(props){
      super(props);
      this.submitJob = evt => {
        evt.preventDefault();
        const data = {};
        $.ajax({
          type: "POST",
          url: "http://localhost:8080/submit",
          contentType: false,
          processData: false,
          data,
          success: (payload, status, xhr) => {
            // console.log("success: ", status, xhr, payload);
          },
          error: (xhr, status, error) => {
            // console.log("error", error, status, xhr);
          }
        });
      }
    }
    render(){
      return (
        <RaisedButton label="Submit Job" onClick={evt => this.submitJob(evt)}/>
      );
    }
}
