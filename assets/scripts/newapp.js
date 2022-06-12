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
      if (playerRoundData.slice(-1) == "heal") {
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
      const healValue =
        player.maxHp * 0.35 +
        (Math.random().toPrecision(2) * 10 * player.maxHp) / 100;
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
      playerRoundData.push("heal");
      writeLog("player");
    },
  },
  strongAttack: {
    canUseStrong() {
      let neededMana = player.maxMana * 0.2;
      if (playerRoundData.slice(-1) == "strongattack") {
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
      playerRoundData.push("strongattack");
    },
  },
  stun: {
    canUseStun() {
      let neededMana = player.maxMana * 0.4;
      if (playerRoundData.slice(-1) == "stun") {
        neededMana *= 2;
        stunManaSpan.textContent = "80% MP";
      } else {
        stunManaSpan.textContent = "40% MP";
      }

      if (player.currentMana >= neededMana) {
        return neededMana;
      } else {
        return false;
      }
    },
    useStun() {
      const mana = playerSkills.stun.canUseStun();
      player.useMana(mana);
      playerRoundData.push("stun");
      const stun = Math.random();
      attack(player, monster);
      if (stun > 0.7) {
        roundLogs.push(`Stun failed`);
        writeLog("system");
        attack(monster, player);
      } else {
        roundLogs.push(`Monster is stunned`);
        monsterRoundData.push("stun");
        writeLog("system");
      }
    },
  },
  restore: {
    canUseRestore() {
      const neededHp = player.maxHp * 0.2;
      if (player.currentHp >= neededHp) {
        return neededHp;
      } else {
        return false;
      }
    },
    useRestore() {
      const restoredMana = player.maxMana / 2;
      const burnHp = playerSkills.restore.canUseRestore();
      player.currentHp -= burnHp;
      if (player.currentMana + restoredMana >= player.maxMana) {
        player.currentMana = player.maxMana;
      } else {
        player.currentMana = player.currentMana + restoredMana;
      }
      player.manaBar.value = player.currentMana;
      roundLogs.push(`Player restore mana using 20%HP`);
      playerRoundData.push("restore");
      writeLog("player");
      endGame();
    },
  },
};

const monsterSkills = {
  hypno: {
    hypnosis(chance) {
      if (
        monsterRoundData.slice(-2,-1) == "hypnosis prep" &&
        gameStatus.isActive &&
        monsterRoundData.slice(-1) != "stun"
      ) {
        monsterRoundData.push("hypnosis");
        roundLogs.push(`Hypno used hypnosis`);
        console.log("working");
        writeLog("monster-special");
        attack(monster, player);
        attack(monster, player);
      }
      if (
        monsterRoundData.slice(-1) != "regeneration" &&
        monsterRoundData.slice(-1) != "hypnosis" &&
        chance >= 0.97 &&
        gameStatus.isActive &&
        monsterRoundData.slice(-1) != "stun"
      ) {
        monsterRoundData.push("hypnosis prep");
        roundLogs.push(`Hypno is preparing to use hypnosis`);
        writeLog("monster-special");
      }
      console.log(monsterRoundData);
    },
    regeneration(chance) {
      if (
        monsterRoundData.slice(-1) != "regeneration" &&
        chance <= 0.03 &&
        monster.currentHp <= 0.33 * monster.maxHp &&
        gameStatus.isActive &&
        monsterRoundData.slice(-1) != "stun"
      ) {
        monster.currentHp += 0.25 * monster.maxHp;
        updateHealthBar(monster);
        roundLogs.push(`Hypno used regeneration and restore 25% HP`);
        monsterRoundData.push("regeneration");
        writeLog("monster-special");
      } else {
        monsterRoundData.push("regeneration failed");
      }
    },
  },
  electro: {
    lightning(chance) {
      if (
        chance <= 0.1 &&
        gameStatus.isActive &&
        monsterRoundData.slice(-1) != "stun"
      ) {
        lightningDamage = +(
          0.08 * player.maxHp +
          Math.random() * 0.15 * player.maxHp
        ).toPrecision(1);
        player.currentHp -= lightningDamage;
        updateHealthBar(player);
        roundLogs.push(
          `Electro used lightning and caused ${lightningDamage} damage to player (${showPercentageHp(
            player
          )})%`
        );
        writeLog("monster-special");
        endGame();
      }
    },
    flash() {
      console.log("electro use flash");
    },
  },
  drago: {
    fireFury() {
      console.log("drago use fireFury");
    },
    rainOfFire(chance) {
      if (
        chance <= 0.1 &&
        gameStatus.isActive &&
        monsterRoundData.slice(-1) != "stun"
      ) {
        rainOfFireDrops = Math.floor(Math.random() * (5 - 2 + 1) + 2);
        for (let i = 0; i < rainOfFireDrops; i++) {
          rainOfFireDamage = +(
            Math.random() * 0.04 * player.maxHp +
            0.01 * player.maxHp
          ).toPrecision(1);
          player.currentHp -= rainOfFireDamage;
          updateHealthBar(player);
          roundLogs.push(
            `Drago used rain of fire and caused ${rainOfFireDamage} damage to player (${showPercentageHp(
              player
            )})%`
          );
          writeLog("monster-special");
          endGame();
        }
      }
    },
  },
};

//regeneration: monster can regenerate 25% HP if his HP is under 50%, chance 10%
//hypnosis: monster is preparing for attack that can stun player for 2 rounds (and make 2 attack in this time), chance 3% (can be stopped by stun)
//lightning: strong attack with random damage
//flash: 2 normal attacks in round, chance 10% or more
//fire fury: player is burning in fire, takes 5% of HP for 3 rounds (can stack)
//rain of fire: monster can attack with 2 to 5 fire balls with random damage

const gameStatus = {
  canStart: true,
  isActive: true,
  result: null,
};

let roundLogs = [];
let playerRoundData = [];
let monsterRoundData = [];

const activeGameSections = [
  healthSection,
  logsSection,
  controlsSection,
  additionalControlsSection,
];

const activeSettingsSections = [header, settingsSection];

function checkAvailableSkills(skill, controlBtn) {
  if (!skill || !gameStatus.isActive) {
    controlBtn.classList.remove("button-active");
    restoreBtn.classList.remove("button-active-alt");
    controlBtn.setAttribute("disabled", true);
  } else {
    controlBtn.classList.add("button-active");
    restoreBtn.classList.add("button-active-alt");
    controlBtn.removeAttribute("disabled", true);
  }
}

function enableSpecialMonsterSkills(selectedMonster) {
  for (let key in monsterSkills) {
    if (key == selectedMonster) {
      specialSkills = monsterSkills[key];
      console.log(specialSkills);
    }
  }
}

function attack(attacker, defender, dmg = 1) {
  if (!gameStatus.isActive) {
    return;
  }

  const dealtDamage = +(
    Math.random() * 15 +
    attacker.damage * dmg +
    defender.maxHp * 0.02
  ).toPrecision(3);
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
  }
}

function startGame() {
  healManaSpan.textContent = "40% MP";
  stunManaSpan.textContent = "40% MP";
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
  writeLog("system");

  for (const activeSection of activeGameSections) {
    showSection(activeSection);
  }

  hideSection(settingsSection); //close settings
  hideSection(header); //close header

  for (const controlBtn of controlBtns) {
    controlBtn.classList.add("button-active");
    controlBtn.removeAttribute("disabled");
  }
  restoreBtn.classList.add("button-active-alt");
  settingsBtn.classList.remove("click-me");
}

function hideSection(section) {
  section.classList.add("hidden");
}

function showSection(section) {
  section.classList.remove("hidden");
}

function writeLog(className) {
  if (!gameStatus.isActive) {
    return;
  }

  let li = document.createElement("li");
  li.classList.add(className);
  li.textContent = roundLogs.slice(-1);
  logList.appendChild(li);
  logsSection.scrollTop = logsSection.scrollHeight - logsSection.clientHeight;
}

function removeLogs() {
  roundLogs = [];
  playerRoundData = [];
  const logsLi = document.querySelector("#logs ul");
  while (logsLi.firstChild) {
    logsLi.firstChild.remove();
  }
  // logsSection.classList.add("toggle");
}

function specialMonsterAttack() {
  console.log("losowanie specjalnego ataku");
  let chance = Math.random();
  if (player.maxHp / monster.maxHp >= 2) {
    chance -= (player.maxHp / monster.maxHp) * 0.1;
  }
  console.log(chance);
  for (let skill in specialSkills) {
    specialSkills[skill](chance);
  }
}

function nextRound() {
  returnMana();
  specialMonsterAttack();
  checkAvailableSkills(playerSkills.heal.canUseHeal(), healBtn);
  checkAvailableSkills(
    playerSkills.strongAttack.canUseStrong(),
    strongAttackBtn
  );
  checkAvailableSkills(playerSkills.stun.canUseStun(), stunBtn);
  checkAvailableSkills(playerSkills.restore.canUseRestore(), restoreBtn);
}

function endGame() {
  if (monster.currentHp <= 0 && player.currentHp <= 0 && gameStatus.isActive) {
    gameStatus.result = "Draw";
  } else if (player.currentHp <= 0 && gameStatus.isActive) {
    gameStatus.result = "Monster wins";
    gameStatusSection.classList.add("monster-bg");
  } else if (monster.currentHp <= 0 && gameStatus.isActive) {
    gameStatus.result = "Player wins";
    gameStatusSection.classList.add("player-bg");
  } else {
    return;
  }

  roundLogs.push(gameStatus.result);
  writeLog("system");
  gameStatus.isActive = !gameStatus.isActive;
  gameStatusSection.firstElementChild.textContent = gameStatus.result;
  hideSection(healthSection);
  showSection(gameStatusSection);
  for (const controlBtn of controlBtns) {
    controlBtn.classList.remove("button-active");
    controlBtn.setAttribute("disabled", true);
  }
  settingsBtn.classList.add("click-me");
}

hpForm.addEventListener("submit", (event) => {
  event.preventDefault();
  removeLogs();
  for (const monsterSelect of monsterSelects) {
    if (monsterSelect.checked) {
      selectedMonster = monsterSelect.value;
      enableSpecialMonsterSkills(selectedMonster);
    }
  }
  startGame();
});

attackBtn.addEventListener("click", () => {
  attack(player, monster);
  attack(monster, player);
  playerRoundData.push("attack");
  nextRound();
});

strongAttackBtn.addEventListener("click", () => {
  playerSkills.strongAttack.useStrong();
  nextRound();
  attack(monster, player);
});

logBtn.addEventListener("click", () => {
  logsSection.classList.toggle("hidden");
});

settingsBtn.addEventListener("click", () => {
  removeLogs();
  endGame();
  for (const activeSection of activeGameSections) {
    hideSection(activeSection);
  }
  for (const activeSection of activeSettingsSections) {
    showSection(activeSection);
  }
  hideSection(gameStatusSection);
});

stunBtn.addEventListener("click", () => {
  playerSkills.stun.useStun();
  nextRound();
});

healBtn.addEventListener("click", () => {
  playerSkills.heal.useHeal();
  nextRound();
  attack(monster, player);
});

restoreBtn.addEventListener("click", () => {
  playerSkills.restore.useRestore();
  nextRound();
  attack(monster, player);
});

for (const hpInput of hpInputs) {
  hpInput.addEventListener("keyup", () => {
    if (hpInput.value < 1) {
      hint.style = "display: block";
      gameStatus.canStart = false;
      startGameBtn.classList.remove("button-active");
    } else {
      hint.style = "display: none";
      gameStatus.canStart = true;
      startGameBtn.classList.add("button-active");
    }
  });
  hpInput.oninput = function () {
    if (this.value.length > 5) {
      this.value = this.value.slice(0, 5);
    }
  };
}
