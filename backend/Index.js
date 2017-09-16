var Sequelize = require('sequelize-cockroachdb');
var server = require('http').createServer();
var io = require('socket.io')(server);

// Starting socket.io connection
io.on('connection', function(client){
  client.on('event', function(data){
    console.log("fuc ia")
  });
  client.on('disconnect', function(){});
});

server.listen(3000);

// Connect to CockroachDB through Sequelize.
var sequelize = new Sequelize('reports', 'maxroach', '', {
  dialect: 'postgres',
  port: 26257,
  logging: false
});

// Define the Issue model for the "issues" table.
var Issue = sequelize.define('issues', {
  id: { type: Sequelize.INTEGER, primaryKey: true },
  name: { type: Sequelize.STRING },
  problem: { type: Sequelize.STRING },
  uuid: { type: Sequelize.STRING },
});

// Define the "issues" table.
Issue.sync({force: true}).then(function() {
  // Insert two rows into the "issues" table.
  return Issue.bulkCreate([
    {id: 1, name: "name1", problem: "this is a real problem", uuid: "exampleUUID123"},
    {id: 2, name: "name2", problem: "this is not a real problem", uuid: "exaaaampleUUID123"},
  ]);
}).then(function() {
  // Retrieve issues.
  return Issue.findAll();
}).then(function(issues) {
  // Print out the names.
  issues.forEach(function(issue) {
    //console.log(issue.id + ' ' + issue.name);
  });
  process.exit(0);
}).catch(function(err) {
  console.error('error: ' + err.message);
  process.exit(1);
});

// Define the Session model for the "sessions" table
var Session = sequelize.define('sessions', {
  id: { type: Sequelize.INTEGER, primaryKey: true },
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
    {id: 1, isMobileConnected: true, isClientConnected: false, uuid: "me stupid"},
    {id: 2, isMobileConnected: false, isClientConnected: true, uuid: "me maybe not so stupid"},
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
