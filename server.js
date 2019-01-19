var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var app = express();
var PORT = process.env.PORT || 3000;

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");
// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Configure middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/mongoscrapper", { useNewUrlParser: true });

// Routes

// A GET route for scraping the echoJS website
app.get("/", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.nytimes.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
       var $ = cheerio.load(response.data);
    // Now, we grab every h2 within an article tag, and do the following:
       $("article.css-8atqhb").each(function(i, element) {
    //empty result object 
        var result = {};
        //Save key value pair to empty result object
        result.title = $(element).find("h2").text();
        result.link = "https://www.nytimes.com"+$(element).find("a").attr("href");
        result.description= $(element).find("p").text();
        //Make an object and push to results 
            db.Article.create(result);
    });
    }).then(function(data){
    var query = db.Article.find({ $where: 'this.description.length > 0' }).limit(10);
    query.exec(function(err, data){
        if (err) { 
           throw err;
        }
        else if (data.length === 0) {
           res.render("index", {article:"Uh Oh. Looks like we don't have any new articles."})
        }else 
        {
           res.render("index", {article:data});
        }
    });
    })
    //res.setHeader("Content-Type", "text/html")
    // Send a message to the client
    //res.send("Scrape Complete");
    });

//Route for creating Articles from the db
app.post("/:id", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  //console.log(req.params.id);
  db.Article.updateOne({_id: req.params.id}, {$set: {"saved":true}})
  .then(function(dbArticle) {
    // View the added result in the console
    //console.log(dbArticle);
  }).catch(function(err){
    console.log(err);
  })
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/saved", function(req, res) {
  db.Article.find({"saved":true}).populate("note").then(function(dbArticle)
  {
      console.log(dbArticle)
      res.render("article", {article:dbArticle})
  }).catch(function(err){
    res.json(err);
  })
});

//Delete One Article
app.get("/delete/:id", function(req, res){
    db.Article.deleteOne({
        _id: req.params.id
    }, function(err, removed){
        if(err){
            console.log(err);
        }else{
            console.log(removed);
        }
    }).then(function (data){
        db.Article.find({"saved":true}).then(function(dbArticle){
            res.render("article", {article:dbArticle})
        }).catch(function(err){
          console.log(err);
        });
    })
});

//Delete All Article
app.get("/clear", function(req, res){
    db.Article.remove({}, function(err, remove){
        if(err){
            console.log(err);
        }else{
            console.log(remove)
        }
    }).then(function(data){
         db.Note.remove({}, function(err, removeNote){
             console.log("note collecton removed")
         });
    })
});


// Route for saving/updating an Article's associated Note
app.post("/savenote/:id", function(req, res) {
  console.log(req.body);
  console.log(req.params);
  db.Note.create(req.body).then(function(dbNote){
    console.log(dbNote._id);
    console.log(dbNote);
    //some how not working findeOneAndUpdate({_id:req.params.id},{note : dbNote._id}, {new : true})
    return db.Article.updateOne({_id:req.params.id},{note : dbNote._id}, {new : true});
  }).then(function(dbArticle){
    console.log(dbArticle)
     //res.json(dbArticle);
  }).catch(function(err){
     //res.json(err);
  })
});

//Get Note of saved article
app.get("/note/:id", function(req, res) {
    db.Article.findOne({_id:req.params.id}).populate("note").then(function(dbArticle)
    {
        console.log(dbArticle)
    }).catch(function(err){
      console.log(err);
    })
  });

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
