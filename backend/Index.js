var Sequelize = require('sequelize-cockroachdb');
var server = require('http').createServer();
var p2p = require('socket.io-p2p-server').Server;
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
  //id: { type: Sequelize.INTEGER, primaryKey: true },
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
  force: true
}).then(function () {
  // Retrieve issues.
  return Issue.findAll();
}).then(function (issues) {
  // Print out the names.
  issues.forEach(function (issue) {
    console.log(issue.id + ' ' + issue.name);
  });
}).catch(function (err) {
  console.error('error: ' + err.message);
});

// Define the Session model for the "sessions" table
var Session = sequelize.define('sessions', {
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
  force: true
}).then(function () {
  // Retrieve issues.
  return Session.findAll();
}).then(function (sessions) {
  // Print out the names.
  sessions.forEach(function (session) {
    console.log(session.id + ' ' + session.isClientConnected + ' ' + session.isMobileConnected);
  });
}).catch(function (err) {
  console.error('error: ' + err.message);
});

// Starting socket.io connection
io.on('connection', (client) => {

  // get all issues
  client.on("fetchAll", (data) => {
    console.log("Fetching all...");
    client.send(Issue.findAll())
  });

  // mobile:
  client.on("createIssue", (data) => {
    console.log("Creating issue...");
    Issue.create({
      name: data.name,
      problem: data.problem,
      uuid: data.uuid
    });
  });

  // mobile
  client.on("createSession", (data) => {
    console.log("Creating session...");
    Issue.findone({
      where: {
        uuid: data.uuid
      }
    }).then((res) => {
      if (res != null) {
        // create session entry if issue exists
        Session.create({
          isMobileConnected: true,
          isClientConnected: false,
          uuid: data.uuid
        });

        // connect mobile to p2p room
        client.join(data.uuid);
      } else {
        client.send("Failed to create session. UUID doesn't exist.")
      }
    });
  });

  // client | website
  client.on("joinRoom", (data) => {
    console.log("Joining room...");
    Session.findone({
      where: {
        uuid: data.uuid
      }
    }).then((res) => {
      if (res != null && res.isMobileConnected && !res.isClientConnected) {
        // connect if issue exists, mobile connected, and no client/website is connected
        client.join(data.uuid);
        p2p(client, null, data.uuid);
        console.log("Client and mobile are now in a p2p room.");
      } else {
        client.send("Failed to join room. Either issue doesn't exist, mobile isn't connected, or client is already connected");
      }
    });

    Session.findone({
      where: {
        uuid: data.uuid
      }
    }).then((res) => {
      // updating isClientConnected to true
      res.update({
        isClientConnected: true,
      }).then(() => {})
    });

  });
  /*client.on('reRender', (data) => {
    console.log("sending new data...");
    io.sockets.in(data.uuid).emit('receiveRender', data.view);
  });*/
  client.on('endSession', (data) => {
    console.log("Ending session...");
    Session.findone({
      where: {
        uuid: data.uuid
      }
    }).then((res) => {
      // closing connections
      res.isClientConnected = false;
      res.isMobileConnected = false;
    });
  });


  client.on('disconnect', () => {
    console.log("user disconnected");
  });
});