import {Map} from "immutable";

export default function(state = Map(), action) {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return state.set("tasks", Map());
    case "UPDATE_TASK":
      if (state.hasIn(["tasks", action.payload.update.id])) {
        return state.updateIn(["tasks", action.payload.update.id, "status"], () => action.payload.update.status)
      } else {
        return state.setIn(["tasks", action.payload.update.id], Map(action.payload.update))
      };
  }
  return state;
}
