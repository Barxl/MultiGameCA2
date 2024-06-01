
//Creating server
const http = require("http");
const websockerServer = require("websocket").server
const httpServer = http.createServer();
httpServer.listen(9090, () => console,log("Listening.. on 9090"))

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

        
    })
})