var Sequelize = require('sequelize-cockroachdb');
var server = require('http').createServer();
var io = require('socket.io')(server);

server.listen(3000);
console.log("Now listening on port 3000...");

// Connect to CockroachDB through Sequelize.
var sequelize = new Sequelize('reports', 'maxroach', '', {
  dialect: 'postgres',
  port: 26257,
  logging: false
});

// Define the Issue model for the "issues" table.
var Issue = sequelize.define('issues', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING
  },
  problem: {
    type: Sequelize.STRING
  },
  uuid: {
    type: Sequelize.STRING
  },
});

// Define the "issues" table.
Issue.sync({
}).then(function () {
  // Retrieve issues.
  return Issue.findAll();
}).then(function (issues) {
  // Print out the names.
  /*issues.forEach(function (issue) {
    console.log(issue.id + ' ' + issue.name);
  });*/
}).catch(function (err) {
  console.error('error: ' + err.message);
});

// Define the Session model for the "sessions" table
var Session = sequelize.define('sessions', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  isMobileConnected: {
    type: Sequelize.BOOLEAN
  },
  isClientConnected: {
    type: Sequelize.BOOLEAN
  },
  uuid: {
    type: Sequelize.STRING
  },
});

// Define the "sessions" table.
Session.sync({
}).then(function () {
  // Retrieve issues.
  return Session.findAll();
}).then((sessions) => {
  // Print out the names.
  /*sessions.forEach(function (session) {
    console.log(session.id + ' ' + session.isClientConnected + ' ' + session.isMobileConnected);
  });*/
}).catch(function (err) {
  console.error('error: ' + err.message);
});

// Starting socket.io connection
io.on('connection', (client) => {

  // get all issues
  client.on("fetchAllReq", (data) => {
    console.log("Fetching all issues...");

    Issue.findAll().done((data) => {
      client.emit('fetchAllRes', data);
    });
  });

  // mobile:
  client.on('createIssue', (data) => {
    console.log("Creating issue...");
    console.log("Issue entry: " + JSON.stringify(data))
    Issue.create({
      name: data.name,
      problem: data.problem,
      uuid: data.uuid
    });
    Issue.findAll().done((data) => {
      client.emit('fetchAllRes', data);
    });

  });

  // mobile
  client.on("createSession", (uuid) => {
    console.log("Creating session...");
    Issue.findOne({
      where: {
        uuid: uuid
      }
    }).then((res) => {
      if (res != null) {
        // create session entry if issue exists
        Session.create({
          isMobileConnected: true,
          isClientConnected: false,
          uuid: uuid
        });

        // connect mobile to p2p room
        client.join(uuid);
      } else {
        client.send("Failed to create session. UUID doesn't exist.")
      }
    });
  });

  client.on('event', (data, uuid) => {
    client.broadcast.to(uuid).emit(data)
  });

  client.on('reRender', (data, uuid) => {
    console.log("Re-rendering...")
    client.broadcast.to(uuid).emit('reRender', data) 
  });

  // client | website
  client.on("connectToSessionReq", (uuid) => {
    console.log("Client joining room...");
    Session.findOne({
      where: {
        uuid: uuid
      }
    }).then((res) => {
      if (res != null && res.isMobileConnected && !res.isClientConnected) {
        // connect if issue exists, mobile connected, and no client/website is connected
        client.join(uuid);
        console.log("Client and mobile are now connected.");
        client.emit('connectToSessionRes', true); // "You are both in a room now!"
        Session.update(
          {isClientConnected: true},
          { where: {uuid: uuid}}
        );
      } else {
        client.emit('connectToSessionRes', false); // "Failed to join room. Either issue doesn't exist, mobile isn't connected, or client is already connected"
        console.log("Client and mobile are now connected.");
      }
    });
  });


  client.on('endSession', (uuid) => {
    console.log("Ending session...");
    Session.findOne({
      where: {
        uuid: uuid
      }
    }).then((res) => {
      // closing connections
      Session.update(
        { isClientConnected: false, isMobileConnected: false},
        { where: {uuid: uuid}}
      );
    });
  });

  client.on('disconnect', () => {
    console.log("User disconnected");
  });
});
