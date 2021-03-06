module.exports = (router, rnd_string, Users, passport, func) =>{
  router.post('/signup', (req, res) => {
    const id = req.body.id;
    const passwd = req.body.passwd;
    const name = req.body.name;
    
    const new_user = new Users({
      id: id,
      passwd: passwd,
      name: name,
      token: rnd_string.generate()
    });
    
    new_user.save((err, data)=>{
      if(err) return res.status(400).send("save err");
      return res.status(200).json(new_user);
    });
  })

  .post('/signin', (req, res)=>{
    Users.findOne({id: req.body.id, passwd: req.body.passwd}, {_id: 0}, (err, user)=>{
      if(err) return res.status(500).send("DB err");
      if(users) return res.status(200).send(user);
      else return res.status(401).send("incorrect id or passwd");
    })
  })

  //social auth
  .get('/github/token', passport.authenticate('github-token'), (req, res)=>{
    if (req.user) {
      Users.findOne({github_id: req.user._json.id}, {_id: 0}, function(err, users) {
        if(err) err;
        if(users) return res.status(200).send(users);
        else{
          github_user = new Users({
            github_id: req.user._json.id,
            name: req.user._json.name,
            token: rnd_string.generate(),
          });
          github_user.save((err, result)=>{
            if(err) return res.stauts(500).send("DB err");
            if(result) return res.status(200).json(github_user);
          });
        }
      });
    }else res.status(401).send("unauthed");
  })

  .get('/fb/token', passport.authenticate('facebook-token'), function(req, res) {
    if (req.user) {
      Users.findOne({facebook_id: req.user._json.id}, {_id: 0}, function(err, users) {
        if(err) err;
        if(users) res.status(200).send(users);
        else{
          facebook_user = new Users({
            facebook_id: req.user._json.id,
            name: req.user._json.name,
            token: rnd_string.generate(),
          });
          facebook_user.save((err, result)=>{
            if(err) return res.stauts(500).send("DB err");
            if(result) return res.status(200).json(facebook_user);
          });
        }
      });
    } else  res.status(401).send("unauthed");
  })

  .get('/tw/token', passport.authenticate('twitter-token'), (req, res) =>{
    if(req.user) {
      Users.findOne({twitter_id: req.user._json.id}, {_id: 0}, function(err, users) {
        if(err) err;
        if(users) res.status(200).send(users);
        else{
          twitter_user = new Users({
            twitter_id: req.user._json.id,
            name: req.user._json.name,
            token: rnd_string.generate(),
          });
          twitter_user.save((err, result)=>{
            if(err) return res.stauts(500).send("DB err");
            if(result) return res.status(200).json(twitter_user);
          });
        }
      });
    } else  res.status(401).send(req.user);
  })

  return router;
}
