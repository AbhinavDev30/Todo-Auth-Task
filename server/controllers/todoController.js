import Todo from "../models/Todomodel.js";

export const addData = async (req, res) => {
  try {
    console.log("Hello, todo controller is working", req.body);

    const { inputValue } = req.body; // Expecting `task` instead of `todo`

    console.log(`hello task`, inputValue);

    if (!inputValue) {
      return res.status(401).send("Data not received");
    }

    const todoData = await Todo.create({ task: inputValue });
    if (!todoData) {
      return res.status(401).send("Failed to add data");
    }
    console.log(`No problem in reciving data`);

    res.status(201).send(todoData);
  } catch (error) {
    return res.status(500).send("Error adding data");
  }
};

export const getData = async (req, res) => {
  try {
    const dataFromDb = await Todo.find();
    console.log("Getting rodo data", dataFromDb);

    return res.status(200).send(dataFromDb);
  } catch (error) {
    return res.status(500).send("Error retrieving data");
  }
};

export const updateData = async (req, res) => {
  try {
    console.log("Update is working");

    const { id } = req.params;
    const { inputValue } = req.body;

    if (!inputValue) {
      return res.status(400).send("Task content is required");
    }

    const updatedTodo = await Todo.findByIdAndUpdate(id, { task: inputValue });

    if (!updatedTodo) {
      return res.status(404).send("Todo not found");
    }

    return res.status(200).send(updatedTodo);
  } catch (error) {
    return res.status(500).send("Error updating todo");
  }
};

export const deleteData = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).send("Todo not found");
    }

    return res.status(200).send(deletedTodo);
  } catch (error) {
    return res.status(500).send("Error deleting todo");
  }
};
