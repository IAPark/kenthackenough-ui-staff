angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router.when('/schedule', {
      templateUrl: '/views/schedule.html',
      controller: 'ScheduleCtrl as schedule'
    }).when('/events', {
      templateUrl: '/views/schedule.html',
      controller: 'ScheduleCtrl as schedule'
    });
  }])
  .controller('ScheduleCtrl', ['User', 'Event', function (User, Event) {

    /**
    * The template interface
    */
    var view = this;

    var Models = {
      user: new User(),
      event: new Event()
    };

    /**
    * Logged in user
    */
    view.me = Models.user.getMe();

    /**
    * An array of all events
    */
    view.events = [];

    /**
    * Populate the list of events
    */
    function get() {
      Models.event.list().
      success(function (data) {
        view.errors = null;
        view.events = data.events;
        reload();
      }).
      error(function (data) {
        view.errors = data.errors || ['An internal error has occurred'];
      });
    }

    /**
    * Set up socket connections
    */
    function listen() {
      // Event created
      Models.event.socket().on('create', function (event) {
        console.log(event);
        view.events.push(event);
        reload();
      });

      // Event updated
      Models.event.socket().on('update', function (event) {
        view.events = view.events.map(function (e) {
          if (e._id == event._id) {
            e = event;
          }
          return e;
        });
      });

      // Event deleted
      Models.event.socket().on('delete', function (event) {
        console.log(event);
        view.messages = view.messages.filter(function (e) {
          return e._id != event._id;
        });
      });
    }

    function reload() {
      for (var i = 0; i < view.events.length; ++i) {
        var start = moment(view.events[i].start).format('dddd, h:mma');
        var end = moment(view.events[i].end).format('h:mma');
        view.events[i].duration = start + ' - ' + end;
      }
    }

    view.event = {

      /**
      * An object containing the new event
      */
      new: {},

      /**
      * Create the event
      */
      create: function () {
        var self = this;
        Models.event.create(self.new).
        success(function (data) {
          view.errors = null;
          self.new = {};
        }).
        error(function (data) {
          view.errors = data.errors || ['An internal error had occurred'];
        });
      },

      /**
      * Delete a given message
      */
      delete: function (event) {
        Models.event.delete(event._id).
        success(function (data) {
          view.errors = null;
        }).
        error(function (data) {
          view.errors = data.errors || ['An internal error has occurred'];
        });
      }

    };

    /**
    * Initialize controller
    */
    get();
    listen();

  }]);