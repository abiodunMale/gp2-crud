const Task = require('../models/Task');
const {
    checkPermissions,
  } = require('../utils');

const getAllTask = async (req, res) => {
    const { role, userId } = req.user;

    let alltask;
    if(role === 'admin'){
        alltask = await Task.find({}).populate('assignedTo', 'name');
    }else{
        alltask = await Task.find({ assignedTo: userId}).populate('assignedTo', 'name');
    }

    
    res.status(200).json({ alltask });
};

const createTask = async (req, res) => {

    const task = await Task.create(req.body);
    res.status(201).json({ task });
};

const getSingleTask = async (req, res) => {

    const task = await Task.findOne({ _id: req.params.id }).populate('assignedTo', 'name');
    if (!task) {
        return res.status(404).json({error: `No task with id : ${req.params.id}`});
    }

    if(!checkPermissions(req.user, task.assignedTo._id)){
        return res.status(403).json({error: 'Not authorized to access this information'});
    }
    
    res.status(200).json({ task });
};

const updateTask = async (req, res) => {
    
    const task = await Task.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true, runValidators: true }
    );

    if (!task) {
        return res.status(404).json({error: `No task with id : ${req.params.id}`})
    }

    res.status(200).json({ task });
};

module.exports = {
    getAllTask,
    createTask,
    getSingleTask,
    updateTask,
};