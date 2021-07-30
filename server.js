require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const mongoose = require("mongoose");
const { callbackify } = require("util");
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
let roomData = new Map();
let roomQuestions = new Map();

const getSocket = (socketId) => {
  return io.sockets.sockets.get(socketId);
};

const getSocketRoom = (socket) => {
  return socket.rooms.values().next().value;
};

const getRoomSocketsIds = (room) => {
  return io.of("/").adapter.rooms.get(room);
};

const lobbyUpdate = (room, lobbyData) => {
  io.to(room).emit("lobby-update", lobbyData);
};

io.on("connection", (socket) => {
  socket.leave(socket.id);
  socket.on("lobbyCreateRequest", (callback) => {
    let room = Math.random().toString(36).substr(2, 5);
    socket.join(room);
    roomData.set(room, {
      host: socket.id,
      question: "",
      details: "",
    });
    callback({
      status: "ok",
      lobby: room,
      members: [],
    });
  });
  socket.on("lobbyJoinRequest", (lobbyId, nickname, callback) => {
    socket.rooms.forEach((room) => {
      socket.leave(room);
    });
    socket.join(lobbyId);
    socket.data.nickname = nickname;
    const clients = getRoomSocketsIds(lobbyId);
    const nicknames = [];
    clients.forEach((clientId) => {
      nicknames.push(getSocket(clientId).data.nickname);
    });
    lobbyUpdate(lobbyId, {
      members: nicknames,
    });
    callback({
      members: nicknames,
      givenHost: socket.id === roomData.get(lobbyId).host,
    });
  });
  socket.on("lobbyQuestionSend", (questionData) => {
    // Get current room user is in
    const room = getSocketRoom(socket);
    roomQuestions.set(room, {
      ...questionData,
      answers: [],
      clients_answered: [],
    });
    io.to(room).emit("lobbyQuestionPose", questionData);
  });
  socket.on("lobbyAnswerSend", (answerData, callback) => {
    const room = getSocketRoom(socket);
    const answer = {
      answer: answerData.answer,
      nickname: roomQuestions.get(room).anonymous
        ? "Anonymous"
        : socket.data.nickname,
    };
    if (!roomQuestions.get(room).clients_answered.includes(socket.id)) {
      const roomData = roomQuestions.get(room);
      const { answers, clients_answered } = roomData;
      roomQuestions.set({
        ...roomData,
        answers: answers.push(answer),
        clients_answered: clients_answered.push(socket.id),
      });
    }
    io.to(room).emit("answer-count", roomQuestions.get(room).answers.length);
    callback({
      status: "ok",
    });
  });
  socket.on("lobbyAnswerEnd", async () => {
    const room = getSocketRoom(socket);
    const sockets = await io.in(room).fetchSockets();
    const { targets, answers } = roomQuestions.get(room);
    sockets.map((client) => {
      client.emit("lobbyAnswerEnd", targets.includes(client.data.nickname)? answers: []);
    })
  });
  socket.on("user-leave", () => {
    const room = getSocketRoom(socket);
    const nicknames = [];
    const clients = getRoomSocketsIds(room);
    if (clients) {
      clients.forEach((client) => {
        client !== socket.id && nicknames.push(getSocket(client).data.nickname);
      });
      lobbyUpdate(room, {
        members: nicknames,
      });
    }
  });
  socket.on("disconnecting", () => {
    const room = getSocketRoom(socket);
    const nicknames = [];
    const clients = getRoomSocketsIds(room);
    if (clients) {
      clients.forEach((client) => {
        socket.id !== client && nicknames.push(getSocket(client).data.nickname);
      });
      // clear data when all users leave
      if (clients.size === 1) {
        roomData.delete(room);
        roomQuestions.delete(room);
      } else {
        lobbyUpdate(room, {
          members: nicknames,
        });
      }
    }
  });
});

/* mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const Lobby = mongoose.model(
  "lobby",
  new mongoose.Schema({
    host: String,
    messages: [
      {
        name: String,
        content: String,
      },
    ],
    participants: [String],
    code: String,
  })
); */
/* db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
}); */
app.use(express.json());

server.listen(port, () => {
  console.log("Server is listening on port, ", port);
});
