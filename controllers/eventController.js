const Event = require('../models/Event');

const {
    checkPermissions,
  } = require('../utils');

const getAllEvent = async (req, res) => {

    const allevent = await Event.find({ organizer: req.user.assembly });
    
    res.status(200).json({ allevent });
};

const createEvent = async (req, res) => {

    const event = await Event.create({...req.body, organizer: req.user.assembly});
    res.status(201).json({ event });
};

const getSingleEvent = async (req, res) => {

    const event = await Event.findOne({ _id: req.params.id });
    if (!event) {
        return res.status(404).json({error: `No event with id : ${req.params.id}`});
    }

    if(event.organizer != req.user.assembly){
        return res.status(403).json({error: 'Not authorized to access this information'});
    }
    
    res.status(200).json({ event });
};

const updateEvent = async (req, res) => {
    
    const event = await Event.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true, runValidators: true }
    );

    if (!event) {
        return res.status(404).json({error: `No event with id : ${req.params.id}`})
    }

    res.status(200).json({ event });
};

module.exports = {
    getAllEvent,
    createEvent,
    getSingleEvent,
    updateEvent,
};