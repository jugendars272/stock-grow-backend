const {States} = require("../models");
const {Withdraw}  = require("../models");
const {Transection} = require("../models");
const {Deposit} = require('../models');

//Add into wallet
exports.add = async(req, res) => {
    try{
      const userId = req.userId;
      const {amount, transactionId} = req.body;
      if(amount<1){
        return res.status(400).send("Invalid amount");
      }
      let state = await States.findOne({userId});
      if(!state){
        //Create a state for user
        state = new States({userId, current: 0});
        await state.save();
      }
       
      //Add into deposit table
      const newDeposit = new Deposit({userId, amount, transactionId});
      await newDeposit.save();
      // Add transaction to the transaction table
      const newTransaction = new Transection({userId, description:"Deposit", amount});
      await newTransaction.save();

      res.status(200).send("Amount added successfully");
    }
    catch(err){
        console.error(err);
        res.status(500).send("Server Error");
    }
}

// Request Withdraw
exports.withdraw = async(req, res) => {
    try{
      const userId = req.userId;
      const {amount, upiId} = req.body;
      if(amount<1){
        return res.status(400).send("Invalid amount");
      }
      let state = await States.findOne({userId});
      if(!state){
        return res.status(404).send("Insufficient funds");
      }
      if(state.current<amount){
        return res.status(400).send("Insufficient funds");
      }
      const newWithdrawrRequest = new Withdraw({userId, amount, upiId});
      await newWithdrawrRequest.save();
      const newTransaction = new Transection({userId, description:"Withdraw", amount});
         await newTransaction.save();
      res.status(200).send("Withdraw request successful");
    }
    catch(err){
        console.error(err);
        res.status(500).send("Server Error");
    }
}