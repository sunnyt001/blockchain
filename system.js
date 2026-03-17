/**
 * ═══════════════════════════════════════════════════════════
 * IDEX SYSTEM DOCUMENTATION — JavaScript
 * Xử lý các hiệu ứng tương tác cho trang mô tả hệ thống
 * ═══════════════════════════════════════════════════════════
 */

// ── Dữ liệu mô tả kiến trúc hệ thống ──────────────────────
const SYSTEM_DATA = {
  version: "v1.0.0",
  components: [
    {
      id: "auth",
      name: "DID Authentication",
      color: "purple",
      icon: "🔐",
      steps: ["Nhập DID", "Blockchain Lookup", "Sign Challenge", "Verify"],
      desc: "Xác thực phi tập trung 4 bước theo chuẩn W3C DID",
    },
    {
      id: "exchange",
      name: "Exchange View",
      color: "yellow",
      icon: "📊",
      steps: ["Mua/Bán BTC", "Tính toán", "Ký SHA-256", "Vào Queue"],
      desc: "Sàn giao dịch realtime với candlestick chart, order book",
    },
    {
      id: "txqueue",
      name: "TX Selection",
      color: "green",
      icon: "📋",
      steps: ["Nhận TX", "Tick chọn", "Giới hạn 5", "Đẩy vào Block"],
      desc: "Panel lựa chọn giao dịch thủ công, tối đa 5 TX/block",
    },
    {
      id: "mempool",
      name: "Mempool",
      color: "blue",
      icon: "⏳",
      steps: ["Thu nhận TX", "Sắp xếp phí", "Chờ đào", "Xác nhận"],
      desc: "Vùng chứa tạm giao dịch chờ được đào vào block",
    },
    {
      id: "mining",
      name: "Mining Engine",
      color: "green",
      icon: "⛏",
      steps: ["Chọn TX", "Tính Merkle", "PoW nonce", "Block found"],
      desc: "Proof-of-Work, tìm nonce sao cho hash bắt đầu bằng 4 số 0",
    },
    {
      id: "blockchain",
      name: "Blockchain",
      color: "yellow",
      icon: "⛓",
      steps: ["Nhận block", "Xác minh", "Link hash", "Lưu trữ"],
      desc: "Chuỗi block bất biến, mỗi block link với block trước qua prevHash",
    },
  ],

  // Luồng dữ liệu chính
  mainFlow: [
    { label: "USER", color: "purple", text: "DID Login" },
    { label: "EXCHANGE", color: "yellow", text: "Đặt lệnh" },
    { label: "TX QUEUE", color: "green", text: "Lựa chọn" },
    { label: "MEMPOOL", color: "blue", text: "Chờ đào" },
    { label: "MINER", color: "green", text: "Đào block" },
    { label: "CHAIN", color: "yellow", text: "Xác nhận" },
  ],

  // Cấu trúc block
  blockStructure: [
    {
      field: "index",
      type: "number",
      desc: "Số thứ tự block trong chuỗi",
      example: "4",
    },
    {
      field: "timestamp",
      type: "number",
      desc: "Thời điểm tạo block (Unix ms)",
      example: "1714123456789",
    },
    {
      field: "transactions",
      type: "array",
      desc: "Danh sách TX trong block (max 5 + coinbase)",
      example: "[coinbase, tx1, tx2...]",
    },
    {
      field: "previousHash",
      type: "string",
      desc: "SHA-256 hash của block trước",
      example: "0000a3f9...",
    },
    {
      field: "merkleRoot",
      type: "string",
      desc: "Merkle root của tất cả TX",
      example: "b2c8d45e...",
    },
    {
      field: "nonce",
      type: "number",
      desc: "Số tìm được để hash thỏa difficulty",
      example: "284917",
    },
    {
      field: "hash",
      type: "string",
      desc: "SHA-256 hash của block hiện tại",
      example: "0000f9b2...",
    },
    {
      field: "miner",
      type: "string",
      desc: "Địa chỉ ví nhận block reward",
      example: "0x4F3A...8B2C",
    },
  ],

  // Cấu trúc TX
  txStructure: [
    {
      field: "id",
      type: "string",
      desc: "ID ngẫu nhiên định danh TX",
      example: "TX3K9MXYZ",
    },
    {
      field: "type",
      type: "string",
      desc: "Loại giao dịch",
      example: "buy | send | reward",
    },
    {
      field: "from",
      type: "string",
      desc: "Địa chỉ ví người gửi",
      example: "0x4F3A...8B2C",
    },
    {
      field: "to",
      type: "string",
      desc: "Địa chỉ ví người nhận",
      example: "EXCHANGE",
    },
    {
      field: "amount",
      type: "number",
      desc: "Số BTC giao dịch",
      example: "0.15000",
    },
    {
      field: "fee",
      type: "number",
      desc: "Phí giao dịch (BTC)",
      example: "0.0005",
    },
    {
      field: "signature",
      type: "string",
      desc: "SHA-256 chữ ký xác thực TX",
      example: "a3f9b12c...",
    },
    {
      field: "fromExchange",
      type: "boolean",
      desc: "Đánh dấu TX đến từ Exchange view",
      example: "true",
    },
    {
      field: "timestamp",
      type: "number",
      desc: "Thời điểm tạo TX (Unix ms)",
      example: "1714123400000",
    },
  ],

  // Các security layer
  securityLayers: [
    {
      name: "DID Authentication",
      icon: "🔐",
      color: "purple",
      mechanism: "W3C DID + Ed25519",
      desc: "Xác thực danh tính phi tập trung. User chứng minh quyền sở hữu DID bằng cách ký challenge từ server.",
    },
    {
      name: "Digital Signature",
      icon: "✍️",
      color: "blue",
      mechanism: "SHA-256 signing",
      desc: "Mỗi giao dịch đều được ký bằng SHA-256 từ private key trước khi vào mempool.",
    },
    {
      name: "Merkle Tree",
      icon: "🌳",
      color: "green",
      mechanism: "Binary hash tree",
      desc: "Tất cả TX trong block được hash thành Merkle Root. Bất kỳ TX nào bị sửa sẽ thay đổi toàn bộ root.",
    },
    {
      name: "Proof of Work",
      icon: "⛏",
      color: "yellow",
      mechanism: "SHA-256 · 4 zeros prefix",
      desc: 'Miner phải tìm nonce sao cho hash block bắt đầu bằng "0000". Ngăn chặn block giả mạo.',
    },
    {
      name: "Chain Linking",
      icon: "⛓",
      color: "yellow",
      mechanism: "prevHash reference",
      desc: "Mỗi block chứa hash của block trước. Sửa 1 block sẽ làm vỡ toàn bộ chuỗi sau đó.",
    },
  ],
};

// ── Khởi tạo trang ──────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderFlowDiagram();
  renderComponentCards();
  renderBlockTable();
  renderTxTable();
  renderSecurityCards();
  renderMerkleVisual();
  animateStats();
  initScrollSpy();
  initCodeHighlight();
});

// ── Render flow diagram chính ──────────────────────────────
function renderFlowDiagram() {
  const el = document.getElementById("main-flow");
  if (!el) return;

  el.innerHTML = SYSTEM_DATA.mainFlow
    .map((node, i) => {
      const isLast = i === SYSTEM_DATA.mainFlow.length - 1;
      return `
      <div class="flow-node ${node.color}" title="${node.desc || ""}">
        <div style="font-size:8px;opacity:.7;margin-bottom:2px">${node.label}</div>
        ${node.text}
      </div>
      ${!isLast ? '<div class="flow-arrow">→</div>' : ""}
    `;
    })
    .join("");
}

// ── Render component cards ─────────────────────────────────
function renderComponentCards() {
  const el = document.getElementById("component-cards");
  if (!el) return;

  el.innerHTML = SYSTEM_DATA.components
    .map(
      (c) => `
    <div class="doc-card ${c.color}">
      <div class="card-icon">${c.icon}</div>
      <div class="card-title">${c.name}</div>
      <div class="card-desc">${c.desc}</div>
      <div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:4px">
        ${c.steps
          .map(
            (s, i) => `
          <span style="font-family:var(--m);font-size:8px;background:var(--bg3);border:1px solid var(--line2);color:var(--txt3);padding:1px 6px">
            ${i + 1}. ${s}
          </span>
        `,
          )
          .join("")}
      </div>
    </div>
  `,
    )
    .join("");
}

// ── Render Block structure table ───────────────────────────
function renderBlockTable() {
  const el = document.getElementById("block-table-body");
  if (!el) return;

  el.innerHTML = SYSTEM_DATA.blockStructure
    .map(
      (row) => `
    <tr>
      <td><span style="color:var(--b);font-family:var(--m)">${row.field}</span></td>
      <td><span class="card-tag tag-y">${row.type}</span></td>
      <td>${row.desc}</td>
      <td><span style="color:var(--txt3);font-size:10px">${row.example}</span></td>
    </tr>
  `,
    )
    .join("");
}

// ── Render TX structure table ──────────────────────────────
function renderTxTable() {
  const el = document.getElementById("tx-table-body");
  if (!el) return;

  el.innerHTML = SYSTEM_DATA.txStructure
    .map(
      (row) => `
    <tr>
      <td><span style="color:var(--g);font-family:var(--m)">${row.field}</span></td>
      <td><span class="card-tag tag-b">${row.type}</span></td>
      <td>${row.desc}</td>
      <td><span style="color:var(--txt3);font-size:10px">${row.example}</span></td>
    </tr>
  `,
    )
    .join("");
}

// ── Render Security layer cards ────────────────────────────
function renderSecurityCards() {
  const el = document.getElementById("security-cards");
  if (!el) return;

  el.innerHTML = SYSTEM_DATA.securityLayers
    .map(
      (layer, i) => `
    <div class="doc-card ${layer.color}" style="display:flex;gap:12px;align-items:flex-start">
      <div style="font-size:24px;flex-shrink:0">${layer.icon}</div>
      <div>
        <div class="card-title">${layer.name}</div>
        <div style="margin-bottom:6px">
          <span class="card-tag tag-mg">${layer.mechanism}</span>
        </div>
        <div class="card-desc">${layer.desc}</div>
      </div>
      <div style="font-family:var(--m);font-size:20px;font-weight:700;color:var(--line2);flex-shrink:0;margin-left:auto">0${i + 1}</div>
    </div>
  `,
    )
    .join("");
}

// ── Render Merkle Tree visual ──────────────────────────────
function renderMerkleVisual() {
  const el = document.getElementById("merkle-visual");
  if (!el) return;

  el.innerHTML = `
    <div class="mv-level">
      <div class="mv-node root">
        <span class="mv-lbl">MERKLE ROOT</span>
        0000a3f9b12c...
      </div>
    </div>
    <div class="mv-connector">↑ sha256(H12 + H34)</div>
    <div class="mv-level">
      <div class="mv-node branch">
        <span class="mv-lbl">BRANCH H12</span>
        sha256(H1+H2)
      </div>
      <div class="mv-node branch">
        <span class="mv-lbl">BRANCH H34</span>
        sha256(H3+H4)
      </div>
    </div>
    <div class="mv-connector">↑ sha256(TX)</div>
    <div class="mv-level">
      <div class="mv-node leaf">
        <span class="mv-lbl">LEAF — COINBASE</span>
        sha256(reward TX)
      </div>
      <div class="mv-node leaf">
        <span class="mv-lbl">LEAF — TX1</span>
        sha256(buy TX)
      </div>
      <div class="mv-node leaf">
        <span class="mv-lbl">LEAF — TX2</span>
        sha256(send TX)
      </div>
      <div class="mv-node leaf">
        <span class="mv-lbl">LEAF — TX3</span>
        sha256(buy TX)
      </div>
    </div>
    <div style="font-family:var(--m);font-size:9px;color:var(--txt3);margin-top:12px;padding-top:10px;border-top:1px solid var(--line)">
      Nếu TX2 bị sửa → H34 thay đổi → BRANCH thay đổi → MERKLE ROOT thay đổi → Block bị phát hiện giả mạo ✗
    </div>
  `;
}

// ── Animate stats counter ──────────────────────────────────
function animateStats() {
  const targets = [
    { id: "stat-components", end: 6, suffix: "" },
    { id: "stat-tx-max", end: 5, suffix: "/block" },
    { id: "stat-security", end: 5, suffix: " lớp" },
    { id: "stat-difficulty", end: 4, suffix: " zeros" },
  ];

  targets.forEach(({ id, end, suffix }) => {
    const el = document.getElementById(id);
    if (!el) return;
    let current = 0;
    const step = end / 30;
    const interval = setInterval(() => {
      current = Math.min(current + step, end);
      el.textContent = Math.floor(current) + suffix;
      if (current >= end) clearInterval(interval);
    }, 40);
  });
}

// ── Scroll spy cho TOC ─────────────────────────────────────
function initScrollSpy() {
  const sections = document.querySelectorAll(".doc-section[id]");
  const tocLinks = document.querySelectorAll(".toc-list a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          tocLinks.forEach((link) => {
            link.style.color = "";
            if (link.getAttribute("href") === "#" + entry.target.id) {
              link.style.color = "var(--y)";
            }
          });
        }
      });
    },
    { threshold: 0.3 },
  );

  sections.forEach((s) => observer.observe(s));
}

// ── Code syntax highlight (đơn giản) ──────────────────────
function initCodeHighlight() {
  document.querySelectorAll(".code-raw").forEach((el) => {
    let html = el.textContent
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      // strings
      .replace(/"([^"]+)"/g, '<span class="cs">"$1"</span>')
      // keywords
      .replace(
        /\b(const|let|async|await|function|return|if|true|false)\b/g,
        '<span class="ck">$1</span>',
      )
      // comments
      .replace(/(\/\/[^\n]*)/g, '<span class="cc">$1</span>')
      // numbers
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="cn">$1</span>');
    el.innerHTML = html;
    el.classList.remove("code-raw");
  });
}

// ── Smooth scroll cho TOC links ────────────────────────────
document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  e.preventDefault();
  const target = document.querySelector(link.getAttribute("href"));
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});
