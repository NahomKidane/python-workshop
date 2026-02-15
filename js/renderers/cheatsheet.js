/* ==========================================================================
   renderers/cheatsheet.js — Cheat Sheet tab renderer
   Depends on: utils.js, data/cheatsheet.js
   ========================================================================== */

import { CHEATSHEET } from "../data/cheatsheet.js";
import { escapeHtml } from "../utils.js";

export function renderCheatSheet() {
  const panel = document.getElementById("contentPanel");

  let html = `<div class="cheat-sections">`;

  for (const section of CHEATSHEET) {
    html += `
      <div class="cheat-section">
        <h3 class="cheat-section-title">${section.icon} ${section.title}</h3>
        <div class="cheat-rows">`;

    for (const row of section.rows) {
      html += `
          <div class="cheat-row">
            <code class="cheat-code">${escapeHtml(row.code)}</code>
            <span class="cheat-desc">${row.desc}</span>
          </div>`;
    }

    html += `
        </div>
      </div>`;
  }

  html += `</div>`;
  panel.innerHTML = html;
}
