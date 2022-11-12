const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn)
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
  })
}

exports.postLogin = (req, res, next) => {
  User.findById('636d3b31d4a1e00e10365723').then(user => {
    req.session.isLoggedIn = true
    req.session.user = user
    res.redirect('/')
  })

  // req.session.user = userData
}
