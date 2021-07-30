const sendMessage = (socket) => {
  socket.emit("hello");
  console.log("message sent");
};

const lobbyCreateRequest = (socket, history) => {
  socket.emit("lobbyCreateRequest", (data) => {
    history.push(`/lobby/${data.lobby}`);
  });
};

const lobbyQuestionSend = (socket, data) => {
  socket.emit("lobbyQuestionSend", data);
};

const lobbyAnswerSend = (socket, data, responseHandler) => {
  socket.emit("lobbyAnswerSend", data, (response) => {
    responseHandler(response);
  });
};
export { sendMessage, lobbyCreateRequest, lobbyQuestionSend, lobbyAnswerSend };
