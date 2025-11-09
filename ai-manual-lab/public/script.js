document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const files = document.getElementById("manualUpload").files;
  if (!files.length) return alert("ファイルを選んでください。");

  const reader = new FileReader();
  reader.onload = async function (e) {
    const base64 = e.target.result.split(",")[1];
    document.getElementById("loading").classList.remove("hidden");

    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64 }),
    });
    const data = await res.json();
    localStorage.setItem("manualText", data.text);
    document.getElementById("loading").classList.add("hidden");
    document.getElementById("chatArea").classList.remove("hidden");
  };
  reader.readAsDataURL(files[0]);
});

document.getElementById("askBtn").addEventListener("click", async () => {
  const q = document.getElementById("userQuestion").value;
  const context = localStorage.getItem("manualText");
  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: q, context }),
  });
  const data = await res.json();

  const log = document.getElementById("chatLog");
  log.innerHTML += `<div class='userQ'>👤 ${q}</div><div class='aiA'>🤖 ${data.answer}</div>`;
  document.getElementById("userQuestion").value = "";
});
