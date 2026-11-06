import { ACTIONS, MONTHS } from "./data.js";

export function createUI(game) {
  const $ = s => document.querySelector(s);
  const modal = $("#modal");
  let toastTimer;
  function toast(message) {
    const el = $("#toast"); el.textContent = message; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(()=>el.classList.remove("show"),2200);
  }
  function render() {
    const s = game.state, d = game.getDeltas();
    $("#date-label").textContent = `${MONTHS[s.month]} ${s.year}`;
    $("#month-title").textContent = `${MONTHS[s.month]} ${s.year}`;
    $("#turn-label").textContent = `TURN ${s.turn}`;
    $("#food-value").textContent = s.food; $("#industry-value").textContent = s.industry;
    $("#money-value").textContent = `₽${s.money}`; $("#trust-value").textContent = `${s.trust}%`;
    $("#stability-value").textContent = `${s.stability}%`;
    [["food",d.food],["industry",d.industry],["money",d.money]].forEach(([key,val])=>{
      const el = $(`#${key}-delta`); el.textContent = `${val>=0?"+":""}${val} / turn`; el.classList.toggle("negative",val<0);
    });
    $("#trust-delta").textContent = s.food<25 ? "-5 risk / turn" : (s.food>55?"+1 net / turn":"-1 / turn");
    $("#stability-delta").textContent = s.stability<30 ? "fragile" : "—";
    $("#briefing").textContent = s.lastReport;
    const progress = Math.round(Math.min(s.trust/70,s.industry/65)*100);
    $("#goal-percent").textContent = `${progress}%`; $("#goal-bar").style.width = `${progress}%`;
    $("#map-caption").textContent = `Farms ${s.farms} · Workshops ${s.factories} · Civic services ${s.civic}`;
    $("#action-list").innerHTML = ACTIONS.map(a=>`
      <button class="action-btn" data-action="${a.id}" ${s.actionsUsed>=2||s.money<a.cost||s.gameOver?"disabled":""}>
        <span class="action-icon">${a.icon}</span><span class="action-copy"><strong>${a.title}</strong><small>${a.detail}</small></span><span class="cost">₽${a.cost}</span>
      </button>`).join("");
    $("#action-list").querySelectorAll("[data-action]").forEach(btn=>btn.addEventListener("click",()=>{
      const result=game.act(btn.dataset.action); toast(result.message);
    }));
    $("#event-content").innerHTML = `<span class="event-tag">${s.lastEvent?"SPECIAL EVENT":"REPORT"}</span><p>${s.lastEvent?s.lastEvent.description:s.lastReport}</p>`;
    $("#next-turn-btn").textContent = s.actionsUsed===0 ? "End month →" : `End month (${2-s.actionsUsed} orders left) →`;
    $("#next-turn-btn").disabled = !!s.gameOver;
    if (s.lastEvent) openEvent(s.lastEvent);
    if (s.gameOver) showGameOver();
  }
  function openEvent(event) {
    $("#modal-title").textContent = event.title;
    $("#modal-description").textContent = event.description;
    $("#modal-choices").innerHTML = event.choices.map((c,i)=>`<button class="choice" data-choice="${i}"><strong>${c.title}</strong><small>${c.detail}</small></button>`).join("");
    $("#modal-choices").querySelectorAll("[data-choice]").forEach(b=>b.addEventListener("click",()=>{game.chooseEvent(Number(b.dataset.choice));modal.classList.add("hidden");toast("Decision recorded.");}));
    modal.classList.remove("hidden");
  }
  function showGameOver() {
    $("#modal-title").textContent = "The republic is in crisis";
    $("#modal-description").textContent = "Food supplies, public trust or national stability have collapsed. Your administration can no longer continue. Start a new administration to try a different approach.";
    $("#modal-choices").innerHTML = `<button class="choice" id="restart-choice"><strong>Start a new game</strong><small>Begin again in January 1921.</small></button>`;
    $("#restart-choice").addEventListener("click",()=>{game.reset();modal.classList.add("hidden");});
    modal.classList.remove("hidden");
  }
  function bind() {
    $("#next-turn-btn").addEventListener("click",()=>game.endTurn());
    $("#save-btn").addEventListener("click",()=>{game.save();toast("Game saved in this browser.");});
    $("#reset-btn").addEventListener("click",()=>{if(confirm("Start a new game? Your current local save will be replaced."))game.reset();});
    $("#close-modal").addEventListener("click",()=>{if(!game.state.lastEvent&&!game.state.gameOver)modal.classList.add("hidden");});
    if(game.load()) toast("Saved game loaded.");
  }
  return {render,bind};
}
