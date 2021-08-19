"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
require("dotenv").config();
var http = require("http");
var express = require("express");
var cors = require("cors");
var app = express();
var port = process.env.PORT || 5000;
var server = http.createServer(app);
var mongoose = require("mongoose");
var callbackify = require("util").callbackify;
var io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});
var roomData = new Map();
var roomQuestions = new Map();
var getSocket = function (socketId) {
    return io.sockets.sockets.get(socketId);
};
var getSocketRoom = function (socket) {
    return socket.rooms.values().next().value;
};
var getRoomSocketsIds = function (room) {
    return io.of("/").adapter.rooms.get(room);
};
var lobbyUpdate = function (room, lobbyData) {
    io.to(room).emit("lobby-update", lobbyData);
};
io.on("connection", function (socket) {
    socket.leave(socket.id);
    socket.on("lobbyCreateRequest", function (callback) {
        var room = Math.random().toString(36).substr(2, 5);
        socket.join(room);
        roomData.set(room, {
            host: socket.id,
            question: "",
            details: ""
        });
        callback({
            status: 200,
            lobby: room,
            members: []
        });
    });
    socket.on("lobbyJoinRequest", function (lobbyId, nickname, callback) {
        socket.rooms.forEach(function (room) {
            socket.leave(room);
        });
        socket.join(lobbyId);
        socket.data.nickname = nickname;
        if (roomData.has(lobbyId)) {
            var clients = getRoomSocketsIds(lobbyId);
            var nicknames_1 = [];
            clients.forEach(function (clientId) {
                nicknames_1.push(getSocket(clientId).data.nickname);
            });
            lobbyUpdate(lobbyId, {
                members: nicknames_1
            });
            callback({
                status: 200,
                members: nicknames_1,
                givenHost: socket.id === roomData.get(lobbyId).host
            });
        }
        else {
            callback({
                status: 404,
                lobby: "",
                members: []
            });
        }
    });
    socket.on("lobbyQuestionSend", function (questionData) {
        // Get current room user is in
        var room = getSocketRoom(socket);
        roomQuestions.set(room, __assign(__assign({}, questionData), { answers: [], clients_answered: [] }));
        io.to(room).emit("lobbyQuestionPose", questionData);
    });
    socket.on("lobbyAnswerSend", function (answerData, callback) {
        var room = getSocketRoom(socket);
        var answer = {
            answer: answerData.answer,
            nickname: roomQuestions.get(room).anonymous
                ? "Anonymous"
                : socket.data.nickname
        };
        if (!roomQuestions.get(room).clients_answered.includes(socket.id)) {
            var roomData_1 = roomQuestions.get(room);
            var answers = roomData_1.answers, clients_answered = roomData_1.clients_answered;
            roomQuestions.set(room, __assign(__assign({}, roomData_1), { answers: __spreadArray(__spreadArray([], answers), [answer]), clients_answered: __spreadArray(__spreadArray([], clients_answered), [socket.id]) }));
        }
        io.to(room).emit("answer-count", roomQuestions.get(room).answers.length);
        callback({
            status: 200
        });
    });
    socket.on("lobbyAnswerEnd", function () { return __awaiter(void 0, void 0, void 0, function () {
        var room, sockets, _a, targets, answers;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    room = getSocketRoom(socket);
                    return [4 /*yield*/, io["in"](room).fetchSockets()];
                case 1:
                    sockets = _b.sent();
                    _a = roomQuestions.get(room), targets = _a.targets, answers = _a.answers;
                    sockets.map(function (client) {
                        client.emit("lobbyAnswerEnd", targets.includes(client.data.nickname) ? answers : []);
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    socket.on("send-message", function (message) {
        var room = getSocketRoom(socket);
        io.to(room).emit("new-message", { nickname: socket.data.nickname, text: message });
    });
    socket.on("user-leave", function () {
        var room = getSocketRoom(socket);
        var nicknames = [];
        var clients = getRoomSocketsIds(room);
        if (clients) {
            clients.forEach(function (client) {
                client !== socket.id && nicknames.push(getSocket(client).data.nickname);
            });
            lobbyUpdate(room, {
                members: nicknames
            });
        }
    });
    socket.on("disconnecting", function () {
        var room = getSocketRoom(socket);
        var nicknames = [];
        var clients = getRoomSocketsIds(room);
        if (clients) {
            clients.forEach(function (client) {
                socket.id !== client && nicknames.push(getSocket(client).data.nickname);
            });
            // clear data when all users leave
            if (clients.size === 1) {
                roomData["delete"](room);
                roomQuestions["delete"](room);
            }
            else {
                lobbyUpdate(room, {
                    members: nicknames
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
server.listen(port, function () {
    console.log("Server is listening on port, ", port);
});
