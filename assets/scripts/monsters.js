const monster = {
    name: "Monster",
    currentHp: null,
    // maxHp: 200,
    damage: 50,
    healthBar: document.getElementById("monster-health"),
    isStunned: false,
    canUseAllSkills: true,
    skillPrep: false,
    normalAttack() {
        if (!gameStatus.isActive) {
            return;
        }
        const dealtDamage = +(
            player.maxHp * 0.021 * Math.floor(Math.random() * (5 - 2 + 1) + 2) +
            monster.damage
        ).toPrecision(2);
        player.currentHp -= dealtDamage;
        updateHealthBar(player);
        let message = (
            `MONSTER(${showPercentageHp(monster)}%) attack PLAYER(${showPercentageHp(player)}%) and caused ${dealtDamage} damage`
        );
        writeLog(message, "monster");
        endGame();
    },
    addHypnosisButton() {
        let hypnosisButton = document.createElement('button');
        hypnosisButton.textContent = '????????????';
        hypnosisButton.className = "button-active";
        hypnosisButton.addEventListener('click', ()=> {
            dealtDamage = player.maxHp/100 * Math.floor(Math.random() * 20) + 10 // min10, max20
            player.currentHp -= dealtDamage;
            updateHealthBar(player);
            let message = (
                `PLAYER(${showPercentageHp(player)}%) attack himself due to hypnosis and caused ${dealtDamage} damage`
            );
            writeLog(message, "monster-special");
            playerRoundData.push("attack");
            controlsSection.removeChild(hypnosisButton);
            enableControlButtons();
            nextRound();
        })
        controlsSection.prepend(hypnosisButton);
    }
};

const monsterSkills = {
    hypno: {
        hypnosis(chance) {
            if (monster.skillPrep) {
                // roundLogs.push(`Hypno used hypnosis`);
                writeLog(`Hypno used hypnosis`,"monster-special");
                monster.skillPrep = !monster.skillPrep //false
                player.isHypnotized = true;
                writeLog("Player is hypnotized", "monster-special")
                monster.canUseAllSkills = false;
                //użyj hipnozy
            }

            if (monster.canUseAllSkills &&
                chance >= 0.9
            ) {
                monster.skillPrep = !monster.skillPrep; //true
                monster.canUseAllSkills = !monster.canUseAllSkills //false
                // roundLogs.push(`Hypno is preparing to use hypnosis`);
                writeLog(`Hypno is preparing to use hypnosis`,"monster-special");
                //przygotowanie do użycia hipnozy w następnej rundzie
            }

            if (player.isHypnotized){
                disableControlButtons();
                monster.addHypnosisButton();
                //dodać przycisk ???????????
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
                // roundLogs.push(`Hypno used regeneration and restore 25% HP`);
                writeLog(`Hypno used regeneration and restore 25% HP`,"monster-special");
                monster.canUseAllSkills = !monster.canUseAllSkills //false
                //użycie regeneracji
            }
        },
    },
    electro: {
        lightning(chance) {
            if (
                chance <= 0.15 &&
                gameStatus.isActive
            ) {
                lightningDamage = +(
                    0.08 * player.maxHp +
                    Math.random() * 0.15 * player.maxHp
                ).toPrecision(1);
                player.currentHp -= lightningDamage;
                updateHealthBar(player);
                let message = `Electro used lightning and caused ${lightningDamage} damage to player (${showPercentageHp(player)})%`;
                writeLog(message,"monster-special");
                // endGame();
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
                    let message =
                        `Drago used rain of fire and caused ${rainOfFireDamage} damage to player (${showPercentageHp(
                            player
                        )})%`
                    writeLog(message,"monster-special");
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
  