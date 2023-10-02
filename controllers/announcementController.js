const Announcement = require('../models/Announcement');
const {
    checkPermissions,
  } = require('../utils');

const getAllAnnouncement = async (req, res) => {
    const { role, position, assembly } = req.user;

    console.log(position, assembly);

    const positionArray = position.split(',');
    const positionRegexPattern = positionArray.join('|');
    const positionRegex = new RegExp(`(${positionRegexPattern})`, 'i');

    console.log(positionRegexPattern, positionRegex);

    let allannouncement;
    if(role === 'admin'){
        allannouncement = await Announcement.find({});
    }else{
        allannouncement = await Announcement.find({
            targetAudience: assembly,
            $or: [
              { visibility: { $regex: positionRegex } },
              { visibility: 'all' }
            ]
        });
    }

    
    res.status(200).json({ allannouncement });
};

const createAnnouncement = async (req, res) => {
    const { assembly } = req.user;

    const announcement = await Announcement.create({...req.body, targetAudience: assembly});
    res.status(201).json({ announcement });
};

const getSingleAnnouncement = async (req, res) => {

    const announcement = await Announcement.findOne({ _id: req.params.id });
    if (!announcement) {
        return res.status(404).json({error: `No task with id : ${req.params.id}`});
    }
    
    res.status(200).json({ announcement });
};

const updateAnnouncement = async (req, res) => {
    
    const announcement = await Announcement.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true, runValidators: true }
    );

    if (!announcement) {
        return res.status(404).json({error: `No task with id : ${req.params.id}`})
    }

    res.status(200).json({ announcement });
};

module.exports = {
    getAllAnnouncement,
    createAnnouncement,
    getSingleAnnouncement,
    updateAnnouncement,
};