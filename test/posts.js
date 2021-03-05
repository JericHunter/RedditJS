const agent = chai.request.agent(app);
const newPost = {

}

const user = {
    username: 'poststest',
    password: 'testposts'
};
before(function (done) {
  agent
    .post('/sign-up')
    .set("content-type", "application/x-www-form-urlencoded")
    .send(user)
    .then(function (res) {
      done();
    })
    .catch(function (err) {
      done(err);
    });
});
after(function (done) {
  Post.findOneAndDelete(newPost)
  .then(function (res) {
      agent.close()

      User.findOneAndDelete({
          username: user.username
      })
        .then(function (res) {
            done()
        })
        .catch(function (err) {
            done(err);
        });
  })
  .catch(function (err) {
      done(err);
  });
});
