const websites = [
  { name: "mhmd.be", url: "https://mhmd.be" }
];

const tbody = document.getElementById("status-body");

function createRow(site, i) {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>
      <a href="${site.url}" target="_blank">
        ${site.name}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
          <path d="M384 64C366.3 64 352 78.3 352 96C352 113.7 366.3 128 384 128L466.7 128L265.3 329.4C252.8 341.9 252.8 362.2 265.3 374.7C277.8 387.2 298.1 387.2 310.6 374.7L512 173.3L512 256C512 273.7 526.3 288 544 288C561.7 288 576 273.7 576 256L576 96C576 78.3 561.7 64 544 64L384 64z"/>
        </svg>
      </a>
    </td>
    <td id="status-${i}" class="checking">checking...</td>
  `;

  tbody.appendChild(row);
}

async function checkWebsite(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    await fetch(url, {
      method: "GET",
      mode: "no-cors",
      cache: "no-store",
      signal: controller.signal
    });

    clearTimeout(timeout);

    // NOTE:
    // We cannot truly verify content in browser-only mode
    return true;

  } catch (e) {
    return false;
  }
}

async function updateStatuses() {
  for (let i = 0; i < websites.length; i++) {
    const site = websites[i];
    const cell = document.getElementById(`status-${i}`);

    cell.textContent = "checking...";
    cell.className = "checking";

    const ok = await checkWebsite(site.url);

    if (ok) {
      cell.textContent = "UP";
      cell.className = "up";
    } else {
      cell.textContent = "DOWN";
      cell.className = "down";
    }
  }
}

// safer loop (no overlap)
async function loop() {
  await updateStatuses();
  setTimeout(loop, 30000);
}

function init() {
  websites.forEach((site, i) => createRow(site, i));
  loop();
}

init();
