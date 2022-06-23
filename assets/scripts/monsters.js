import {disableControlButtons, enableControlButtons, endGame, gameStatus, randomIntegerBetweenValues, dealDamage} from "./main.js";
import {hideSection, showPercentageHp, showSection, updateHealthBar} from "./sections&hp.js";
import {player} from "./player.js";
import {writeLog} from "./logs.js";
import {buttons} from "./elements.js";

export const monster = {
    name: "Monster",
    currentHp: null,
    maxHp: null,
    damage: null,
    healthBar: document.getElementById("monster-health"),
    isStunned: false,
    specialSkills: null,
    canUseAllSkills: true,
    skillPrep: false,
    activeSkill: null,
    normalAttack() {
        const dealtDamage = dealDamage(5, 10, monster, player)
        let message = (
            `${monster.name}(${showPercentageHp(monster)}%) attack PLAYER(${showPercentageHp(player)}%) and caused ${dealtDamage} damage`
        );
        writeLog(message, "monster");
        endGame();
    },
    enableSpecialMonsterSkills(name) {
        for (let key in monsterSkills) {
            if (key === name) {
                monster.specialSkills = monsterSkills[key];
                console.log(monster.specialSkills)
            }
        }
    },
    calcSpec() {
        let max = 100;
        if (monster.maxHp / player.maxHp >= 1.5) {
            max = 80;
        }
        console.log(max)
        let chance = randomIntegerBetweenValues(1, max);
        for (let skill in monster.specialSkills) {
            monster.specialSkills[skill](chance);
            console.log('chance after calc', chance)
        }
    }
};


export const useMonsterSkill = {
    hypno: {
        hypnosis() {
            const dealtDamage = dealDamage(10, 15, monster, player);
            let message = (
                `PLAYER(${showPercentageHp(player)}%) attack himself due to hypnosis and caused ${dealtDamage} damage`
            );
            writeLog(message, "monster-special");
            player.roundData.push("attack");
            hideSection(buttons.hypnosisBtn);
            enableControlButtons();
            endGame();
        },
        regeneration() {
            monster.currentHp += 0.25 * monster.maxHp;
            updateHealthBar(monster);
            writeLog(`Hypno used regeneration and restore 25% HP`, "monster-special");
            monster.canUseAllSkills = !monster.canUseAllSkills //false
        }
    },
    electro: {
        glare() {
            writeLog(`Electro used glare and stole mana from player`, "monster-special");
            player.currentMana < player.maxMana * 0.3 ? player.currentMana = 0 : player.currentMana -= Math.ceil(player.maxMana * 0.3);
            player.manaBar.value = player.currentMana;
        },
        lightning() {
            const dealtDamage = dealDamage(8, 18, monster, player);
            let message = `Electro used lightning and caused ${dealtDamage} damage to player (${showPercentageHp(player)})%`;
            writeLog(message, "monster-special");
            endGame();
        }
    },
    drago: {
        fireFury() {
            //podpala playera na kilka rund
            let percentageDamage = randomIntegerBetweenValues(4, 7);
            player.currentHp -= Math.floor((player.maxHp / 100) * percentageDamage);
            updateHealthBar(player);
            writeLog(`Player lose ${percentageDamage}% HP due to fire fury`, 'monster-special');
            endGame();
        },
        rainOfFire() {
            for (let i = 0; i < randomIntegerBetweenValues(3, 5); i++) {
                let dealtDamage = dealDamage(4,7,monster, player)
                let message =
                    `Drago used rain of fire and caused ${dealtDamage} damage to player (${showPercentageHp(
                        player
                    )})%`
                writeLog(message, "monster-special");
                endGame();
            }
        }
    }
};

const monsterSkills = {
    hypno: {
        hypnosis(chance) {
            if (monster.canUseAllSkills &&
                chance < 5
            ) {
                monster.skillPrep = !monster.skillPrep; //true
                monster.canUseAllSkills = !monster.canUseAllSkills //false
                writeLog(`Hypno is preparing to use hypnosis`, "monster-special");
                //przygotowanie do użycia hipnozy w następnej rundzie
                return;
            }

            if (monster.skillPrep) {
                writeLog(`Hypno used hypnosis`, "monster-special");
                monster.skillPrep = !monster.skillPrep //false
                monster.canUseAllSkills = false;
                showSection(buttons.hypnosisBtn);
                player.isHypnotized = true;
                disableControlButtons();
                //użyj hipnozy
            }
        },
        regeneration(chance) {
            if (
                monster.canUseAllSkills &&
                monster.currentHp <= 0.33 * monster.maxHp &&
                chance >= 15 && chance < 21
            ) {
                useMonsterSkill.hypno.regeneration();
                //użycie regeneracji
            }
        },
    },
    electro: {
        lightning(chance) {
            if (
                chance < 5 &&
                monster.canUseAllSkills
            ) {
                monster.skillPrep = !monster.skillPrep; //true
                monster.canUseAllSkills = !monster.canUseAllSkills //false
                writeLog(`Electro is preparing to use lightning`, "monster-special");
                //przygotowanie do użycia lightning w następnej rundzie
                return;
            }

            if (monster.skillPrep) {
                monster.skillPrep = !monster.skillPrep //false
                monster.canUseAllSkills = false;
                useMonsterSkill.electro.lightning();
                //użyj glare
            }
        },
        glare(chance) {
            if (
                chance >= 10 && chance <= 15 &&
                monster.canUseAllSkills
            ) {
                useMonsterSkill.electro.glare()
            }
        }
    },
    drago: {
        fireFury(chance) {
            if (
                chance < 5 &&
                monster.canUseAllSkills &&
                !monster.activeSkill //zmienić żeby nextRound nie przestawiało canUseAllSkills i to wywalić
            ) {
                monster.skillPrep = !monster.skillPrep; //true
                monster.canUseAllSkills = !monster.canUseAllSkills //false
                writeLog(`Drago is preparing to use fire fury`, "monster-special");
                //przygotowanie do użycia fireFury w następnej rundzie
                return;
            }

            if (monster.skillPrep) {
                monster.skillPrep = !monster.skillPrep //false
                monster.canUseAllSkills = false;
                monster.activeSkill = 4;
                console.log(monster.activeSkill)
                writeLog(`Drago used fire fury`, 'monster-special');
                //użyj firefury
            }

            if (monster.activeSkill) {
                monster.activeSkill -= 1;
                useMonsterSkill.drago.fireFury();
            }
        },
        rainOfFire(chance) {
            if (
                chance >= 10 && chance <= 18 &&
                monster.canUseAllSkills &&
                !monster.activeSkill
            ) {
                useMonsterSkill.drago.rainOfFire();
            }
        }
    },

};



  