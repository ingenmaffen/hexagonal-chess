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
};

const showMenu = () => {
  $("#title").show();
};

const appendMainMenu = () => {
  const mainMenuButtons = [
    {
      text: "Local Play",
      callback: () => {
        hideMenu();
        localPlay = true;
        // TODO: append exit button
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

appendUsernameInput();
