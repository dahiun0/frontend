// frontend/js/ranking.js
const RankingPage = (() => {
  const INITIAL_SHOW = 10; // 처음에 몇 명 보여줄지 (원하면 5→8 이런 식으로)

  let all = [];
  let expanded = false;

  async function fetchRanking() {
    // ranking/index.html 기준: ../data/ranking.json
    const res = await fetch("../data/ranking.json");
    return res.json();
  }

  function escapeHTML(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // 배지 1개 기준 (데이터에 여러 개면 여러 개 렌더링 가능)
  function badge(b) {
    if (!b) return "";
    const icon = escapeHTML(b.icon || "person");
    const label = escapeHTML(b.label || "Member");
    const color = (b.color || "slate").toLowerCase();

    const colorMap = {
      purple: "bg-purple-100 text-purple-700",
      blue: "bg-blue-100 text-blue-700",
      orange: "bg-orange-100 text-orange-700",
      pink: "bg-pink-100 text-pink-700",
      green: "bg-green-100 text-green-700",
      red: "bg-red-100 text-red-700",
      slate: "bg-slate-100 text-slate-600",
    };

    const cls = colorMap[color] || colorMap.slate;

    return `
      <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md ${cls} text-xs font-medium">
        <span class="material-symbols-outlined text-sm">${icon}</span> ${label}
      </span>
    `;
  }

  function trendIcon(trend) {
    const t = (trend || "flat").toLowerCase();
    if (t === "up") {
      return `
        <div class="inline-flex items-center justify-center size-8 rounded-full bg-green-100 text-green-600">
          <span class="material-symbols-outlined text-lg">trending_up</span>
        </div>
      `;
    }
    if (t === "down") {
      return `
        <div class="inline-flex items-center justify-center size-8 rounded-full bg-red-100 text-red-600">
          <span class="material-symbols-outlined text-lg">trending_down</span>
        </div>
      `;
    }
    return `
      <div class="inline-flex items-center justify-center size-8 rounded-full bg-slate-100 text-slate-400">
        <span class="material-symbols-outlined text-lg">remove</span>
      </div>
    `;
  }

  function renderRows(list) {
    const tbody = document.getElementById("rank-tbody");
    if (!tbody) return;

    tbody.innerHTML = list.map((m) => `
      <tr class="hover:bg-slate-50 transition-colors group">
        <td class="px-6 py-4 font-bold text-slate-400 group-hover:text-primary">#${escapeHTML(m.rank)}</td>
        <td class="px-6 py-4">
          <div class="flex items-center gap-3">
            <div>
              <p class="font-bold text-slate-900">${escapeHTML(m.name)}</p>
              <p class="text-xs text-slate-500">${escapeHTML(m.sub || "")}</p>
            </div>
          </div>
        </td>
        <td class="px-6 py-4">
          ${badge(m.badge)}
        </td>
        <td class="px-6 py-4 font-mono font-medium text-slate-700">${escapeHTML(m.participation)}</td>
        <td class="px-6 py-4 text-center">
          ${trendIcon(m.trend)}
        </td>
      </tr>
    `).join("");
  }
  // ===== Podium (Top 1/2/3) helpers =====
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function parsePercent(participation) {
    // "29/31" 또는 "29/31 days" 같은 문자열에서 퍼센트 계산
    const s = String(participation || "");
    const m = s.match(/(\d+)\s*\/\s*(\d+)/);
    if (!m) return 0;
    const a = parseInt(m[1], 10);
    const b = parseInt(m[2], 10);
    if (!b) return 0;
    return Math.round((a / b) * 100);
  }

  function setBar(id, percent) {
    const el = document.getElementById(id);
    if (!el) return;
    const p = Math.max(0, Math.min(100, percent));
    el.style.width = `${p}%`;
  }

  function renderPodium() {
    // all[0]=1등, all[1]=2등, all[2]=3등 (정렬된 상태라고 가정)
    if (!all || all.length < 3) return;

    const first = all[0];
    const second = all[1];
    const third = all[2];

    setText("p1-name", first.name);
    setText("p1-score", first.participation); // 예: "31/31"

    setText("p2-name", second.name);
    setText("p2-score", `${second.participation} days`);
    setBar("p2-bar", parsePercent(second.participation));

    setText("p3-name", third.name);
    setText("p3-score", `${third.participation} days`);
    setBar("p3-bar", parsePercent(third.participation));
  }
  

function updateMoreButton() {
    const text = document.getElementById("more-text");
  const btn = document.getElementById("btn-more");
  const icon = document.getElementById("more-icon");
  if (!btn) return;

  // ✅ 전체 멤버 10명 이하면 버튼 없음
  if (all.length <= INITIAL_SHOW) {
    btn.style.display = "none";
    return;
  }

  btn.style.display = "inline-flex";

  // ✅ 펼침/접힘에 따라 문구 + 아이콘 변경
 if (expanded) {
  if (text) text.textContent = "Show less";
  if (icon) icon.textContent = "expand_less";
} else {
  if (text) text.textContent = "Show more members";
  if (icon) icon.textContent = "expand_more";
}
}



function applyView() {
  const rest = all.slice(3); // 4등부터 테이블
  const total = rest.length;

  // ✅ 전체 멤버가 10명 이하이면(= all.length <= 10) 버튼 없이 전부 표시
  if (all.length <= INITIAL_SHOW) {
    expanded = true; // 전체보기로 강제
  }

  const list = expanded ? rest : rest.slice(0, INITIAL_SHOW - 3); 
  // INITIAL_SHOW=10이면 처음에 4~10등(7명)만 보이게 됨

  renderRows(list);
  updateMoreButton();
}




  async function init() {
    const data = await fetchRanking();
    all = (data.items || []).slice();

    // rank 오름차순 정렬 (원하면 다른 기준 가능)
    all.sort((a, b) => (a.rank || 9999) - (b.rank || 9999));
    renderPodium();

    const btn = document.getElementById("btn-more");
    if (btn) {
     btn.addEventListener("click", () => {
  expanded = !expanded;   // ✅ 토글
  applyView();
});

}

    applyView();
  }

  return { init };
})();
