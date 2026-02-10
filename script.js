const btn = document.getElementById("generateBtn");
const topicInput = document.getElementById("topic");
const platformSelect = document.getElementById("platform");
const resultBox = document.getElementById("result");
const loadingText = document.getElementById("loading");

btn.addEventListener("click", async () => {
  const topic = topicInput.value.trim();
  const platform = platformSelect.value;

  // validation
  if (!topic) {
    resultBox.innerHTML = "<p>Please enter a topic first.</p>";
    return;
  }

  // UI state
  loadingText.classList.remove("hidden");
  resultBox.innerHTML = "";
  btn.disabled = true;

  try {
    const response = await fetch("/.netlify/functions/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        topic,
        platform
      })
    });

    const data = await response.json();

    loadingText.classList.add("hidden");
    btn.disabled = false;

    if (!data.hooks || data.hooks.length === 0) {
      resultBox.innerHTML = "<p>No hooks generated. Try another topic.</p>";
      return;
    }

    // render hooks
    data.hooks.forEach((hook, index) => {
      const div = document.createElement("div");
      div.className = "hook" + (index === 0 ? " best" : "");
      div.textContent = hook;
      resultBox.appendChild(div);
    });

  } catch (error) {
    loadingText.classList.add("hidden");
    btn.disabled = false;
    resultBox.innerHTML = "<p>Something went wrong. Please try again.</p>";
  }
});
