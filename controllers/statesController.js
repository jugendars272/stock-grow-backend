const {States} = require('../models');

//Get states of a user
exports.getStates = async(req,res) => {
    try {
        console.log(req.userId);
        const states = await States.findOne({userId: req.userId});
        if(states){
          return res.send(states);
        } else {
          return res.send({
            current:0,
            invested:0,
            returns:0,
            totalReturnsPerc:0
          })
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

