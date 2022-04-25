function startGame() {
  gameActive = true;
  writeLog("Game started");
  showHeader("GAME STARTED!");

  displaySection(settingsSection);
  displaySection(gameSection);
  displaySection(controlsSection);
  displaySection(healthSection);
  displaySection(reset);

  for (const controlBtn of controlBtns) {
    controlBtn.classList = "button-active";
    controlBtn.removeAttribute("disabled");
  }
}

function showHeader(message) {
  gameSection.firstElementChild.textContent = message;
}

function endGame() {
  if (
    monsterHealthBar.value <= 0 &&
    playerHealthBar.value <= 0 &&
    gameActive === true
  ) {
    writeLog("Draw");
    showHeader("DRAW");
  } else if (playerHealthBar.value <= 0 && gameActive === true) {
    writeLog("Monster wins");
    showHeader("MONSTER WINS!");
  } else if (monsterHealthBar.value <= 0 && gameActive === true) {
    writeLog("Player wins");
    showHeader("PLAYER WINS!");
  } else {
    return;
  }

  gameActive = false;
  for (const controlBtn of controlBtns) {
    controlBtn.classList.remove("button-active");
    controlBtn.setAttribute("disabled", true);
  }
  settingsBtn.classList.add("button-active");
}

function displaySection(section) {
  section.classList.toggle("toggle");
}

function writeLog(message) {
  if (gameActive === true) {
    let li = document.createElement("li");
    li.textContent = message;
    logList.appendChild(li);
  } else {
    return;
  }
}

function healPlayer() {
  const healValue = +(playerHealthBar.max / 5 + 5 * Math.random()).toPrecision(
    2
  );
  increasePlayerHealth(healValue);
  dealPlayerDamage(pDamage);
  return healValue;
}

function dealMonsterDamage(damage) {
  const dealtDamage = (Math.random() * damage).toPrecision(2);
  monsterHealthBar.value = +monsterHealthBar.value - dealtDamage;
  const playerHP = +(
    (playerHealthBar.value / playerHealthBar.max) *
    100
  ).toPrecision(2);
  const monsterHP = +(
    (monsterHealthBar.value / monsterHealthBar.max) *
    100
  ).toPrecision(2);
  writeLog(`Player(${playerHP}%) attack Monster(${monsterHP}%) ${dealtDamage}`);
  endGame();
}

function dealPlayerDamage(damage) {
  const dealtDamage = (Math.random() * damage).toPrecision(2);
  playerHealthBar.value = +playerHealthBar.value - dealtDamage;
  const playerHP = +(
    (playerHealthBar.value / playerHealthBar.max) *
    100
  ).toPrecision(2);
  const monsterHP = +(
    (monsterHealthBar.value / monsterHealthBar.max) *
    100
  ).toPrecision(2);

  writeLog(`Monster(${monsterHP}%) attack Player(${playerHP}%) ${dealtDamage}`);
  endGame();
}

function increasePlayerHealth(healValue) {
  const playerHP = +(
    (playerHealthBar.value / playerHealthBar.max) *
    100
  ).toPrecision(2);
  if (playerHealthBar.value + healValue < playerHealthBar.max) {
    playerHealthBar.value = +playerHealthBar.value + healValue;
    writeLog(`Player(${playerHP}%) healed ${healValue} HP`);
  } else {
    writeLog(
      `Player(${playerHP}%) healed ${
        playerHealthBar.max - playerHealthBar.value
      } HP`
    );
    playerHealthBar.value = playerHealthBar.max;
  }
}

function resetGame() {
  const logsLi = document.querySelectorAll("#logList li");

  for (const logLi of logsLi) {
    logList.removeChild(logLi);
  }
  logs.classList.add("toggle");
}

function openSettings() {
  if (settingsBtn.classList.value === "button-active") {
    displaySection(settingsSection);
    displaySection(controlsSection);
    displaySection(gameSection);
    displaySection(healthSection);
    displaySection(reset);

    resetGame();
    settingsBtn.classList.remove("button-active");
  } else {
    return;
  }
}

attackBtn.addEventListener("click", () => {
  dealMonsterDamage(mDamage);
  dealPlayerDamage(pDamage);
});

strongAttackBtn.addEventListener("click", () => {
  dealMonsterDamage(mDamage * 2);
  dealPlayerDamage(pDamage);
});

healBtn.addEventListener("click", healPlayer);

logBtn.addEventListener("click", () => {
  displaySection(logs);
});

startGameBtn.addEventListener("click", () => {
  monsterHealthBar.setAttribute("max", hpInputs[0].value);
  monsterHealthBar.setAttribute("value", hpInputs[0].value);
  playerHealthBar.setAttribute("max", hpInputs[1].value);
  playerHealthBar.setAttribute("value", hpInputs[1].value);

  startGame();
});

settingsBtn.addEventListener("click", openSettings);

for (const hpInput of hpInputs) {
  hpInput.addEventListener("keyup", () => {
    if (hpInput.value < 1) {
      hint.style = "display: block";
    } else {
      hint.style = "display: none";
    }
  });
}
