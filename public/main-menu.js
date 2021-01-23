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

const hideMenu = () => {
  $("#title").hide();
  appendExitSessionButton();
};

const showMenu = () => {
  $("#title").show();
};

const emptyGameState = () => {
  currentPlayer = "white";
  gameState = {
    white: {},
    black: {},
  };
};

const appendMainMenu = () => {
  const mainMenuButtons = [
    {
      text: "Local Play",
      callback: () => {
        hideMenu();
        localPlay = true;
        socket.emit("requestGameData");
      },
    },
    {
      text: "Search for players",
      callback: () => {
        emptyMenu();
        socket.emit("getPlayerList", null);
      },
    },
  ];
  mainMenuButtons.forEach((menuItem) => {
    const menuButton = $(`<button type="button" class="btn btn-success menu-button-full">${menuItem.text}</button>`);
    menuButton.on("click", (_event) => {
      menuItem.callback();
    });
    menuButton.appendTo("#main-menu");
  });
};

const appendPlayerListMenu = () => {
  const list = $(`
    <div class="table-container">
      <table class="table table-dark">
        <thead>
          <tr>
            <th>Username</th>
            <th>Request</th>
          </tr>
        </thead>
        <tbody id="player-list">
        </tbody>
      </table>
    </div>`);

  list.appendTo("#main-menu");

  const backButton = $(`<button type="button" class="btn btn-success menu-button-half">${"Back"}</button>`);
  backButton.on("click", (_event) => {
    emptyMenu();
    appendMainMenu();
  });
  backButton.appendTo("#main-menu");

  const refreshButton = $(`<button type="button" class="btn btn-success menu-button-half">${"Refresh"}</button>`);
  refreshButton.on("click", (_event) => {
    socket.emit("getPlayerList", null);
  });
  refreshButton.appendTo("#main-menu");
  refreshButton.focus();
};

listPlayersClickable = (text, callback) => {
  const player = $(
    `<tr><th class="player-list-name">${text}</th>
      <th><button class="btn btn-success player-list-button">${"Send"}</button></th></tr>`
  );
  player.on("click", (event) => {
    callback();
    event.stopImmediatePropagation();
  });
  player.appendTo("#player-list");
};

const appendGameRequest = (playerId, playerName) => {
  $("#request-modal").remove();
  // TODO: translation
  const acceptButton = `<button id="accept-${playerId}" type="button" class="btn btn-success">${"Accept"}</button>`;
  // TODO: translation
  const cancelButton = `<button id="refuse-${playerId}" type="button" class="btn btn-danger">${"Refuse"}</button>`;
  const modal = $(
    // TODO: translation
    `
    <div id="request-modal" class="request-modal">
      <div class="header">Game Request</div>
      <div class="request-body">
        <div class="text">${playerName ? playerName : playerId} sent you a game request</div>
        <div id="request-options-${playerId}"> ${acceptButton} ${cancelButton}</div>
      </div>
    </div>
    `
  );
  modal.appendTo("#title").hide().show("slow");
  $(`#accept-${playerId}`).on("click", (event) => {
    socket.emit("acceptRequest", playerId);
    event.stopImmediatePropagation();
    hideMenu();
    modal.remove();
  });

  $(`#refuse-${playerId}`).on("click", (event) => {
    socket.emit("cancelRequest", playerId);
    event.stopImmediatePropagation();
    modal.remove();
  });
};

const appendLeaveRoomButton = () => {
  const button = $(`<button type="button" class="btn btn-success">${"Return to lobby"}</button>`);
  button.on("click", (event) => {
    exitFormGame();

    $("#end-game-box").css("display", "none");
    $("#end-game-box").empty();
    event.stopImmediatePropagation();
  });
  button.appendTo("#end-game-box");
};

const appendExitSessionButton = () => {
  $("#exit-button-container").empty();
  const button = $(
    `
    <button type="button" class="btn btn-success">
      <img src="/public/assets/exit-session.svg" />
    </button>`
  );
  button.on("click", (event) => {
    exitFormGame();
    $("#exit-button-container").empty();
    event.stopImmediatePropagation();
  });
  button.appendTo("#exit-button-container");
};

const exitFormGame = () => {
  $("#exit-button-container").empty();
  if (!localPlay) {
    socket.emit("exitRoom", roomId);
  }
  roomId = null;
  playerColor = null;
  localPlay = false;
  emptyGameState();
  drawBoard();
  drawGameState();
  emptyMenu();
  showMenu();
  appendMainMenu();
};

appendUsernameInput();
