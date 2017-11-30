var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

var nbaTeams = require('./nba-teams.json');

function _findTeam(teamId){
  var _team = nbaTeams.find(function (element) {
    if (element.teamId == teamId || element.abbreviation == teamId || element.teamName == teamId) {
      return element;
    }
  });
  return _team;
}

// return list of teams
app.get('/teams', function(req, res){
  res.status(200).send({nbaTeams})
});

// return choosen team with teamId or teamName or abbreviation
app.get('/teams/:id', function(req, res){
  var _id = req.params.id;
  var _team = _findTeam(_id);

  if (_team) {
    res.status(200).send(_team);
  } else {
    res.status(404).send('This team does not exist');
  }
});

// return list of players in choosen team
app.get('/teams/:id/players', function(req, res){
  var _id = req.params.id;
  var _team = _findTeam(_id);

  if (_team) {
    res.status(200).send(_team.players);
  } else {
    res.status(404).send('This team does not exist');
  }
});

app.post('/teams/:id/player', function(req, res){
  var _id = req.params.id;
  var _team = _findTeam(_id);

  var _firstName = req.body.firstName;
  var _lastName = req.body.lastName;
  var _age = req.body.age;
  var _height = req.body.height;
  var _position = req.body.position;

  if (_team && _firstName && _lastName && _age && _height && _position) {
    var newPlayer = {
      firstName: _firstName,
      lastName: _lastName,
      age: _age,
      height: _height,
      position: _position
    };

    _team.players.push(newPlayer);
 
    res.status(200).send('This player has been added');
  } else {
    res.status(404).send('This team does not exist');
  }
});

app.listen(3000, function(){
  console.log('This server is running on port 3000');
});