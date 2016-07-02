// YOUR CODE HERE:

var app;
if (!/(&|\?)username=/.test(window.location.search)) {
  var newSearch = window.location.search;
  if (newSearch !== '' & newSearch !== '?') {
    newSearch += '&';
  }
  var mainUserName = prompt('What is your name?');
  newSearch += 'username=' + (mainUserName || 'anonymous');
  window.location.search = newSearch;
}

$(function() {
  app = {
    server: 'http://127.0.0.1:3000/classes',
    allRooms: {},
    friends: {}
  }

  $('.messageSubmit').on('click', function(event) {
    event.preventDefault();
    var message = $('.userMessage').val();
    if ($('.rooms').val() === 'lobby') {
      alert('please pick a room');
      return false;
    }
    if (message === '' || message === null) {
      return false;
    }
    app.sendUser();
    app.send(message);
    $('.userMessage').val('');
    app.clearMessages();
  });

  $('.fetcher').on('click', function(event) {
    event.preventDefault();
    app.fetch();
    window.location.reload();
    $('.rooms').val();
  });

  $('.clear').on('click', function(event) {
    event.preventDefault();
    app.clearMessages();
  })

  $(document).on('click', '.friend', function() {
    var username = $(this).data('username');
    if (!app.friends[username]) {
      app.friends[username] = username;
    } else {
      delete app.friends[username];
    }
  })

  $('.rooms').on('change', function() {
    app.clearMessages();
    app.fetch();
  })

  $('.makeARoom').on('click', function(event) {
    event.preventDefault();
    var room = $('.newRoom');
    app.sendRoom(room.val());
    room.val('');
    app.fetchRooms();
  })

  //methods

  app.init = function() {
    console.log('init');
    app.fetchRooms();
  }

  app.sendUser = function() {

    var userData = {
      username: getUserName()
    }

    $.ajax({
      url: app.server + '/users',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(userData),
      success: function() {
        app.fetch();
      },
      error: function() {
        console.log('there was a problem');
      }
    })
  }

  app.send = function(message) {
    var envelope = {
      username: getUserName(),
      message: message,
      roomname: $('.rooms').val()
    };
    console.log(envelope.roomname);

    $.ajax({
      url: app.server + '/messages',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(envelope),
      success: function() {
        console.log(envelope);
        app.fetch();
      },
      error: function() {
        console.log('there was a problem');
      }
    })
  }

  app.sendRoom = function(roomname) {
    var roomData = {
      roomname: roomname
    }

    $.ajax({
      url: app.server + '/rooms',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(roomData),
      success: function() {
        app.fetchRooms();
      },
      error: function() {
        console.log('there was a problem');
      }
    })
  }

  app.fetchRooms = function (){
    $.ajax({
      url: app.server + '/rooms',
      type: 'GET',
      contentType: 'application/json',
      success: function(data) {
        $('.rooms').children().remove();
        populateRooms(data);
      },
      error: function() {
        console.log('there was a problem');
      }
    })
  }

  app.fetch = function(path) {
    $.ajax({
        url: app.server + '/messages',
        type: 'GET',
        contentType: 'application/json',
        success: function(data) {
          $.each(data, function(key, value) {

            var message = _.escape(value.message);
            var roomname = _.escape(value.roomname);
            var username = _.escape(value.username);

            //check messages

            if (roomname === $('.rooms').val()) {
              $('.messageList').children().remove();
              app.addMessages(username, message);
            }

          })
        },
        error: function(error) {
          console.error('Failed to fetch data: ' + error);
        }
      })
    }

    app.addRoom = function(room) {
        $('.rooms').append(
        '<option value="' + room + '">' + room + '</option>');
    }

    app.addMessages = function(user, message) {
      var message = "<div class='friend' data-username='" + user + "'>" + user + ": " +  message + "</div>";
      if (app.friends[user]) {
        $('[data-username="' + user + '"]').addClass('friended');
      } else {
        $('[data-username="' + user + '"]').removeClass('friended');
      }
      $('.messageList').append(message);
    }

    app.clearMessages = function() {
      $('.messageList').html('');
    };

});

var populateRooms = function(data) {
 for (var i = 0; i < data.length; i++) {

  var room = _.escape(data[i].roomname);
  $('.rooms').append('<option value="' + room + '">' + room + '</option>')
 }
}

var getUserName = function() {
  var myParam = location.search.split('username=')[1]
  return myParam;
}
