var Sequelize = require('sequelize-cockroachdb');
var server = require('http').createServer();
var p2p = require('socket.io-p2p-server').Server;
var io = require('socket.io')(server);
//io.use(p2pserver)

server.listen(3000);

// Connect to CockroachDB through Sequelize.
var sequelize = new Sequelize('reports', 'maxroach', '', {
  dialect: 'postgres',
  port: 26257,
  logging: false
});

// Define the Issue model for the "issues" table.
var Issue = sequelize.define('issues', {
  //id: { type: Sequelize.INTEGER, primaryKey: true },
  name: { type: Sequelize.STRING },
  problem: { type: Sequelize.STRING },
  uuid: { type: Sequelize.STRING },
});

// Define the "issues" table.
Issue.sync({force: true}).then(function() {
  // Insert two rows into the "issues" table.
  return Issue.bulkCreate([
    {name: "name1", problem: "this is a real problem", uuid: "exampleUUID123"},
    {name: "name2", problem: "this is not a real problem", uuid: "exaaaampleUUID123"},
  ]);
}).then(function() {
  // Retrieve issues.
  return Issue.findAll();
}).then(function(issues) {
  // Print out the names.
  issues.forEach(function(issue) {
    console.log(issue.id + ' ' + issue.name);
  });
  process.exit(0);
}).catch(function(err) {
  console.error('error: ' + err.message);
  process.exit(1);
});

// Define the Session model for the "sessions" table
var Session = sequelize.define('sessions', {
  //id: { type: Sequelize.INTEGER, primaryKey: true },
  isMobileConnected: { type: Sequelize.BOOLEAN },
  isClientConnected: { type: Sequelize.BOOLEAN },
  uuid: { type: Sequelize.STRING },
});

// Assigning uuid value from Issue model to Session
//Session.belongsTo(Issue, { foreignKey: "uuid", targetKey: "uuid"});

// Define the "sessions" table.
Session.sync({force: true}).then(function() {
  // Insert two rows into the "issues" table.
  return Session.bulkCreate([
    {isMobileConnected: true, isClientConnected: false, uuid: "me stupid"},
    {isMobileConnected: false, isClientConnected: true, uuid: "me maybe not so stupid"},
  ]);
}).then(function() {
  console.log("heyyy")
  // Retrieve issues.
  return Session.findAll();
}).then(function(sessions) {
  // Print out the names.
  sessions.forEach(function(session) {
    console.log(session.id + ' ' + session.isClientConnected + ' ' + session.isMobileConnected);
  });
  process.exit(0);
}).catch(function(err) {
  console.error('error: ' + err.message);
  process.exit(1);
});

// Starting socket.io connection
io.on('connection', (client) => {
  
  // mobile:
  client.on("createIssue", (data) => {
    Issue.create({
      name: data.name, problem: data.problem, uuid: data.uuid
    })
  })

  // mobile
  client.on("createSession", (data) => {
    Issue.findone({ where: { uuid: data.uuid } }).then((res) => {
      if (res != null) {
        // create session entry if issue exists
        Session.create({
          isMobileConnected: true, isClientConnected: false, uuid: data.uuid
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
    Session.findone({ where: { uuid: data.uuid}}).then((res) => {
      if (res != null && res.isMobileConnected && !res.isClientConnected) {
        // connect if issue exists, mobile connected, and no client/website is connected
        client.join(data.uuid);
        p2p(client, null, data.uuid);
      }
      else {
        client.send("Failed to join room. Either issue doesn't exist, mobile isn't connected, or client is already connected");
      }
    })
  })
  /*client.on('reRender', (data) => {
    console.log("sending new data...");
    io.sockets.in(data.uuid).emit('receiveRender', data.view);
  });*/
  client.on('disconnect', () => {
    console.log("user disconnected");
  });
});