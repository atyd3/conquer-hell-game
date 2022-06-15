const monster = {
  name: "Monster",
  currentHp: null,
  maxHp: 200,
  damage: 10,
  healthBar: document.getElementById("monster-health"),
};

const monsterSkills = {
  hypno: {
    hypnosis(chance) {
      if (
        monsterRoundData.slice(-2, -1) == "hypnosis prep" &&
        gameStatus.isActive &&
        monsterRoundData.slice(-1) != "stun"
      ) {
        monsterRoundData.push("hypnosis");
        roundLogs.push(`Hypno used hypnosis`);
        writeLog("monster-special");
        attack(monster, player);
        attack(monster, player);
      }
      if (
        monsterRoundData.slice(-1) != "regeneration" &&
        monsterRoundData.slice(-1) != "hypnosis" &&
        chance >= 0.9 &&
        gameStatus.isActive &&
        monsterRoundData.slice(-1) != "stun"
      ) {
        monsterRoundData.push("hypnosis prep");
        roundLogs.push(`Hypno is preparing to use hypnosis`);
        writeLog("monster-special");
      }
    },
    regeneration(chance) {
      if (
        monsterRoundData.slice(-1) != "regeneration" &&
        chance <= 0.3 &&
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
    if (player.maxHp / monster.maxHp >= 2) {
      chance -= (player.maxHp / monster.maxHp) * 0.1;
    }
    for (let skill in specialSkills) {
      specialSkills[skill](chance);
    }
  }
