import { ACTIONS, MONTHS, REPORTS, EVENTS } from "./data.js";

const STORAGE_KEY = "lenin-simulator-save-v1";
const clamp = (n, min=0, max=100) => Math.max(min, Math.min(max, n));

function initialState() {
  return {
    year: 1921, month: 0, turn: 1,
    food: 62, industry: 34, money: 48, trust: 51, stability: 58,
    farms: 2, factories: 1, civic: 1, actionsUsed: 0,
    lastReport: "The country is exhausted after years of upheaval. Restore food supplies, restart production and maintain public confidence.",
    lastEvent: null, gameOver: false
  };
}

export function createGame() {
  let state = initialState();
  const listeners = new Set();
  const notify = () => listeners.forEach(fn => fn(state));
  const subscribe = fn => { listeners.add(fn); return () => listeners.delete(fn); };

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  function load() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (parsed && parsed.year === 1921 && typeof parsed.food === "number") {
        state = { ...initialState(), ...parsed };
        return true;
      }
    } catch {}
    return false;
  }
  function reset() {
    state = initialState();
    save(); notify();
  }
  function act(id) {
    if (state.gameOver || state.actionsUsed >= 2) return { ok:false, message:"You have used both government orders this month." };
    const action = ACTIONS.find(a => a.id === id);
    if (!action) return { ok:false, message:"Unknown order." };
    if (state.money < action.cost) return { ok:false, message:"Not enough treasury funds." };
    if (action.requires && !action.requires(state)) return { ok:false, message:"The required conditions are not met." };
    state.money -= action.cost;
    action.apply(state);
    state.actionsUsed++;
    state.lastReport = action.result;
    save(); notify();
    return { ok:true, message:action.result };
  }
  function chooseEvent(index) {
    if (!state.lastEvent) return;
    const choice = state.lastEvent.choices[index];
    if (!choice) return;
    choice.apply(state);
    state.lastReport = choice.result;
    state.lastEvent = null;
    save(); notify();
  }
  function endTurn() {
    if (state.gameOver) return;
    const foodDelta = Math.round(state.farms * 3 + state.industry * .025 - 5);
    const industryDelta = Math.round(state.factories * 2 + (state.money > 20 ? 1 : 0) - 2);
    const moneyDelta = Math.round(state.industry * .08 + state.civic - 5);
    state.food = clamp(state.food + foodDelta);
    state.industry = clamp(state.industry + industryDelta);
    state.money = clamp(state.money + moneyDelta, 0, 999);
    if (state.food < 25) { state.trust = clamp(state.trust - 5); state.stability = clamp(state.stability - 4); }
    else if (state.food > 55) state.trust = clamp(state.trust + 2);
    if (state.industry < 20) state.stability = clamp(state.stability - 2);
    if (state.trust > 65) state.stability = clamp(state.stability + 1);
    state.trust = clamp(state.trust - 1);
    state.stability = clamp(state.stability - (state.stability > 75 ? 1 : 0));
    state.month++;
    if (state.month >= 12) { state.month = 0; state.year++; }
    state.turn++;
    state.actionsUsed = 0;

    const event = EVENTS.find(e => e.when(state));
    if (event) state.lastEvent = event;
    else state.lastReport = REPORTS[(state.turn - 2) % REPORTS.length];

    if (state.food <= 0 || state.trust <= 0 || state.stability <= 0) state.gameOver = true;
    save(); notify();
  }
  function getDeltas() {
    return {
      food: Math.round(state.farms * 3 + state.industry * .025 - 5),
      industry: Math.round(state.factories * 2 + (state.money > 20 ? 1 : 0) - 2),
      money: Math.round(state.industry * .08 + state.civic - 5)
    };
  }
  return { get state(){return state;}, subscribe, save, load, reset, act, chooseEvent, endTurn, getDeltas, actions:ACTIONS, months:MONTHS };
}
