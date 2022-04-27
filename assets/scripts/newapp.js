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

const gameStatus = {
  isActive: true,
  result: null,
};

let roundLogs = [];
let roundData = [];

const activeGameSections = [
  gameStatusSection,
  healthSection,
  controlsSection,
  additionalControlsSection,
];

function healPlayer() {
  checkPrevRound();
  const healValue = (player.maxHp / 2) + 5 * Math.random().toPrecision(2) + 5;
  if (player.currentHp + healValue > player.maxHp) {
    roundLogs.push(
      `Player healed ${parseInt(player.maxHp - player.currentHp)} HP (100%)`
    );
    player.currentHp = player.maxHp;
  } else {
    roundLogs.push(`Player healed ${parseInt(healValue)} HP`);
    player.currentHp += healValue;
  }
  roundData.push("heal");
  writeLog();
}

function attack(attacker, defender, dmg = 1) {
  if (gameStatus.isActive === true) {
    checkPrevRound();
  
    const dealtDamage = (Math.random() * 15 + attacker.damage * dmg).toPrecision(
      2
    );
    defender.currentHp = defender.currentHp - dealtDamage;
    updateHealthBar(defender);
    roundLogs.push(
      `${attacker.name}(${showPercentageHp(attacker)}%) attack ${
        defender.name
      }(${showPercentageHp(defender)}%) and caused ${dealtDamage} damage`
    );
    writeLog();
    endGame();
  } else {
    return;
  }
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
}

function updateHealthBar(object) {
  object.healthBar.value = object.currentHp;
}

function useMana(value) {
  player.currentMana -= value;
}

function returnMana() {
  let returnManaValue = player.maxMana * 0.05;
  if (player.currentMana + returnManaValue < player.maxMana) {
    player.currentMana = +player.currentMana + returnManaValue;
    player.manaBar.value = player.currentMana;
  } else {
    return;
  }
}

function startGame() {
  manaSpan.textContent = "30% MP"
  gameStatus.isActive = true;
  player.maxHp = document.getElementById("playerInput").value;
  monster.maxHp = document.getElementById("monsterInput").value;
  monster.currentHp = monster.maxHp;
  player.currentHp = player.maxHp;
  player.maxMana = player.maxHp;
  player.currentMana = player.maxMana;
  setProgressBar(player, player.healthBar);
  setProgressBar(monster, monster.healthBar);
  setProgressBar(player, player.manaBar);
  roundLogs[0] = "Game started";
  gameStatusSection.firstElementChild.textContent = roundLogs[0];
  writeLog();

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

function writeLog() {
  if (gameStatus.isActive === true) {
    let li = document.createElement("li");
    li.textContent = roundLogs.slice(-1);
    logList.appendChild(li);
  } else {
    return;
  }
}

function removeLogs() {
  roundLogs = [];
  const logsLi = document.querySelector("#logs ul");
  while (logsLi.firstChild) {
    logsLi.firstChild.remove();
  }
  logs.classList.add("toggle");
}

function endGame() {
  if (
    monster.currentHp <= 0 &&
    player.currentHp <= 0 &&
    gameStatus.isActive === true
  ) {
    gameStatus.result = "Draw";
  } else if (player.currentHp <= 0 && gameStatus.isActive === true) {
    gameStatus.result = "Monster wins";
  } else if (monster.currentHp <= 0 && gameStatus.isActive === true) {
    gameStatus.result = "Player wins";
  } else {
    return;
  }

  roundLogs.push(gameStatus.result);
  writeLog(gameStatus.result);
  gameStatus.isActive = false;
  gameStatusSection.firstElementChild.textContent = gameStatus.result;
  for (const controlBtn of controlBtns) {
    controlBtn.classList.remove("button-active");
    controlBtn.setAttribute("disabled", true);
  }
  settingsBtn.classList.add("click-me");
}

startGameBtn.addEventListener("click", () => {
  removeLogs();
  startGame();
});

attackBtn.addEventListener("click", () => {
  attack(player, monster);
  roundData.push("attack");
  attack(monster, player);
  returnMana();
});

strongAttackBtn.addEventListener("click", () => {
  if (player.currentMana >= player.maxMana * 0.2) {
    attack(player, monster, 2);
    roundData.push("strongattack");

    useMana(`${player.maxMana * 0.2}`);
    returnMana();
    attack(monster, player);
  } else {
    alert("not enought mana");
  }
});

healBtn.addEventListener("click", () => {
  let manaForHeal = player.maxMana * 0.3;
  if (
    roundData.slice(-1) == "heal" &&
    player.currentMana >= player.maxMana * 0.6
  ) {
    manaForHeal = player.maxMana * 0.6;
    healPlayer();
    useMana(manaForHeal);
    attack(monster, player);
    returnMana();
  } else if (player.currentMana >= player.maxMana * 0.3) {
    healPlayer();
    useMana(manaForHeal);
    attack(monster, player);
    returnMana();
  } else {
    alert("not enought mana");
  }
});

logBtn.addEventListener("click", () => {
  displaySection(logs);
});

settingsBtn.addEventListener("click", () => {
  removeLogs();
  endGame();
  startGame();
});

function checkPrevRound() {
  if (roundData.slice(-1) == "heal") {
    manaSpan.textContent = "60% MP";
  } else {
    manaSpan.textContent = "30% MP";
  }

}
