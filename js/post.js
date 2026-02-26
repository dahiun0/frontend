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

    // 🔥 서버에 author_name이 있다면 이렇게
    document.getElementById("post-author").innerText =
      data.author_name || "익명";

    // 🔥 generation → category
    document.getElementById("post-generation").innerText =
      data.category;

    // 🔥 createdAt → created_at
    const date = new Date(data.created_at);
    document.getElementById("post-date").innerText =
      date.toLocaleDateString();

    document.getElementById("post-content").innerHTML =
      data.content;

  } catch (err) {
    console.error(err);
    alert("게시글을 불러오지 못했습니다.");
  }

});