// ✅ same-origin API (works when frontend is served by Express)
const API_BASE = "";

function $(id) { return document.getElementById(id); }

function setMsg(text) {
  const el = $("msg");
  if (el) el.textContent = text || "";
}

function getToken() {
  return localStorage.getItem("token");
}

function requireAuth() {
  const token = getToken();
  if (!token) {
    // if no token, go back to auth page
    window.location.href = "/";
    return null;
  }
  return token;
}

async function api(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// -------------------- PROFILE --------------------
const btnProfile = $("btnProfile");
if (btnProfile) {
  btnProfile.onclick = async () => {
    try {
      requireAuth();
      const data = await api("/api/users/profile");
      $("profileOut").textContent = JSON.stringify(data, null, 2);
      setMsg("");
    } catch (e) {
      setMsg(e.message);
    }
  };
}

// -------------------- LOGOUT --------------------
const btnLogout = $("btnLogout");
if (btnLogout) {
  btnLogout.onclick = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
}

// -------------------- FAVORITES UI --------------------
async function loadFavorites() {
  requireAuth();
  const { resources } = await api("/api/resource");
  renderFavorites(resources || []);
}

function renderFavorites(items) {
  const root = $("favoritesList");
  if (!root) return;

  if (!items.length) {
    root.innerHTML = `<div class="empty">No favorites yet. Add one above.</div>`;
    return;
  }

  root.innerHTML = items.map(item => {
    const id = escapeHtml(item._id);
    const label = escapeHtml(item.label);
    const city = escapeHtml(item.city);
    const lat = escapeHtml(item.lat);
    const lon = escapeHtml(item.lon);

    return `
      <div class="item" data-id="${id}" data-lat="${lat}" data-lon="${lon}" data-city="${city}">
        <div class="itemMain">
          <div class="itemTitle">${label}</div>
          <div class="itemSub">${city} • ${lat}, ${lon}</div>
        </div>
        <div class="itemActions">
          <button class="btnForecast" data-id="${id}">Forecast</button>
          <button class="btnDelete secondary" data-id="${id}">Delete</button>
        </div>
      </div>
    `;
  }).join("");

  // attach button handlers
  root.querySelectorAll(".btnDelete").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      try {
        await api(`/api/resource/${id}`, { method: "DELETE" });
        setMsg("Deleted ✅");
        await loadFavorites();
      } catch (e) {
        setMsg(e.message);
      }
    });
  });

  root.querySelectorAll(".btnForecast").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const itemEl = root.querySelector(`.item[data-id="${CSS.escape(id)}"]`);
      if (!itemEl) return;

      const lat = itemEl.getAttribute("data-lat");
      const lon = itemEl.getAttribute("data-lon");
      const city = itemEl.getAttribute("data-city");
      await loadForecast(lat, lon, city);
    });
  });
}

async function addFavorite() {
  try {
    requireAuth();

    const label = $("favLabel").value.trim();
    const city = $("favCity").value.trim();
    const lat = Number($("favLat").value);
    const lon = Number($("favLon").value);

    const payload = { label, city, lat, lon };

    const data = await api("/api/resource", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    setMsg("Added ✅");
    // clear inputs
    $("favLabel").value = "";
    $("favCity").value = "";
    $("favLat").value = "";
    $("favLon").value = "";

    await loadFavorites();
    return data;
  } catch (e) {
    setMsg(e.message);
  }
}

const btnAddFav = $("btnAddFav");
if (btnAddFav) btnAddFav.onclick = addFavorite;

const btnReloadFav = $("btnReloadFav");
if (btnReloadFav) btnReloadFav.onclick = async () => {
  try {
    await loadFavorites();
    setMsg("Reloaded ✅");
  } catch (e) {
    setMsg(e.message);
  }
};

// -------------------- FORECAST --------------------
async function loadForecast(lat, lon, cityName = "") {
  try {
    requireAuth();
    $("forecastOut").textContent = "Loading forecast...";
    const data = await api(`/api/weather/forecast?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`);
    // make a small summary (first item in list)
    const f = data.forecast;
    const first = f?.list?.[0];
    const summary = first
      ? {
          city: f.city?.name || cityName,
          time: first.dt_txt,
          tempC: first.main?.temp,
          feelsLikeC: first.main?.feels_like,
          description: first.weather?.[0]?.description
        }
      : { note: "No forecast data" };

    $("forecastOut").textContent =
      "Summary:\n" + JSON.stringify(summary, null, 2) +
      "\n\nRaw response (for debugging):\n" + JSON.stringify(data.forecast, null, 2);

    setMsg("");
  } catch (e) {
    $("forecastOut").textContent = e.message;
    setMsg(e.message);
  }
}

// -------------------- INIT --------------------
(function init() {
  const token = getToken();
  if (!token) {
    // if user opens app.html without login
    window.location.href = "/";
    return;
  }

  // auto-load favorites when app opens
  loadFavorites().catch(() => {});
})();
