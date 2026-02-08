const API_BASE = "";

function setMsg(text) {
  const el = document.getElementById("msg");
  if (el) el.textContent = text || "";
}

function saveToken(token) {
  localStorage.setItem("token", token);
}

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  // делаем ошибки “читаемыми”
  if (!res.ok) {
    const msg = data?.details?.length
      ? `${data.error}: ${data.details.join(", ")}`
      : (data.error || "Request failed");
    throw new Error(msg);
  }
  return data;
}

// простая front-end валидация (чтобы было “понятно” пользователю)
function isEmailValid(email) {
  return typeof email === "string" && email.includes("@") && email.includes(".");
}

window.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        const username = document.getElementById("r_username").value.trim();
        const email = document.getElementById("r_email").value.trim();
        const password = document.getElementById("r_password").value;

        if (!username) return setMsg("Username is required");
        if (!isEmailValid(email)) return setMsg("Please enter a valid email");
        if (password.length < 6) return setMsg("Password must be at least 6 characters");

        const data = await api("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({ username, email, password })
        });

        saveToken(data.token);
        setMsg("Registered Token saved. Open App.");
      } catch (err) {
        setMsg(err.message);
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        const email = document.getElementById("l_email").value.trim();
        const password = document.getElementById("l_password").value;

        if (!isEmailValid(email)) return setMsg("Please enter a valid email");
        if (!password) return setMsg("Password is required");

        const data = await api("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password })
        });

        saveToken(data.token);
        setMsg("Logged in Token saved. Open App.");
      } catch (err) {
        setMsg(err.message);
      }
    });
  }
});
