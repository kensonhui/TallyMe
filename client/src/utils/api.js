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

const lobbyAnswerSend = (socket, data) => {
  socket.emit("lobbyAnswerSend", data);
};
export { 
  sendMessage, 
  lobbyCreateRequest, 
  lobbyQuestionSend, 
  lobbyAnswerSend 
};
