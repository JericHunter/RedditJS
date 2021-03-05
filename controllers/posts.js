const Post = require('../models/post');

module.exports = (app) => {

    // CREATE
    const Post = require('../models/posts');
    const User = require('../models/user');
    var post = new Post(req.body);
    post.author = req.user._id;
    post.upVotes = [];
    post.downVotes = [];
    post.voteScore = 0;

    app.post("/posts/new", (req, res) => {
      if (req.user) {
        var post = new Post(req.body);

        post.save(function(err, post) {
          return res.redirect(`/`);
        });
      } else {
        return res.status(401); // UNAUTHORIZED
      }
    });


    // SAVE INSTANCE OF POST MODEL TO DB
    post.save((err, post) => {
      console.log(err)
      console.log(post)
      // REDIRECT TO THE ROOT
      return res.redirect(`/`);
    })
  });

  //INDEX
  app.get("/", (req, res) => {
    var currentUser = req.user;

    Post.find({})
      .then(posts => {
        res.render("posts-index", { posts, currentUser });
      })
      .catch(err => {
        console.log(err.message);
      });
  });

  // SHOW
  app.get("/posts/:id", function (req, res) {
      var currentUser = req.user;
      Post.findById(req.params.id).populate('comments').lean()
          .then(post => {
              res.render("posts-show", { post, currentUser });
          })
          .catch(err => {
              console.log(err.message);
          });
  });

  // SUBREDDIT
  app.get("/n/:subreddit", function (req, res) {
      var currentUser = req.user;
      Post.find({ subreddit: req.params.subreddit }).lean()
          .then(posts => {
              res.render("posts-index", { posts, currentUser });
          })
          .catch(err => {
              console.log(err);
          });
  });
  app.put("/posts/:id/vote-up", function(req, res) {
    Post.findById(req.params.id).exec(function(err, post) {
      post.upVotes.push(req.user._id);
      post.voteScore = post.voteScore + 1;
      post.save();

      res.status(200);
    });
  });

  app.put("/posts/:id/vote-down", function(req, res) {
    Post.findById(req.params.id).exec(function(err, post) {
      post.downVotes.push(req.user._id);
      post.voteScore = post.voteScore - 1;
      post.save();

      res.status(200);
    });
  });
