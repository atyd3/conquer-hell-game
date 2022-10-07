import {dealDamage, endGame, gameStatus, randomIntegerBetweenValues} from "./main.js";
import {buttons, manaSpan} from "./elements.js";
import {monster} from "./monsters.js";
import {showPercentageHp, updateHealthBar, updatePlayerManaBar} from "./sections&hp.js";
import {writeLog} from "./logs.js";


export const player = {
    name: "Player",
    currentHp: null,
    maxHp: null,
    maxMana: null,
    healthBar: document.getElementById("player-health"),
    manaBar: document.getElementById("player-mana"),
    currentMana: null,
    damage: 40,
    roundData: [],
    isHypnotized: false,
    useMana(value) {
        if (this.currentMana - value >= 0) {
            this.currentMana -= value;
        } else {
            return;
        }
    },
    returnMana() {
        let returnManaValue = player.maxMana * 0.05;
        if (player.currentMana + returnManaValue < player.maxMana) {
            player.currentMana = +player.currentMana + returnManaValue;
        } else {
            player.currentMana = player.maxMana;
        }
        updatePlayerManaBar();
    },
    checkAvailableSkills(skill, controlBtn) {
        if (!skill || !gameStatus.isActive || player.isHypnotized) {
            controlBtn.classList.remove("btn--active");
            buttons.restoreBtn.classList.remove("btn--active--alt");
            controlBtn.setAttribute("disabled", true);
        } else {
            controlBtn.classList.add("btn--active");
            buttons.restoreBtn.classList.add("btn--active--alt");
            controlBtn.removeAttribute("disabled", true);
        }
    },
    playerSkills: {
        normalAttack() {
            const dealtDamage = dealDamage(4, 7, player, monster)
            let message = (`PLAYER(${showPercentageHp(player)}%) attack ${monster.name}(${showPercentageHp(monster)}%) and caused ${dealtDamage} damage`);
            writeLog(message, "player");
            player.roundData.push("attack");
        },
        heal: {
            canUseHeal() {
                let neededMana = player.maxMana * 0.4;
                if (player.roundData.slice(-1) == "heal") {
                    neededMana *= 2;
                    manaSpan.healManaSpan.textContent = "80% MP";
                } else {
                    manaSpan.healManaSpan.textContent = "40% MP";
                }

                if (player.currentMana >= neededMana) {
                    return neededMana;
                } else {
                    return false;
                }
            }, useHeal() {
                const healValue = player.maxHp * 0.35 + (Math.random().toPrecision(2) * 10 * player.maxHp) / 100;
                let message;
                if (player.currentHp + healValue > player.maxHp) {
                    message = `Player healed ${parseInt(player.maxHp - player.currentHp)} HP (100%)`
                    player.currentHp = player.maxHp;
                } else {
                    message = `Player healed ${parseInt(healValue)} HP`
                    player.currentHp += healValue;
                }
                const mana = player.playerSkills.heal.canUseHeal();
                player.useMana(mana);
                updateHealthBar(player);
                player.roundData.push("heal");
                writeLog(message, "player-special");
            },
        }, strongAttack: {
            canUseStrong() {
                let neededMana = player.maxMana * 0.2;
                if (player.roundData.slice(-1) == "strongattack") {
                    neededMana *= 2;
                    manaSpan.strongManaSpan.textContent = "40% MP";
                } else {
                    manaSpan.strongManaSpan.textContent = "20% MP";
                }

                if (player.currentMana >= neededMana) {
                    return neededMana;
                } else {
                    return false;
                }
            }, useStrong() {
                const mana = player.playerSkills.strongAttack.canUseStrong();
                let dealtDamage = dealDamage(10,12,player,monster);
                player.useMana(mana);
                let message = (`PLAYER(${showPercentageHp(player)}%) use strong attack on ${monster.name}(${showPercentageHp(monster)}%) and caused ${dealtDamage} damage`);
                writeLog(message, "player-special");
                player.roundData.push("strongattack");
            },
        }, stun: {
            canUseStun() {
                let neededMana = player.maxMana * 0.4;
                if (player.roundData.slice(-1) == "stun") {
                    neededMana *= 2;
                    manaSpan.stunManaSpan.textContent = "80% MP";
                } else {
                    manaSpan.stunManaSpan.textContent = "40% MP";
                }

                if (player.currentMana >= neededMana) {
                    return neededMana;
                } else {
                    return false;
                }
            }, useStun() {
                const mana = player.playerSkills.stun.canUseStun();
                player.useMana(mana);
                player.roundData.push("stun");
                const stun = Math.random();
                if (stun > 0.7) {
                    writeLog(`Stun failed`, "system");
                } else {
                    monster.skillPrep = false;
                    writeLog(`${monster.name} is stunned`, "player-special");
                    monster.isStunned = true;
                }
            },
        }, restore: {
            canUseRestore() {
                const neededHp = Math.ceil(player.maxHp * 0.2);
                if (player.currentHp >= neededHp) {
                    return neededHp;
                } else {
                    return false;
                }
            }, useRestore() {
                const restoredMana = Math.ceil(player.maxMana / 2);
                const burnHp = player.playerSkills.restore.canUseRestore();
                player.currentHp -= burnHp;
                if (player.currentMana + restoredMana >= player.maxMana) {
                    player.currentMana = player.maxMana;
                } else {
                    player.currentMana = player.currentMana + restoredMana;
                }
                player.manaBar.value = player.currentMana;
                player.roundData.push("restore");
                writeLog(`Player restore mana using 20%HP`, "player-special");
            },
        },
    }
};




