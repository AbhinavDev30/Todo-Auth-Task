import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
});

const Todo = mongoose.model("todo", TodoSchema);

export default Todo;
