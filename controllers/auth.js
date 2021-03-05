module.exports = (app) => {
  // SIGN UP FORM
  app.get("/sign-up", (req, res) => {
    res.render("sign-up");
  });
}
// SIGN UP POST
app.post("/sign-up", (req, res) => {
  // Create User
  const user = new User(req.body);

  user
    .save()
    .then(user => {
      res.redirect("/");
    })
    .catch(err => {
      console.log(err.message);
    });
});
};
// LOGOUT
app.get('/logout', (req, res) => {
  res.clearCookie('nToken');
  res.redirect('/');
});
// LOGIN FORM
app.get('/login', (req, res) => {
  res.render('login');
});
