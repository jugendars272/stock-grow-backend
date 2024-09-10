const {States} = require('../models');
const Transaction= require('../models/transections');

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

exports.getTransections = async(req, res) => {
  try{
    const userId = req.userId;

    const transactions = await Transaction.find({userId}).sort({_id: -1});
    res.status(200).send(transactions);
  }
  catch(error){
    console.error(error);
    res.status(500).send("Server Error");
  }
}