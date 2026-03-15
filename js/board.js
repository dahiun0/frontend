
const BoardPage = (() => {
  const PAGE_SIZE = 10;

  let _cache = null;
  let _bound = false;

 async function fetchAllPosts() {
  if (_cache) return _cache;

  const res = await fetch("https://backend-production-5853.up.railway.app/api/v1/boards");  // 🔥 서버 주소로 변경
  const data = await res.json();

  _cache = {
    items: (data.question_list || []).map(item => ({
      id: item.id,
      title: item.title,
      category: (item.category || "").replace("th Gen", "기"),
      date: item.created_at?.slice(0, 10), 
      author: item.user?.name || "익명"
    }))
  };

  return _cache;
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
  const raw = (cat || "").trim();
  if (!raw) return "";

  let color = "bg-gray-100 text-gray-700";

if (raw === "11기") {
  color = "bg-emerald-50 text-emerald-600";
} 
else if (raw === "10기") {
  color = "bg-violet-50 text-violet-600";
} 
else {
  color = "bg-sky-50 text-sky-600";
}

  return `<span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${color}">
    ${escapeHTML(raw)}
  </span>`;
}

 function renderRows(items, startIndex) {
  const tbody = document.getElementById("post-tbody");
  if (!tbody) return;

  tbody.innerHTML = items
    .map(
      (p, i) => `
      <tr class="hover:bg-primary/5 transition-colors group cursor-pointer">
        <td class="py-4 px-6 text-sm text-gray-400 text-center font-mono">
          ${items.length - (startIndex + i)}
        </td>
        <td class="py-4 px-6">${badge(p.category)}</td>
        <td class="py-4 px-6">
          <a class="text-sm font-medium text-black group-hover:text-green-700 transition-colors block"
             href="./post/index.html?id=${encodeURIComponent(p.id)}">
            ${escapeHTML(p.title)}
          </a>
        </td>
        <td class="py-4 px-6 text-sm text-gray-600">${escapeHTML(p.author)}</td>
        <td class="py-6 px-6 text-sm text-gray-500 text-right font-mono">${escapeHTML(
          p.date
        )}</td>
      </tr>
    `
    )
    .join("");
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
      <button class="w-8 h-8 rounded-sm ${
        active
          ? "bg-primary text-white font-bold"
          : "hover:bg-gray-100 bg-white text-gray-600 font-medium"
      } border border-gray-200 text-sm flex items-center justify-center transition-colors"
              onclick="BoardPage.goto(${p})">${p}</button>
    `;
    const dots = () =>
      `<span class="text-gray-400 px-1 text-sm font-medium">...</span>`;

    let html = "";


    if (totalPages <= 5) {
      for (let p = 1; p <= totalPages; p++) html += btn(p, p === page);
      wrap.innerHTML = html;
      return;
    }


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


    if (page <= 2) {
      html += btn(1, page === 1);
      html += btn(2, page === 2);
      html += btn(3, page === 3);
      html += dots();
      html += btn(totalPages, page === totalPages);
      wrap.innerHTML = html;
      return;
    }

    if (page >= totalPages - 1) {
      html += btn(1, page === 1);
      html += dots();
      html += btn(totalPages - 2, page === totalPages - 2);
      html += btn(totalPages - 1, page === totalPages - 1);
      html += btn(totalPages, page === totalPages);
      wrap.innerHTML = html;
      return;
    }


    html += btn(1, page === 1);
    html += dots();
    html += btn(page - 1, false);
    html += btn(page, true);
    html += btn(page + 1, false);
    html += dots();
    html += btn(totalPages, page === totalPages);

    wrap.innerHTML = html;
  }

  function updateActiveButtons() {
    const state = getState();
    const filterButtons = document.querySelectorAll("button[data-filter]");

    filterButtons.forEach((btn) => {
      const val = (btn.dataset.filter || "all").toLowerCase();
      const isActive = val === state.category;

      btn.classList.toggle("bg-primary", isActive);
      btn.classList.toggle("text-white", isActive);
      btn.classList.toggle("border-primary", isActive);

      btn.classList.toggle("bg-white", !isActive);
      btn.classList.toggle("text-gray-600", !isActive);
      btn.classList.toggle("border-gray-200", !isActive);
    });
  }

  async function render() {
    const state = getState();

    const data = await fetchAllPosts();
    let items = (data.items || []).slice();

 if (state.category === "etc") {
  items = items.filter(x => {
    const c = (x.category || "");
    return c !== "11기" && c !== "10기";
  });
}
else if (state.category !== "all") {
  items = items.filter(x =>
    (x.category || "") === state.category
  );
}

    if (state.q) {
      const q = state.q.toLowerCase();
      items = items.filter(
        (x) =>
          (x.title || "").toLowerCase().includes(q) ||
          (x.author || "").toLowerCase().includes(q)
      );
    }

    items.sort((a, b) => (b.id || 0) - (a.id || 0));

    const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
    const page = Math.min(Math.max(1, state.page), totalPages);

    const start = (page - 1) * PAGE_SIZE;
    const pageItems = items.slice(start, start + PAGE_SIZE);

    renderRows(pageItems, start);
    renderPagination(page, totalPages);

    document.title = `BINARY Board - Page ${page} of ${totalPages}`;

    updateActiveButtons();
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

     const writeBtn = document.getElementById("write-btn");

  if (writeBtn) {
    writeBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const token = localStorage.getItem("token");

      if (!token) {
        alert("로그인이 필요합니다.");
        window.location.href = "/login/index.html";
        return;
      }

      window.location.href = "../board/write/index.html";
    });
  }

const searchBtn = document.getElementById("search-btn");
if (search && searchBtn) {
  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    go({ ...getState(), page: 1, q: search.value.trim() });
  });
}

    const filterButtons = document.querySelectorAll("button[data-filter]");

    if (!_bound) {
      _bound = true;

      filterButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();

          const nextCategory = (btn.dataset.filter || "all").toLowerCase();

         
          const u = new URL(location.href);
          u.searchParams.set("page", "1");
          u.searchParams.set("category", nextCategory);

          
          const q = getState().q;
          if (q) u.searchParams.set("q", q);
          else u.searchParams.delete("q");

          history.pushState({}, "", u.toString());

          render();
        });
      });

      window.addEventListener("popstate", () => render());
    }

    await render();
  }

  function goto(p) {
    const state = getState();
    go({ ...state, page: p });
  }
  

  return { init, goto };
})();
