const Post = require('../models/post');

module.exports = (app) => {

    // CREATE
    const Post = require('../models/posts');
    const User = require('../models/user');

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

  app.get('/posts/:id', function(req, res) {
      // LOOK UP THE POST
      Post.findById(req.params.id).lean().populate('comments').then((post) => {
        res.render('post-show', { post })
      }).catch((err) => {
        console.log(err.message)
      })
  });

  // SUBREDDIT
app.get("/n/:subreddit", function (req, res) {
    var currentUser = req.user;
    Post.find({ subreddit: req.params.subreddit }).lean().populate('author')
        .then(posts => {
            res.render("posts-index", { posts, currentUser });
        })
        .catch(err => {
            console.log(err);
        });
});
