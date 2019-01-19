var mongoose = require("mongoose");

//Schema Constructor reference saved
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        type:String,
        required: true
    },
    link: {
        type:String,
        required: true
    },
    description:{
        type:String
    },
    saved:{
        type:Boolean,
        default: false
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
      }
});

var Article = mongoose.model("Article",ArticleSchema);

module.exports = Article;
