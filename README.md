# Plugable

This is the repository for Plugable, a project made at Hack the North 2017.

[![Video of Project](http://img.youtube.com/vi/7hBXHtQEXkc/0.jpg)](http://www.youtube.com/watch?v=7hBXHtQEXkc)

### How to use
To use this project you would have to run the webapp, the server and the mobile app. 

#### Server
- Set up `CockroachDB` as specified in their tutorials. 
- Install `node` and `npm`.
- `cd backend`
- `npm install`
- `node Index.js`
- This should set up the server. The server runs on port 3000. 

> NOTE: The url for the server has been hardcoded into the web and mobile apps, you would have to change them to fit your use case.

#### Mobile app
- You could really use this with any mobile app you'd like, you'd have to just import the Plugable folder from the source.
- We have included a basic mobile app. (Can be found in `stable/apk-debug.apk`)
- Can also build from source in Android Studio. 

#### Web App
- Install `node` and `npm`
- `cd frontend`
- `npm install`
- `npm start`

To use this as a whole package. 
- Once you have the server up and running, turn on the mobile app. 
- Click the top right menu button to create a "Bug Report". 
- Then click the same spot again when you're ready to connect to the webapp to establish a connection. 
- Click the bug report on the web app. 
- HAVE FUN!!!

- You can click that top right again to end the connection. 
