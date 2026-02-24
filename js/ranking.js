const API_BASE = "https://backend-production-5853.up.railway.app"
const RankingPage = (() => {
  const INITIAL_SHOW = 10;

  let all = [];
  let expanded = false;

function getDaysInCurrentMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

const TIER_MAP = {
  0: "Unrated",
  1: "Bronze V",
  2: "Bronze IV",
  3: "Bronze III",
  4: "Bronze II",
  5: "Bronze I",
  6: "Silver V",
  7: "Silver IV",
  8: "Silver III",
  9: "Silver II",
  10: "Silver I",
  11: "Gold V",
  12: "Gold IV",
  13: "Gold III",
  14: "Gold II",
  15: "Gold I",
  16: "Platinum V",
  17: "Platinum IV",
  18: "Platinum III",
  19: "Platinum II",
  20: "Platinum I",
  21: "Diamond V",
  22: "Diamond IV",
  23: "Diamond III",
  24: "Diamond II",
  25: "Diamond I",
  26: "Ruby V",
  27: "Ruby IV",
  28: "Ruby III",
  29: "Ruby II",
  30: "Ruby I",
  31: "Master"
};

function tierToText(tierNum) {
  const n = Number(tierNum);
  return TIER_MAP[n] || "Unrated";
}

async function fetchRanking() {
  const res = await fetch(`${API_BASE}/api/v1/grass/ranking?year=2026&month=2`);
  if (!res.ok) throw new Error("랭킹 API 실패: " + res.status);

  const arr = await res.json(); // ✅ 백엔드가 배열로 줌
  const totalDays = getDaysInCurrentMonth();

  // ✅ 프론트가 원하는 구조로 변환
  const items = arr.map((u, idx) => {
    const attend = Number(u.attendance || 0);
    const streak = Number(u.streak || 0);

    return {
      user_id: u.user_id,
      rank: idx + 1, // ✅ 배열 순서대로 1,2,3... 매김
      name: u.name,
      tier: tierToText(u.tier), // ✅ 숫자 → 텍스트
      originalTier: Number(u.tier), 
      participation: `${attend}/${totalDays}`, // ✅ 자동으로 뒤 날짜 붙임
      streak:`${streak} Days` , // ✅ 0이면 — 처리
      baekjoon_id: u.baekjoon_id,
    };
  });

  return { items }; // ✅ 기존 코드가 data.items 쓰니까 맞춰줌
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
    const str = String(s ?? "");

  // 앞 숫자만 추출
  const m = str.match(/(\d+)/);
  const a = m ? parseInt(m[1], 10) : 0;

  const total = getDaysInCurrentMonth(); 
  const pct = total ? Math.round((a / total) * 100) : 0;

  return { a, b: total, pct };
  }

  function setBar(id, percent) {
    const el = document.getElementById(id);
    if (!el) return;
    const p = Math.max(0, Math.min(100, percent || 0));
    el.style.width = `${p}%`;
  }

  function guessTier(member) {
    if (member?.tier) return String(member.tier);
    if (member?.badge?.label) return String(member.badge.label);
    if (member?.badgeLabel) return String(member.badgeLabel);
    return "";
  }

  function tierMeta(tierText) {
    const t = String(tierText || "").toLowerCase();


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
    if (t.includes("platinum")) {
  return { dot: "bg-cyan-500", text: "text-slate-700", tierLabel: tierText };
}
if (t.includes("ruby")) {
  return { dot: "bg-red-500", text: "text-slate-700", tierLabel: tierText };
}
if (t.includes("master")) {
  return { dot: "bg-purple-600", text: "text-slate-700", tierLabel: tierText };
}
    return { dot: "bg-slate-300", text: "text-slate-700", tierLabel: tierText || "Member" };
  }

  function guessStreak(member) {
   
    if (member?.streak != null && String(member.streak).trim() !== "") return String(member.streak);
    if (member?.sub != null && String(member.sub).toLowerCase().includes("day")) return String(member.sub);
   
    if (typeof member?.sub === "number") return `${member.sub} Days`;
    return "—";
  }

 function badgeGradientByTier(tierText) {
  const t = tierText.toLowerCase();

  if (t.includes("diamond")) return "bg-gradient-to-br from-cyan-400 to-cyan-600";
  if (t.includes("platinum")) return "bg-gradient-to-br from-sky-400 to-sky-600";
  if (t.includes("gold")) return "bg-gradient-to-br from-yellow-400 to-yellow-600";
  if (t.includes("silver")) return "bg-gradient-to-br from-slate-400 to-slate-600";
  if (t.includes("bronze")) return "bg-gradient-to-br from-orange-400 to-orange-600";
  if (t.includes("ruby")) return "bg-gradient-to-br from-red-400 to-red-600";
  if (t.includes("master")) return "bg-gradient-to-br from-purple-500 to-purple-700";

  return "bg-gradient-to-br from-gray-400 to-gray-600";
}
function tierLevelRoman(tierText) {
  const t = String(tierText || "").trim();
  const m = t.match(/\b(I|II|III|IV|V)\b$/);
  if (!m) return ""; // Unrated, Master 등
  return m[1];       // ✅ 로마숫자 그대로
}
 function renderPodium() {
  if (!all || all.length < 3) return;


  const first = all[0];
  const second = all[1];
  const third = all[2];

  // 이름
  setText("p1-name", first?.name || "—");
  setText("p2-name", second?.name || "—");
  setText("p3-name", third?.name || "—");

  // ✅ tier 메타 가져오기
  const m1 = tierMeta(guessTier(first));
  const m2 = tierMeta(guessTier(second));
  const m3 = tierMeta(guessTier(third));

  // 텍스트 변경
  setText("p1-tier", m1.tierLabel);
  setText("p2-tier", m2.tierLabel);
  setText("p3-tier", m3.tierLabel);

  // ✅ 색상 변경 (클래스 교체)
  const p1 = document.getElementById("p1-tier");
  const p2 = document.getElementById("p2-tier");
  const p3 = document.getElementById("p3-tier");

setText("p1-rank", tierLevelRoman(first?.tier));
setText("p2-rank", tierLevelRoman(second?.tier));
setText("p3-rank", tierLevelRoman(third?.tier));

  if (p1) p1.className = `text-sm font-black uppercase tracking-widest mt-1 ${m1.text}`;
  if (p2) p2.className = `text-xs font-bold uppercase tracking-wider mt-1 ${m2.text}`;
  if (p3) p3.className = `text-xs font-bold uppercase tracking-wider mt-1 ${m3.text}`;

  // ===== 육각형 배지 색 변경 =====
const b1 = document.getElementById("p1-badge");
const b2 = document.getElementById("p2-badge");
const b3 = document.getElementById("p3-badge");

if (b1) b1.className = `badge-polygon badge-polygon-lg shadow-xl flex items-center justify-center ${badgeGradientByTier(m1.tierLabel)}`;
if (b2) b2.className = `badge-polygon shadow-lg flex items-center justify-center ${badgeGradientByTier(m2.tierLabel)}`;
if (b3) b3.className = `badge-polygon shadow-lg flex items-center justify-center ${badgeGradientByTier(m3.tierLabel)}`;

  // attendance
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

  setText("p1-streak", guessStreak(first));
  setText("p2-streak", guessStreak(second));
  setText("p3-streak", guessStreak(third));
}
  //List
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

    //10명 이하
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
    const rest = all.slice(3); //4등부터 리스트
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