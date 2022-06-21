const gameStatus = {
    canStart: true,
    isActive: true,
    result: null,
};

function randomIntegerBetweenValues(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

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
    writeLog("Game started", "system");

    for (const activeSection of activeGameSections) {
        showSection(activeSection);
    }

    hideSection(settingsSection); //close settings
    hideSection(header); //close header
    hideSection(hypnosisBtn);

    calcMonsterSpec();

    enableControlButtons();
    restoreBtn.classList.add("button-active-alt");
    settingsBtn.classList.remove("click-me");
}

function nextRound() {
    endGame();
    returnMana();
    if (!monster.canUseAllSkills && !monster.skillPrep) {
        monster.canUseAllSkills = !monster.canUseAllSkills
    }
    //to przenieść do monstera
    if (monster.isStunned || monster.skillPrep) {
        monster.isStunned = false
    } else {
        monster.normalAttack();
    }


    if (player.isHypnotized){
        player.isHypnotized = !player.isHypnotized;
    }

    calcMonsterSpec();

    checkAvailableSkills(playerSkills.heal.canUseHeal(), healBtn);
    checkAvailableSkills(
        playerSkills.strongAttack.canUseStrong(),
        strongAttackBtn
    );
    checkAvailableSkills(playerSkills.stun.canUseStun(), stunBtn);
    checkAvailableSkills(playerSkills.restore.canUseRestore(), restoreBtn);
}

function enableControlButtons() {
    for (const controlBtn of controlBtns) {
        controlBtn.classList.add("button-active");
        controlBtn.removeAttribute("disabled");
        restoreBtn.classList.add("button-active-alt");
    }
}

function disableControlButtons() {
    for (const controlBtn of controlBtns) {
        controlBtn.classList.remove("button-active");
        controlBtn.setAttribute("disabled", true);
        restoreBtn.classList.add("button-active-alt");
    }
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
    writeLog(gameStatus.result, "system");
    gameStatus.isActive = !gameStatus.isActive;
    gameStatusSection.firstElementChild.textContent = gameStatus.result;
    hideSection(healthSection);
    showSection(gameStatusSection);
    disableControlButtons();
    settingsBtn.classList.add("click-me");
}




