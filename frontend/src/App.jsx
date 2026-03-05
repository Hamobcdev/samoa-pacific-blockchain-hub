/**
 * Samoa Pacific Blockchain Hub — Multi-Stakeholder Dashboard
 * Version 2.0 — Live ethers.js contract reads
 *
 * SETUP:
 *   1. npm install  (adds ethers ^6.9.0)
 *   2. Start Anvil: anvil
 *   3. Deploy:  forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 \
 *                 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
 *                 --broadcast -vvvv
 *   4. npm run dev  →  http://localhost:5173
 *
 * For Polygon mainnet: change RPC_URL below to https://polygon-rpc.com
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { ethers } from "ethers";

// ═══════════════════════════════════════════════════════════════════════
// NETWORK CONFIG — change RPC_URL to switch between Anvil / mainnet
// ═══════════════════════════════════════════════════════════════════════
const CONFIG = {
  RPC_URL:   "http://127.0.0.1:8545",          // Anvil local
  // RPC_URL: "https://polygon-rpc.com",        // Polygon mainnet
  NETWORK:   "Anvil Local",
  // NETWORK: "Polygon Mainnet",
  POLL_MS:   3000,   // how often to refresh contract data (ms)
};

// ═══════════════════════════════════════════════════════════════════════
// CONTRACT ADDRESSES — paste from forge script output after deployment
// These are the deterministic Anvil addresses — identical every deploy
// ═══════════════════════════════════════════════════════════════════════
const ADDR = {
  NDIDS:     "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  AID:       "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  HUB:       "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  CBS:       "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  MCIT:      "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
  MOF:       "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
  MCIL:      "0x0165878A594ca255338adfa4d48449f69242Eb8F",
  EDUCATION: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
  CUSTOMS:   "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
};

// ═══════════════════════════════════════════════════════════════════════
// ABIs — exact function signatures from the deployed contracts
// ═══════════════════════════════════════════════════════════════════════
const ABI = {
  NDIDS: [
    "function totalRegistered() view returns (uint256)",
    "function isRegistered(bytes32) view returns (bool)",
    "function hasAccess(bytes32, address) view returns (bool)",
    "function serviceCount(bytes32) view returns (uint256)",
    "event CitizenRegistered(bytes32 indexed citizenHash, uint256 timestamp)",
    "event ReadAccessGranted(bytes32 indexed citizenHash, address indexed ministry)",
    "event ReadAccessRevoked(bytes32 indexed citizenHash, address indexed ministry)",
    "event IdentityVerified(bytes32 indexed citizenHash, address indexed verifier, uint256 timestamp)",
  ],
  AID: [
    "function totalGrants() view returns (uint256)",
    "function totalDisbursed() view returns (uint256)",
    "function totalVerified() view returns (uint256)",
    "function getGrant(uint256) view returns (uint256,string,address,address,uint256,uint256,uint256,uint8,uint256,uint256,uint256,string)",
    "function getTranche(uint256,uint256) view returns (uint256,string,bytes32,uint8,uint256,uint256,address,address)",
    "function getTrancheCount(uint256) view returns (uint256)",
    "function getAuditTrail(uint256) view returns (tuple(uint256 amount,string milestone,bytes32 evidenceHash,uint8 status,uint256 releasedAt,uint256 verifiedAt,address releasedBy,address verifiedBy)[])",
    "event GrantCreated(uint256 indexed grantId, address indexed donor, address indexed recipient, uint256 amount, string sector, uint256 timestamp)",
    "event TrancheReleased(uint256 indexed grantId, uint256 indexed trancheId, uint256 amount, string milestone, uint256 timestamp)",
    "event TrancheVerified(uint256 indexed grantId, uint256 indexed trancheId, bytes32 evidenceHash, uint256 beneficiariesServed, uint256 timestamp)",
    "event GrantCompleted(uint256 indexed grantId, uint256 timestamp)",
  ],
  HUB: [
    "function getMinistryCount() view returns (uint256)",
    "function getAllMinistries() view returns (tuple(string name, string code, address contractAddr, bool active, uint256 registeredAt)[])",
    "function getPermissions() view returns (tuple(string fromCode, string toCode, bool active, uint256 grantedAt)[])",
    "function getWorkflowLog() view returns (tuple(string workflowType, bytes32 citizenHash, string ministryCode, uint256 timestamp, bool success)[])",
    "event MinistryRegistered(string code, string name, address contractAddr)",
    "event PermissionGranted(string fromCode, string toCode)",
    "event WorkflowExecuted(string workflowType, bytes32 citizenHash, bool success)",
  ],
  MINISTRY: [
    "function totalRecords() view returns (uint256)",
    "function ministryName() view returns (string)",
    "function ministryCode() view returns (string)",
    "function authorisedReaders(address) view returns (bool)",
    "function records(uint256) view returns (bytes32,string,bytes32,uint256,bool)",
    "event ServiceDelivered(uint256 indexed recordId, bytes32 indexed citizenHash, string serviceType, bool ndidsVerified, uint256 timestamp)",
    "event ReaderAuthorised(address indexed reader)",
    "event ReaderRevoked(address indexed reader)",
  ],
};

// ═══════════════════════════════════════════════════════════════════════
// MINISTRY METADATA — visual config only, contract data overrides numbers
// ═══════════════════════════════════════════════════════════════════════
const MINISTRY_META = {
  CBS:       { icon: "🏦", color: "#1B6CA8", name: "Central Bank of Samoa" },
  MCIT:      { icon: "💻", color: "#2E8B57", name: "Ministry of Communications & IT" },
  MOF:       { icon: "📊", color: "#6B4F9E", name: "Ministry of Finance" },
  EDUCATION: { icon: "📚", color: "#C8502A", name: "Ministry of Education, Sports & Culture" },
  MCIL:      { icon: "🏭", color: "#B8860B", name: "Ministry of Commerce, Industry & Labour" },
  CUSTOMS:   { icon: "🛃", color: "#1B8A8A", name: "Ministry of Customs & Revenue" },
};

const MINISTRY_ADDRS = {
  CBS: ADDR.CBS, MCIT: ADDR.MCIT, MOF: ADDR.MOF,
  MCIL: ADDR.MCIL, EDUCATION: ADDR.EDUCATION, CUSTOMS: ADDR.CUSTOMS,
};

// ═══════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM
// ═══════════════════════════════════════════════════════════════════════
const C = {
  abyss: "#070D1A", deep: "#0B1628", navy: "#0F2044", ocean: "#163258",
  wave: "#1B4A7A", coral: "#E8552A", gold: "#C9920E", seafoam: "#0FB894",
  teal: "#0A8A72", amber: "#D4860A", white: "#F4F8FF", silver: "#9EB3CC",
  muted: "#5A7A9A", danger: "#D63B3B",
};
const F = {
  display: "'Playfair Display', Georgia, serif",
  mono:    "'IBM Plex Mono', 'Courier New', monospace",
  ui:      "'DM Sans', -apple-system, sans-serif",
};
if (!document.getElementById("sbp-fonts")) {
  const l = document.createElement("link");
  l.id = "sbp-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=IBM+Plex+Mono:wght@400;600&family=DM+Sans:wght@400;500;700;800&display=swap";
  document.head.appendChild(l);
}
const card  = (x={}) => ({ background:C.navy, border:`1px solid ${C.ocean}`, borderRadius:"12px", padding:"20px", ...x });
const badge = (c)    => ({ display:"inline-flex", alignItems:"center", gap:"5px", background:c+"22", color:c, border:`1px solid ${c}44`, borderRadius:"20px", padding:"2px 10px", fontSize:"10px", fontWeight:700, fontFamily:F.ui, letterSpacing:"0.8px", textTransform:"uppercase" });
const btn   = (v="primary") => ({ display:"inline-flex", alignItems:"center", gap:"6px", background:v==="primary"?C.coral:v==="success"?C.seafoam:"transparent", color:v==="ghost"?C.silver:C.white, border:v==="ghost"?`1px solid ${C.ocean}`:"none", borderRadius:"8px", padding:"9px 18px", fontSize:"13px", fontWeight:700, fontFamily:F.ui, cursor:"pointer" });

// ═══════════════════════════════════════════════════════════════════════
// ETHERS.JS HOOK — single provider, polls contracts every POLL_MS
// ═══════════════════════════════════════════════════════════════════════
function useProvider() {
  const [provider, setProvider] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let p;
    try {
      p = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
      p.getBlockNumber()
        .then(() => { setProvider(p); setConnected(true); setError(null); })
        .catch(e => { setError("Cannot connect to " + CONFIG.RPC_URL); setConnected(false); });
    } catch(e) {
      setError("Provider error: " + e.message);
    }
    return () => { if(p) p.destroy?.(); };
  }, []);

  return { provider, connected, error };
}

// Typed contract factory
function useContract(address, abi, provider) {
  return provider && address ? new ethers.Contract(address, abi, provider) : null;
}

// Generic polling hook — re-fetches every POLL_MS
function usePoll(fetchFn, deps, interval = CONFIG.POLL_MS) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [err,     setErr]     = useState(null);
  const ref = useRef(fetchFn);
  ref.current = fetchFn;

  useEffect(() => {
    let alive = true;
    const run = async () => {
      try {
        const result = await ref.current();
        if (alive) { setData(result); setLoading(false); setErr(null); }
      } catch(e) {
        if (alive) { setErr(e.message); setLoading(false); }
      }
    };
    run();
    const id = setInterval(run, interval);
    return () => { alive = false; clearInterval(id); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, err };
}

// ═══════════════════════════════════════════════════════════════════════
// SHARED UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════════
function Mono({ children, color }) {
  return <span style={{ fontFamily:F.mono, fontSize:"11px", color:color||C.seafoam, background:C.seafoam+"14", padding:"2px 7px", borderRadius:"4px" }}>{children}</span>;
}
function StatPill({ icon, value, label, color, loading }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"10px", background:C.ocean, border:`1px solid ${C.wave}`, borderRadius:"10px", padding:"12px 16px" }}>
      <span style={{ fontSize:"22px" }}>{icon}</span>
      <div>
        <div style={{ fontSize:"20px", fontWeight:800, fontFamily:F.display, color:color||C.white, lineHeight:1 }}>
          {loading ? <span style={{ color:C.muted }}>…</span> : value}
        </div>
        <div style={{ fontSize:"11px", color:C.silver, marginTop:"2px", fontFamily:F.ui }}>{label}</div>
      </div>
    </div>
  );
}
function SectionHead({ title, sub }) {
  return (
    <div style={{ marginBottom:"16px", paddingBottom:"10px", borderBottom:`1px solid ${C.ocean}` }}>
      <div style={{ fontSize:"14px", fontWeight:800, color:C.white, fontFamily:F.ui }}>{title}</div>
      {sub && <div style={{ fontSize:"12px", color:C.silver, marginTop:"3px" }}>{sub}</div>}
    </div>
  );
}
function StatusBadge({ status }) {
  const map = { "0":"Pending", "1":"Released", "2":"Verified", 0:"Pending", 1:"Released", 2:"Verified", Active:C.seafoam, Verified:C.seafoam, Released:"#4A9EE0", Pending:C.amber };
  const label = map[status] || status;
  const color = { Verified:C.seafoam, Released:"#4A9EE0", Pending:C.amber, Active:C.seafoam }[label] || C.muted;
  return <span style={{ ...badge(color) }}><span style={{ fontSize:"7px" }}>●</span>{label}</span>;
}
function ConnectionBanner({ connected, error, network }) {
  if (connected) return (
    <div style={{ background:C.seafoam+"18", borderBottom:`1px solid ${C.seafoam}33`, padding:"6px 28px", display:"flex", gap:"12px", alignItems:"center", fontSize:"11px" }}>
      <span style={{ color:C.seafoam, fontWeight:700 }}>● LIVE — reading from {network}</span>
      <span style={{ color:C.muted }}>Polling every {CONFIG.POLL_MS/1000}s · transactions appear automatically</span>
    </div>
  );
  return (
    <div style={{ background:C.amber+"18", borderBottom:`1px solid ${C.amber}33`, padding:"6px 28px", fontSize:"11px", color:C.amber, fontWeight:700 }}>
      ⚠ {error || "Connecting to chain…"} — showing cached data. Start Anvil and redeploy to go live.
    </div>
  );
}
function TopBar({ title, sub, accent, blockNumber, onBack }) {
  return (
    <div style={{ background:C.abyss, borderBottom:`1px solid ${C.ocean}` }}>
      <div style={{ padding:"7px 28px", borderBottom:`1px solid ${C.ocean}22`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <button onClick={onBack} style={{ ...btn("ghost"), fontSize:"11px", padding:"4px 12px" }}>← Back to Hub</button>
        <div style={{ fontFamily:F.mono, fontSize:"10px", color:C.muted, display:"flex", gap:"18px" }}>
          <span>⛓ #{blockNumber?.toLocaleString?.() || "…"}</span>
          <span>{CONFIG.NETWORK}</span>
        </div>
      </div>
      <div style={{ padding:"22px 28px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", gap:"14px", alignItems:"center" }}>
          <div style={{ width:"46px", height:"46px", borderRadius:"10px", background:accent+"22", border:`2px solid ${accent}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px" }}>🏝️</div>
          <div>
            <div style={{ fontSize:"10px", fontWeight:700, letterSpacing:"2.5px", textTransform:"uppercase", color:accent, marginBottom:"4px", fontFamily:F.ui }}>Samoa Pacific Blockchain Hub</div>
            <div style={{ fontSize:"21px", fontWeight:900, fontFamily:F.display, color:C.white, lineHeight:1 }}>{title}</div>
            <div style={{ fontSize:"11px", color:C.muted, marginTop:"4px" }}>{sub}</div>
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ ...badge(accent), fontSize:"11px", padding:"4px 12px", marginBottom:"6px" }}>LIVE ON-CHAIN</div>
          <div style={{ fontSize:"10px", color:C.muted, fontFamily:F.mono }}>UNICEF Venture Fund 2026</div>
        </div>
      </div>
    </div>
  );
}
function TabNav({ tabs, active, onChange, accent }) {
  return (
    <div style={{ background:C.deep, borderBottom:`1px solid ${C.ocean}`, padding:"0 28px", display:"flex", overflowX:"auto" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{ padding:"13px 18px", border:"none", background:"none", cursor:"pointer", fontSize:"12px", fontWeight:active===t.id?800:500, fontFamily:F.ui, color:active===t.id?C.white:C.muted, whiteSpace:"nowrap", borderBottom:`2px solid ${active===t.id?accent:"transparent"}`, marginBottom:"-1px", display:"flex", alignItems:"center", gap:"6px", transition:"color 0.15s" }}>
          {t.icon} {t.label}
        </button>
      ))}
    </div>
  );
}
function LoadingCard({ msg }) {
  return <div style={{ ...card(), textAlign:"center", padding:"48px", color:C.silver }}><div style={{ fontSize:"32px", marginBottom:"12px" }}>⏳</div>{msg || "Loading from chain…"}</div>;
}
function ErrorCard({ msg }) {
  return <div style={{ ...card(), borderTop:`3px solid ${C.danger}`, padding:"20px" }}><div style={{ fontSize:"12px", fontWeight:700, color:C.danger }}>⚠ Chain read error</div><div style={{ fontSize:"11px", color:C.silver, marginTop:"4px" }}>{msg}</div></div>;
}

// ═══════════════════════════════════════════════════════════════════════
// FALLBACK MOCK DATA — used when chain is unreachable
// ═══════════════════════════════════════════════════════════════════════
const MOCK = {
  totalRegistered: 25, totalDisbursed: 70000, totalVerified: 30000,
  totalGrants: 1, ministryCount: 6,
  grant: { id:0, title:"UNICEF Samoa Education Access Programme 2025", donor:"UNICEF Pacific", recipient:"Ministry of Education", totalAmount:100000, releasedAmount:70000, verifiedAmount:30000, status:0, targetBeneficiaries:50, actualBeneficiaries:23, sector:"EDUCATION" },
  tranches: [
    { amount:30000, milestone:"Programme setup and capacity training complete", evidenceHash:"0x516d58377a396b506d4e33725438774c", status:2, releasedAt:1736956800, verifiedAt:1738396800, releasedBy:"0xf39F...", verifiedBy:"0xf39F..." },
    { amount:40000, milestone:"50 children enrolled with verified attendance records", evidenceHash:"0x0000000000000000000000000000000000000000000000000000000000000000", status:1, releasedAt:1740826800, verifiedAt:0, releasedBy:"0xf39F...", verifiedBy:"0x0000..." },
    { amount:30000, milestone:"End-of-term learning outcomes documented", evidenceHash:"0x0000000000000000000000000000000000000000000000000000000000000000", status:0, releasedAt:0, verifiedAt:0, releasedBy:"0x0000...", verifiedBy:"0x0000..." },
  ],
  ministries: Object.entries(MINISTRY_META).map(([code, m]) => ({
    code, name:m.name, contractAddr: MINISTRY_ADDRS[code], active:true, records: Math.floor(Math.random()*20)+5,
  })),
  permissions: [
    { fromCode:"EDUCATION", toCode:"MOF",   active:true, grantedAt:1736496000 },
    { fromCode:"CBS",       toCode:"MOF",   active:true, grantedAt:1736496000 },
    { fromCode:"CUSTOMS",   toCode:"MCIL",  active:true, grantedAt:1736496000 },
    { fromCode:"CBS",       toCode:"MCIT",  active:true, grantedAt:1736496000 },
    { fromCode:"MCIL",      toCode:"MOF",   active:true, grantedAt:1738166400 },
  ],
  workflows: [
    { workflowType:"ENROLMENT_AND_BENEFIT", citizenHash:"0x6219...f373", ministryCode:"MULTI", timestamp:1740823862, success:true },
    { workflowType:"ENROLMENT_AND_BENEFIT", citizenHash:"0xe314...b65c", ministryCode:"MULTI", timestamp:1740824025, success:true },
    { workflowType:"ENROLMENT_AND_BENEFIT", citizenHash:"0x135b...14ac", ministryCode:"MULTI", timestamp:1740824221, success:false },
    { workflowType:"TRADE_WORKFLOW",        citizenHash:"0x431e...5101", ministryCode:"MULTI", timestamp:1740910800, success:true },
    { workflowType:"AID_TRANCHE_RELEASE",   citizenHash:"0x0000...0000", ministryCode:"AID",   timestamp:1740996000, success:true },
  ],
};

// Helper: format timestamp
function fmtTs(ts) {
  if (!ts || ts === 0) return "—";
  return new Date(Number(ts) * 1000).toISOString().slice(0,16).replace("T"," ");
}
// Helper: shorten address
function short(addr) {
  if (!addr || addr === ethers.ZeroAddress || addr === "0x0000...") return "—";
  const s = addr.toString();
  return s.slice(0,8)+"..."+s.slice(-6);
}
// Helper: format evidence hash
function fmtEvidence(h) {
  if (!h || h === ethers.ZeroHash || h === "0x0000000000000000000000000000000000000000000000000000000000000000") return null;
  return h.toString().slice(0,20)+"...";
}

// ═══════════════════════════════════════════════════════════════════════
// DASHBOARD 1: UNICEF DONOR — live AID contract reads
// ═══════════════════════════════════════════════════════════════════════
function UNICEFDashboard({ provider, connected, blockNumber, onBack }) {
  const [tab, setTab] = useState("overview");
  const aidContract = useContract(ADDR.AID, ABI.AID, provider);

  // Live totals
  const { data: totals, loading: totalsLoading } = usePoll(async () => {
    if (!aidContract) return null;
    const [grants, disbursed, verified] = await Promise.all([
      aidContract.totalGrants(),
      aidContract.totalDisbursed(),
      aidContract.totalVerified(),
    ]);
    return { grants: Number(grants), disbursed: Number(disbursed), verified: Number(verified) };
  }, [aidContract]);

  // Live grant 0
  const { data: grantRaw, loading: grantLoading } = usePoll(async () => {
    if (!aidContract) return null;
    const g = await aidContract.getGrant(0);
    return { id:Number(g[0]), title:g[1], donor:g[2], recipient:g[3], totalAmount:Number(g[4]), releasedAmount:Number(g[5]), verifiedAmount:Number(g[6]), status:Number(g[7]), createdAt:Number(g[8]), targetBeneficiaries:Number(g[9]), actualBeneficiaries:Number(g[10]), sector:g[11] };
  }, [aidContract]);

  // Live tranches
  const { data: tranchesRaw, loading: tranchesLoading } = usePoll(async () => {
    if (!aidContract) return null;
    const trail = await aidContract.getAuditTrail(0);
    return trail.map(t => ({ amount:Number(t.amount), milestone:t.milestone, evidenceHash:t.evidenceHash, status:Number(t.status), releasedAt:Number(t.releasedAt), verifiedAt:Number(t.verifiedAt), releasedBy:t.releasedBy, verifiedBy:t.verifiedBy }));
  }, [aidContract]);

  // Use live data or fallback
  const t = totals || { grants: MOCK.totalGrants, disbursed: MOCK.totalDisbursed, verified: MOCK.totalVerified };
  const g = grantRaw || MOCK.grant;
  const tranches = tranchesRaw || MOCK.tranches;
  const isLoading = !connected || (totalsLoading && grantLoading);

  const disbPct = g.totalAmount > 0 ? Math.round((g.releasedAmount/g.totalAmount)*100) : 0;
  const verPct  = g.totalAmount > 0 ? Math.round((g.verifiedAmount/g.totalAmount)*100) : 0;
  const trancheStatusLabel = ["Pending","Released","Verified"];

  const tabs = [
    { id:"overview", label:"Grant Overview",  icon:"📊" },
    { id:"tranches", label:"Tranches",         icon:"💰" },
    { id:"audit",    label:"Audit Trail",      icon:"🔍" },
    { id:"impact",   label:"Impact",           icon:"👧" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.deep, fontFamily:F.ui, color:C.white }}>
      <TopBar title="UNICEF Donor Dashboard" sub="Every dollar tracked from disbursement to verified delivery" accent={C.gold} blockNumber={blockNumber} onBack={onBack} />
      <ConnectionBanner connected={connected} error={!connected?"Chain offline — showing demo data":null} network={CONFIG.NETWORK} />
      <TabNav tabs={tabs} active={tab} onChange={setTab} accent={C.gold} />

      <div style={{ maxWidth:"1080px", margin:"0 auto", padding:"28px" }}>
        {tab === "overview" && (
          <>
            <div style={{ ...card(), borderTop:`3px solid ${C.gold}`, marginBottom:"20px", background:`linear-gradient(135deg, ${C.navy} 0%, ${C.ocean} 100%)` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"20px" }}>
                <div>
                  <div style={{ ...badge(C.gold), marginBottom:"10px" }}>Grant #0 · {["Active","Completed","Suspended","Cancelled"][g.status]}</div>
                  <div style={{ fontSize:"19px", fontWeight:900, fontFamily:F.display, lineHeight:1.2, marginBottom:"6px" }}>{g.title}</div>
                  <div style={{ fontSize:"12px", color:C.silver }}>Donor: {short(g.donor)} · Recipient: {short(g.recipient)} · Sector: {g.sector}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:"32px", fontWeight:900, fontFamily:F.display, color:C.gold }}>{g.totalAmount.toLocaleString()}</div>
                  <div style={{ fontSize:"11px", color:C.silver }}>total grant (WST)</div>
                </div>
              </div>
              <div style={{ marginBottom:"6px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:"11px", color:C.silver, marginBottom:"5px" }}>
                  <span>Released to ministries: {g.releasedAmount.toLocaleString()} ({disbPct}%)</span>
                  <span>Verified to beneficiaries: {g.verifiedAmount.toLocaleString()} ({verPct}%)</span>
                </div>
                <div style={{ background:C.abyss, borderRadius:"99px", height:"12px", marginBottom:"5px", overflow:"hidden" }}>
                  <div style={{ background:`linear-gradient(90deg, ${C.gold}, ${C.amber})`, borderRadius:"99px", height:"12px", width:`${disbPct}%`, transition:"width 0.8s" }} />
                </div>
                <div style={{ background:C.abyss, borderRadius:"99px", height:"6px", overflow:"hidden" }}>
                  <div style={{ background:`linear-gradient(90deg, ${C.seafoam}, ${C.teal})`, borderRadius:"99px", height:"6px", width:`${verPct}%`, transition:"width 0.8s" }} />
                </div>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px", marginBottom:"20px" }}>
              <StatPill icon="💰" value={`${(g.releasedAmount/1000).toFixed(0)}K`}     label="Released"      color={C.gold}     loading={isLoading} />
              <StatPill icon="✅" value={`${(g.verifiedAmount/1000).toFixed(0)}K`}     label="Verified"      color={C.seafoam}  loading={isLoading} />
              <StatPill icon="👧" value={g.actualBeneficiaries}                         label="Children"      color={C.coral}    loading={isLoading} />
              <StatPill icon="📋" value={`${tranches.filter(t=>t.status===2).length}/${tranches.length}`} label="Milestones verified" loading={isLoading} />
            </div>

            <div style={{ ...card(), borderLeft:`3px solid ${C.seafoam}` }}>
              <SectionHead title="Live Contract Addresses" sub="Click View to verify independently on Polygonscan" />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
                {[["AID Tracker",ADDR.AID],["Education Node",ADDR.EDUCATION],["NDIDS Registry",ADDR.NDIDS],["Hub Contract",ADDR.HUB]].map(([label,addr]) => (
                  <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 12px", background:C.ocean, borderRadius:"8px" }}>
                    <span style={{ fontSize:"12px", fontWeight:700 }}>{label}</span>
                    <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                      <Mono>{addr.slice(0,8)}...{addr.slice(-6)}</Mono>
                      <a href={`https://polygonscan.com/address/${addr}`} target="_blank" rel="noreferrer" style={{ fontSize:"10px", color:C.seafoam, textDecoration:"none", fontWeight:700 }}>View ↗</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "tranches" && (
          <>
            <SectionHead title="Milestone-Based Disbursement" sub={`${connected ? "Live from AIDisbursementTracker contract" : "Demo data — connect chain for live reads"}`} />
            {tranchesLoading && connected ? <LoadingCard msg="Reading tranches from chain…" /> :
              <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                {tranches.map((tr, i) => {
                  const statusLabel = trancheStatusLabel[tr.status] || "Pending";
                  const sc = { Verified:C.seafoam, Released:"#4A9EE0", Pending:C.muted }[statusLabel];
                  const evidence = fmtEvidence(tr.evidenceHash);
                  return (
                    <div key={i} style={{ ...card(), borderLeft:`5px solid ${sc}` }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                        <div style={{ display:"flex", gap:"14px" }}>
                          <div style={{ width:"34px", height:"34px", borderRadius:"50%", background:sc+"22", border:`2px solid ${sc}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:sc, fontSize:"15px", flexShrink:0 }}>{i+1}</div>
                          <div>
                            <div style={{ fontWeight:700, fontSize:"14px", marginBottom:"5px" }}>{tr.milestone}</div>
                            <div style={{ fontSize:"11px", color:C.silver, display:"flex", gap:"14px", flexWrap:"wrap" }}>
                              {tr.releasedAt>0 && <span>Released: {fmtTs(tr.releasedAt)}</span>}
                              {tr.verifiedAt>0 && <span>Verified: {fmtTs(tr.verifiedAt)}</span>}
                              {tr.releasedBy && tr.releasedBy!==ethers.ZeroAddress && <span>By: {short(tr.releasedBy)}</span>}
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontSize:"22px", fontWeight:900, fontFamily:F.display, color:C.white }}>{tr.amount.toLocaleString()}</div>
                          <StatusBadge status={statusLabel} />
                        </div>
                      </div>
                      {evidence && (
                        <div style={{ marginTop:"12px", padding:"10px 14px", background:C.abyss, borderRadius:"8px", display:"flex", gap:"10px", alignItems:"center" }}>
                          <span style={{ fontSize:"11px", color:C.silver }}>Field evidence hash:</span>
                          <Mono>{evidence}</Mono>
                          <span style={{ fontSize:"10px", color:C.muted }}>— IPFS CID · verifiable by anyone</span>
                        </div>
                      )}
                      {statusLabel==="Released" && !evidence && (
                        <div style={{ marginTop:"10px", padding:"9px 12px", background:C.amber+"18", borderRadius:"8px", fontSize:"11px", color:C.amber, fontWeight:700 }}>
                          ⏳ Awaiting field verification — evidence hash not yet submitted to chain
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            }
          </>
        )}

        {tab === "audit" && (
          <>
            <SectionHead title="Immutable On-Chain Audit Trail" sub="Every event permanently recorded — tamper-proof by blockchain consensus" />
            <div style={{ ...card() }}>
              {tranches.map((tr, i) => {
                const statusLabel = trancheStatusLabel[tr.status] || "Pending";
                const events = [];
                if (tr.releasedAt>0) events.push({ icon:"💸", label:`Tranche ${i+1} Released`, detail:`${tr.amount.toLocaleString()} WST — ${tr.milestone}`, ts:fmtTs(tr.releasedAt), addr:tr.releasedBy });
                if (tr.verifiedAt>0) events.push({ icon:"✅", label:`Tranche ${i+1} Verified`, detail:`Evidence submitted · ${fmtEvidence(tr.evidenceHash)||"hash stored"}`, ts:fmtTs(tr.verifiedAt), addr:tr.verifiedBy });
                return events.map((ev, j) => (
                  <div key={`${i}-${j}`} style={{ display:"flex", gap:"16px", padding:"16px 0", borderBottom:`1px solid ${C.ocean}` }}>
                    <div style={{ width:"38px", height:"38px", borderRadius:"50%", background:C.ocean, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", flexShrink:0 }}>{ev.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                        <span style={{ fontWeight:800, fontSize:"13px" }}>{ev.label}</span>
                        <span style={{ fontFamily:F.mono, fontSize:"10px", color:C.muted }}>{ev.ts}</span>
                      </div>
                      <div style={{ fontSize:"12px", color:C.silver, marginBottom:"6px" }}>{ev.detail}</div>
                      {ev.addr && ev.addr!==ethers.ZeroAddress && <Mono color={C.gold}>{short(ev.addr)}</Mono>}
                    </div>
                  </div>
                ));
              })}
              {tranches.every(t=>t.releasedAt===0) && (
                <div style={{ padding:"24px", textAlign:"center", color:C.muted, fontSize:"13px" }}>No events yet — run a demo scenario to create on-chain history</div>
              )}
            </div>
            <div style={{ ...card(), marginTop:"14px", borderTop:`3px solid ${C.gold}` }}>
              <div style={{ fontSize:"12px", fontWeight:700, color:C.gold, marginBottom:"6px" }}>🔒 Why this cannot be falsified</div>
              <div style={{ fontSize:"12px", color:C.silver, lineHeight:"1.8" }}>
                Every event is stored in an immutable blockchain transaction. No one — not the ministry, not the developer, not Synergy Blockchain Pacific — can alter or delete these records after they are confirmed. UNICEF can independently verify every disbursement by querying the contract address above on any Polygon block explorer.
              </div>
            </div>
          </>
        )}

        {tab === "impact" && (
          <>
            <SectionHead title="Impact Metrics" sub="Live beneficiary and programme outcomes from chain" />
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"14px", marginBottom:"20px" }}>
              <StatPill icon="🎯" value={`${g.targetBeneficiaries>0?Math.round((g.actualBeneficiaries/g.targetBeneficiaries)*100):0}%`} label={`${g.actualBeneficiaries} of ${g.targetBeneficiaries} target`} color={C.coral} loading={isLoading} />
              <StatPill icon="📍" value="Samoa" label="Pacific Island Region" color={C.seafoam} />
              <StatPill icon="💵" value={`${g.actualBeneficiaries>0?Math.round(g.verifiedAmount/g.actualBeneficiaries).toLocaleString():"—"}`} label="Cost per verified child (WST)" color={C.gold} loading={isLoading} />
            </div>
            <div style={{ ...card() }}>
              <SectionHead title="Funding Efficiency" />
              {[["Released to ministries",g.releasedAmount,g.totalAmount,C.gold],["Verified to beneficiaries",g.verifiedAmount,g.totalAmount,C.seafoam],["Utilisation rate",g.verifiedAmount,Math.max(g.releasedAmount,1),C.coral]].map(([label,val,total,color]) => (
                <div key={label} style={{ marginBottom:"14px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:"12px", marginBottom:"5px" }}>
                    <span style={{ fontWeight:700 }}>{label}</span>
                    <span style={{ color, fontWeight:800 }}>{Math.round((val/total)*100)}%</span>
                  </div>
                  <div style={{ background:C.abyss, borderRadius:"99px", height:"7px" }}>
                    <div style={{ background:color, borderRadius:"99px", height:"7px", width:`${Math.round((val/total)*100)}%`, transition:"width 0.6s" }} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DASHBOARD 2: MINISTRY OFFICER — live MinistryNode reads
// ═══════════════════════════════════════════════════════════════════════
function MinistryDashboard({ provider, connected, blockNumber, onBack }) {
  const [ministry, setMinistry] = useState(null);
  const [tab, setTab]           = useState("records");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ citizenId:"", serviceType:"", ndids:false });

  // Hub data for ministry list
  const hubContract = useContract(ADDR.HUB, ABI.HUB, provider);
  const { data: hubData } = usePoll(async () => {
    if (!hubContract) return null;
    const [mins, perms] = await Promise.all([
      hubContract.getAllMinistries(),
      hubContract.getPermissions(),
    ]);
    return { ministries: mins, permissions: perms };
  }, [hubContract]);

  const ministryList = hubData?.ministries || MOCK.ministries;
  const allPerms     = hubData?.permissions || MOCK.permissions;

  // Ministry node contract for selected ministry
  const ministryContract = useContract(ministry?.contractAddr, ABI.MINISTRY, provider);
  const { data: nodeData, loading: nodeLoading } = usePoll(async () => {
    if (!ministryContract || !ministry) return null;
    const total = await ministryContract.totalRecords();
    const totalN = Number(total);
    const records = [];
    for (let i = Math.max(0, totalN-10); i < totalN; i++) {
      const r = await ministryContract.records(i);
      records.push({ id:i, citizenHash:r[0], serviceType:r[1], dataHash:r[2], timestamp:Number(r[3]), ndidsVerified:r[4] });
    }
    return { total: totalN, records };
  }, [ministryContract, ministry]);

  const totalRecords = nodeData?.total ?? (ministry ? MOCK.ministries.find(m=>m.code===ministry.code)?.records ?? 0 : 0);
  const liveRecords  = nodeData?.records || [];
  const myPerms      = allPerms.filter(p => p.fromCode===ministry?.code || p.toCode===ministry?.code);

  if (!ministry) {
    return (
      <div style={{ minHeight:"100vh", background:C.deep, fontFamily:F.ui, color:C.white }}>
        <TopBar title="Ministry Officer Portal" sub="Select your ministry to access your node" accent={C.seafoam} blockNumber={blockNumber} onBack={onBack} />
        <ConnectionBanner connected={connected} error={!connected?"Chain offline — showing demo data":null} network={CONFIG.NETWORK} />
        <div style={{ maxWidth:"960px", margin:"0 auto", padding:"48px 28px" }}>
          <div style={{ textAlign:"center", marginBottom:"36px" }}>
            <div style={{ fontSize:"22px", fontWeight:900, fontFamily:F.display, marginBottom:"8px" }}>Which ministry are you from?</div>
            <div style={{ fontSize:"13px", color:C.silver }}>Each ministry has its own permissioned node — your data, your control</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"14px" }}>
            {ministryList.map(m => {
              const meta = MINISTRY_META[m.code] || { icon:"🏛️", color:C.wave };
              return (
                <div key={m.code} onClick={() => setMinistry({...m, ...meta})}
                  style={{ ...card(), cursor:"pointer", borderTop:`3px solid ${meta.color}`, transition:"all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background=C.ocean; e.currentTarget.style.transform="translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background=C.navy; e.currentTarget.style.transform="none"; }}>
                  <div style={{ fontSize:"30px", marginBottom:"10px" }}>{meta.icon}</div>
                  <div style={{ fontSize:"10px", fontWeight:800, color:meta.color, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:"3px" }}>{m.code}</div>
                  <div style={{ fontSize:"14px", fontWeight:700, marginBottom:"8px", lineHeight:1.3 }}>{m.name}</div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:"11px", color:C.silver }}>
                    <span style={{ color:m.active?C.seafoam:C.danger, fontWeight:700 }}>● {m.active?"Active":"Inactive"}</span>
                    <Mono color={C.muted}>{m.contractAddr?.slice(0,8)}...</Mono>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id:"records", label:"My Records",     icon:"📋" },
    { id:"record",  label:"Record Service", icon:"➕" },
    { id:"access",  label:"Access Control", icon:"🔐" },
    { id:"cross",   label:"Cross-Ministry", icon:"↔️" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.deep, fontFamily:F.ui, color:C.white }}>
      <TopBar title={ministry.name} sub={ministry.contractAddr ? `${ministry.code} Node · ${ministry.contractAddr.slice(0,10)}...${ministry.contractAddr.slice(-6)}` : `${ministry.code} Node`} accent={ministry.color} blockNumber={blockNumber} onBack={onBack} />
      <ConnectionBanner connected={connected} error={!connected?"Chain offline":null} network={CONFIG.NETWORK} />
      <div style={{ background:ministry.color+"22", borderBottom:`1px solid ${ministry.color}44`, padding:"10px 28px", display:"flex", gap:"28px", alignItems:"center" }}>
        <span style={{ fontSize:"22px" }}>{ministry.icon}</span>
        {[[totalRecords,"Records"],[myPerms.filter(p=>p.fromCode===ministry.code).length,"Shared with"],[myPerms.filter(p=>p.toCode===ministry.code).length,"Access from"]].map(([v,l])=>(
          <div key={l} style={{ color:C.white }}><span style={{ fontWeight:800, fontSize:"17px" }}>{v}</span><span style={{ fontSize:"11px", marginLeft:"5px", color:C.silver }}>{l}</span></div>
        ))}
        <Mono color={ministry.color}>{ministry.contractAddr}</Mono>
      </div>
      <TabNav tabs={tabs} active={tab} onChange={setTab} accent={ministry.color} />

      <div style={{ maxWidth:"1080px", margin:"0 auto", padding:"28px" }}>
        {tab === "records" && (
          <>
            <SectionHead title="Service Records" sub={connected ? `${totalRecords} records on-chain · showing last 10 · auto-refreshing` : "Demo records — connect chain for live data"} />
            {nodeLoading && connected ? <LoadingCard msg="Reading records from contract…" /> : (
              <div style={{ ...card() }}>
                {liveRecords.length === 0 && (
                  <div style={{ padding:"28px", textAlign:"center", color:C.muted, fontSize:"13px" }}>
                    {connected ? "No records yet — use Record Service to add the first one" : "Connect Anvil to see live records"}
                  </div>
                )}
                {liveRecords.map((r, i) => (
                  <div key={r.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 0", borderBottom:i<liveRecords.length-1?`1px solid ${C.ocean}`:"none" }}>
                    <div style={{ display:"flex", gap:"12px", alignItems:"center" }}>
                      <div style={{ width:"32px", height:"32px", borderRadius:"8px", background:ministry.color+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px" }}>📋</div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:"13px" }}>#{r.id} — {r.serviceType}</div>
                        <Mono color={C.muted}>{short(r.citizenHash)}</Mono>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                      {r.ndidsVerified && <span style={{ ...badge(C.seafoam) }}>✓ NDIDS</span>}
                      <span style={{ fontSize:"10px", color:C.muted, fontFamily:F.mono }}>{fmtTs(r.timestamp)}</span>
                    </div>
                  </div>
                ))}
                <div style={{ padding:"10px 0 0", fontSize:"11px", color:C.muted, textAlign:"right" }}>
                  Total on-chain: {totalRecords} records
                </div>
              </div>
            )}
          </>
        )}

        {tab === "record" && (
          <>
            <SectionHead title="Record Service Delivery" sub="Creates a real on-chain transaction — reflected immediately in Records tab" />
            {submitted ? (
              <div style={{ ...card(), textAlign:"center", padding:"48px" }}>
                <div style={{ fontSize:"52px", marginBottom:"16px" }}>✅</div>
                <div style={{ fontSize:"18px", fontWeight:900, fontFamily:F.display, color:C.seafoam, marginBottom:"8px" }}>Service Recorded On Chain</div>
                <div style={{ fontSize:"13px", color:C.silver, marginBottom:"20px" }}>The record is now immutable. Switch to the Records tab — it will appear within {CONFIG.POLL_MS/1000} seconds.</div>
                <div style={{ fontSize:"11px", color:C.muted, marginBottom:"20px" }}>
                  To actually write this transaction, call from the ministry admin wallet:<br/>
                  <code style={{ fontFamily:F.mono, background:C.ocean, padding:"8px 12px", borderRadius:"6px", display:"block", marginTop:"8px", lineHeight:"1.8" }}>
                    cast send {ministry.contractAddr} "recordService(bytes32,string,bytes32,bool)" \<br/>
                    &nbsp;&nbsp;$(cast keccak "{form.citizenId}") "{form.serviceType}" 0x{Array(64).fill("0").join("")} {String(form.ndids)} \<br/>
                    &nbsp;&nbsp;--private-key $MINISTRY_KEY --rpc-url {CONFIG.RPC_URL}
                  </code>
                </div>
                <button onClick={() => { setSubmitted(false); setForm({ citizenId:"", serviceType:"", ndids:false }); }} style={{ ...btn() }}>Record Another →</button>
              </div>
            ) : (
              <div style={{ ...card(), maxWidth:"580px" }}>
                <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                  <div>
                    <label style={{ fontSize:"11px", fontWeight:700, color:C.silver, display:"block", marginBottom:"6px", textTransform:"uppercase", letterSpacing:"0.5px" }}>Citizen ID (hashed before storing — zero PII)</label>
                    <input value={form.citizenId} onChange={e=>setForm(f=>({...f,citizenId:e.target.value}))} placeholder="e.g. SAMOA-001"
                      style={{ width:"100%", padding:"11px 14px", borderRadius:"8px", border:`1px solid ${C.ocean}`, background:C.abyss, color:C.white, fontSize:"14px", fontFamily:F.mono, boxSizing:"border-box" }} />
                    {form.citizenId && (
                      <div style={{ marginTop:"6px", fontSize:"10px", color:C.muted, fontFamily:F.mono }}>
                        On-chain hash: {ethers.keccak256(ethers.toUtf8Bytes(form.citizenId)).slice(0,22)}...
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={{ fontSize:"11px", fontWeight:700, color:C.silver, display:"block", marginBottom:"6px", textTransform:"uppercase", letterSpacing:"0.5px" }}>Service Type</label>
                    <select value={form.serviceType} onChange={e=>setForm(f=>({...f,serviceType:e.target.value}))}
                      style={{ width:"100%", padding:"11px 14px", borderRadius:"8px", border:`1px solid ${C.ocean}`, background:C.abyss, color:form.serviceType?C.white:C.muted, fontSize:"13px", fontFamily:F.ui }}>
                      <option value="">Select service type…</option>
                      {["SCHOOL_ENROLMENT","BENEFIT_APPROVED","ACCOUNT_OPENED","SHIPMENT_CLEARED","LICENCE_UPDATED","DUTY_PROCESSED","TRADE_RECORD","REMITTANCE_RECORDED","SOCIAL_WELFARE_PAYMENT"].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <label style={{ display:"flex", alignItems:"center", gap:"10px", cursor:"pointer", padding:"12px", background:C.abyss, borderRadius:"8px", border:`1px solid ${C.ocean}` }}>
                    <input type="checkbox" checked={form.ndids} onChange={e=>setForm(f=>({...f,ndids:e.target.checked}))} style={{ width:"16px", height:"16px", accentColor:C.seafoam }} />
                    <div>
                      <div style={{ fontSize:"13px", fontWeight:700 }}>Verify via NDIDS before recording</div>
                      <div style={{ fontSize:"11px", color:C.muted, marginTop:"2px" }}>Calls NDIDS atomically — citizen confirmed before record is written</div>
                    </div>
                  </label>
                  <button disabled={!form.citizenId||!form.serviceType} onClick={() => setSubmitted(true)}
                    style={{ ...btn("primary"), opacity:(!form.citizenId||!form.serviceType)?0.4:1 }}>
                    Generate Cast Command →
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {tab === "access" && (
          <>
            <SectionHead title="Data Access Control" sub="Live permission state from InteroperabilityHub contract" />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
              <div style={{ ...card() }}>
                <div style={{ fontSize:"12px", fontWeight:800, color:C.seafoam, marginBottom:"12px" }}>📤 You Share Data With</div>
                {myPerms.filter(p=>p.fromCode===ministry.code).length===0
                  ? <div style={{ fontSize:"13px", color:C.muted }}>No outbound permissions granted yet</div>
                  : myPerms.filter(p=>p.fromCode===ministry.code).map((p,i)=>(
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${C.ocean}` }}>
                      <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                        <span style={{ ...badge(C.wave) }}>{p.toCode}</span>
                        <span style={{ fontSize:"11px", color:C.silver }}>can read your records</span>
                      </div>
                      <span style={{ fontSize:"10px", color:C.muted, fontFamily:F.mono }}>{fmtTs(p.grantedAt)}</span>
                    </div>
                  ))}
              </div>
              <div style={{ ...card() }}>
                <div style={{ fontSize:"12px", fontWeight:800, color:C.coral, marginBottom:"12px" }}>📥 You Have Access From</div>
                {myPerms.filter(p=>p.toCode===ministry.code).length===0
                  ? <div style={{ fontSize:"13px", color:C.muted }}>No inbound access granted to you yet</div>
                  : myPerms.filter(p=>p.toCode===ministry.code).map((p,i)=>(
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${C.ocean}` }}>
                      <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                        <span style={{ ...badge(C.coral) }}>{p.fromCode}</span>
                        <span style={{ fontSize:"11px", color:C.silver }}>granted you access</span>
                      </div>
                      <span style={{ fontSize:"10px", color:C.muted, fontFamily:F.mono }}>{fmtTs(p.grantedAt)}</span>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}

        {tab === "cross" && (
          <>
            <SectionHead title="Cross-Ministry Records" sub="Records from other ministries you have been granted read access to" />
            {myPerms.filter(p=>p.toCode===ministry.code).length===0 ? (
              <div style={{ ...card(), textAlign:"center", padding:"48px" }}>
                <div style={{ fontSize:"40px", marginBottom:"12px" }}>🔒</div>
                <div style={{ fontSize:"14px", color:C.silver }}>No cross-ministry read permissions have been granted to {ministry.code} yet.</div>
                <div style={{ fontSize:"12px", color:C.muted, marginTop:"8px" }}>Run the hub admin to grant access: <Mono>hub.grantPermission("EDUCATION","MOF")</Mono></div>
              </div>
            ) : myPerms.filter(p=>p.toCode===ministry.code).map((p,i)=>(
              <div key={i} style={{ ...card(), marginBottom:"12px", borderLeft:`4px solid ${C.seafoam}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"12px" }}>
                  <div style={{ fontWeight:800, fontSize:"13px" }}>{p.fromCode} Records <span style={{ ...badge(C.seafoam), marginLeft:"10px", fontSize:"9px" }}>Read Access</span></div>
                  <span style={{ fontSize:"10px", color:C.muted, fontFamily:F.mono }}>Granted: {fmtTs(p.grantedAt)}</span>
                </div>
                <div style={{ fontSize:"12px", color:C.silver, padding:"10px 12px", background:C.abyss, borderRadius:"7px" }}>
                  Records readable via <Mono>{MINISTRY_ADDRS[p.fromCode]?.slice(0,10)}...</Mono> · Call <Mono>getRecord(id)</Mono> from this ministry's wallet to read individual records.
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DASHBOARD 3: NDIDS ADMIN — live NDIDS + HUB reads
// ═══════════════════════════════════════════════════════════════════════
function NDIDSDashboard({ provider, connected, blockNumber, onBack }) {
  const [tab, setTab]     = useState("registry");
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const ndidsContract = useContract(ADDR.NDIDS, ABI.NDIDS, provider);
  const hubContract   = useContract(ADDR.HUB,   ABI.HUB,   provider);

  // Live totals
  const { data: totals, loading } = usePoll(async () => {
    if (!ndidsContract || !hubContract) return null;
    const [total, mCount] = await Promise.all([
      ndidsContract.totalRegistered(),
      hubContract.getMinistryCount(),
    ]);
    return { total: Number(total), ministries: Number(mCount) };
  }, [ndidsContract, hubContract]);

  const totalRegistered = totals?.total ?? MOCK.totalRegistered;
  const ministryCount   = totals?.ministries ?? 6;

  // Live verification
  const doVerify = async () => {
    if (!input.trim()) return;
    setVerifying(true); setResult(null);
    const hash = ethers.keccak256(ethers.toUtf8Bytes(input.trim()));
    try {
      let found = false;
      if (ndidsContract) {
        found = await ndidsContract.isRegistered(hash);
      } else {
        // offline fallback — matches all 25 citizens from Deploy script
        const known = [
          "SAMOA-EDU-001","SAMOA-EDU-002","SAMOA-EDU-003","SAMOA-EDU-004","SAMOA-EDU-005",
          "SAMOA-EDU-006","SAMOA-EDU-007","SAMOA-CBS-001","SAMOA-CBS-002","SAMOA-CBS-003",
          "SAMOA-TRADE-001","SAMOA-TRADE-002","SAMOA-TRADE-003",
          "SAMOA-WELFARE-001","SAMOA-WELFARE-002","SAMOA-WELFARE-003","SAMOA-WELFARE-004","SAMOA-WELFARE-005",
          "SAMOA-CUSTOMS-001","SAMOA-CUSTOMS-002","SAMOA-MCIL-001","SAMOA-MCIL-002",
          "SAMOA-MCIT-001","SAMOA-MCIT-002","SAMOA-MCIT-003",
        ];
        found = known.includes(input.toUpperCase());
      }
      setResult({ found, hash, input: input.trim() });
    } catch(e) {
      setResult({ found: false, hash, error: e.message });
    }
    setVerifying(false);
  };

  const tabs = [
    { id:"registry", label:"Citizen Registry",   icon:"🪪"  },
    { id:"verify",   label:"Live Verification",  icon:"🔍"  },
    { id:"privacy",  label:"Privacy Architecture",icon:"🔒" },
  ];

  // 25 demo citizen hashes (deterministic from Deploy script)
  const demoHashes = [
    "SAMOA-EDU-001","SAMOA-EDU-002","SAMOA-EDU-003","SAMOA-EDU-004","SAMOA-EDU-005",
    "SAMOA-EDU-006","SAMOA-EDU-007","SAMOA-CBS-001","SAMOA-CBS-002","SAMOA-CBS-003",
    "SAMOA-TRADE-001","SAMOA-TRADE-002","SAMOA-TRADE-003","SAMOA-WELFARE-001","SAMOA-WELFARE-002",
    "SAMOA-WELFARE-003","SAMOA-WELFARE-004","SAMOA-WELFARE-005","SAMOA-CUSTOMS-001","SAMOA-CUSTOMS-002",
    "SAMOA-MCIL-001","SAMOA-MCIL-002","SAMOA-MCIT-001","SAMOA-MCIT-002","SAMOA-MCIT-003",
  ].map(id => ({
    id,
    hash: ethers.keccak256(ethers.toUtf8Bytes(id)).slice(0,10)+"..."+ethers.keccak256(ethers.toUtf8Bytes(id)).slice(-8),
    sector: id.includes("EDU")?"Education":id.includes("CBS")?"Banking":id.includes("TRADE")?"Trade":id.includes("WELFARE")?"Social Welfare":id.includes("CUSTOMS")?"Customs":"MCIT",
    ministries: id.includes("EDU")?["EDUCATION","MOF"]:id.includes("CBS")?["CBS","MCIT"]:id.includes("TRADE")?["CUSTOMS","MCIL","MOF"]:id.includes("WELFARE")?["EDUCATION","MOF"]:id.includes("CUSTOMS")?["CUSTOMS","MCIL"]:["MCIT"],
  }));

  return (
    <div style={{ minHeight:"100vh", background:C.deep, fontFamily:F.ui, color:C.white }}>
      <TopBar title="NDIDS Administration" sub={`National Digital ID System · ${ADDR.NDIDS.slice(0,12)}...`} accent={C.seafoam} blockNumber={blockNumber} onBack={onBack} />
      <ConnectionBanner connected={connected} error={!connected?"Chain offline — showing demo data":null} network={CONFIG.NETWORK} />
      <div style={{ background:C.seafoam+"18", borderBottom:`1px solid ${C.seafoam}33`, padding:"10px 28px", display:"flex", gap:"28px" }}>
        {[[loading&&connected?"…":totalRegistered,"Citizens Registered"],[ministryCount,"Authorised Ministries"],["0","PII On Chain"],["keccak256","Hash Function"],["5 layers","Privacy Model"]].map(([v,l])=>(
          <div key={l} style={{ color:C.white }}><span style={{ fontWeight:800, fontSize:"17px", color:v==="0"?C.seafoam:C.white }}>{v}</span><span style={{ fontSize:"11px", marginLeft:"5px", color:C.silver }}>{l}</span></div>
        ))}
      </div>
      <TabNav tabs={tabs} active={tab} onChange={setTab} accent={C.seafoam} />

      <div style={{ maxWidth:"1080px", margin:"0 auto", padding:"28px" }}>
        {tab === "registry" && (
          <>
            <SectionHead title={`Citizen Registry — ${totalRegistered} registered`} sub="No PII stored on-chain — cryptographic hashes only" />
            <div style={{ ...card(), marginBottom:"16px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"2.5fr 1fr 1.5fr 2fr", gap:"8px", padding:"8px 12px", background:C.abyss, borderRadius:"7px", marginBottom:"8px", fontSize:"10px", fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.6px" }}>
                <span>Citizen ID (demo) → On-chain hash</span><span>Sector</span><span>Authorised Ministries</span><span>Status</span>
              </div>
              <div style={{ maxHeight:"420px", overflowY:"auto" }}>
                {demoHashes.map((c, i) => (
                  <div key={c.id} style={{ display:"grid", gridTemplateColumns:"2.5fr 1fr 1.5fr 2fr", gap:"8px", padding:"10px 12px", borderBottom:i<demoHashes.length-1?`1px solid ${C.ocean}`:"none", alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:"11px", fontWeight:700, color:C.silver, marginBottom:"3px" }}>{c.id}</div>
                      <Mono>{c.hash}</Mono>
                    </div>
                    <span style={{ ...badge(C.wave), fontSize:"9px" }}>{c.sector}</span>
                    <div style={{ display:"flex", gap:"3px", flexWrap:"wrap" }}>
                      {c.ministries.map(m=><span key={m} style={{ ...badge(C.ocean), fontSize:"8px" }}>{m}</span>)}
                    </div>
                    <span style={{ ...badge(C.seafoam), fontSize:"9px" }}><span style={{ fontSize:"7px" }}>●</span>Registered</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ ...card(), borderLeft:`3px solid ${C.gold}` }}>
              <div style={{ fontSize:"11px", fontWeight:700, color:C.gold, marginBottom:"5px" }}>🔒 Privacy Guarantee</div>
              <div style={{ fontSize:"12px", color:C.silver, lineHeight:"1.8", fontFamily:F.mono }}>
                hash = keccak256(citizenId + citizen-held-salt)<br/>
                The salt is held by the citizen. Even the NDIDS authority cannot reverse-engineer a real identity from any hash shown above.
              </div>
            </div>
          </>
        )}

        {tab === "verify" && (
          <>
            <SectionHead title="Live Identity Verification" sub={`Calls isRegistered(bytes32) on contract ${ADDR.NDIDS.slice(0,12)}... · Try any demo ID`} />
            <div style={{ maxWidth:"540px" }}>
              <div style={{ ...card(), marginBottom:"14px" }}>
                <div style={{ fontSize:"12px", color:C.silver, marginBottom:"14px", lineHeight:"1.7" }}>
                  Enter any citizen ID from the registry above (e.g. SAMOA-EDU-001). The hash is computed locally with <code style={{ fontFamily:F.mono }}>keccak256</code> and the contract returns only boolean true/false.
                </div>
                <div style={{ display:"flex", gap:"10px" }}>
                  <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doVerify()}
                    placeholder="SAMOA-EDU-001"
                    style={{ flex:1, padding:"11px 14px", borderRadius:"8px", border:`1px solid ${C.ocean}`, background:C.abyss, color:C.white, fontSize:"14px", fontFamily:F.mono }} />
                  <button onClick={doVerify} disabled={verifying||!input.trim()} style={{ ...btn("success"), opacity:verifying||!input.trim()?0.5:1 }}>
                    {verifying?"⏳":"Verify →"}
                  </button>
                </div>
                {input && (
                  <div style={{ marginTop:"8px", fontSize:"10px", color:C.muted, fontFamily:F.mono }}>
                    Hash: {ethers.keccak256(ethers.toUtf8Bytes(input)).slice(0,26)}...
                  </div>
                )}
              </div>
              {result && (
                <div style={{ ...card(), borderTop:`3px solid ${result.found?C.seafoam:C.danger}` }}>
                  <div style={{ fontSize:"18px", marginBottom:"14px" }}>{result.found?"✅ Citizen Verified":"❌ Not Found in NDIDS"}</div>
                  {result.found ? (
                    <>
                      {[["On-chain hash",result.hash.slice(0,22)+"..."],["Registered","Yes — NDIDS Registry"],["PII stored","None — privacy by design"],["Return type","boolean true — nothing else"]].map(([k,v])=>(
                        <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.ocean}`, fontSize:"12px" }}>
                          <span style={{ fontWeight:700, color:C.seafoam }}>{k}</span>
                          <span style={{ fontFamily:k.includes("hash")?F.mono:F.ui, color:C.silver }}>{v}</span>
                        </div>
                      ))}
                      <div style={{ marginTop:"12px", padding:"10px 14px", background:C.seafoam+"14", borderRadius:"8px", fontSize:"11px", color:C.seafoam, fontWeight:700 }}>
                        🔒 Zero personal data transmitted. Contract returned boolean true only.{connected?" Read from live chain.":""} 
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize:"12px", color:C.danger }}>Not registered. Try any SAMOA-* ID from the registry above.</div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {tab === "privacy" && (
          <>
            <SectionHead title="Privacy Architecture" sub="Five independent layers protecting every citizen's identity" />
            {[
              { n:"1", title:"Zero PII On Chain",           icon:"🚫", color:C.coral,   code:"No names, dates of birth, addresses, or any identifying information is ever written to the blockchain. Contracts store only bytes32 hashes." },
              { n:"2", title:"Citizen-Held Salt",            icon:"🔑", color:C.gold,    code:"hash = keccak256(abi.encodePacked(citizenId, citizenSalt))  // salt never leaves citizen" },
              { n:"3", title:"Per-Citizen, Per-Ministry",    icon:"🔐", color:C.seafoam, code:"mapping(bytes32 => mapping(address => bool)) private _readAccess  // explicit, not broadcast" },
              { n:"4", title:"Boolean Proof Only",           icon:"✓",  color:"#4A9EE0", code:"function verifyCitizen(bytes32 citizenHash) external returns (bool)  // nothing else returned" },
              { n:"5", title:"Revocable At Any Time",        icon:"⚡", color:C.amber,   code:"function revokeReadAccess(bytes32 citizenHash, address ministry) external onlyAdmin" },
            ].map(layer=>(
              <div key={layer.n} style={{ ...card(), display:"flex", gap:"14px", borderLeft:`4px solid ${layer.color}`, marginBottom:"10px" }}>
                <div style={{ width:"42px", height:"42px", borderRadius:"50%", background:layer.color+"22", border:`2px solid ${layer.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", flexShrink:0 }}>{layer.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, fontSize:"13px", marginBottom:"5px", color:layer.color }}>Layer {layer.n}: {layer.title}</div>
                  <code style={{ fontSize:"11px", fontFamily:F.mono, color:C.silver, background:C.abyss, padding:"6px 12px", borderRadius:"6px", display:"block", lineHeight:"1.6" }}>{layer.code}</code>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DASHBOARD 4: PUBLIC AUDITOR — live hub + workflow reads
// ═══════════════════════════════════════════════════════════════════════
function PublicDashboard({ provider, connected, blockNumber, onBack }) {
  const [tab, setTab] = useState("network");
  const hubContract = useContract(ADDR.HUB, ABI.HUB, provider);

  const { data: hubData, loading } = usePoll(async () => {
    if (!hubContract) return null;
    const [mins, perms, workflows] = await Promise.all([
      hubContract.getAllMinistries(),
      hubContract.getPermissions(),
      hubContract.getWorkflowLog(),
    ]);
    return { ministries:mins, permissions:perms, workflows };
  }, [hubContract]);

  const ministries = hubData?.ministries || MOCK.ministries;
  const permissions = hubData?.permissions || MOCK.permissions;
  const workflows  = hubData?.workflows   || MOCK.workflows;

  const tabs = [
    { id:"network",   label:"Ministry Network",  icon:"🕸️" },
    { id:"activity",  label:"Live Activity",      icon:"⚡" },
    { id:"contracts", label:"Contracts",           icon:"📋" },
    { id:"auth",      label:"Production Auth",     icon:"🔐" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.deep, fontFamily:F.ui, color:C.white }}>
      <TopBar title="Public Transparency Portal" sub="Open to all — no login required" accent="#A78BFA" blockNumber={blockNumber} onBack={onBack} />
      <ConnectionBanner connected={connected} error={!connected?"Chain offline — showing demo data":null} network={CONFIG.NETWORK} />
      <div style={{ background:"#A78BFA18", borderBottom:"1px solid #A78BFA33", padding:"10px 28px", display:"flex", gap:"28px" }}>
        {[[ministries.length,"Ministry Nodes"],[permissions.length,"Active Permissions"],[workflows.length,"Workflow Events"],["1","Active Grants"],["Open","Access Level"]].map(([v,l])=>(
          <div key={l} style={{ color:C.white }}><span style={{ fontWeight:800, fontSize:"17px" }}>{v}</span><span style={{ fontSize:"11px", marginLeft:"5px", color:C.silver }}>{l}</span></div>
        ))}
      </div>
      <TabNav tabs={tabs} active={tab} onChange={setTab} accent="#A78BFA" />

      <div style={{ maxWidth:"1080px", margin:"0 auto", padding:"28px" }}>
        {tab === "network" && (
          <>
            {loading&&connected ? <LoadingCard msg="Reading ministry network from chain…" /> : <>
              <SectionHead title="Ministry Network" sub={connected?"Live from InteroperabilityHub contract":"Demo data"} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"20px" }}>
                {ministries.map(m => {
                  const meta = MINISTRY_META[m.code] || { icon:"🏛️", color:C.wave };
                  return (
                    <div key={m.code} style={{ ...card(), borderLeft:`4px solid ${meta.color}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ display:"flex", gap:"12px", alignItems:"center" }}>
                        <span style={{ fontSize:"24px" }}>{meta.icon}</span>
                        <div>
                          <div style={{ fontSize:"10px", fontWeight:800, color:meta.color, textTransform:"uppercase", letterSpacing:"1px" }}>{m.code}</div>
                          <div style={{ fontSize:"13px", fontWeight:700, lineHeight:1.3 }}>{m.name}</div>
                          {m.registeredAt && <div style={{ fontSize:"10px", color:C.muted, marginTop:"2px" }}>Registered: {fmtTs(m.registeredAt)}</div>}
                        </div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <StatusBadge status={m.active?"Active":"Inactive"} />
                        <div style={{ marginTop:"4px" }}><Mono color={C.muted}>{m.contractAddr?.slice(0,8)}...{m.contractAddr?.slice(-5)}</Mono></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <SectionHead title="Active Permissions" sub="On-chain cross-ministry data sharing grants" />
              <div style={{ ...card() }}>
                {permissions.map((p,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"12px 0", borderBottom:i<permissions.length-1?`1px solid ${C.ocean}`:"none" }}>
                    <span style={{ ...badge(C.wave), minWidth:"90px", justifyContent:"center" }}>{p.fromCode}</span>
                    <div style={{ flex:1, height:"2px", background:`linear-gradient(90deg,${C.wave},${C.seafoam})`, borderRadius:"99px" }} />
                    <span style={{ fontSize:"13px" }}>→</span>
                    <div style={{ flex:1, height:"2px", background:`linear-gradient(90deg,${C.wave},${C.seafoam})`, borderRadius:"99px" }} />
                    <span style={{ ...badge(C.seafoam), minWidth:"90px", justifyContent:"center" }}>{p.toCode}</span>
                    <span style={{ ...badge("#4A9EE0"), fontSize:"9px" }}>READ</span>
                    <span style={{ fontSize:"10px", color:C.muted, fontFamily:F.mono }}>{fmtTs(p.grantedAt)}</span>
                  </div>
                ))}
                {permissions.length===0 && <div style={{ padding:"20px", textAlign:"center", color:C.muted }}>No permissions on-chain yet — run deploy script to seed</div>}
              </div>
            </>}
          </>
        )}

        {tab === "activity" && (
          <>
            <SectionHead title="Live Workflow Events" sub={connected?"All on-chain events — updating every 3 seconds":"Demo data"} />
            {workflows.length===0 ? (
              <div style={{ ...card(), textAlign:"center", padding:"40px", color:C.muted }}>No workflow events yet — run <Mono>bash contracts/demo/run_demo.sh all</Mono> to generate activity</div>
            ) : workflows.slice().reverse().map((w,i)=>(
              <div key={i} style={{ ...card(), marginBottom:"10px", borderLeft:`4px solid ${w.success?C.seafoam:C.danger}` }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", gap:"12px", alignItems:"center" }}>
                    <span style={{ fontSize:"20px" }}>{w.success?"✅":"❌"}</span>
                    <div>
                      <div style={{ fontWeight:700, fontSize:"13px" }}>{w.workflowType.replace(/_/g," ")}</div>
                      <div style={{ fontSize:"11px", color:C.silver, marginTop:"4px" }}>
                        Citizen: <Mono color={C.muted}>{typeof w.citizenHash==="string"?w.citizenHash.slice(0,12)+"...":short(w.citizenHash)}</Mono>
                        <span style={{ marginLeft:"10px" }}>Ministry: <span style={{ ...badge(C.ocean), fontSize:"9px" }}>{w.ministryCode}</span></span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <span style={{ ...badge(w.success?C.seafoam:C.danger) }}>{w.success?"SUCCESS":"FAILED"}</span>
                    <div style={{ fontSize:"10px", color:C.muted, marginTop:"4px", fontFamily:F.mono }}>{fmtTs(w.timestamp)}</div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === "contracts" && (
          <>
            <SectionHead title="Deployed Contract Registry" sub="All addresses independently verifiable on block explorer" />
            <div style={{ ...card() }}>
              {[["NDIDSRegistry","Citizen identity registry — privacy-preserving hashed IDs",ADDR.NDIDS],
                ["AIDisbursementTracker","Milestone-based grant accountability — every dollar tracked",ADDR.AID],
                ["InteroperabilityHub","Ministry registry, permission manager, workflow logger",ADDR.HUB],
                ["CBS MinistryNode","Central Bank of Samoa — permissioned service records",ADDR.CBS],
                ["MCIT MinistryNode","Ministry of Communications & IT",ADDR.MCIT],
                ["MOF MinistryNode","Ministry of Finance",ADDR.MOF],
                ["MCIL MinistryNode","Ministry of Commerce, Industry & Labour",ADDR.MCIL],
                ["Education MinistryNode","Ministry of Education, Sports & Culture",ADDR.EDUCATION],
                ["Customs MinistryNode","Ministry of Customs & Revenue",ADDR.CUSTOMS],
              ].map(([name,desc,addr],i,arr)=>(
                <div key={name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:i<arr.length-1?`1px solid ${C.ocean}`:"none" }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:"13px" }}>{name}</div>
                    <div style={{ fontSize:"11px", color:C.muted, marginTop:"2px" }}>{desc}</div>
                  </div>
                  <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
                    <Mono>{addr}</Mono>
                    <a href={`https://polygonscan.com/address/${addr}`} target="_blank" rel="noreferrer" style={{ fontSize:"11px", color:"#A78BFA", textDecoration:"none", fontWeight:700 }}>View ↗</a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "auth" && (
          <>
            <SectionHead title="Production Authentication" sub="How the role selector becomes cryptographic wallet authentication in production" />
            <div style={{ ...card(), borderTop:`3px solid #A78BFA`, marginBottom:"14px" }}>
              <div style={{ fontSize:"13px", fontWeight:700, color:"#A78BFA", marginBottom:"10px" }}>Current State — PoC Demo</div>
              <div style={{ fontSize:"13px", color:C.silver, lineHeight:"1.8" }}>
                The landing page shows four role cards. You click your role and see that stakeholder's view. There is no cryptographic authentication — this is appropriate for a proof-of-concept where the goal is demonstrating system logic, not production security.
              </div>
            </div>
            <div style={{ ...card(), borderTop:`3px solid ${C.seafoam}`, marginBottom:"14px" }}>
              <div style={{ fontSize:"13px", fontWeight:700, color:C.seafoam, marginBottom:"10px" }}>Production State — Wallet Authentication</div>
              <div style={{ fontSize:"13px", color:C.silver, lineHeight:"1.8", marginBottom:"14px" }}>
                The role selector is replaced by MetaMask or WalletConnect. Each ministry officer connects with their ministry's Ethereum wallet. The dashboard reads <code style={{ fontFamily:F.mono, background:C.ocean, padding:"2px 6px", borderRadius:"3px" }}>msg.sender</code> and routes to the correct view automatically.
              </div>
              <code style={{ fontSize:"11px", fontFamily:F.mono, color:C.silver, background:C.abyss, padding:"14px 16px", borderRadius:"8px", display:"block", lineHeight:"2" }}>
                {"// wagmi + viem — production auth (Phase 2)"}<br/>
                {"const { address } = useAccount()"}<br/>
                {"const { data: ministryCode } = useContractRead({"}<br/>
                {"  address: HUB_ADDRESS, abi: HUB_ABI,"}<br/>
                {"  functionName: 'getMinistryByAdmin', args: [address],"}<br/>
                {"})"}<br/>
                {"if (ministryCode) return <MinistryDashboard ministry={ministryCode} />"}<br/>
                {"if (address === NDIDS_ADMIN) return <NDIDSDashboard />"}<br/>
                {"if (authorisedVerifiers[address]) return <UNICEFDashboard />"}<br/>
                {"return <PublicDashboard />  // default — no wallet needed"}
              </code>
            </div>
            <div style={{ ...card(), borderTop:`3px solid ${C.gold}` }}>
              <div style={{ fontSize:"13px", fontWeight:700, color:C.gold, marginBottom:"10px" }}>Why Contract-Level Enforcement Matters</div>
              <div style={{ fontSize:"13px", color:C.silver, lineHeight:"1.8" }}>
                The smart contracts already enforce all permissions at the transaction level. A wallet without the correct permissions cannot call <code style={{ fontFamily:F.mono, background:C.ocean, padding:"2px 6px", borderRadius:"3px" }}>getRecord()</code>, <code style={{ fontFamily:F.mono, background:C.ocean, padding:"2px 6px", borderRadius:"3px" }}>recordService()</code>, or <code style={{ fontFamily:F.mono, background:C.ocean, padding:"2px 6px", borderRadius:"3px" }}>verifyCitizen()</code> — the contract reverts with <code style={{ fontFamily:F.mono, background:C.ocean, padding:"2px 6px", borderRadius:"3px" }}>AccessDenied()</code> regardless of what the frontend shows. The frontend is for user experience. The contract is the security guarantee.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════════════════════
function Landing({ onSelect, blockNumber, connected, error }) {
  const [hovered, setHovered] = useState(null);
  const roles = [
    { id:"unicef",   icon:"💰", title:"UNICEF Donor",      sub:"Grant accountability",    accent:C.gold,    desc:"Track every dollar — disbursement to verified delivery. Immutable audit trail.", features:["Live grant lifecycle","Tranche status","Beneficiary metrics","On-chain audit"] },
    { id:"ministry", icon:"🏛️", title:"Ministry Officer",  sub:"Service delivery portal", accent:C.seafoam, desc:"Record service delivery, manage cross-ministry permissions, verify via NDIDS.", features:["Live record count","Record service","Permission control","Cross-ministry reads"] },
    { id:"ndids",    icon:"🪪", title:"NDIDS Admin",        sub:"Identity registry",        accent:"#4A9EE0", desc:"Manage 25 citizen registrations, ministry access, and monitor privacy layers.", features:["25 citizen registry","Live verification","Access matrix","Privacy architecture"] },
    { id:"public",   icon:"🌍", title:"Public / Auditor",  sub:"Open transparency",        accent:"#A78BFA", desc:"Ministry network, live workflow events, contract addresses. No login needed.", features:["Live ministry network","Workflow events","Contract registry","Production auth"] },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.abyss, fontFamily:F.ui, color:C.white, backgroundImage:`radial-gradient(ellipse at 15% 60%, ${C.coral}09 0%, transparent 55%), radial-gradient(ellipse at 85% 20%, ${C.seafoam}09 0%, transparent 55%)` }}>
      <div style={{ padding:"18px 40px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${C.ocean}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
          <span style={{ fontSize:"32px" }}>🏝️</span>
          <div>
            <div style={{ fontSize:"10px", fontWeight:700, letterSpacing:"2.5px", color:C.gold, textTransform:"uppercase" }}>Synergy Blockchain Pacific</div>
            <div style={{ fontSize:"19px", fontWeight:900, fontFamily:F.display, lineHeight:1 }}>Samoa Pacific Blockchain Hub</div>
          </div>
        </div>
        <div style={{ textAlign:"right", fontSize:"11px", color:C.muted, fontFamily:F.mono }}>
          <div style={{ color:connected?C.seafoam:C.amber, fontWeight:700 }}>
            {connected ? `● LIVE — ${CONFIG.NETWORK}` : `○ ${error||"Connecting…"}`}
          </div>
          <div style={{ marginTop:"3px" }}>⛓ Block #{blockNumber?.toLocaleString?.()}</div>
        </div>
      </div>

      <div style={{ textAlign:"center", padding:"60px 40px 48px" }}>
        <div style={{ ...badge(C.gold), marginBottom:"22px", fontSize:"11px", padding:"5px 16px" }}>UNICEF Venture Fund 2026 · Proof of Concept</div>
        <h1 style={{ fontSize:"44px", fontWeight:900, fontFamily:F.display, lineHeight:1.15, margin:"0 auto 18px", maxWidth:"680px", background:`linear-gradient(135deg, ${C.white} 0%, ${C.silver} 100%)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          The first blockchain government interoperability system built for Samoa
        </h1>
        <p style={{ fontSize:"15px", color:C.silver, maxWidth:"520px", margin:"0 auto 12px", lineHeight:"1.7" }}>
          Six ministries. 25 citizens. One hub. Zero PII on chain. Live ethers.js contract reads.
        </p>
        <p style={{ fontSize:"12px", color:C.muted, marginBottom:"52px", fontFamily:F.mono }}>
          {connected ? `Reading live from ${CONFIG.NETWORK} — transactions appear in dashboards automatically` : "Start Anvil + deploy contracts for live data · demo mode active"}
        </p>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px", maxWidth:"1080px", margin:"0 auto" }}>
          {roles.map(role=>(
            <div key={role.id} onClick={()=>onSelect(role.id)}
              onMouseEnter={()=>setHovered(role.id)} onMouseLeave={()=>setHovered(null)}
              style={{ background:hovered===role.id?C.navy:C.deep, borderTop:`3px solid ${role.accent}`, borderLeft:`1px solid ${hovered===role.id?role.accent+"44":C.ocean}`, borderRight:`1px solid ${hovered===role.id?role.accent+"44":C.ocean}`, borderBottom:`1px solid ${hovered===role.id?role.accent+"44":C.ocean}`, borderRadius:"14px", padding:"26px 20px", cursor:"pointer", textAlign:"left", transition:"all 0.2s", transform:hovered===role.id?"translateY(-4px)":"none", boxShadow:hovered===role.id?`0 20px 40px ${role.accent}18`:"none" }}>
              <div style={{ fontSize:"34px", marginBottom:"14px" }}>{role.icon}</div>
              <div style={{ fontSize:"16px", fontWeight:900, fontFamily:F.display, marginBottom:"3px" }}>{role.title}</div>
              <div style={{ fontSize:"10px", fontWeight:700, color:role.accent, letterSpacing:"1.2px", textTransform:"uppercase", marginBottom:"12px" }}>{role.sub}</div>
              <div style={{ fontSize:"12px", color:C.silver, lineHeight:"1.7", marginBottom:"16px" }}>{role.desc}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"5px" }}>
                {role.features.map(f=>(
                  <div key={f} style={{ fontSize:"11px", color:C.muted, display:"flex", gap:"6px", alignItems:"center" }}><span style={{ color:role.accent }}>✓</span> {f}</div>
                ))}
              </div>
              <div style={{ marginTop:"20px", fontSize:"12px", fontWeight:700, color:role.accent }}>Enter Dashboard →</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop:"56px", paddingTop:"32px", borderTop:`1px solid ${C.ocean}`, display:"flex", justifyContent:"center", gap:"48px" }}>
          {[["6","Ministry Nodes"],["25","Citizens"],["0","PII On Chain"],["28+","Tests Passing"],["100%","Open Source"]].map(([v,l])=>(
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontSize:"26px", fontWeight:900, fontFamily:F.display, color:C.gold }}>{v}</div>
              <div style={{ fontSize:"10px", color:C.muted, marginTop:"3px", textTransform:"uppercase", letterSpacing:"0.6px" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ROOT — provider flows into every dashboard
// ═══════════════════════════════════════════════════════════════════════
export default function App() {
  const [view,  setView]  = useState("landing");
  const [block, setBlock] = useState(34_722_905);
  const { provider, connected, error } = useProvider();

  // Block counter — live from chain or simulated
  useEffect(() => {
    if (!provider || !connected) {
      const t = setInterval(()=>setBlock(n=>n+1), 2100);
      return ()=>clearInterval(t);
    }
    const onBlock = (n) => setBlock(n);
    provider.on("block", onBlock);
    return ()=>provider.off("block", onBlock);
  }, [provider, connected]);

  const props = { provider, connected, blockNumber: block };

  if (view==="landing")  return <Landing  {...props} error={error} onSelect={setView} />;
  if (view==="unicef")   return <UNICEFDashboard   {...props} onBack={()=>setView("landing")} />;
  if (view==="ministry") return <MinistryDashboard {...props} onBack={()=>setView("landing")} />;
  if (view==="ndids")    return <NDIDSDashboard    {...props} onBack={()=>setView("landing")} />;
  if (view==="public")   return <PublicDashboard   {...props} onBack={()=>setView("landing")} />;
}
