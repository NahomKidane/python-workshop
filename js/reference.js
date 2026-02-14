/* ==========================================================================
   renderers/reference.js — Reference tab renderer
   Depends on: utils.js, data/reference.js
   ========================================================================== */

function renderReference() {
  const panel = document.getElementById("contentPanel");

  let html = `<div class="ref-grid">`;

  for (const cat of REFERENCE) {
    html += `
      <div class="ref-card">
        <div class="ref-card-header">
          <span class="ref-icon">${cat.icon}</span>
          <span class="ref-title">${cat.title}</span>
        </div>
        <table class="ref-table">`;

    for (const item of cat.items) {
      html += `
          <tr>
            <td class="ref-code"><code>${escapeHtml(item.code)}</code></td>
            <td class="ref-desc">${item.desc}</td>
          </tr>`;
    }

    html += `
        </table>
      </div>`;
  }

  html += `</div>`;
  panel.innerHTML = html;
}
