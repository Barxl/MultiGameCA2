
//Creating server
const { response } = require("express");
const http = require("http");
const app = require("express")();
app.get("/", (req, res)=> res.sendFile(__dirname + "/index.html"))
app.listen(9091, ()=>console.log("Listening on http port 9091"))
const websocketServer = require("websocket").server;
const httpServer = http.createServer();
httpServer.listen(9090, () => console.log("Listening.. on 9090"))

//This is the hashMap for the clients
const clients = {};
//This is the hashMap for the game
const games = {};


//I am going to use websocket server for the multiplayer aspect of the game
const wsServer = new websocketServer({
    "httpServer": httpServer
})

//function to connect
wsServer.on("request", request => {
    const connection = request.accept(null, request.origin);
    connection.on("close", () => console.log("closed!"))
    connection.on("open", () => console.log("opened!"))
    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data)

        //creating a new game
        if (result.method === "create") {
            const clientId = result.clientId
            const gameId = guid();
            games[gameId] = {
                "id": gameId,
                "cells": 10,
                "clients": []
            }

            const payLoad = {
                "method": "create",
                "game": games[gameId]
            }

            const con = clients[clientId].connection;
            con.send(JSON.stringify(payLoad));
        }

        //this is for the user be able to join a game
        if (result.method === "join") {

            const clientId = result.clientId;
            const gameId = result.gameId;
            const game = games[gameId];

            if (game.clients.length >= 4){
                return;
            }

            //assigning colour for each player
            const colour = {"0": "Red", "1": "Green", "2": "Blue", "3": "Purple"} [game.clients.length]
            game.clients.push({
                "clientId": clientId,
                "colour": colour
            })

            const payLoad = {
                "method": "join",
                "game": game
            }
            //this loop shows to the players that a new player has joined the game
            game.clients.forEach(c=> {
                 clients[c.clientId].connection.send(JSON.stringify(payLoad))
            })
        }
        
    })

    //generate a new clientId
    const clientId = guid();
    clients[clientId] = {
        "connection": connection
    }

    //sending back the reponse from the client
    const payLoad = {
        "method": "connect",
        "clientId": clientId
    }

    connection.send(JSON.stringify(payLoad))
    
})

//Function to create a user ID
function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
