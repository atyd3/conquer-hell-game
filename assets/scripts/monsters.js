const monster = {
    name: "Monster",
    currentHp: null,
    maxHp: 200,
    damage: 50,
    healthBar: document.getElementById("monster-health"),
    canUseAllSkills: true,
    skillPrep: false
};

// const previousAttackSkillPrep = (monsterRoundData, gameStatus) => {
//     return (
//         monsterRoundData.slice(-2, -1) === "hypnosis prep" &&
//         monsterRoundData.slice(-1) != "stun" &&
//         gameStatus.isActive
//     )
// }


const monsterSkills = {
    hypno: {
        hypnosis(chance) {
            if (monster.skillPrep) {
                roundLogs.push(`Hypno used hypnosis`);
                writeLog("monster-special");
                monster.skillPrep = !monster.skillPrep //false
                attack(monster, player, 3);
                attack(monster, player, 3);
                monster.canUseAllSkills = false;
                //użyj hipnozy
            }

            if (monster.canUseAllSkills &&
                chance >= 0.9
            ) {
                monster.skillPrep = !monster.skillPrep; //true
                monster.canUseAllSkills = !monster.canUseAllSkills //false
                roundLogs.push(`Hypno is preparing to use hypnosis`);
                writeLog("monster-special");
                //przygotowanie do użycia hipnozy w następnej rundzie
            }
        },
        regeneration(chance) {
            if (
                monster.canUseAllSkills &&
                monster.currentHp <= 0.33 * monster.maxHp &&
                chance <= 0.3
            ) {
                monster.currentHp += 0.25 * monster.maxHp;
                updateHealthBar(monster);
                roundLogs.push(`Hypno used regeneration and restore 25% HP`);
                writeLog("monster-special");
                monster.canUseAllSkills = !monster.canUseAllSkills //false
                //użycie regeneracji
            }
        },
    },
    electro: {
        lightning(chance) {
            if (
                chance <= 0.15 &&
                gameStatus.isActive &&
                monsterRoundData.slice(-1) != "stun"
            ) {
                lightningDamage = +(
                    0.08 * player.maxHp +
                    Math.random() * 0.15 * player.maxHp
                ).toPrecision(1);
                player.currentHp -= lightningDamage;
                updateHealthBar(player);
                roundLogs.push(`Electro used lightning and caused ${lightningDamage} damage to player (${showPercentageHp(player)})%`);
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
                chance <= 0.15 &&
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

function enableSpecialMonsterSkills(selectedMonster) {
    for (let key in monsterSkills) {
        if (key == selectedMonster) {
            specialSkills = monsterSkills[key];
        }
    }
}

function specialMonsterAttack() {
    let chance = Math.random();
    console.log(chance);
    if (player.maxHp / monster.maxHp >= 2) {
        chance -= (player.maxHp / monster.maxHp) * 0.1;
        console.log("chance after calc",chance);
    }
    for (let skill in specialSkills) {
        specialSkills[skill](chance);
    }
}
  