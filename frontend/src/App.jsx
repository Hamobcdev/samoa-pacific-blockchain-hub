import { useState, useEffect, useCallback } from "react";

// ── Mock blockchain state (simulates live Polygon Amoy contract reads) ──────
// In production: replace with ethers.js calls to deployed contracts
const MOCK_MINISTRIES = [
  { code: "CBS",       name: "Central Bank of Samoa",                     records: 12, color: "#1A3A5C", icon: "🏦" },
  { code: "MCIT",      name: "Ministry of Communications & IT",           records: 8,  color: "#2E5F8A", icon: "💻" },
  { code: "MOF",       name: "Ministry of Finance",                       records: 15, color: "#1A5C3A", icon: "📊" },
  { code: "EDUCATION", name: "Ministry of Education",                     records: 23, color: "#5C1A3A", icon: "📚" },
  { code: "MCIL",      name: "Ministry of Commerce, Industry & Labour",   records: 6,  color: "#5C4A1A", icon: "🏭" },
  { code: "CUSTOMS",   name: "Ministry of Customs & Revenue",             records: 19, color: "#3A1A5C", icon: "🛃" },
];

const MOCK_GRANT = {
  id: 0,
  title: "UNICEF Samoa Education Access Programme 2025",
  donor: "UNICEF",
  recipient: "Ministry of Education",
  total: 100000,
  sector: "EDUCATION",
  targetBeneficiaries: 50,
  actualBeneficiaries: 18,
  tranches: [
    { id: 0, milestone: "Programme setup & capacity training complete",           amount: 30000, status: "Verified",  evidence: "QmX7...IPFS", beneficiaries: 0,  releasedAt: "2025-01-15", verifiedAt: "2025-02-01" },
    { id: 1, milestone: "50 children enrolled with verified attendance records",  amount: 40000, status: "Released",  evidence: null,           beneficiaries: 18, releasedAt: "2025-03-01", verifiedAt: null },
    { id: 2, milestone: "End-of-term outcomes documented and verified",           amount: 30000, status: "Pending",   evidence: null,           beneficiaries: 0,  releasedAt: null,         verifiedAt: null },
  ]
};

const MOCK_WORKFLOWS = [
  { id: 0, type: "ENROLMENT_AND_BENEFIT", citizen: "0xC7F3...4A2B", success: true,  ts: "2025-03-01 09:14:22", ministries: ["NDIDS", "EDUCATION", "MOF"] },
  { id: 1, type: "ENROLMENT_AND_BENEFIT", citizen: "0xA1D2...9C3E", success: true,  ts: "2025-03-01 09:17:05", ministries: ["NDIDS", "EDUCATION", "MOF"] },
  { id: 2, type: "ENROLMENT_AND_BENEFIT", citizen: "0xB8E4...2F1A", success: false, ts: "2025-03-01 09:20:11", ministries: ["NDIDS"] },
];

const PERMISSIONS = [
  { from: "EDUCATION", to: "MOF",   grantedAt: "2025-01-10" },
  { from: "CBS",       to: "MOF",   grantedAt: "2025-01-10" },
  { from: "CUSTOMS",   to: "MCIL",  grantedAt: "2025-01-10" },
  { from: "CBS",       to: "MCIT",  grantedAt: "2025-01-10" },
];

// ── Colour helpers ───────────────────────────────────────────────────────────
const STATUS_COLOURS = {
  Verified: { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
  Released: { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" },
  Pending:  { bg: "#f3f4f6", text: "#6b7280", dot: "#9ca3af" },
};

// ── Sub-components ───────────────────────────────────────────────────────────

function Header() {
  return (
    <div style={{ background: "linear-gradient(135deg, #1A3A5C 0%, #2E5F8A 100%)", color: "#fff", padding: "24px 32px", borderBottom: "4px solid #C8942A" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
        <div style={{ fontSize: 36 }}>🏝️</div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 0.5 }}>Samoa Pacific Blockchain Hub</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>Government Services Interoperability — Proof of Concept</div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ background: "#C8942A", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>🔴 LIVE — Polygon Amoy Testnet</div>
          <div style={{ fontSize: 11, opacity: 0.7 }}>UNICEF Venture Fund PoC · Synergy Blockchain Pacific</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 24, marginTop: 12 }}>
        {[
          ["6", "Ministry Nodes"],
          ["83", "Citizens Registered"],
          ["4", "Cross-Ministry Permissions"],
          ["$70K", "Aid Disbursed"],
        ].map(([val, label]) => (
          <div key={label} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: "8px 16px", minWidth: 90 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#C8942A" }}>{val}</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabBar({ active, setActive }) {
  const tabs = [
    { id: "network",   label: "Ministry Network",     icon: "🕸️" },
    { id: "aid",       label: "AID Tracker",          icon: "💰" },
    { id: "workflows", label: "Workflow Log",          icon: "⚡" },
    { id: "ndids",     label: "NDIDS Demo",            icon: "🪪" },
  ];
  return (
    <div style={{ display: "flex", borderBottom: "2px solid #e5e7eb", background: "#f9fafb", padding: "0 24px" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setActive(t.id)}
          style={{ padding: "14px 20px", border: "none", background: "none", cursor: "pointer", fontSize: 14, fontWeight: active === t.id ? 700 : 400,
            color: active === t.id ? "#1A3A5C" : "#6b7280", borderBottom: active === t.id ? "3px solid #C8942A" : "3px solid transparent",
            marginBottom: -2, display: "flex", alignItems: "center", gap: 6 }}>
          {t.icon} {t.label}
        </button>
      ))}
    </div>
  );
}

// Ministry Network Tab
function MinistryNetwork() {
  const [selected, setSelected] = useState(null);
  const sel = selected ? MOCK_MINISTRIES.find(m => m.code === selected) : null;

  return (
    <div style={{ display: "flex", gap: 24, padding: 24 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, color: "#1A3A5C" }}>🏛️ Permissioned Ministry Nodes</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          {MOCK_MINISTRIES.map(m => (
            <div key={m.code} onClick={() => setSelected(selected === m.code ? null : m.code)}
              style={{ border: `2px solid ${selected === m.code ? "#C8942A" : "#e5e7eb"}`, borderRadius: 12, padding: 16,
                cursor: "pointer", background: selected === m.code ? "#FFFDF5" : "#fff",
                transition: "all 0.15s", boxShadow: selected === m.code ? "0 0 0 3px rgba(200,148,42,0.2)" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 26 }}>{m.icon}</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: m.color, textTransform: "uppercase", letterSpacing: 1 }}>{m.code}</div>
                  <div style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>{m.name}</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6b7280" }}>
                <span>📝 {m.records} records</span>
                <span style={{ color: "#10b981", fontWeight: 600 }}>● Active</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "#f0f4ff", borderRadius: 12, padding: 16, border: "1px solid #c7d2fe" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1A3A5C", marginBottom: 12 }}>🔗 Cross-Ministry Read Permissions</div>
          {PERMISSIONS.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 13 }}>
              <span style={{ background: "#1A3A5C", color: "#fff", borderRadius: 6, padding: "2px 8px", fontWeight: 700, fontSize: 11 }}>{p.from}</span>
              <span style={{ color: "#10b981", fontWeight: 700 }}>→ READ →</span>
              <span style={{ background: "#2E5F8A", color: "#fff", borderRadius: 6, padding: "2px 8px", fontWeight: 700, fontSize: 11 }}>{p.to}</span>
              <span style={{ color: "#9ca3af", fontSize: 11, marginLeft: "auto" }}>granted {p.grantedAt}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ width: 320 }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, color: "#1A3A5C" }}>🔍 Ministry Details</div>
        {sel ? (
          <div style={{ border: "2px solid #C8942A", borderRadius: 12, padding: 20, background: "#FFFDF5" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{sel.icon}</div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#1A3A5C", marginBottom: 4 }}>{sel.name}</div>
            <div style={{ fontSize: 12, color: "#C8942A", fontWeight: 700, marginBottom: 16 }}>{sel.code} · Polygon Amoy</div>
            {[
              ["Contract", "0x" + sel.code.padEnd(40, "a").slice(0, 40) + "..."],
              ["Records on-chain", sel.records],
              ["Status", "Active"],
              ["NDIDS Connected", "Yes"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f3f4f6", fontSize: 13 }}>
                <span style={{ color: "#6b7280" }}>{k}</span>
                <span style={{ fontWeight: 600, color: "#111", fontFamily: k === "Contract" ? "monospace" : "inherit", fontSize: k === "Contract" ? 11 : 13 }}>{v.toString()}</span>
              </div>
            ))}
            <div style={{ marginTop: 16, fontSize: 12, color: "#6b7280", background: "#f3f4f6", borderRadius: 8, padding: 10 }}>
              🔒 Data is stored as hashed records. No personally identifiable information is held on-chain.
            </div>
          </div>
        ) : (
          <div style={{ border: "2px dashed #e5e7eb", borderRadius: 12, padding: 32, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
            Click a ministry node to view details
          </div>
        )}

        <div style={{ marginTop: 16, background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 12, padding: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "#065f46", marginBottom: 6 }}>✅ Permissioned Architecture</div>
          <div style={{ fontSize: 12, color: "#047857", lineHeight: 1.6 }}>
            Each ministry owns its data. Cross-ministry reads require explicit permission grants — recorded immutably on-chain. No central database. No single point of failure.
          </div>
        </div>
      </div>
    </div>
  );
}

// AID Disbursement Tracker Tab
function AIDTracker() {
  const g = MOCK_GRANT;
  const totalReleased = g.tranches.filter(t => t.status !== "Pending").reduce((s, t) => s + t.amount, 0);
  const totalVerified = g.tranches.filter(t => t.status === "Verified").reduce((s, t) => s + t.amount, 0);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Grant",       val: `$${g.total.toLocaleString()}`,         bg: "#eff6ff", border: "#93c5fd", text: "#1e40af" },
          { label: "Released",          val: `$${totalReleased.toLocaleString()}`,   bg: "#dbeafe", border: "#60a5fa", text: "#1d4ed8" },
          { label: "Verified to Beneficiaries", val: `$${totalVerified.toLocaleString()}`, bg: "#d1fae5", border: "#6ee7b7", text: "#065f46" },
          { label: "Children Served",   val: g.actualBeneficiaries,                  bg: "#fef3c7", border: "#fcd34d", text: "#92400e" },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.text }}>{s.val}</div>
            <div style={{ fontSize: 12, color: s.text, opacity: 0.8, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ background: "#1A3A5C", color: "#fff", padding: "14px 20px" }}>
          <div style={{ fontWeight: 800, fontSize: 15 }}>📋 {g.title}</div>
          <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>Donor: {g.donor} · Recipient: {g.recipient} · Sector: {g.sector}</div>
        </div>
        <div style={{ padding: "0 20px 20px" }}>
          {g.tranches.map((t, i) => {
            const sc = STATUS_COLOURS[t.status];
            return (
              <div key={t.id} style={{ padding: "18px 0", borderBottom: i < g.tranches.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: sc.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>
                    {t.status === "Verified" ? "✅" : t.status === "Released" ? "🔵" : "⏳"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>Tranche {i + 1}: ${t.amount.toLocaleString()}</div>
                      <span style={{ background: sc.bg, color: sc.text, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>{t.status}</span>
                    </div>
                    <div style={{ fontSize: 13, color: "#374151", marginBottom: 8 }}>{t.milestone}</div>
                    <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#6b7280" }}>
                      {t.releasedAt && <span>📅 Released: {t.releasedAt}</span>}
                      {t.verifiedAt && <span>✓ Verified: {t.verifiedAt}</span>}
                      {t.evidence   && <span style={{ fontFamily: "monospace", background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>IPFS: {t.evidence}</span>}
                      {t.beneficiaries > 0 && <span>👨‍👩‍👧‍👦 {t.beneficiaries} beneficiaries</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ background: "#1A3A5C", color: "#fff", borderRadius: 12, padding: 16, fontSize: 13, lineHeight: 1.8 }}>
        <div style={{ fontWeight: 700, marginBottom: 6, color: "#C8942A" }}>🔍 How This Works</div>
        Every funding milestone is recorded immutably on Polygon. Evidence hashes (stored on IPFS) are cryptographically linked to on-chain verification events. UNICEF, the recipient ministry, and any authorised auditor can verify the full audit trail in real time — no spreadsheets, no manual reconciliation, no opacity.
      </div>
    </div>
  );
}

// Workflow Log Tab
function WorkflowLog() {
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState(MOCK_WORKFLOWS);

  const simulate = useCallback(() => {
    setRunning(true);
    setTimeout(() => {
      const newEntry = {
        id:         log.length,
        type:       "ENROLMENT_AND_BENEFIT",
        citizen:    "0x" + Math.random().toString(16).slice(2, 10).toUpperCase() + "...",
        success:    Math.random() > 0.2,
        ts:         new Date().toLocaleString(),
        ministries: ["NDIDS", "EDUCATION", "MOF"],
      };
      setLog(prev => [newEntry, ...prev]);
      setRunning(false);
    }, 1800);
  }, [log.length]);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: "#1A3A5C" }}>⚡ Cross-Ministry Workflow Execution Log</div>
        <button onClick={simulate} disabled={running}
          style={{ background: running ? "#9ca3af" : "#1A3A5C", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px",
            fontSize: 13, fontWeight: 700, cursor: running ? "not-allowed" : "pointer" }}>
          {running ? "⏳ Executing..." : "▶ Simulate New Workflow"}
        </button>
      </div>

      <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 10, padding: 14, marginBottom: 20, fontSize: 13, color: "#047857" }}>
        <strong>Enrolment & Benefit Workflow:</strong> Citizen presents digital ID → NDIDS verifies identity → Education ministry records enrolment on-chain → MOF automatically records benefit eligibility. All in a single atomic transaction.
      </div>

      {log.map(w => (
        <div key={w.id} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 12, background: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>{w.success ? "✅" : "❌"}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>{w.type.replace(/_/g, " ")}</div>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: "#6b7280" }}>Citizen: {w.citizen}</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#6b7280" }}>{w.ts}</div>
              <span style={{ fontSize: 12, fontWeight: 700, color: w.success ? "#10b981" : "#ef4444" }}>
                {w.success ? "SUCCESS" : "FAILED — ACCESS DENIED"}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
            {w.ministries.map((m, i) => (
              <span key={m} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ background: "#1A3A5C", color: "#fff", borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>{m}</span>
                {i < w.ministries.length - 1 && <span style={{ color: "#10b981", fontWeight: 700 }}>→</span>}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// NDIDS Demo Tab
function NDIDSDemo() {
  const [citizenId, setCitizenId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const verify = () => {
    if (!citizenId.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const found = ["SAMOA-001", "SAMOA-002", "SAMOA-003", "SAMOA-004", "SAMOA-005"].includes(citizenId.toUpperCase());
      setResult({
        found,
        hash: "0x" + [...citizenId].reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0).toString(16).replace("-","").padEnd(64, "a"),
        services: found ? Math.floor(Math.random() * 5) + 1 : 0,
        ministries: found ? ["EDUCATION", "MOF"] : [],
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div style={{ padding: 24, maxWidth: 700 }}>
      <div style={{ fontWeight: 700, fontSize: 16, color: "#1A3A5C", marginBottom: 8 }}>🪪 NDIDS Citizen Verification Demo</div>
      <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20, lineHeight: 1.6 }}>
        The National Digital Identification System (NDIDS) stores only a cryptographic hash of each citizen's identity — no names, no dates of birth, no addresses. Any authorised ministry can verify a citizen's registration without accessing personal data.
      </div>

      <div style={{ background: "#f0f4ff", borderRadius: 12, padding: 20, marginBottom: 20, border: "1px solid #c7d2fe" }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "#1A3A5C" }}>Try a demo citizen ID (SAMOA-001 through SAMOA-005):</div>
        <div style={{ display: "flex", gap: 10 }}>
          <input value={citizenId} onChange={e => setCitizenId(e.target.value)}
            onKeyDown={e => e.key === "Enter" && verify()}
            placeholder="e.g. SAMOA-001"
            style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #c7d2fe", fontSize: 14, fontFamily: "monospace" }} />
          <button onClick={verify} disabled={loading || !citizenId.trim()}
            style={{ background: "#1A3A5C", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            {loading ? "⏳ Verifying..." : "Verify"}
          </button>
        </div>
      </div>

      {result && (
        <div style={{ border: `2px solid ${result.found ? "#10b981" : "#ef4444"}`, borderRadius: 12, padding: 20, background: result.found ? "#f0fdf4" : "#fef2f2" }}>
          <div style={{ fontSize: 20, marginBottom: 12 }}>{result.found ? "✅ Citizen Verified" : "❌ Citizen Not Found"}</div>
          {result.found ? (
            <>
              <div style={{ display: "grid", gap: 10 }}>
                {[
                  ["On-chain hash",       result.hash.slice(0, 20) + "..."],
                  ["Registered",          "Yes — NDIDS Registry"],
                  ["Services accessed",   result.services],
                  ["Authorised ministries", result.ministries.join(", ")],
                  ["Personal data stored", "None — privacy by design"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "8px 0", borderBottom: "1px solid #d1fae5" }}>
                    <span style={{ color: "#047857", fontWeight: 600 }}>{k}</span>
                    <span style={{ fontFamily: k.includes("hash") ? "monospace" : "inherit", fontWeight: 600, color: "#065f46", fontSize: k.includes("hash") ? 11 : 13 }}>{v.toString()}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, background: "#dcfce7", borderRadius: 8, padding: 10, fontSize: 12, color: "#166534" }}>
                🔒 Only the cryptographic hash was queried. Zero personal information was transmitted or stored in this verification.
              </div>
            </>
          ) : (
            <div style={{ fontSize: 13, color: "#991b1b" }}>This citizen ID is not registered in the NDIDS. Try SAMOA-001 through SAMOA-005 for demo data.</div>
          )}
        </div>
      )}

      <div style={{ marginTop: 24, background: "#1A3A5C", color: "#fff", borderRadius: 12, padding: 16, fontSize: 13, lineHeight: 1.8 }}>
        <div style={{ fontWeight: 700, marginBottom: 6, color: "#C8942A" }}>📐 Privacy Architecture</div>
        In production: hash = keccak256(citizenId + off-chain salt). The salt is held by the citizen — meaning no one, not even the NDIDS authority, can reverse-engineer a hash to a real identity without the citizen's cooperation. This is self-sovereign identity.
      </div>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("network");
  const [blockNumber, setBlockNumber] = useState(15482301);

  useEffect(() => {
    const interval = setInterval(() => setBlockNumber(n => n + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", minHeight: "100vh", background: "#f9fafb", color: "#111" }}>
      <Header />
      <div style={{ maxWidth: 1100, margin: "0 auto", background: "#fff", boxShadow: "0 1px 8px rgba(0,0,0,0.07)", minHeight: "calc(100vh - 160px)" }}>
        <TabBar active={tab} setActive={setTab} />
        {tab === "network"   && <MinistryNetwork />}
        {tab === "aid"       && <AIDTracker />}
        {tab === "workflows" && <WorkflowLog />}
        {tab === "ndids"     && <NDIDSDemo />}
      </div>
      <div style={{ textAlign: "center", padding: "16px", fontSize: 11, color: "#9ca3af" }}>
        Block #{blockNumber.toLocaleString()} · Polygon Amoy Testnet · Open Source: github.com/Hamobcdev/samoa-pacific-blockchain-hub · Synergy Blockchain Pacific © 2025
      </div>
    </div>
  );
}
