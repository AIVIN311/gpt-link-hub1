function addLink() {
  const title = document.getElementById("titleInput").value;
  const link = document.getElementById("linkInput").value;

  if (!title || !link) {
    alert("請輸入標題和連結");
    return;
  }

  const card = document.createElement("div");
  card.className = "link-card";
  card.innerHTML = `
    <strong>${title}</strong><br>
    <input type="text" value="${link}" readonly style="width: 100%">
    <button onclick="copyLink(this)">複製連結</button>
  `;

  document.getElementById("linkContainer").appendChild(card);

  // 清空欄位
  document.getElementById("titleInput").value = "";
  document.getElementById("linkInput").value = "";
}

function copyLink(button) {
  const input = button.previousElementSibling;
  input.select();
  document.execCommand("copy");
  alert("已複製連結！");
}
