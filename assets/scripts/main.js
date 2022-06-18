const gameStatus = {
  canStart: true,
  isActive: true,
  result: null,
};

function startGame() {
  healManaSpan.textContent = "40% MP";
  stunManaSpan.textContent = "40% MP";
  strongManaSpan.textContent = "20% MP";
  gameStatus.isActive = true;

  monster.canUseAllSkills = true;
  monster.skillPrep = false;

  monster.currentHp = monster.maxHp;
  player.currentHp = player.maxHp;
  player.maxMana = player.maxHp;
  player.currentMana = player.maxMana;

  setProgressBar(player, player.healthBar);
  setProgressBar(monster, monster.healthBar);
  setProgressBar(player, player.manaBar);
  // roundLogs[0] = "Game started";
  writeLog("Game started","system");

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

function attack(attacker, defender, dmg = 1) {
  if (!gameStatus.isActive) {
    return;
  }
  if (attacker === monster && monster.skillPrep){
    return;
  }
  const dealtDamage = +(
    defender.maxHp * 0.021 * Math.floor(Math.random() * (5 - 2 + 1) + 2) +
    attacker.damage *dmg 
  ).toPrecision(2);
  defender.currentHp = defender.currentHp - dealtDamage;
  updateHealthBar(defender);
  let message =(
    `${attacker.name}(${showPercentageHp(attacker)}%) attack ${
      defender.name
    }(${showPercentageHp(defender)}%) and caused ${dealtDamage} damage`
  );
  writeLog(message, attacker.name.toLowerCase());
  endGame();
}

function nextRound() {
  if(!gameStatus.isActive){
    return;
  }
  returnMana();
  if (!monster.canUseAllSkills && !monster.skillPrep) {
    monster.canUseAllSkills = !monster.canUseAllSkills
  }
  specialMonsterAttack();
  console.log("can use all skills",monster.canUseAllSkills);

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
  monster.canUseAllSkills = false;
  monster.skillPrep = false;
  // roundLogs.push(gameStatus.result);
  writeLog(gameStatus.result,"system");
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




