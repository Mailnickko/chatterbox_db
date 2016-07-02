var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) {
      models.messages.get(function(data) {
        res.send(data);
        // or you coulld do it this way?
        //res.json(data);
      })
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      models.messages.post(req.body, function(data) {
        res.send(data);
      })

    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      models.users.get(function(data) {
        res.send(data);
        // or you coulld do it this way?
        //res.json(data);
      })
    },
    post: function (req, res) {
      models.users.post(req.body, function(data) {
        res.send(data);
      })
    }
  },

  rooms: {
    // Ditto as above
    get: function (req, res) {
      models.rooms.get(function(data) {
        res.send(data);
        // or you coulld do it this way?
        //res.json(data);
      })
    },
    post: function (req, res) {
      models.rooms.post(req.body, function(data) {
        res.send(data);
      })
    }
  }
};

