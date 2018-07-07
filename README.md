# Real-time multiplayer guessing game

Real-time multiplayer guessing game built with MEAN stack and Web Sockets.<br>
User can join existing gameplays or add a new one. The gameplay starts when minimum two players join.<br>
The active player shows the word by creating a picture from draggable SVG symbols, other players write answers using real-time chat.

## Getting started

* Download and install [MongoDB](https://www.mongodb.com/download-center#community)
* In MongoDB\bin run `mongo.exe`
* Create game-app database
```
use game-app
```
* Download and install [Node.js](https://nodejs.org/en/)
* Install Angular
```
npm install -g @angular/cli
```
* Clone this repo
* Install Node dependencies
```
npm install
```
* Run Node server
```
node server.js
```
* In client directory install Angular dependencies
```
npm install
```
* Run Angular project
```
ng serve --open
```