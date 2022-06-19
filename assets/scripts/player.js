const player = {
    name: "Player",
    currentHp: null,
    // maxHp: 100,
    damage: 40,
    healthBar: document.getElementById("player-health"),
    manaBar: document.getElementById("player-mana"),
    currentMana: null,
    isHypnotized: false,
    // maxMana: 100,
    useMana(value) {
        if (this.currentMana - value >= 0) {
            this.currentMana -= value;
        } else {
            return;
        }
    },
};

const playerSkills = {
    normalAttack() {
        if (!gameStatus.isActive) {
            return;
        }

        const dealtDamage = +(
            monster.maxHp * 0.021 * Math.floor(Math.random() * (5 - 2 + 1) + 2) +
            player.damage
        ).toPrecision(2);
        monster.currentHp -= dealtDamage;
        updateHealthBar(monster);
        let message = (
            `PLAYER(${showPercentageHp(player)}%) attack MONSTER(${showPercentageHp(monster)}%) and caused ${dealtDamage} damage`
        );
        writeLog(message, "player");
        playerRoundData.push("attack");
        // endGame();
    },
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
            let message;
            if (player.currentHp + healValue > player.maxHp) {
                message = `Player healed ${parseInt(player.maxHp - player.currentHp)} HP (100%)`
                player.currentHp = player.maxHp;
            } else {
                message = `Player healed ${parseInt(healValue)} HP`
                player.currentHp += healValue;
            }
            const mana = playerSkills.heal.canUseHeal();
            player.useMana(mana);
            updateHealthBar(player);
            playerRoundData.push("heal");
            writeLog(message, "player-special");
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
            const dealtDamage = +(
               2 * monster.maxHp * 0.021 * Math.floor(Math.random() * (5 - 2 + 1) + 2) + player.damage
            ).toPrecision(2);
            monster.currentHp -= dealtDamage;
            updateHealthBar(monster);
            player.useMana(mana);
            let message = (
                `PLAYER(${showPercentageHp(player)}%) use strong attack on MONSTER(${showPercentageHp(monster)}%) and caused ${dealtDamage} damage`
            );
            writeLog(message, "player-special");
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
            if (stun > 0.7) {
                writeLog(`Stun failed`, "system");
                console.log("stun failed > 0.7", stun);
            } else {
                monster.skillPrep = false;
                writeLog(`Monster is stunned`, "player-special");
                monster.isStunned = true;
                console.log("stun chance", stun);
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
            // roundLogs.push(`Player restore mana using 20%HP`);
            playerRoundData.push("restore");
            writeLog(`Player restore mana using 20%HP`, "player-special");
            // endGame();
        },
    },
};

function checkAvailableSkills(skill, controlBtn) {
    if (!skill || !gameStatus.isActive || player.isHypnotized) {
        controlBtn.classList.remove("button-active");
        restoreBtn.classList.remove("button-active-alt");
        controlBtn.setAttribute("disabled", true);
    } else {
        controlBtn.classList.add("button-active");
        restoreBtn.classList.add("button-active-alt");
        controlBtn.removeAttribute("disabled", true);
    }
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
