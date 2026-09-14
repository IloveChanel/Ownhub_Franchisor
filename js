/* OwnHub — franchisor control layer for Buscemi's stores */
(function () {
  const STORAGE_KEY = "ownhub.stores.v1";
  const AUTH_KEY = "ownhub.auth.v1";

  const DEMO_OWNER = {
    email: "owner@buscemis.com",
    pin: "2468",
    name: "Tony Buscemi",
    role: "Franchisor"
  };

  const SEED_STORES = [
    { id: "HARRISON-001", name: "Harrison Township", address: "29965 S River Rd, Harrison Twp, MI 48045", phone: "(586) 468-4779", owner: "Michelle Vance", status: "live", opened: "2018-04-12", salesToday: 4280, salesWeek: 27410, openOrders: 3, royaltyDue: 856 },
    { id: "UTICA-014", name: "Utica — Hall Road", address: "45450 Hall Rd, Utica, MI 48317", phone: "(586) 731-2200", owner: "Paul Buscemi Jr.", status: "live", opened: "1972-06-01", salesToday: 6125, salesWeek: 40110, openOrders: 5, royaltyDue: 1225 },
    { id: "ROSEVILLE-008", name: "Roseville — Gratiot", address: "30360 Gratiot Ave, Roseville, MI 48066", phone: "(586) 294-1100", owner: "Nash K.", status: "live", opened: "1994-09-18", salesToday: 3890, salesWeek: 25100, openOrders: 2, royaltyDue: 778 },
    { id: "EASTPOINTE-001", name: "Eastpointe — Original", address: "Gratiot & Toepfer, Eastpointe, MI 48021", phone: "(586) 775-0100", owner: "Family Trust", status: "live", opened: "1956-03-01", salesToday: 2740, salesWeek: 18840, openOrders: 1, royaltyDue: 548 },
    { id: "WARREN-022", name: "Warren", address: "28700 Van Dyke, Warren, MI 48093", phone: "(586) 573-4411", owner: "Lena Romano", status: "live", opened: "2003-11-02", salesToday: 3310, salesWeek: 22005, openOrders: 4, royaltyDue: 662 },
    { id: "STERLING-031", name: "Sterling Heights", address: "13800 15 Mile Rd, Sterling Heights, MI 48312", phone: "(586) 268-9090", owner: "Chris D'Angelo", status: "onboarding", opened: "2026-08-20", salesToday: 0, salesWeek: 1240, openOrders: 0, royaltyDue: 0 },
    { id: "CLINTON-019", name: "Clinton Township", address: "41800 Groesbeck Hwy, Clinton Twp, MI 48036", phone: "(586) 463-2200", owner: "Angela Reyes", status: "live", opened: "2008-05-14", salesToday: 2975, salesWeek: 19660, openOrders: 2, royaltyDue: 595 },
    { id: "MACOMB-044", name: "Macomb Township", address: "21700 21 Mile Rd, Macomb, MI 48044", phone: "(586) 992-1800", owner: "James Kowalski", status: "offline", opened: "2016-02-09", salesToday: 0, salesWeek: 8420, openOrders: 0, royaltyDue: 168 }
  ];

  const SEED_ORDERS = {
    "HARRISON-001": [
      { id: 1042, customer: "Michelle Vance", fulfill: "pickup", time: "6:14 PM", date: "2026-09-14", items: [{ name: "2× Detroit Style Pizza", mods: ["Extra cheese", "sauce", "light pepperoni"] }, { name: "1× Chicken Tenders", mods: ["Ranch"] }], total: 58.97, status: "open", phone: "(586) 555-0142", address: null, email: "mvance@email.com", subscribed: true },
      { id: 1043, customer: "James Kowalski", fulfill: "delivery", time: "6:02 PM", date: "2026-09-14", items: [{ name: "1× The Torpedo 12\"", mods: ["No banana peppers"] }, { name: "1× Square Cheese Tray", mods: [] }], total: 26.98, status: "printed", phone: "(586) 555-0198", address: "214 Jefferson Cir", email: "", subscribed: false },
      { id: 1044, customer: "Angela Reyes", fulfill: "pickup", time: "5:41 PM", date: "2026-09-14", items: [{ name: "1× Detroit Style Pizza", mods: ["Extra sauce"] }, { name: "2× Mozzarella Sticks", mods: [] }], total: 35.97, status: "fulfilled", phone: "(586) 555-0173", address: null, email: "", subscribed: false },
      { id: 1045, customer: "Tom Bishara", fulfill: "delivery", time: "5:28 PM", date: "2026-09-14", items: [{ name: "3× Detroit Style Pizza", mods: ["1 plain", "2 extra cheese + sauce"] }], total: 74.97, status: "open", phone: "(586) 555-0121", address: "88 Crocker Blvd", email: "", subscribed: true },
      { id: 1046, customer: "Priya Nair", fulfill: "pickup", time: "4:55 PM", date: "2026-09-14", items: [{ name: "1× The Torpedo 12\"", mods: ["Extra oregano salt"] }, { name: "1× Chicken Wings", mods: ["Buffalo"] }], total: 20.98, status: "fulfilled", phone: "(586) 555-0165", address: null, email: "priyan@email.com", subscribed: true },
      { id: 1047, customer: "Dave Okafor", fulfill: "pickup", time: "4:22 PM", date: "2026-09-14", items: [{ name: "2× Square Cheese Tray", mods: ["Extra cheese on one"] }], total: 29.98, status: "printed", phone: "(586) 555-0110", address: null, email: "", subscribed: false }
    ]
  };

  function money(n) {
    return "$" + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  function money2(n) {
    return "$" + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function loadStores() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_STORES));
    return SEED_STORES.slice();
  }

  function saveStores(stores) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stores));
  }

  function isAuthed() {
    try {
      const a = JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
      return a && a.ok === true;
    } catch (e) { return false; }
  }

  function requireAuth() {
    if (!isAuthed()) {
      location.href = "index.html";
      return false;
    }
    return true;
  }

  function login(email, pin) {
    const e = (email || "").trim().toLowerCase();
    const p = String(pin || "").trim();
    const ok = (e === DEMO_OWNER.email && p === DEMO_OWNER.pin) || (e.length > 3 && p === DEMO_OWNER.pin);
    if (!ok) return false;
    localStorage.setItem(AUTH_KEY, JSON.stringify({ ok: true, email: e || DEMO_OWNER.email, name: DEMO_OWNER.name, at: Date.now() }));
    return true;
  }

  function logout() {
    localStorage.removeItem(AUTH_KEY);
    location.href = "index.html";
  }

  function generateStoreId(name) {
    const base = (name || "STORE").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10) || "STORE";
    const n = 1000 + Math.floor(Math.random() * 9000);
    return base + "-" + n;
  }

  function qs(name) {
    return new URLSearchParams(location.search).get(name);
  }

  function findStore(id) {
    return loadStores().find(s => s.id === id);
  }

  function toast(msg) {
    let t = document.getElementById("toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.display = "block";
    clearTimeout(t._h);
    t._h = setTimeout(() => { t.style.display = "none"; }, 2400);
  }

  function header(active) {
    const auth = JSON.parse(localStorage.getItem(AUTH_KEY) || "{}");
    return `
      <header class="app-header">
        <div class="brand">
          <span class="logo-script">Buscemi's</span>
          <span class="hub-tag">OwnHub</span>
        </div>
        <div class="header-right">
          <span class="status-live"><span class="dot"></span> Network live</span>
          <span>${auth.name || "Owner"}</span>
          <button class="logout-btn" onclick="OwnHub.logout()">Log Out</button>
        </div>
      </header>
      <nav class="admin-nav">
        <a href="dashboard.html" class="${active === "dashboard" ? "active" : ""}">All Stores</a>
        <a href="stores.html" class="${active === "stores" ? "active" : ""}">Active Stores</a>
        <a href="add-store.html" class="${active === "add" ? "active" : ""}">Add / Upload Stores</a>
        <a href="accounting.html" class="${active === "accounting" ? "active" : ""}">Accounting</a>
      </nav>`;
  }

  function storeHeader(store, active) {
    const id = encodeURIComponent(store.id);
    const name = encodeURIComponent(store.name);
    return `
      <div class="store-banner">
        <span>Viewing as franchisee — ${store.name} · ${store.id}</span>
        <a href="dashboard.html">← Back to OwnHub</a>
      </div>
      <header class="dash-header">
        <div class="store-title">
          <strong style="font-family:Fredoka,sans-serif;font-size:22px">${store.name}</strong>
          <small>Store ID: ${store.id}</small>
        </div>
        <div class="header-right">
          <span class="status-live"><span class="dot"></span> ${store.status === "live" ? "Live" : store.status}</span>
          <button class="logout-btn" onclick="location.href='dashboard.html'">Leave Store</button>
        </div>
      </header>
      <nav class="admin-nav">
        <a href="store.html?id=${id}&name=${name}" class="${active === "orders" ? "active" : ""}">Orders</a>
        <a href="store-menu.html?id=${id}&name=${name}" class="${active === "menu" ? "active" : ""}">Menu Items</a>
        <a href="store-export.html?id=${id}&name=${name}" class="${active === "export" ? "active" : ""}">Export / Accounting</a>
      </nav>`;
  }

  function ordersFor(storeId) {
    const key = "ownhub.orders." + storeId;
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    const seed = (SEED_ORDERS[storeId] || SEED_ORDERS["HARRISON-001"]).map(o => Object.assign({}, o, { items: o.items.map(i => Object.assign({}, i, { mods: i.mods.slice() })) }));
    if (!SEED_ORDERS[storeId]) {
      seed.forEach((o, i) => { o.id = 2000 + i; o.customer = o.customer; });
    }
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }

  function saveOrders(storeId, orders) {
    localStorage.setItem("ownhub.orders." + storeId, JSON.stringify(orders));
  }

  window.OwnHub = {
    DEMO_OWNER, SEED_STORES,
    money, money2, loadStores, saveStores, isAuthed, requireAuth,
    login, logout, generateStoreId, qs, findStore, toast, header, storeHeader,
    ordersFor, saveOrders
  };
})();
