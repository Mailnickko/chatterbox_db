var db = require('../db');

module.exports = {
  messages: {
    get: function (callback) {
      db.query('SELECT m.message, u.username, r.roomname FROM messages m INNER JOIN users u ON (m.user_id = u.id) INNER JOIN rooms r ON (m.room_id = r.id)', function(err, result, fields) {
          if (err) {
            throw err;
          }
          callback(result);
      });
    },
    post: function (params, callback) {
      db.query(
        'INSERT INTO messages (message, user_id, room_id) VALUES \
        ("' +  params['message'] + '"\
        ,(SELECT id from users where users.username = "' + params['username'] + '" limit 1), \
        (SELECT id from rooms where rooms.roomname = "' + params['roomname'] + '" limit 1))'
       , function(err, result, fields) {
          if (err) {
            throw err;
          }
          callback(result);
      });
    }
  },



// "INSERT INTO messages (message, user_id, room_id) VALUES ('" + message.message + "', (SELECT id from users WHERE username="message.username"), (SELECT id from rooms WHERE roomname="message.roomname"))"

  users: {
    // Ditto as above.
    get: function (callback) {
      db.query('SELECT username FROM users', function(err, results, fields) {
        if (err) {
          throw err;
        }
        callback(results);
      })
    },
    post: function (data, callback) {
      db.query('INSERT INTO users (username) VALUES ("' + data.username + '")', function(err, result, fields) {
          if (err) {
            throw err;
          }
          callback(result);
      });
    }
  },

  rooms: {
    // Ditto as above.
    get: function (callback) {
      db.query('SELECT roomname FROM rooms', function(err, results, fields) {
        if (err) {
          throw err;
        }
        callback(results);
      })
    },
    post: function (data, callback) {
      db.query('INSERT INTO rooms (roomname) VALUES ("' + data.roomname + '")', function(err, result, fields) {
          if (err) {
            throw err;
          }
          callback(result);
      });
    }
  }

};

 // select c.name, c.room from classes c inner join teachers t on (c.teacher_id = t.id) where t.id = 2;