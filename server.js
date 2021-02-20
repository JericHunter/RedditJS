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
//Routes
app.get('/posts/new', (req, res) => {
    res.render('posts-new')
});

// app.get('/', (req, res) => {
//     res.render('home')
// });

//Controllers
require('./controllers/posts.js')(app);

require('./controllers/comments.js')(app);


app.listen(3000, () => {
    console.log('Reddit listening on localhost:3000')
});

module.exports = app;
