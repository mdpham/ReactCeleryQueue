// REACT
import React from "react";
import ReactDOM from "react-dom";
// MATERIAL UI
import injectTapEventPlugin from "react-tap-event-plugin";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Paper from "material-ui/Paper";
// COMPONENTS
import TaskTable from "./src/TaskTable.jsx";
import TaskButton from "./src/TaskButton.jsx";

// APP
export class App extends React.Component {
	render() {
		return (
      <Paper>
        <TaskButton {...this.props}/>
        <TaskTable {...this.props}/>
      </Paper>
		);
	}
}

// REDUX
import {compose, createStore} from "redux";
import {connect, Provider} from "react-redux";
// Connect React component (App) to Redux store
import reducer from "./src/redux/reducer.jsx";
const createStoreDevTools = compose(window.devToolsExtension ? window.devToolsExtension() : f=>f)(createStore);
const store = createStoreDevTools(reducer);
import * as actionCreators from "./src/redux/action_creators.jsx";
function mapStateToProps(state) {
  return {
    tasks: state.get("tasks")
  }
}
const AppContainer = connect(mapStateToProps, actionCreators)(App);

// INITIALIZE
store.dispatch({
  type: "SET_INITIAL_STATE"
})
injectTapEventPlugin();
ReactDOM.render(
  <MuiThemeProvider>
    <Provider store={store}>
      <AppContainer />
    </Provider>
  </MuiThemeProvider>,
  document.querySelector("#App")
);
