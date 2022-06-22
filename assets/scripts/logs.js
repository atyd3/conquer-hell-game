import {player} from './player.js';
import {logList} from "./elements.js";
import {gameStatus} from "./main.js";
import {sections} from "./elements.js";

export function writeLog(message, className) {
    if (!gameStatus.isActive) {
      return;
    }
  
    let li = document.createElement("li");
    li.classList.add(className);
    li.textContent = message;
    logList.appendChild(li);
    sections.logs.scrollTop = sections.logs.scrollHeight - sections.logs.clientHeight;
  }
  
export function removeLogs() {
    player.roundData = [];
    const logsLi = document.querySelector("#logs ul");
    while (logsLi.firstChild) {
      logsLi.firstChild.remove();
    }
  }