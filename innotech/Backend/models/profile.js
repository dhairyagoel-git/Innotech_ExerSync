const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  coins : {type :Number , required: true},
  xp : {type :Number ,required:true},
  workouts : {type : [String] , required : true},
});

module.exports = mongoose.model("profile", userSchema);
