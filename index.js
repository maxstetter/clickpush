import express from 'express';
const app = express();
const port = process.env.PORT

const server = app.listen(port, () => {
    console.log(`clickpush listening at: ${port}`)
})

app.use(express.static('public'));
import { WebSocketServer } from 'ws';
const wss = new WebSocketServer({ server })

var player1 = null;
var player2 = null;
var rope = 50;
var CLIENTS = [];

wss.on('connection', function connection(ws) {
    if(player1 == null){
        player1 = ws;
        //ws.send(JSON.stringify("you are Player 1"));
        player1.on('close', function () {
        player1 = null;
        CLIENTS.push(ws);
    })
    } else if (player2 == null) {
        player2 = ws;
        //ws.send(JSON.stringify("you are Player 2"));
        player2.on('close', function () {
        player2 = null;
        CLIENTS.push(ws);
    })
    } else {
        //ws.send(JSON.stringify("there are already 2 players."));
        CLIENTS.push(ws);
    }
});


wss.on('connection', function (client) {
    client.on('message', function (message){
        var data = JSON.parse(message);
        console.log("data.action: " + data.action);
        console.log("data.team: " + data.team);
        if (data.action){
            if (data.action == "click"){
                if (player1 == client || player2 == client){
                    if (data.team == "blue"){
                        rope += 1;
                        console.log("rope: " + rope);
                        var roper = {rope: rope};
                        if (rope >= 100){
                            var winner = {winner: "blue"}
                        }
                    } else if (data.team == "red"){
                        rope -= 1;
                        console.log("rope: " + rope);
                        var roper = {rope: rope};
                        if (rope <= 0){
                            var winner = {winner: "red"}
                        }
                    } 
                }
            } else if (data.action == "reset"){
                rope = 50;
                console.log("rope successfully reset.");
                var winner = {winner: "none", rope: rope}
            }
        }
        wss.clients.forEach(function each(client){
            client.send(JSON.stringify(roper), {isBinary:false});
            client.send(JSON.stringify(winner), {isBinary:false});
        });
    });
});
