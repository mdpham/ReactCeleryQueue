export function updateTask(update){
  return {
    type: "UPDATE_TASK",
    payload: {update}
  }
}
