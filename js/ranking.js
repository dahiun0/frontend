// frontend/js/ranking.js
const RankingPage = (() => {
  const INITIAL_SHOW = 10; // 처음에 몇 명 보여줄지

  let all = [];
  let expanded = false;

  async function fetchRanking() {
    // ranking/index.html 기준: ../data/ranking.json
    const res = await fetch("../data/ranking.json");
    return res.json();
  }
function setCurrentMonth() {
  const el = document.getElementById("current-month");
  if (!el) return;

  const now = new Date();
  const options = { year: "numeric", month: "long" };
  el.textContent = now.toLocaleDateString("en-US", options);
}
  function escapeHTML(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text ?? "";
  }

  function parseAttend(s) {
    // "29/31" or "29/31 days" 등에서 29, 31 추출
    const str = String(s ?? "");
    const m = str.match(/(\d+)\s*\/\s*(\d+)/);
    if (!m) return { a: 0, b: 0, pct: 0 };
    const a = parseInt(m[1], 10);
    const b = parseInt(m[2], 10);
    const pct = b ? Math.round((a / b) * 100) : 0;
    return { a, b, pct };
  }

  function setBar(id, percent) {
    const el = document.getElementById(id);
    if (!el) return;
    const p = Math.max(0, Math.min(100, percent || 0));
    el.style.width = `${p}%`;
  }

  function guessTier(member) {
    // 데이터에서 tier가 없을 수도 있어서 최대한 안전하게 추정
    // 우선순위: member.tier > badge.label > member.badgeLabel > ""
    if (member?.tier) return String(member.tier);
    if (member?.badge?.label) return String(member.badge.label);
    if (member?.badgeLabel) return String(member.badgeLabel);
    return "";
  }

  function tierMeta(tierText) {
    const t = String(tierText || "").toLowerCase();

    // 카드 리스트 쪽 작은 마름모 색 + 텍스트 색 맞추기
    if (t.includes("diamond")) {
      return { dot: "bg-primary", text: "text-slate-700", tierLabel: tierText || "Diamond" };
    }
    if (t.includes("gold")) {
      return { dot: "bg-tier-gold", text: "text-slate-700", tierLabel: tierText || "Gold" };
    }
    if (t.includes("silver")) {
      return { dot: "bg-tier-silver", text: "text-slate-700", tierLabel: tierText || "Silver" };
    }
    if (t.includes("bronze")) {
      return { dot: "bg-tier-bronze", text: "text-slate-700", tierLabel: tierText || "Bronze" };
    }
    return { dot: "bg-slate-300", text: "text-slate-700", tierLabel: tierText || "Member" };
  }

  function guessStreak(member) {
    // streak 필드가 있으면 그걸 쓰고, 없으면 sub에서 숫자/Days 같은 걸 최대한 살림
    if (member?.streak != null && String(member.streak).trim() !== "") return String(member.streak);
    if (member?.sub != null && String(member.sub).toLowerCase().includes("day")) return String(member.sub);
    // 혹시 "14" 숫자만 오는 경우도 대비
    if (typeof member?.sub === "number") return `${member.sub} Days`;
    return "—";
  }

  // ===== Podium =====
  function renderPodium() {
    if (!all || all.length < 3) return;

    const first = all[0];
    const second = all[1];
    const third = all[2];

    // 이름
    setText("p1-name", first?.name || "—");
    setText("p2-name", second?.name || "—");
    setText("p3-name", third?.name || "—");

    // tier
    setText("p1-tier", guessTier(first) || "Diamond I");
    setText("p2-tier", guessTier(second) || "Gold II");
    setText("p3-tier", guessTier(third) || "Silver III");

    // attendance = participation 사용(네 JSON 구조를 그대로 존중)
    const a1 = parseAttend(first?.participation);
    const a2 = parseAttend(second?.participation);
    const a3 = parseAttend(third?.participation);

    setText("p1-attend", a1.a);
    setText("p1-total", `/${a1.b}`);
    setBar("p1-bar", a1.pct);

    setText("p2-attend", a2.a);
    setText("p2-total", `/${a2.b}`);
    setBar("p2-bar", a2.pct);

    setText("p3-attend", a3.a);
    setText("p3-total", `/${a3.b}`);
    setBar("p3-bar", a3.pct);

    // streak
    setText("p1-streak", guessStreak(first));
    setText("p2-streak", guessStreak(second));
    setText("p3-streak", guessStreak(third));
  }

  // ===== List Cards (사진 디자인 그대로) =====
  function renderCards(list) {
    const wrap = document.getElementById("rank-list");
    if (!wrap) return;

    wrap.innerHTML = list.map((m) => {
      const tier = guessTier(m);
      const meta = tierMeta(tier);
      const attend = parseAttend(m?.participation);
      const streak = guessStreak(m);

      const rank = escapeHTML(m?.rank);
      const name = escapeHTML(m?.name);

      return `
        <div class="glass-card glass-card-hover rounded-xl p-4 flex flex-col md:grid md:grid-cols-12 gap-4 items-center transition-all duration-300 group">
          <div class="col-span-1 flex justify-center">
            <span class="font-bold text-lg text-slate-400 group-hover:text-primary transition-colors">#${rank}</span>
          </div>

          <div class="col-span-3 w-full text-center md:text-left pl-0 md:pl-2">
            <span class="text-lg font-bold text-slate-900">${name}</span>
          </div>

          <div class="col-span-2 flex justify-center">
            <div class="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-lg shadow-sm">
              <div class="w-3 h-3 ${meta.dot} rotate-45"></div>
              <span class="text-xs font-bold ${meta.text}">${escapeHTML(meta.tierLabel)}</span>
            </div>
          </div>

          <div class="col-span-3 w-full flex flex-col items-center justify-center">
            <div class="flex items-baseline gap-1">
              <span class="font-mono text-xl font-bold text-slate-800">${attend.a}</span>
              <span class="text-sm text-slate-400">/${attend.b}</span>
            </div>
          </div>

          <div class="col-span-3 w-full flex items-center justify-center gap-2">
            <span class="material-symbols-outlined ${streak === "—" || String(streak).includes("0") ? "text-slate-300" : "text-orange-400"}">local_fire_department</span>
            <span class="text-lg font-bold ${streak === "—" || String(streak).includes("0") ? "text-slate-400" : "text-slate-700"}">${escapeHTML(streak)}</span>
          </div>
        </div>
      `;
    }).join("");
  }

  function updateMoreButton() {
    const btn = document.getElementById("btn-more");
    const text = document.getElementById("more-text");
    const icon = document.getElementById("more-icon");
    if (!btn) return;

    // 전체 멤버 10명 이하면 버튼 없음(원래 네 로직 유지)
    if (all.length <= INITIAL_SHOW) {
      btn.style.display = "none";
      return;
    }

    btn.style.display = "inline-flex";

    if (expanded) {
      if (text) text.textContent = "Show less";
      if (icon) icon.textContent = "expand_less";
    } else {
      if (text) text.textContent = "Show more members";
      if (icon) icon.textContent = "expand_more";
    }
  }

  function applyView() {
    const rest = all.slice(3); // 4등부터 카드 리스트
    if (all.length <= INITIAL_SHOW) expanded = true;

    const list = expanded ? rest : rest.slice(0, INITIAL_SHOW - 3); // 처음엔 4~10등만(7명)
    renderCards(list);
    updateMoreButton();
  }

  async function init() {
    setCurrentMonth();
    
    const data = await fetchRanking();
    all = (data.items || []).slice();

    // rank 오름차순 정렬
    all.sort((a, b) => (a.rank || 9999) - (b.rank || 9999));

    renderPodium();

    const btn = document.getElementById("btn-more");
    if (btn) {
      btn.addEventListener("click", () => {
        expanded = !expanded;
        applyView();
      });
    }

    applyView();
  }

  return { init };
})();