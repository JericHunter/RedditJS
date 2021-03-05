const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const app = express();

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Adding body parser
app.use(expressValidator());

// Set db
require('./data/reddit-db');

//Middleware
const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const Post = require('../models/post');
const Comment = require('../models/comment');
// LOGIN
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Find this user name
  User.findOne({ username }, "username password")
    .then(user => {
      if (!user) {
        // User not found
        return res.status(401).send({ message: "Wrong Username or Password" });
      }
      // Check the password
      user.comparePassword(password, (err, isMatch) => {
        if (!isMatch) {
          // Password does not match
          return res.status(401).send({ message: "Wrong Username or password" });
        }
        // Create a token
        const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
          expiresIn: "60 days"
        });
        // Set a cookie and redirect to root
        res.cookie("nToken", token, { maxAge: 900000, httpOnly: true });
        res.redirect("/");
      });
    })
    .catch(err => {
      console.log(err);
    });
});
// CREATE Comment
app.post("/posts/:postId/comments", function(req, res) {
  // INSTANTIATE INSTANCE OF MODEL
  const comment = new Comment(req.body);

  // SAVE INSTANCE OF Comment MODEL TO DB
  comment
    .save()
    .then(comment => {
      return Post.findById(req.params.postId);
    })
    .then(post => {
      post.comments.unshift(comment);
      return post.save();
    })
    .then(post => {
      res.redirect(`/`);
    })
    .catch(err => {
      console.log(err);
    });
});
var checkAuth = (req, res, next) => {
  console.log("Checking authentication");
  if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.user = null;
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }

  next();
};
app.use(checkAuth);
//Routes
app.get('/posts/new', (req, res) => {
    res.render('posts-new')
});

// app.get('/', (req, res) => {
//     res.render('home')
// });

//Controllers
require('./controllers/posts')(app);
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);
require('./controllers/replies.js')(app);


app.listen(3000, () => {
    console.log('Reddit listening on localhost:3000')
});

module.exports = app;
