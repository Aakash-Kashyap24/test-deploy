const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const Document = new mongoose.Schema({
  _id: String,
  data: Object,
});

module.exports = model("Document", Document);
