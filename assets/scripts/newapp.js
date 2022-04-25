const monster = {
  name: "Monster",
  currentHp: null,
  maxHp: 200,
  damage: 15,
  healthBar: document.getElementById("monster-health"),
};

const player = {
  name: "Player",
  currentHp: null,
  maxHp: 100,
  damage: 25,
  healthBar: document.getElementById("player-health"),
  manaBar: document.getElementById("player-mana"),
  currentMana: null,
  maxMana: 100,
};

const activeGameSections = [
  gameStatusSection,
  healthSection,
  controlsSection,
  additionalControlsSection,
];

function healPlayer() {
  const healValue = player.maxHp / 3 + 5 * Math.random().toPrecision(2);
  if (player.currentHp + healValue > player.maxHp) {
    writeLog(`Player healed ${parseInt(player.maxHp - player.currentHp)} HP`);
    player.currentHp = player.maxHp;
  } else {
    writeLog(`Player healed ${parseInt(healValue)} HP`);
    player.currentHp += healValue;
  }
}

function attack(attacker, defender, dmg = 1) {
  const dealtDamage = (Math.random() * 15 + attacker.damage * dmg).toPrecision(
    2
  );
  defender.currentHp = defender.currentHp - dealtDamage;
  updateHealthBar(defender);
  writeLog(
    `${attacker.name}(${showPercentageHp(attacker)}%) attack ${
      defender.name
    }(${showPercentageHp(defender)}%) and caused ${dealtDamage} damage`
  );
  endGame();
}

function showPercentageHp(object) {
  const result = parseInt((object.currentHp / object.maxHp) * 100);
  if (result <= 0) {
    return 0;
  } else {
    return result;
  }
}

function setProgressBar(object, progressBar) {
  progressBar.max = object.maxHp;
  progressBar.value = object.maxHp;
  console.log(object);
}

function updateHealthBar(object) {
  object.healthBar.value = object.currentHp;
}

function useMana(value) {
  player.currentMana -= value;
  player.manaBar.value = player.currentMana;
}

function startGame() {
  gameActive = true;
  player.maxHp = document.getElementById("playerInput").value;
  monster.maxHp = document.getElementById("monsterInput").value;
  monster.currentHp = monster.maxHp;
  player.currentHp = player.maxHp;
  player.maxMana = player.maxHp;
  player.currentMana = player.maxMana;
  setProgressBar(player, player.healthBar);
  setProgressBar(monster, monster.healthBar);
  setProgressBar(player, player.manaBar);
  writeLog("Game started");

  for (const activeSection of activeGameSections) {
    displaySection(activeSection);
  }

  displaySection(settingsSection); //close settings

  for (const controlBtn of controlBtns) {
    controlBtn.classList = "button-active";
    controlBtn.removeAttribute("disabled");
  }
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

function removeLogs() {
  const logsLi = document.querySelector("#logs ul");
  while (logsLi.firstChild) {
    logsLi.firstChild.remove();
  }
  logs.classList.add("toggle");
}

function endGame() {
  let gameResult;
  if (monster.currentHp <= 0 && player.currentHp <= 0 && gameActive === true) {
    gameResult = "Draw";
  } else if (player.currentHp <= 0 && gameActive === true) {
    gameResult = "Monster wins";
  } else if (monster.currentHp <= 0 && gameActive === true) {
    gameResult = "Player wins";
  } else {
    return;
  }
  writeLog(gameResult);
  gameStatusSection.firstElementChild.textContent = gameResult;
  gameActive = false;
  for (const controlBtn of controlBtns) {
    controlBtn.classList.remove("button-active");
    controlBtn.setAttribute("disabled", true);
  }
  settingsBtn.classList.add("click-me");
}

startGameBtn.addEventListener("click", () => {
  startGame();
});

attackBtn.addEventListener("click", () => {
  attack(player, monster);
  attack(monster, player);
});

strongAttackBtn.addEventListener("click", () => {
  if (player.currentMana >= player.maxMana * 0.2) {
    attack(player, monster, 2);
    useMana(`${player.maxMana * 0.2}`);
    attack(monster, player);
  } else {
    alert("not enought mana");
  }
});

healBtn.addEventListener("click", () => {
  if (player.currentMana >= player.maxMana * 0.5) {
    healPlayer();
    useMana(`${player.maxMana * 0.5}`);
    attack(monster, player);
  } else {
    alert("not enought mana");
  }
});

logBtn.addEventListener("click", () => {
  displaySection(logs);
});

settingsBtn.addEventListener("click", () => {
  removeLogs();
  startGame();
});
