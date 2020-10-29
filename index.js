// Express Configuration
const express = require("express");
const app = express();
const path = require("path");

// Socket.io configuration
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use("/", express.static(path.join(__dirname, "dist/chart")));
let pollObj = {
  question: "Select Your Favourite Component",
  options: [
    { text: "Angular", value: 0, count: 0 },
    { text: "MongoDB", value: 1, count: 0 },
    { text: "Express.js", value: 2, count: 0 },
    { text: "Golang", value: 3, count: 0 },
    { text: "Python", value: 4, count: 0 },
    { text: "C#", value: 5, count: 0 },
    { text: "PHP", value: 6, count: 0 },
    { text: "C++", value: 7, count: 0 },
  ],
};
// Wait for connection
io.on("connection", function (socket) {
  socket.emit("pollObject", pollObj);

  socket.on("incrementPoll", (data) => {
    // Getting the value of the object from the
    let value = data.value;
    let chosenVote = "";
    pollObj.options.forEach((data) => {
      if (data.value === value) {
        data.count++;
      }
    });

    io.sockets.emit("updatedPoll", pollObj);
  });
});

server.listen(8080);
