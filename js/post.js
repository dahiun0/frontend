document.addEventListener("DOMContentLoaded", async () => {

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("잘못된 접근입니다.");
    return;
  }

  try {
    const res = await fetch(`https://backend-production-5853.up.railway.app/api/v1/boards/${id}`);
    if (!res.ok) throw new Error("불러오기 실패");

    const data = await res.json();

    document.getElementById("post-title").innerText = data.title;

    document.getElementById("post-author").innerText =
      data.user?.name || "익명";

    document.getElementById("post-generation").innerText =
      data.category;

     const genEl = document.getElementById("post-generation");
genEl.innerText = data.category;

const gen = data.category;

if (gen.includes("11")) {
  genEl.classList.add("bg-emerald-50", "text-emerald-600");
}
else if (gen.includes("10")) {
  genEl.classList.add("bg-violet-50", "text-violet-600");
}
else {
  genEl.classList.add("bg-sky-50", "text-sky-600");
}
    const date = new Date(data.created_at);
    document.getElementById("post-date").innerText =
      date.toLocaleDateString();

    document.getElementById("post-content").innerHTML =
      data.content;

    const loginUser = JSON.parse(localStorage.getItem("user"));

    console.log("loginUser:", loginUser);
    console.log("postUser:", data.user);

    if (loginUser && loginUser.name === data.user?.name) {
      document.getElementById("post-actions").classList.remove("hidden");
    }

    const editBtn = document.getElementById("edit-btn");

if (editBtn) {
  editBtn.addEventListener("click", () => {
    window.location.href = `../write/index.html?id=${id}`;
  });
}

    //삭제버튼
    const deleteBtn = document.getElementById("delete-btn");

    deleteBtn.addEventListener("click", async () => {

      const confirmDelete = confirm("정말 삭제하시겠습니까?");
      if (!confirmDelete) return;

      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          `https://backend-production-5853.up.railway.app/api/v1/boards/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!res.ok) {
          alert("삭제 실패");
          return;
        }

        alert("삭제되었습니다.");

        window.location.href = "../index.html";

      } catch (err) {
        console.error(err);
        alert("삭제 중 오류 발생");
      }

    });

//이전,다음글 있는지 확인
const listRes = await fetch("https://backend-production-5853.up.railway.app/api/v1/boards");
const listData = await listRes.json();

const posts = (listData.question_list || []).sort((a,b)=>b.id-a.id);

const index = posts.findIndex(p => p.id == id);

const prevBtn = document.getElementById("btn-prev");
const nextBtn = document.getElementById("btn-next");

const prevPost = posts[index + 1];
const nextPost = posts[index - 1];

//previous버튼
if (prevPost) {
  prevBtn.onclick = () => {
    window.location.href = `./index.html?id=${prevPost.id}`;
  };
} else {
prevBtn.classList.remove("hover:text-gray-900");
prevBtn.classList.add("text-gray-300");
prevBtn.onclick = null;
}

//next버튼
if (nextPost) {
  nextBtn.onclick = () => {
    window.location.href = `./index.html?id=${nextPost.id}`;
  };
} else {
 nextBtn.classList.remove("hover:text-gray-900");
nextBtn.classList.add("text-gray-300");
nextBtn.onclick = null;
}

  } catch (err) {
    console.error(err);
    alert("게시글을 불러오지 못했습니다.");
  }

});