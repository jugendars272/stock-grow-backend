const {States} = require("../models");

//Add into wallet
exports.add = async(req, res) => {
    try{
      const userId = req.userId;
      const {amount} = req.body;
      if(amount<1){
        return res.status(400).send("Invalid amount");
      }
      let state = await States.findOne({userId});
      if(!state){
        //Create a state for user
        state = new States({userId, current: amount});
        await state.save();
      }
      else{
        state.current += amount;
        await state.save();
      }
      res.status(200).send("Amount added successfully");
    }
    catch(err){
        console.error(err);
        res.status(500).send("Server Error");
    }
}