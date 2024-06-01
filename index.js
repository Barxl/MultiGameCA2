
//Creating server
const http = require("http");
const app = require("express")();
app.get("/", (req, res)=> res.sendFile(__dirname + "/index.html"))
app.listen(9091, ()=>console.log("Listening on heep port 9091"))
const websocketServer = require("websocket").server;
const httpServer = http.createServer();
httpServer.listen(9090, () => console.log("Listening.. on 9090"))

//This is the hashMap for the clients
const clients = {};

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
        console.log(result)
        
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