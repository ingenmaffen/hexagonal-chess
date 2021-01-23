const appendUsernameInput = () => {
  const savedUsername = localStorage.getItem("username");
  const username = $(`<input type="text" class="form-control" placeholder="Username"/>`);
  username.on("keydown", (event) => {
    if (event.key === "Enter") {
      sendUserName(username.val());
    }
  });
  username.appendTo("#main-menu");
  username.trigger("focus");

  if (savedUsername) {
    username.val(savedUsername);
  }

  const confirmButton = $(`<button type="button" class="btn btn-success menu-button-quarter">OK</button>`);
  confirmButton.on("click", (_event) => {
    sendUserName(username.val());
  });
  confirmButton.appendTo("#main-menu");
};

const sendUserName = (userName) => {
  localStorage.setItem("username", userName);
  socket.emit("username", userName);
};

const emptyMenu = () => {
  $("#main-menu").empty();
};

const appendMainMenu = () => {
  console.log("appending menu");
};

appendUsernameInput();
