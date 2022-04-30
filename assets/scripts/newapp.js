const monster = {
  name: "Monster",
  currentHp: null,
  maxHp: 200,
  damage: 10,
  healthBar: document.getElementById("monster-health"),
};

const player = {
  name: "Player",
  currentHp: null,
  maxHp: 100,
  damage: 10,
  healthBar: document.getElementById("player-health"),
  manaBar: document.getElementById("player-mana"),
  currentMana: null,
  maxMana: 100,
  useMana(value) {
    if (this.currentMana - value >= 0) {
      this.currentMana -= value;
    } else {
      return;
    }
  },
};

const playerSkills = {
  heal: {
    canUseHeal() {
      let neededMana = player.maxMana * 0.4;
      if (roundData.slice(-1) == "heal") {
        neededMana *= 2;
        healManaSpan.textContent = "80% MP";
      } else {
        healManaSpan.textContent = "40% MP";
      }

      if (player.currentMana >= neededMana) {
        return neededMana;
      } else {
        return false;
      }
    },
    useHeal() {
      const healValue = player.maxHp / 3 + 5 * Math.random().toPrecision(2) + 5;
      if (player.currentHp + healValue > player.maxHp) {
        roundLogs.push(
          `Player healed ${parseInt(player.maxHp - player.currentHp)} HP (100%)`
        );
        player.currentHp = player.maxHp;
      } else {
        roundLogs.push(`Player healed ${parseInt(healValue)} HP`);
        player.currentHp += healValue;
      }
      const mana = playerSkills.heal.canUseHeal();
      player.useMana(mana);
      updateHealthBar(player);
      roundData.push("heal");
      writeLog('player');
    },
  },
  strongAttack: {
    canUseStrong() {
      let neededMana = player.maxMana * 0.2;
      if (roundData.slice(-1) == "strongattack") {
        neededMana *= 2;
        strongManaSpan.textContent = "40% MP";
      } else {
        strongManaSpan.textContent = "20% MP";
      }

      if (player.currentMana >= neededMana) {
        return neededMana;
      } else {
        return false;
      }
    },
    useStrong() {
      const mana = playerSkills.strongAttack.canUseStrong();
      attack(player, monster, 2);
      player.useMana(mana);
      roundData.push("strongattack");
    },
  },
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

function checkAvailableSkills(skill, controlBtn) {
  if (!skill || !gameStatus.isActive) {
    controlBtn.classList.remove("button-active");
    controlBtn.setAttribute("disabled", true);
  } else {
    controlBtn.classList = "button-active";
    controlBtn.removeAttribute("disabled", true);
  }
}

function attack(attacker, defender, dmg = 1) {
  if (!gameStatus.isActive) {
    return
  }
  
  const dealtDamage = (
    Math.random() * 15 +
    attacker.damage * dmg + (defender.maxHp * 0.01)
  ).toPrecision(2);
  defender.currentHp = defender.currentHp - dealtDamage;
  updateHealthBar(defender);
  roundLogs.push(
    `${attacker.name}(${showPercentageHp(attacker)}%) attack ${
      defender.name
    }(${showPercentageHp(defender)}%) and caused ${dealtDamage} damage`
  );
  writeLog(attacker.name.toLowerCase());
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
}

function updateHealthBar(object) {
  object.healthBar.value = object.currentHp;
}

function returnMana() {
  let returnManaValue = player.maxMana * 0.05;
  if (player.currentMana + returnManaValue < player.maxMana) {
    player.currentMana = +player.currentMana + returnManaValue;
    player.manaBar.value = player.currentMana;
  } else {
    player.currentMana = player.maxMana;
    return;
  }
  checkAvailableSkills(playerSkills.heal.canUseHeal(), healBtn);
  checkAvailableSkills(
    playerSkills.strongAttack.canUseStrong(),
    strongAttackBtn
  );
}

function startGame() {
  healManaSpan.textContent = "40% MP";
  strongManaSpan.textContent = "20% MP";
  gameStatus.isActive = true;

  player.maxHp = +document.getElementById("playerInput").value;
  monster.maxHp = +document.getElementById("monsterInput").value;
  monster.currentHp = monster.maxHp;
  player.currentHp = player.maxHp;
  player.maxMana = player.maxHp;
  player.currentMana = player.maxMana;

  setProgressBar(player, player.healthBar);
  setProgressBar(monster, monster.healthBar);
  setProgressBar(player, player.manaBar);
  roundLogs[0] = "Game started";
  gameStatusSection.firstElementChild.textContent = roundLogs[0];
  writeLog('system');

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

function writeLog(className) {
  if (!gameStatus.isActive) {
    return 
  }

  let li = document.createElement("li");
  li.classList.add(className);
  li.textContent = roundLogs.slice(-1);
  logList.appendChild(li);
}

function removeLogs() {
  roundLogs = [];
  roundData = [];
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
    gameStatus.isActive
  ) {
    gameStatus.result = "Draw";
  } else if (player.currentHp <= 0 && gameStatus.isActive) {
    gameStatus.result = "Monster wins";
  } else if (monster.currentHp <= 0 && gameStatus.isActive) {
    gameStatus.result = "Player wins";
  } else {
    return;
  }

  roundLogs.push(gameStatus.result);
  writeLog('system');
  gameStatus.isActive = !gameStatus.isActive;
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
  attack(monster, player);
  roundData.push("attack");
  returnMana();
});

strongAttackBtn.addEventListener("click", () => {
  playerSkills.strongAttack.useStrong();
  returnMana();
  attack(monster, player);
});

logBtn.addEventListener("click", () => {
  displaySection(logs);
});

settingsBtn.addEventListener("click", () => {
  removeLogs();
  endGame();
  startGame();
});

healBtn.addEventListener("click", () => {
  playerSkills.heal.useHeal();
  returnMana();
  attack(monster, player);
});
