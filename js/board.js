// frontend/js/board.js
const BoardPage = (() => {
  const PAGE_SIZE = 10;

  async function fetchAllPosts() {
    const res = await fetch("../data/posts.json");
    return res.json();
  }

  function getState() {
    const u = new URL(location.href);
    return {
      page: parseInt(u.searchParams.get("page") || "1", 10),
      category: (u.searchParams.get("category") || "all").toLowerCase(),
      q: u.searchParams.get("q") || "",
    };
  }

  function go({ page, category, q }) {
    const u = new URL(location.href);
    u.searchParams.set("page", String(page));
    u.searchParams.set("category", category || "all");
    if (q) u.searchParams.set("q", q);
    else u.searchParams.delete("q");
    location.href = u.toString();
  }

  function escapeHTML(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function badge(cat) {
    const c = (cat || "").toUpperCase();
    if (c === "NOTICE") return `<span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800">NOTICE</span>`;
    if (c === "FREE") return `<span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">Free</span>`;
    if (c === "EVENT") return `<span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">Event</span>`;
    if (c === "Q&A" || c === "QNA") return `<span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700">Q&amp;A</span>`;
    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">General</span>`;
  }

  function renderRows(items) {
    const tbody = document.getElementById("post-tbody");
    if (!tbody) return;

    tbody.innerHTML = items.map(p => `
      <tr class="hover:bg-primary/5 transition-colors group cursor-pointer">
        <td class="py-4 px-6 text-sm text-gray-400 text-center font-mono">${escapeHTML(p.id)}</td>
        <td class="py-4 px-6">${badge(p.category)}</td>
        <td class="py-4 px-6">
          <a class="text-sm font-medium text-black group-hover:text-green-700 transition-colors block"
             href="./post.html?id=${encodeURIComponent(p.id)}">
            ${escapeHTML(p.title)}
          </a>
        </td>
        <td class="py-4 px-6 text-sm text-gray-600">${escapeHTML(p.author)}</td>
        <td class="py-4 px-6 text-sm text-gray-500 text-right font-mono">${escapeHTML(p.date)}</td>
      </tr>
    `).join("");
  }

function renderPagination(page, totalPages) {
  const prev = document.getElementById("btn-prev");
  const next = document.getElementById("btn-next");
  const wrap = document.getElementById("pagination");
  if (!wrap) return;

  const state = getState();

  if (prev) {
    prev.disabled = page <= 1;
    prev.onclick = () => go({ ...state, page: page - 1 });
  }
  if (next) {
    next.disabled = page >= totalPages;
    next.onclick = () => go({ ...state, page: page + 1 });
  }

  const btn = (p, active) => `
    <button class="w-8 h-8 rounded-sm ${active ? "bg-primary text-white font-bold" : "hover:bg-gray-100 bg-white text-gray-600 font-medium"} border border-gray-200 text-sm flex items-center justify-center transition-colors"
            onclick="BoardPage.goto(${p})">${p}</button>
  `;
  const dots = () => `<span class="text-gray-400 px-1 text-sm font-medium">...</span>`;

  let html = "";

  // ✅ 5페이지 이하면 전부 표시
 if (totalPages <= 5) {
  for (let p = 1; p <= totalPages; p++) html += btn(p, p === page);
  wrap.innerHTML = html;
  return;
}


  // ✅ (특수) 앞에서 3번째(page=3)면 1 2 3 4 ... last
  if (page === 3 && totalPages >= 5) {
    html += btn(1, page === 1);
    html += btn(2, page === 2);
    html += btn(3, page === 3);
    html += btn(4, page === 4);
    html += dots();
    html += btn(totalPages, page === totalPages);
    wrap.innerHTML = html;
    return;
  }

  // ✅ (특수) 뒤에서 3번째(page=last-2)면 1 ... last-3 last-2 last-1 last
  if (page === totalPages - 2 && totalPages >= 5) {
    html += btn(1, page === 1);
    html += dots();
    html += btn(totalPages - 3, page === totalPages - 3);
    html += btn(totalPages - 2, page === totalPages - 2);
    html += btn(totalPages - 1, page === totalPages - 1);
    html += btn(totalPages, page === totalPages);
    wrap.innerHTML = html;
    return;
  }

  // ✅ 처음 구간: page 1~2 -> 1 2 3 ... last
  if (page <= 2) {
    html += btn(1, page === 1);
    html += btn(2, page === 2);
    html += btn(3, page === 3);
    html += dots();
    html += btn(totalPages, page === totalPages);
    wrap.innerHTML = html;
    return;
  }

  // ✅ 끝 구간: page >= last-1 -> 1 ... last-2 last-1 last
  if (page >= totalPages - 1) {
    html += btn(1, page === 1);
    html += dots();
    html += btn(totalPages - 2, page === totalPages - 2);
    html += btn(totalPages - 1, page === totalPages - 1);
    html += btn(totalPages, page === totalPages);
    wrap.innerHTML = html;
    return;
  }

  // ✅ 중간 구간: 1 ... (page-1) page (page+1) ... last
  html += btn(1, page === 1);
  html += dots();
  html += btn(page - 1, false);
  html += btn(page, true);
  html += btn(page + 1, false);
  html += dots();
  html += btn(totalPages, page === totalPages);

  wrap.innerHTML = html;
}



  async function init() {
    const state = getState();

    const search = document.getElementById("search-input");
    if (search) {
      search.value = state.q;
      search.addEventListener("keydown", (e) => {
        if (e.key === "Enter") go({ ...state, page: 1, q: search.value.trim() });
      });
    }

    const data = await fetchAllPosts();
    let items = (data.items || []).slice();

    if (state.category !== "all") {
      items = items.filter(x => (x.category || "").toLowerCase() === state.category);
    }

    if (state.q) {
      const q = state.q.toLowerCase();
      items = items.filter(x =>
        (x.title || "").toLowerCase().includes(q) ||
        (x.author || "").toLowerCase().includes(q)
      );
    }

    items.sort((a, b) => (b.id || 0) - (a.id || 0));

    const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
    const page = Math.min(Math.max(1, state.page), totalPages);

    const start = (page - 1) * PAGE_SIZE;
    const pageItems = items.slice(start, start + PAGE_SIZE);

    renderRows(pageItems);
    renderPagination(page, totalPages);

    document.title = `BINARY Board - Page ${page} of ${totalPages}`;
  }

  function goto(p) {
    const state = getState();
    go({ ...state, page: p });
  }

  return { init, goto };
})();
