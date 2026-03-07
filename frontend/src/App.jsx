/**
 * Samoa Pacific Blockchain Hub — Multi-Stakeholder Dashboard
 * Version 8 — Complete Workflow Interoperability
 *
 * NEW IN V8 (built on v7 foundation):
 *   - 6 complete end-to-end workflows:
 *       1. Education Benefit:       EDUCATION → MOF → CBS → EDUCATION → UNICEF auto-updates
 *       2. Customs Trade Clearance: CUSTOMS → MCIL → MOF → CBS → CUSTOMS release
 *       3. Social Welfare Payment:  MOF → CBS → MOF confirm
 *       4. Business Licence:        MCIL → MOF fee → MCIT issue
 *       5. Foreign Investment:      MCIL → MOF → MCIT → MCIL certificate
 *       6. UNICEF Grant Tranche:    EDUCATION/MOF evidence → UNICEF verify → CBS confirm
 *   - Every ministry dashboard: Pending Actions | Active Workflows | Record Service | My Records
 *   - Pending Actions: cross-ministry step detection, pre-filled one-click action
 *   - Active Workflows: per-citizen progress bars, blocking ministry shown
 *   - Enhanced ReceiptCard: ref number, officer hash, all steps, amount/fee, print/download
 *   - UNICEF dashboard: verifyUsage() + releaseTranche() from browser, auto beneficiary count
 *   - All v7 dashboards preserved: UNICEF Donor, Hub, per-ministry with search
 *
 * SETUP:
 *   1. npm install  (adds ethers ^6.9.0)
 *   2. anvil
 *   3. forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 \
 *        --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
 *        --broadcast -vvvv
 *   4. npm run dev  → http://localhost:5173
 */

import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";

// ---
// NETWORK CONFIG
// ---
const CONFIG = {
  RPC_URL: "http://127.0.0.1:8545",   // Anvil local
  NETWORK: "Anvil Local",
  POLL_MS: 3000,
};

const DEPLOYER_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

function getSigner(provider) {
  if (!provider) return null;
  return new ethers.Wallet(DEPLOYER_KEY, provider);
}

// ---
// CONTRACT ADDRESSES — deterministic Anvil
// ---
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

// ---
// ABIs
// ---
const ABI = {
  NDIDS: [
    "function totalRegistered() view returns (uint256)",
    "function isRegistered(bytes32) view returns (bool)",
    "function hasAccess(bytes32, address) view returns (bool)",
    "function serviceCount(bytes32) view returns (uint256)",
    "event CitizenRegistered(bytes32 indexed citizenHash, uint256 timestamp)",
  ],
  AID: [
    "function totalGrants() view returns (uint256)",
    "function totalDisbursed() view returns (uint256)",
    "function totalVerified() view returns (uint256)",
    "function getGrant(uint256) view returns (uint256,string,address,address,uint256,uint256,uint256,uint8,uint256,uint256,uint256,string)",
    "function getTranche(uint256,uint256) view returns (tuple(uint256 amount,string milestone,bytes32 evidenceHash,uint8 status,uint256 releasedAt,uint256 verifiedAt,address releasedBy,address verifiedBy))",
    "function getTrancheCount(uint256) view returns (uint256)",
    "function getAuditTrail(uint256) view returns (tuple(uint256 amount,string milestone,bytes32 evidenceHash,uint8 status,uint256 releasedAt,uint256 verifiedAt,address releasedBy,address verifiedBy)[])",
    "function verifyUsage(uint256 grantId, uint256 trancheId, bytes32 evidenceHash, uint256 beneficiariesServed) external",
    "function releaseTranche(uint256 grantId, uint256 trancheId) external",
    "event TrancheVerified(uint256 indexed grantId, uint256 indexed trancheId, bytes32 evidenceHash, uint256 beneficiariesServed, uint256 timestamp)",
    "event TrancheReleased(uint256 indexed grantId, uint256 indexed trancheId, uint256 amount, string milestone, uint256 timestamp)",
  ],
  HUB: [
    "function getMinistryCount() view returns (uint256)",
    "function getAllMinistries() view returns (tuple(string name, string code, address contractAddr, bool active, uint256 registeredAt)[])",
    "function getPermissions() view returns (tuple(string fromCode, string toCode, bool active, uint256 grantedAt)[])",
    "function getWorkflowLog() view returns (tuple(string workflowType, bytes32 citizenHash, string ministryCode, uint256 timestamp, bool success)[])",
  ],
  MINISTRY: [
    "function totalRecords() view returns (uint256)",
    "function ministryName() view returns (string)",
    "function ministryCode() view returns (string)",
    "function authorisedReaders(address) view returns (bool)",
    "function records(uint256) view returns (bytes32,string,bytes32,uint256,bool)",
    "function recordService(bytes32 citizenHash, string serviceType, bytes32 dataHash, bool ndidsVerified) external",
    "function authoriseReader(address reader) external",
    "function revokeReader(address reader) external",
  ],
};

// ---
// DESIGN SYSTEM
// ---
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
const btn   = (v="primary") => ({ display:"inline-flex", alignItems:"center", gap:"6px", background:v==="primary"?C.coral:v==="success"?C.seafoam:v==="amber"?C.amber:"transparent", color:v==="ghost"?C.silver:C.white, border:v==="ghost"?`1px solid ${C.ocean}`:"none", borderRadius:"8px", padding:"9px 18px", fontSize:"13px", fontWeight:700, fontFamily:F.ui, cursor:"pointer" });

// ---
// MINISTRY METADATA
// ---
const MINISTRY_META = {
  CBS:       { icon:"🏦", color:"#1B6CA8", name:"Central Bank of Samoa" },
  MCIT:      { icon:"💻", color:"#2E8B57", name:"Ministry of Communications & IT" },
  MOF:       { icon:"📊", color:"#6B4F9E", name:"Ministry of Finance" },
  EDUCATION: { icon:"📚", color:"#C8502A", name:"Ministry of Education, Sports & Culture" },
  MCIL:      { icon:"🏭", color:"#B8860B", name:"Ministry of Commerce, Industry & Labour" },
  CUSTOMS:   { icon:"🛃", color:"#1B8A8A", name:"Ministry of Customs & Revenue" },
};

const MINISTRY_ADDRS = {
  CBS:ADDR.CBS, MCIT:ADDR.MCIT, MOF:ADDR.MOF,
  MCIL:ADDR.MCIL, EDUCATION:ADDR.EDUCATION, CUSTOMS:ADDR.CUSTOMS,
};

// ---
// SERVICE TYPES PER MINISTRY
// ---
const SERVICE_TYPES = {
  EDUCATION: [
    { value:"SCHOOL_ENROLMENT_2025",   label:"School Enrolment",          desc:"Child enrolled in school — identity verified via NDIDS" },
    { value:"ATTENDANCE_RECORD",       label:"Attendance Record",          desc:"Monthly attendance recorded for enrolled student" },
    { value:"SCHOLARSHIP_AWARDED",     label:"Scholarship Awarded",        desc:"Scholarship granted — eligibility verified on chain" },
    { value:"GRADUATION_RECORD",       label:"Graduation / Completion",    desc:"Student completed education level" },
    { value:"SPECIAL_NEEDS_SUPPORT",   label:"Special Needs Support",      desc:"Additional educational support services recorded" },
  ],
  MOF: [
    { value:"EDUCATION_BENEFIT_ELIGIBLE_2025", label:"Education Benefit Approved", desc:"Citizen approved for school fee subsidy" },
    { value:"SOCIAL_WELFARE_PAYMENT_2025",     label:"Social Welfare Payment",     desc:"Welfare payment disbursed and recorded" },
    { value:"TAX_COMPLIANCE_VERIFIED",         label:"Tax Compliance Verified",    desc:"Citizen or business tax status confirmed" },
    { value:"BUDGET_ALLOCATION_RECORDED",      label:"Budget / Licence Fee",       desc:"Ministry budget allocation or government fee" },
    { value:"DUTY_PROCESSED",                  label:"Customs Duty Processed",     desc:"Import/export duty payment confirmed by MOF" },
  ],
  CBS: [
    { value:"ACCOUNT_OPENED",          label:"Bank Account Opened",        desc:"New bank account created — identity verified" },
    { value:"REMITTANCE_RECEIVED",     label:"Remittance Received",        desc:"International remittance received and recorded" },
    { value:"LOAN_APPROVED",           label:"Loan Approved",              desc:"Loan application approved — credit check on chain" },
    { value:"DIGITAL_PAYMENT_RECORDED",label:"Digital Payment",            desc:"Digital or mobile payment transaction recorded" },
    { value:"STABLECOIN_ISSUANCE",     label:"WST Stablecoin Issuance",    desc:"Digital WST issued against verified fiat reserve" },
  ],
  MCIT: [
    { value:"BUSINESS_LICENCE_DIGITAL",label:"Issue Business Licence",     desc:"Business licence issued and recorded digitally" },
    { value:"SPECTRUM_LICENCE_ISSUED", label:"Spectrum Licence Issued",    desc:"Radio/telecom spectrum licence granted" },
    { value:"DIGITAL_ID_ISSUED",       label:"Digital ID Issued",          desc:"Government digital identity credential issued" },
    { value:"CYBERSECURITY_AUDIT",     label:"Cybersecurity Audit",        desc:"Organisation cybersecurity compliance recorded" },
    { value:"ICT_REGISTRATION",        label:"ICT Sector Approval",        desc:"ICT/sector review for investment or registration" },
  ],
  MCIL: [
    { value:"TRADE_LICENCE_UPDATED",         label:"Trade Licence Verified",      desc:"Importer trade licence verified for customs" },
    { value:"LABOUR_CONTRACT_RECORDED",      label:"Investment Certificate",      desc:"MCIL investment certificate issued" },
    { value:"FOREIGN_INVESTMENT_APPROVED",   label:"Foreign Investment Review",   desc:"FDI application received and reviewed by MCIL" },
    { value:"COMPANY_REGISTRATION",          label:"Company Registration",        desc:"New company registered — eligibility check" },
    { value:"DISPUTE_RESOLUTION_RECORDED",   label:"Dispute Resolution",          desc:"Labour or commercial dispute outcome recorded" },
  ],
  CUSTOMS: [
    { value:"SHIPMENT_CLEARED_2025",     label:"Record Shipment Manifest",   desc:"Import/export shipment manifest recorded" },
    { value:"TRADE_FACILITATION_RECORD", label:"Release Container ✓",        desc:"Final clearance — container released" },
    { value:"TARIFF_CLASSIFICATION",     label:"Tariff Classification",      desc:"Goods tariff code assigned and recorded" },
    { value:"PROHIBITED_GOODS_FLAGGED",  label:"Prohibited Goods Flagged",   desc:"Prohibited or restricted goods flagged at border" },
    { value:"BOND_WAREHOUSE_RECORD",     label:"Bond Warehouse Entry",       desc:"Goods entered into bonded warehouse" },
  ],
};

function serviceLabel(code) {
  for (const types of Object.values(SERVICE_TYPES)) {
    const f = types.find(t => t.value === code);
    if (f) return f.label;
  }
  return code;
}
function serviceDesc(code) {
  for (const types of Object.values(SERVICE_TYPES)) {
    const f = types.find(t => t.value === code);
    if (f) return f.desc;
  }
  return "";
}

// ---
// WORKFLOW ENGINE
// 6 end-to-end workflows defined as ordered step arrays
// Each step: { ministry, serviceType, label, fee }
// ---
const WORKFLOW_DEFS = {
  "EDU-BENEFIT": {
    name: "Education Benefit & UNICEF Grant",
    icon: "📚",
    steps: [
      { ministry:"EDUCATION", serviceType:"SCHOOL_ENROLMENT_2025",          label:"Record School Enrolment",           fee:false },
      { ministry:"MOF",       serviceType:"EDUCATION_BENEFIT_ELIGIBLE_2025", label:"Approve Education Benefit",         fee:false },
      { ministry:"CBS",       serviceType:"DIGITAL_PAYMENT_RECORDED",        label:"Process Benefit Payment to Family", fee:true  },
      { ministry:"EDUCATION", serviceType:"ATTENDANCE_RECORD",               label:"Confirm Benefit Received",          fee:false },
    ],
  },
  "CUSTOMS-CLEAR": {
    name: "Customs Trade Clearance",
    icon: "🛃",
    steps: [
      { ministry:"CUSTOMS", serviceType:"SHIPMENT_CLEARED_2025",     label:"Record Shipment Manifest",      fee:false },
      { ministry:"MCIL",    serviceType:"TRADE_LICENCE_UPDATED",     label:"Verify Importer Trade Licence", fee:false },
      { ministry:"MOF",     serviceType:"DUTY_PROCESSED",            label:"Confirm Duty Payment",          fee:true  },
      { ministry:"CBS",     serviceType:"DIGITAL_PAYMENT_RECORDED",  label:"Clear Duty Funds via CBS",      fee:true  },
      { ministry:"CUSTOMS", serviceType:"TRADE_FACILITATION_RECORD", label:"Release Container ✓",           fee:false },
    ],
  },
  "WELFARE": {
    name: "Social Welfare Disbursement",
    icon: "💰",
    steps: [
      { ministry:"MOF", serviceType:"SOCIAL_WELFARE_PAYMENT_2025", label:"Approve Welfare Payment",        fee:false },
      { ministry:"CBS", serviceType:"DIGITAL_PAYMENT_RECORDED",    label:"Process Payment to Recipient",   fee:true  },
      { ministry:"MOF", serviceType:"TAX_COMPLIANCE_VERIFIED",     label:"MOF Confirm Payment Completed ✓",fee:false },
    ],
  },
  "BIZ-LICENCE": {
    name: "Business Licence",
    icon: "🏢",
    steps: [
      { ministry:"MCIL", serviceType:"COMPANY_REGISTRATION",       label:"MCIL: Register & Verify Eligibility", fee:false },
      { ministry:"MOF",  serviceType:"BUDGET_ALLOCATION_RECORDED", label:"MOF: Process Licence Fee",            fee:true  },
      { ministry:"MCIT", serviceType:"BUSINESS_LICENCE_DIGITAL",   label:"MCIT: Issue Digital Licence ✓",       fee:false },
    ],
  },
  "FOREIGN-INV": {
    name: "Foreign Investment Approval",
    icon: "🌏",
    steps: [
      { ministry:"MCIL", serviceType:"FOREIGN_INVESTMENT_APPROVED", label:"MCIL: Application Review",            fee:false },
      { ministry:"MOF",  serviceType:"TAX_COMPLIANCE_VERIFIED",     label:"MOF: Tax & Compliance Clearance",     fee:false },
      { ministry:"MCIT", serviceType:"ICT_REGISTRATION",            label:"MCIT: Sector Review & Approval",      fee:false },
      { ministry:"MCIL", serviceType:"LABOUR_CONTRACT_RECORDED",    label:"MCIL: Issue Investment Certificate ✓",fee:false },
    ],
  },
  "UNICEF-TRANCHE": {
    name: "UNICEF Grant Tranche",
    icon: "🌐",
    steps: [
      { ministry:"EDUCATION", serviceType:"GRADUATION_RECORD",          label:"EDUCATION: Submit Evidence",          fee:false },
      { ministry:"MOF",       serviceType:"BUDGET_ALLOCATION_RECORDED", label:"MOF: Financial Evidence Confirmed",   fee:false },
    ],
    // Steps 3+4 handled in UNICEF dashboard: verifyUsage() + releaseTranche()
  },
};

// Build reverse lookup: serviceType → [{ workflowId, stepIndex }]
const SVC_TO_WF = {};
Object.entries(WORKFLOW_DEFS).forEach(([wfId, wf]) => {
  wf.steps.forEach((step, idx) => {
    if (!SVC_TO_WF[step.serviceType]) SVC_TO_WF[step.serviceType] = [];
    SVC_TO_WF[step.serviceType].push({ workflowId:wfId, stepIndex:idx });
  });
});

// Build ministry → [workflowId] map
const MINISTRY_WFS = {};
Object.entries(WORKFLOW_DEFS).forEach(([wfId, wf]) => {
  wf.steps.forEach(step => {
    if (!MINISTRY_WFS[step.ministry]) MINISTRY_WFS[step.ministry] = [];
    if (!MINISTRY_WFS[step.ministry].includes(wfId)) MINISTRY_WFS[step.ministry].push(wfId);
  });
});

// ---
// NDIDS VERIFICATION POLICY
// Derived from Deploy.s.sol grantReadAccess assignments.
// Each ministry only has NDIDS access to its OWN sector's citizens.
// Cross-workflow steps (e.g. CBS processing a payment for an edu citizen)
// must submit with verifyViaNDIDS=false — identity was verified upstream.
//
// Rule: true  = this ministry CAN verify this serviceType via NDIDS
//       false = payment/processing step — identity already verified upstream
// ---
const NDIDS_POLICY = {
  // EDUCATION — owns edu citizens, verifies all its own service types
  EDUCATION: {
    SCHOOL_ENROLMENT_2025:   true,   // step 1 EDU-BENEFIT — edu citizen, EDUCATION has access
    ATTENDANCE_RECORD:       true,   // step 4 EDU-BENEFIT — confirming receipt, still edu citizen
    SCHOLARSHIP_AWARDED:     true,
    GRADUATION_RECORD:       true,
    SPECIAL_NEEDS_SUPPORT:   true,
  },
  // MOF — has access to edu + welfare + trade citizens
  MOF: {
    EDUCATION_BENEFIT_ELIGIBLE_2025: true,   // step 2 EDU-BENEFIT — MOF has eduHash access
    SOCIAL_WELFARE_PAYMENT_2025:     true,   // step 1 WELFARE — MOF has welfareHash access
    TAX_COMPLIANCE_VERIFIED:         true,   // step 3 WELFARE / step 2 FOREIGN-INV — trade/welfare
    DUTY_PROCESSED:                  true,   // step 3 CUSTOMS-CLEAR — MOF has tradeHash access
    BUDGET_ALLOCATION_RECORDED:      false,  // step 2 BIZ-LICENCE — MOF NOT in bizHash grants
  },
  // CBS — payment processor only, NO cross-sector NDIDS access
  // CBS owns cbsHashes (SAMOA-CBS-001/002/003) only
  // All cross-workflow payments use citizens from other sectors → NO NDIDS verify
  CBS: {
    DIGITAL_PAYMENT_RECORDED: false,  // used in EDU-BENEFIT/WELFARE/CUSTOMS — cross-sector
    REMITTANCE_RECEIVED:       true,  // CBS own sector citizen (SAMOA-CBS-xxx)
    ACCOUNT_OPENED:            true,  // CBS own sector citizen
    LOAN_APPROVED:             true,  // CBS own sector citizen
    STABLECOIN_ISSUANCE:       true,  // CBS own sector citizen
  },
  // CUSTOMS — owns trade citizens
  CUSTOMS: {
    SHIPMENT_CLEARED_2025:     true,
    TRADE_FACILITATION_RECORD: true,
    TARIFF_CLASSIFICATION:     true,
    PROHIBITED_GOODS_FLAGGED:  true,
    BOND_WAREHOUSE_RECORD:     true,
  },
  // MCIL — owns biz + trade citizens
  MCIL: {
    COMPANY_REGISTRATION:        true,
    FOREIGN_INVESTMENT_APPROVED: true,
    LABOUR_CONTRACT_RECORDED:    true,
    TRADE_LICENCE_UPDATED:       true,
    DISPUTE_RESOLUTION_RECORDED: true,
  },
  // MCIT — owns biz citizens [4,5,6]
  MCIT: {
    BUSINESS_LICENCE_DIGITAL: true,
    ICT_REGISTRATION:         true,
    SPECTRUM_LICENCE_ISSUED:  true,
    DIGITAL_ID_ISSUED:        true,
    CYBERSECURITY_AUDIT:      true,
  },
};

// Helper: should this ministry verify NDIDS for this serviceType?
function shouldVerifyNDIDS(ministryCode, serviceType) {
  const policy = NDIDS_POLICY[ministryCode];
  if (!policy) return false; // unknown ministry — safe default
  if (policy[serviceType] === undefined) return false; // unknown service — safe default
  return policy[serviceType];
}

// ---
// LEGACY WORKFLOW DEFINITIONS (v7 — kept for ReceiptCard compatibility)
// ---
const WORKFLOWS = {
  SCHOOL_ENROLMENT_2025:          { workflowName:"Education Benefit & UNICEF Grant", workflowId:"EDU-BENEFIT",   step:1, totalSteps:4, owner:"EDUCATION", stepLabel:"Step 1 of 4 — Enrolment Recorded",         nextStep:{ ministry:"MOF",       action:"Approve school fee benefit",        serviceType:"EDUCATION_BENEFIT_ELIGIBLE_2025" }, prevSteps:[],                                                                                  receipt:{ label:"Enrolment Reference",             prefix:"EDU"       }, notice:"MOF will see this in their Pending Actions and must approve the benefit payment." },
  EDUCATION_BENEFIT_ELIGIBLE_2025:{ workflowName:"Education Benefit & UNICEF Grant", workflowId:"EDU-BENEFIT",   step:2, totalSteps:4, owner:"MOF",       stepLabel:"Step 2 of 4 — Benefit Approved by MOF",    nextStep:{ ministry:"CBS",       action:"Process benefit payment to family", serviceType:"DIGITAL_PAYMENT_RECORDED"         }, prevSteps:[{ ministry:"EDUCATION", label:"Enrolment recorded"          }],  receipt:{ label:"Benefit Approval Reference",      prefix:"MOF-BEN"   }, notice:"CBS must now process the payment. Amount and CBS ref required." },
  DIGITAL_PAYMENT_RECORDED:       { workflowName:"Education Benefit & UNICEF Grant", workflowId:"EDU-BENEFIT",   step:3, totalSteps:4, owner:"CBS",       stepLabel:"Step 3 of 4 — Payment Processed by CBS",   nextStep:{ ministry:"EDUCATION", action:"Confirm benefit received by family",serviceType:"ATTENDANCE_RECORD"               }, prevSteps:[{ ministry:"EDUCATION", label:"Enrolment recorded"          },{ ministry:"MOF", label:"Benefit approved" }], receipt:{ label:"Payment Reference",               prefix:"CBS-PAY"   }, notice:"Education must confirm receipt to complete workflow and trigger UNICEF tranche." },
  SHIPMENT_CLEARED_2025:          { workflowName:"Customs Trade Clearance",          workflowId:"CUSTOMS-CLEAR", step:1, totalSteps:5, owner:"CUSTOMS",   stepLabel:"Step 1 of 5 — Shipment Manifest Recorded", nextStep:{ ministry:"MCIL",      action:"Verify importer trade licence",     serviceType:"TRADE_LICENCE_UPDATED"           }, prevSteps:[],                                                                                  receipt:{ label:"Customs Tracking Reference",      prefix:"CST"       }, notice:"MCIL must verify the importer holds a valid trade licence." },
  TRADE_LICENCE_UPDATED:          { workflowName:"Customs Trade Clearance",          workflowId:"CUSTOMS-CLEAR", step:2, totalSteps:5, owner:"MCIL",      stepLabel:"Step 2 of 5 — Trade Licence Verified",    nextStep:{ ministry:"MOF",       action:"Calculate and confirm duty payment", serviceType:"DUTY_PROCESSED"                  }, prevSteps:[{ ministry:"CUSTOMS",   label:"Manifest recorded"          }],  receipt:{ label:"MCIL Licence Verification Ref",   prefix:"MCIL-LIC"  }, notice:"MOF must process and confirm the customs duty payment." },
  DUTY_PROCESSED:                 { workflowName:"Customs Trade Clearance",          workflowId:"CUSTOMS-CLEAR", step:3, totalSteps:5, owner:"MOF",       stepLabel:"Step 3 of 5 — Duty Confirmed by MOF",     nextStep:{ ministry:"CBS",       action:"Confirm duty funds cleared",        serviceType:"DIGITAL_PAYMENT_RECORDED"        }, prevSteps:[{ ministry:"CUSTOMS",   label:"Manifest recorded"          },{ ministry:"MCIL",label:"Licence verified" }], receipt:{ label:"Duty Payment Reference",           prefix:"MOF-DUTY"  }, notice:"CBS must confirm the duty funds have cleared." },
  TRADE_FACILITATION_RECORD:      { workflowName:"Customs Trade Clearance",          workflowId:"CUSTOMS-CLEAR", step:5, totalSteps:5, owner:"CUSTOMS",   stepLabel:"Step 5 of 5 — Container Released ✓",      nextStep:null,                                                                                                                          prevSteps:[{ ministry:"CUSTOMS",   label:"Manifest recorded"          },{ ministry:"MCIL",label:"Licence verified" },{ ministry:"MOF",label:"Duty confirmed" },{ ministry:"CBS",label:"Funds cleared" }], receipt:{ label:"Clearance Certificate Reference",prefix:"CST-CLEAR" }, notice:"Workflow complete. Clearance certificate generated on chain." },
  SOCIAL_WELFARE_PAYMENT_2025:    { workflowName:"Social Welfare Disbursement",      workflowId:"WELFARE",       step:1, totalSteps:3, owner:"MOF",       stepLabel:"Step 1 of 3 — Welfare Approved",          nextStep:{ ministry:"CBS",       action:"Process welfare payment",           serviceType:"DIGITAL_PAYMENT_RECORDED"        }, prevSteps:[],                                                                                  receipt:{ label:"Welfare Payment Reference",       prefix:"MOF-WEL"  }, notice:"CBS must process the payment to the recipient account." },
  COMPANY_REGISTRATION:           { workflowName:"Business Licence",                 workflowId:"BIZ-LICENCE",   step:1, totalSteps:3, owner:"MCIL",      stepLabel:"Step 1 of 3 — Company Registered",        nextStep:{ ministry:"MOF",       action:"Process licence fee",               serviceType:"BUDGET_ALLOCATION_RECORDED"      }, prevSteps:[],                                                                                  receipt:{ label:"Company Registration Reference",  prefix:"MCIL-CRG" }, notice:"MOF must collect and process the licence fee." },
  BUDGET_ALLOCATION_RECORDED:     { workflowName:"Business Licence",                 workflowId:"BIZ-LICENCE",   step:2, totalSteps:3, owner:"MOF",       stepLabel:"Step 2 of 3 — Fee Processed by MOF",      nextStep:{ ministry:"MCIT",      action:"Issue digital business licence",    serviceType:"BUSINESS_LICENCE_DIGITAL"        }, prevSteps:[{ ministry:"MCIL",      label:"Company registered"         }],  receipt:{ label:"Fee Payment Reference",           prefix:"MOF-FEE"  }, notice:"MCIT must now issue the digital business licence on chain." },
  BUSINESS_LICENCE_DIGITAL:       { workflowName:"Business Licence",                 workflowId:"BIZ-LICENCE",   step:3, totalSteps:3, owner:"MCIT",      stepLabel:"Step 3 of 3 — Licence Issued ✓",          nextStep:null,                                                                                                                          prevSteps:[{ ministry:"MCIL",      label:"Company registered"         },{ ministry:"MOF",label:"Fee processed" }], receipt:{ label:"Business Licence Reference",      prefix:"MCIT-LIC" }, notice:"Workflow complete. Digital business licence permanently on chain." },
  FOREIGN_INVESTMENT_APPROVED:    { workflowName:"Foreign Investment Approval",      workflowId:"FOREIGN-INV",   step:1, totalSteps:4, owner:"MCIL",      stepLabel:"Step 1 of 4 — MCIL Review",               nextStep:{ ministry:"MOF",       action:"Tax & compliance clearance",        serviceType:"TAX_COMPLIANCE_VERIFIED"         }, prevSteps:[],                                                                                  receipt:{ label:"FDI Application Reference",       prefix:"MCIL-FDI" }, notice:"MOF must clear tax and compliance." },
  TAX_COMPLIANCE_VERIFIED:        { workflowName:"Foreign Investment Approval",      workflowId:"FOREIGN-INV",   step:2, totalSteps:4, owner:"MOF",       stepLabel:"Step 2 of 4 — MOF Clearance",             nextStep:{ ministry:"MCIT",      action:"Sector review and approval",        serviceType:"ICT_REGISTRATION"                }, prevSteps:[{ ministry:"MCIL",      label:"Application reviewed"       }],  receipt:{ label:"Tax Compliance Reference",        prefix:"MOF-TAX"  }, notice:"MCIT must complete sector review before MCIL issues certificate." },
  ICT_REGISTRATION:               { workflowName:"Foreign Investment Approval",      workflowId:"FOREIGN-INV",   step:3, totalSteps:4, owner:"MCIT",      stepLabel:"Step 3 of 4 — MCIT Sector Approval",      nextStep:{ ministry:"MCIL",      action:"Issue investment certificate",      serviceType:"LABOUR_CONTRACT_RECORDED"        }, prevSteps:[{ ministry:"MCIL",      label:"Application reviewed"       },{ ministry:"MOF",label:"Tax cleared" }], receipt:{ label:"Sector Approval Reference",       prefix:"MCIT-INV" }, notice:"MCIL must now issue the final investment certificate." },
  LABOUR_CONTRACT_RECORDED:       { workflowName:"Foreign Investment Approval",      workflowId:"FOREIGN-INV",   step:4, totalSteps:4, owner:"MCIL",      stepLabel:"Step 4 of 4 — Certificate Issued ✓",      nextStep:null,                                                                                                                          prevSteps:[{ ministry:"MCIL",      label:"Application reviewed"       },{ ministry:"MOF",label:"Tax cleared" },{ ministry:"MCIT",label:"Sector approved" }], receipt:{ label:"Investment Certificate Reference",prefix:"MCIL-CERT"}, notice:"Workflow complete. Investment certificate permanently on chain." },
  GRADUATION_RECORD:              { workflowName:"UNICEF Grant Tranche",             workflowId:"UNICEF-TRANCHE",step:1, totalSteps:2, owner:"EDUCATION", stepLabel:"Step 1 of 2 — Evidence Submitted",        nextStep:{ ministry:"MOF",       action:"Confirm financial evidence",        serviceType:"BUDGET_ALLOCATION_RECORDED"      }, prevSteps:[],                                                                                  receipt:{ label:"Evidence Reference",              prefix:"EDU-EVID" }, notice:"MOF must confirm financial evidence before UNICEF can verify tranche." },
  // Standalone records
  ATTENDANCE_RECORD:     { workflowName:"Education Record",  workflowId:"EDU-ATT",    step:1, totalSteps:1, owner:"EDUCATION", stepLabel:"Standalone", nextStep:null, prevSteps:[], receipt:{ label:"Attendance Reference",  prefix:"EDU-ATT"  }, notice:"Attendance recorded on chain." },
  SCHOLARSHIP_AWARDED:   { workflowName:"Scholarship",       workflowId:"EDU-SCH",    step:1, totalSteps:1, owner:"EDUCATION", stepLabel:"Standalone", nextStep:null, prevSteps:[], receipt:{ label:"Scholarship Reference", prefix:"EDU-SCH"  }, notice:"Scholarship recorded on chain." },
  SPECIAL_NEEDS_SUPPORT: { workflowName:"Special Needs",     workflowId:"EDU-SN",     step:1, totalSteps:1, owner:"EDUCATION", stepLabel:"Standalone", nextStep:null, prevSteps:[], receipt:{ label:"Support Reference",    prefix:"EDU-SN"   }, notice:"Support services recorded on chain." },
  ACCOUNT_OPENED:        { workflowName:"Account Opening",   workflowId:"CBS-ACCT",   step:1, totalSteps:1, owner:"CBS",       stepLabel:"Standalone", nextStep:null, prevSteps:[], receipt:{ label:"Account Reference",    prefix:"CBS-ACCT" }, notice:"Account opening recorded on chain." },
  REMITTANCE_RECEIVED:   { workflowName:"Remittance",        workflowId:"CBS-REM",    step:1, totalSteps:1, owner:"CBS",       stepLabel:"Standalone", nextStep:null, prevSteps:[], receipt:{ label:"Remittance Reference", prefix:"CBS-REM"  }, notice:"Remittance recorded on chain." },
  LOAN_APPROVED:         { workflowName:"Loan",              workflowId:"CBS-LOAN",   step:1, totalSteps:1, owner:"CBS",       stepLabel:"Standalone", nextStep:null, prevSteps:[], receipt:{ label:"Loan Reference",       prefix:"CBS-LOAN" }, notice:"Loan approval recorded on chain." },
  STABLECOIN_ISSUANCE:   { workflowName:"WST Stablecoin",    workflowId:"CBS-WST",    step:1, totalSteps:1, owner:"CBS",       stepLabel:"Standalone", nextStep:null, prevSteps:[], receipt:{ label:"Issuance Reference",   prefix:"CBS-WST"  }, notice:"WST stablecoin issuance recorded." },
  SPECTRUM_LICENCE_ISSUED:{ workflowName:"Spectrum Licence", workflowId:"MCIT-SPEC",  step:1, totalSteps:1, owner:"MCIT",      stepLabel:"Standalone", nextStep:null, prevSteps:[], receipt:{ label:"Spectrum Reference",   prefix:"MCIT-SPEC"}, notice:"Spectrum licence recorded on chain." },
  DIGITAL_ID_ISSUED:     { workflowName:"Digital ID",        workflowId:"MCIT-DID",   step:1, totalSteps:1, owner:"MCIT",      stepLabel:"Standalone", nextStep:null, prevSteps:[], receipt:{ label:"Digital ID Reference",  prefix:"MCIT-DID" }, notice:"Digital ID issuance recorded." },
  CYBERSECURITY_AUDIT:   { workflowName:"Cyber Audit",       workflowId:"MCIT-CYBER", step:1, totalSteps:1, owner:"MCIT",      stepLabel:"Standalone", nextStep:null, prevSteps:[], receipt:{ label:"Audit Reference",       prefix:"MCIT-AUD" }, notice:"Cybersecurity audit recorded on chain." },
  DISPUTE_RESOLUTION_RECORDED:{ workflowName:"Dispute",      workflowId:"MCIL-DIS",   step:1, totalSteps:1, owner:"MCIL",      stepLabel:"Standalone", nextStep:null, prevSteps:[], receipt:{ label:"Dispute Reference",    prefix:"MCIL-DIS" }, notice:"Dispute resolution recorded on chain." },
  TARIFF_CLASSIFICATION: { workflowName:"Tariff",            workflowId:"CST-TAR",    step:1, totalSteps:1, owner:"CUSTOMS",   stepLabel:"Standalone", nextStep:null, prevSteps:[], receipt:{ label:"Tariff Reference",      prefix:"CST-TAR"  }, notice:"Tariff classification recorded on chain." },
  PROHIBITED_GOODS_FLAGGED:{ workflowName:"Prohibited Goods",workflowId:"CST-PROHIB", step:1, totalSteps:1, owner:"CUSTOMS",   stepLabel:"Flagged",    nextStep:null, prevSteps:[], receipt:{ label:"Flag Reference",         prefix:"CST-FLAG" }, notice:"Prohibited goods flagged. MCIL notified." },
  BOND_WAREHOUSE_RECORD: { workflowName:"Bond Warehouse",    workflowId:"CST-BOND",   step:1, totalSteps:1, owner:"CUSTOMS",   stepLabel:"Standalone", nextStep:null, prevSteps:[], receipt:{ label:"Warehouse Reference",   prefix:"CST-BOND" }, notice:"Bond warehouse entry recorded on chain." },
};

// ---
// FALLBACK MOCK DATA
// ---
const MOCK = {
  totalRegistered:25, totalDisbursed:70000, totalVerified:30000, totalGrants:1, ministryCount:6,
  grant:{ id:0, title:"UNICEF Samoa Education Access Programme 2025", donor:"UNICEF Pacific", recipient:"Ministry of Education", totalAmount:100000, releasedAmount:70000, verifiedAmount:30000, status:0, targetBeneficiaries:50, actualBeneficiaries:23, sector:"EDUCATION" },
  tranches:[
    { amount:30000, milestone:"Programme setup and capacity training complete",          evidenceHash:"0x516d58377a396b506d4e33725438774c", status:2, releasedAt:1736956800, verifiedAt:1738396800, releasedBy:"0xf39F...", verifiedBy:"0xf39F..." },
    { amount:40000, milestone:"50 children enrolled with verified attendance records",   evidenceHash:"0x0000000000000000000000000000000000000000000000000000000000000000", status:1, releasedAt:1740826800, verifiedAt:0, releasedBy:"0xf39F...", verifiedBy:"0x0000..." },
    { amount:30000, milestone:"End-of-term learning outcomes documented",                evidenceHash:"0x0000000000000000000000000000000000000000000000000000000000000000", status:0, releasedAt:0, verifiedAt:0, releasedBy:"0x0000...", verifiedBy:"0x0000..." },
  ],
  permissions:[
    { fromCode:"EDUCATION", toCode:"MOF",  active:true, grantedAt:1736496000 },
    { fromCode:"CBS",       toCode:"MOF",  active:true, grantedAt:1736496000 },
    { fromCode:"CUSTOMS",   toCode:"MCIL", active:true, grantedAt:1736496000 },
    { fromCode:"MCIL",      toCode:"MOF",  active:true, grantedAt:1738166400 },
  ],
  workflows:[
    { workflowType:"ENROLMENT_AND_BENEFIT", citizenHash:"0x6219...f373", ministryCode:"MULTI", timestamp:1740823862, success:true },
    { workflowType:"TRADE_WORKFLOW",        citizenHash:"0x431e...5101", ministryCode:"MULTI", timestamp:1740910800, success:true },
    { workflowType:"AID_TRANCHE_RELEASE",   citizenHash:"0x0000...0000", ministryCode:"AID",   timestamp:1740996000, success:true },
  ],
};

// ---
// HELPERS
// ---
function generateRef(txHash, prefix) {
  if (!txHash) return `${prefix}-PENDING`;
  const short = txHash.slice(2, 10).toUpperCase();
  const ts    = Date.now().toString(36).toUpperCase().slice(-4);
  return `${prefix}-${ts}-${short}`;
}
function fmtTs(ts) {
  if (!ts || ts === 0) return "—";
  return new Date(Number(ts) * 1000).toISOString().slice(0,16).replace("T"," ");
}
function short(addr) {
  if (!addr || addr === ethers.ZeroAddress || addr === "0x0000...") return "—";
  const s = addr.toString();
  return s.slice(0,8)+"..."+s.slice(-6);
}
function fmtEvidence(h) {
  if (!h || h === ethers.ZeroHash || h === "0x"+"0".repeat(64)) return null;
  return h.toString().slice(0,20)+"...";
}
function officerHashFor(officerId) {
  return ethers.keccak256(ethers.toUtf8Bytes(`OFFICER:${officerId}:${DEPLOYER_KEY.slice(2,10)}`));
}

// ---
// CROSS-MINISTRY WORKFLOW ENGINE
// ---

// Detect pending actions: for a given ministry, which workflow steps are
// ready (prev step complete on chain) but not yet done by this ministry?
function getPendingActions(ministryCode, allRecords) {
  const pending = [];
  const myWfIds = MINISTRY_WFS[ministryCode] || [];
  myWfIds.forEach(wfId => {
    const wf = WORKFLOW_DEFS[wfId];
    wf.steps.forEach((step, idx) => {
      if (step.ministry !== ministryCode) return;
      if (idx === 0) return; // first step has no prerequisite from another ministry
      const prevStep = wf.steps[idx - 1];
      // Find all on-chain records for previous step
      const prevRecs = allRecords.filter(r => r.serviceType === prevStep.serviceType);
      prevRecs.forEach(prevRec => {
        // Check if this ministry's step is already done for this citizenHash
        const alreadyDone = allRecords.some(r =>
          r.serviceType === step.serviceType && r.citizenHash === prevRec.citizenHash
        );
        if (!alreadyDone) {
          pending.push({
            wfId, wfName: wf.name, stepIndex: idx, step, prevStep,
            citizenHash: prevRec.citizenHash,
            prevRecord: prevRec,
          });
        }
      });
    });
  });
  return pending;
}

// For active workflows: per citizen, how many steps done?
function getActiveWorkflows(ministryCode, allRecords) {
  const myWfIds = MINISTRY_WFS[ministryCode] || [];
  return myWfIds.map(wfId => {
    const wf = WORKFLOW_DEFS[wfId];
    const citizens = {};
    wf.steps.forEach((step, idx) => {
      allRecords.filter(r => r.serviceType === step.serviceType).forEach(r => {
        if (!citizens[r.citizenHash]) citizens[r.citizenHash] = { hash:r.citizenHash, stepsCompleted:0 };
        if (idx + 1 > citizens[r.citizenHash].stepsCompleted)
          citizens[r.citizenHash].stepsCompleted = idx + 1;
      });
    });
    return { wfId, wf, citizens: Object.values(citizens) };
  }).filter(w => w.citizens.length > 0);
}

// ---
// SHARED UI COMPONENTS
// ---
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
  const label = { "0":"Pending","1":"Released","2":"Verified",0:"Pending",1:"Released",2:"Verified" }[status] || String(status);
  const color = { Verified:C.seafoam, Released:"#4A9EE0", Pending:C.amber }[label] || C.muted;
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
        <button key={t.id} onClick={() => onChange(t.id)} style={{ padding:"13px 18px", border:"none", background:"none", cursor:"pointer", fontSize:"12px", fontWeight:active===t.id?800:500, fontFamily:F.ui, color:active===t.id?C.white:C.muted, whiteSpace:"nowrap", borderBottom:`2px solid ${active===t.id?accent:"transparent"}`, marginBottom:"-1px", display:"flex", alignItems:"center", gap:"6px" }}>
          {t.icon} {t.label} {t.badge ? <span style={{ background:C.coral, color:C.white, borderRadius:"10px", padding:"1px 6px", fontSize:"9px", fontWeight:900 }}>{t.badge}</span> : null}
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

// Workflow step bar — shows progress across N steps
function WfBar({ wfId, stepsCompleted }) {
  const wf = WORKFLOW_DEFS[wfId];
  if (!wf) return null;
  const total = wf.steps.length;
  return (
    <div>
      <div style={{ display:"flex", gap:"3px" }}>
        {Array.from({length:total},(_,i)=>(
          <div key={i} style={{ flex:1, height:"5px", borderRadius:"3px", background:i<stepsCompleted?C.seafoam:i===stepsCompleted?C.coral:C.ocean }} />
        ))}
      </div>
      <div style={{ fontSize:"9px", color:C.muted, marginTop:"3px" }}>{stepsCompleted}/{total} steps · {wf.name}</div>
    </div>
  );
}

// ---
// ENHANCED RECEIPT CARD — v8
// Shows reference number, officer hash, amount/fee, all steps, print/download
// ---
function WorkflowProgress({ wf, currentStep }) {
  if (!wf || wf.totalSteps <= 1) return null;
  return (
    <div style={{ marginTop:"12px" }}>
      <div style={{ fontSize:"10px", fontWeight:700, color:C.silver, marginBottom:"6px", textTransform:"uppercase", letterSpacing:"0.8px" }}>
        Workflow Progress — {wf.workflowName}
      </div>
      <div style={{ display:"flex", gap:"4px", alignItems:"center" }}>
        {Array.from({ length:wf.totalSteps }, (_, i) => {
          const stepNum   = i + 1;
          const isDone    = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          return (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:"4px", flex:1 }}>
              <div style={{ flex:1, height:"6px", borderRadius:"3px", background:isDone?C.seafoam:isCurrent?C.coral:C.ocean, transition:"all 0.3s" }} />
              {i < wf.totalSteps - 1 && <div style={{ width:"4px", height:"2px", background:C.wave }} />}
            </div>
          );
        })}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:"4px", fontSize:"9px", color:C.muted }}>
        <span>{wf.prevSteps?.map(s=>s.ministry).join(" → ") || "Start"}</span>
        <span style={{ color:C.coral }}>{wf.stepLabel}</span>
        {wf.nextStep && <span>{wf.nextStep.ministry} →</span>}
      </div>
    </div>
  );
}

function ReceiptCard({ txHash, citizenId, serviceType, evidenceNote, timestamp, ministry, amount, fee, officerId, onNext, onAnother }) {
  const wf         = WORKFLOWS[serviceType] || {};
  const ref        = generateRef(txHash, wf.receipt?.prefix || "SBP");
  const isComplete = !wf.nextStep;
  const oHash      = officerId ? officerHashFor(officerId) : null;

  const handlePrint = () => {
    const w = window.open("", "_blank", "width=700,height=900,scrollbars=yes");
    if (!w) {
      // Popup blocked — fall back to a printable blob URL
      const html = getPrintHtml(ref, wf, serviceType, ministry, citizenId, oHash, txHash, timestamp, amount, fee, evidenceNote);
      const blob = new Blob([html], { type:"text/html" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url; a.target = "_blank"; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      return;
    }
    w.document.write(getPrintHtml(ref, wf, serviceType, ministry, citizenId, oHash, txHash, timestamp, amount, fee, evidenceNote));
    w.document.close(); w.focus(); w.print();
  };

  function getPrintHtml(ref, wf, serviceType, ministry, citizenId, oHash, txHash, timestamp, amount, fee, evidenceNote) {
    return `<html><head><title>${ref}</title>
    <style>body{font-family:monospace;padding:24px;color:#111} h1{font-size:16px} .ref{font-size:22px;font-weight:900;color:#E8552A;margin:8px 0 16px} table{width:100%;border-collapse:collapse;margin-bottom:16px} td{padding:6px 8px;border-bottom:1px solid #eee;font-size:12px} td:first-child{color:#666;width:140px} .step{padding:3px 0;font-size:11px} .done{color:#0FB894} .cur{color:#E8552A;font-weight:700} .nxt{color:#D4860A} footer{font-size:10px;color:#999;margin-top:20px;border-top:1px solid #eee;padding-top:10px}</style>
    </head><body>
    <h1>🌺 Samoa Pacific Blockchain Hub</h1>
    <div class="ref">${ref}</div>
    <table>
      <tr><td>Workflow</td><td>${wf.workflowName || "Standalone"}</td></tr>
      <tr><td>Step</td><td>${wf.stepLabel || "1 of 1"}</td></tr>
      <tr><td>Service</td><td>${serviceLabel(serviceType)}</td></tr>
      <tr><td>Ministry</td><td>${ministry?.code} — ${ministry?.name}</td></tr>
      <tr><td>Citizen Hash</td><td>${citizenId ? ethers.keccak256(ethers.toUtf8Bytes(citizenId.trim())).slice(0,20)+"…" : "—"}</td></tr>
      <tr><td>Officer ID</td><td>${officerId || "—"}</td></tr>
      <tr><td>Officer Hash</td><td>${oHash ? oHash.slice(0,20)+"…" : "—"}</td></tr>
      ${amount ? `<tr><td>Amount</td><td>WST ${amount}</td></tr>` : ""}
      ${fee    ? `<tr><td>Gov Fee</td><td>WST ${fee}</td></tr>`   : ""}
      <tr><td>Tx Hash</td><td>${txHash ? txHash.slice(0,20)+"…" : "—"}</td></tr>
      <tr><td>Network</td><td>${CONFIG.NETWORK}</td></tr>
      <tr><td>Timestamp</td><td>${new Date(timestamp).toLocaleString()}</td></tr>
    </table>
    ${evidenceNote ? `<b>Evidence Note:</b><br/>${evidenceNote}<br/><small>Hash: ${ethers.keccak256(ethers.toUtf8Bytes(evidenceNote.trim())).slice(0,24)}…</small><br/><br/>` : ""}
    ${wf.prevSteps?.length ? `<b>Workflow Steps:</b><br/>
      ${wf.prevSteps.map((s,i)=>`<div class="step done">✓ Step ${i+1}: ${s.ministry} — ${s.label}</div>`).join("")}
      <div class="step cur">● Step ${wf.step}: ${ministry?.code} — ${serviceLabel(serviceType)} (this record)</div>
      ${wf.nextStep ? `<div class="step nxt">⏭ Step ${wf.step+1}: ${wf.nextStep.ministry} — ${wf.nextStep.action}</div>` : ""}
    ` : ""}
    <footer>Permanently recorded on ${CONFIG.NETWORK}. Contract: ${MINISTRY_ADDRS[ministry?.code] || "—"}<br/>Samoa Pacific Blockchain Hub v8 · Anthony George Williams · Synergy Blockchain Pacific</footer>
    </body></html>`;
  }

  return (
    <div style={{ ...card(), borderLeft:`4px solid ${isComplete ? C.seafoam : C.coral}`, maxWidth:"700px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"16px" }}>
        <div>
          <div style={{ fontSize:"22px", marginBottom:"4px" }}>{isComplete ? "✅" : "📋"}</div>
          <div style={{ fontSize:"16px", fontWeight:900, fontFamily:F.display, color:isComplete?C.seafoam:C.white }}>
            {isComplete ? "Workflow Complete — On Chain" : "Step Recorded On Chain"}
          </div>
          <div style={{ fontSize:"12px", color:C.silver, marginTop:"2px" }}>{wf.stepLabel || "Record confirmed"}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:"10px", color:C.muted, marginBottom:"3px" }}>Reference Number</div>
          <div style={{ fontFamily:F.mono, fontSize:"13px", fontWeight:700, color:C.seafoam, background:C.seafoam+"18", padding:"4px 10px", borderRadius:"6px" }}>{ref}</div>
        </div>
      </div>

      {/* Core detail grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"14px" }}>
        {[
          ["Service",      serviceLabel(serviceType)],
          ["Ministry",     ministry?.code],
          ["Citizen Hash", citizenId ? ethers.keccak256(ethers.toUtf8Bytes(citizenId.trim())).slice(0,14)+"…" : "—"],
          ["Officer Hash", oHash ? oHash.slice(0,14)+"…" : "—"],
          ["Timestamp",    new Date(timestamp).toLocaleString()],
          ["Tx Hash",      txHash ? txHash.slice(0,12)+"…"+txHash.slice(-6) : "—"],
          ...(amount ? [["Amount",  `WST ${amount}`]] : []),
          ...(fee    ? [["Gov Fee", `WST ${fee}`]]    : []),
          ["Network",      CONFIG.NETWORK],
        ].map(([label, val]) => (
          <div key={label} style={{ background:C.abyss, borderRadius:"6px", padding:"8px 12px" }}>
            <div style={{ fontSize:"9px", color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:"2px" }}>{label}</div>
            <div style={{ fontSize:"12px", color:C.white, fontFamily:["Citizen Hash","Officer Hash","Tx Hash"].includes(label)?F.mono:F.ui, fontWeight:600 }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Evidence note */}
      {evidenceNote && (
        <div style={{ background:C.abyss, borderRadius:"6px", padding:"10px 12px", marginBottom:"14px" }}>
          <div style={{ fontSize:"9px", color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:"3px" }}>Evidence Note (hashed on chain)</div>
          <div style={{ fontSize:"12px", color:C.silver }}>{evidenceNote}</div>
          <div style={{ fontSize:"10px", color:C.muted, fontFamily:F.mono, marginTop:"3px" }}>Hash: {ethers.keccak256(ethers.toUtf8Bytes(evidenceNote.trim())).slice(0,20)}…</div>
        </div>
      )}

      {/* Workflow progress bar */}
      <WorkflowProgress wf={wf} currentStep={wf.step || 1} />

      {/* Completed steps list */}
      {wf.prevSteps?.length > 0 && (
        <div style={{ marginTop:"12px" }}>
          <div style={{ fontSize:"10px", fontWeight:700, color:C.silver, marginBottom:"6px", textTransform:"uppercase" }}>Completed Steps</div>
          {wf.prevSteps.map((s, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"5px 0", borderBottom:`1px dashed ${C.ocean}` }}>
              <span style={{ color:C.seafoam, fontSize:"12px" }}>✓</span>
              <span style={{ fontSize:"12px", color:C.silver }}>{s.ministry} — {s.label}</span>
            </div>
          ))}
          <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"5px 0" }}>
            <span style={{ color:C.coral, fontSize:"12px" }}>●</span>
            <span style={{ fontSize:"12px", color:C.white, fontWeight:700 }}>{ministry?.code} — {serviceLabel(serviceType)} (this record)</span>
          </div>
        </div>
      )}

      {/* Next step callout */}
      {wf.nextStep && (
        <div style={{ marginTop:"14px", padding:"12px", background:C.amber+"18", border:`1px solid ${C.amber}44`, borderRadius:"8px" }}>
          <div style={{ fontSize:"11px", fontWeight:700, color:C.amber, marginBottom:"4px" }}>⏭ Next Step Required</div>
          <div style={{ fontSize:"12px", color:C.silver }}><strong style={{ color:C.white }}>{wf.nextStep.ministry}</strong> must: {wf.nextStep.action}</div>
          <div style={{ fontSize:"11px", color:C.muted, marginTop:"4px" }}>{wf.notice}</div>
        </div>
      )}
      {isComplete && (
        <div style={{ marginTop:"14px", padding:"12px", background:C.seafoam+"18", border:`1px solid ${C.seafoam}44`, borderRadius:"8px" }}>
          <div style={{ fontSize:"11px", fontWeight:700, color:C.seafoam, marginBottom:"4px" }}>✓ Workflow Complete — Permanently On Chain</div>
          <div style={{ fontSize:"12px", color:C.silver }}>{wf.notice}</div>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display:"flex", gap:"10px", marginTop:"16px", flexWrap:"wrap" }}>
        <button onClick={handlePrint} style={{ ...btn("ghost") }}>🖨 Print / Download PDF</button>
        <button onClick={onAnother}  style={{ ...btn("ghost") }}>Record Another</button>
        {wf.nextStep && onNext && (
          <button onClick={onNext} style={{ ...btn("primary") }}>← Hub — open {wf.nextStep.ministry} Pending Actions</button>
        )}
      </div>
    </div>
  );
}

// ---
// ETHERS HOOKS
// ---
function useProvider() {
  const [provider,  setProvider]  = useState(null);
  const [connected, setConnected] = useState(false);
  const [error,     setError]     = useState(null);
  useEffect(() => {
    let p;
    try {
      p = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
      p.getBlockNumber()
        .then(() => { setProvider(p); setConnected(true); setError(null); })
        .catch(() => { setError("Cannot connect to "+CONFIG.RPC_URL); setConnected(false); });
    } catch(e) { setError("Provider error: "+e.message); }
    return () => { p?.destroy?.(); };
  }, []);
  return { provider, connected, error };
}

function useContract(address, abi, provider) {
  return provider && address ? new ethers.Contract(address, abi, provider) : null;
}

function usePoll(fetchFn, deps, interval = CONFIG.POLL_MS) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [err,     setErr]     = useState(null);
  const ref = useRef(fetchFn);
  ref.current = fetchFn;
  useEffect(() => {
    let alive = true;
    const run = async () => {
      try { const r = await ref.current(); if(alive){ setData(r); setLoading(false); setErr(null); } }
      catch(e) { if(alive){ setErr(e.message); setLoading(false); } }
    };
    run();
    const id = setInterval(run, interval);
    return () => { alive = false; clearInterval(id); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return { data, loading, err };
}

// Fetch all records for a ministry
async function fetchMinistryRecords(provider, addr) {
  if (!provider || !addr) return [];
  const c = new ethers.Contract(addr, ABI.MINISTRY, provider);
  const total = Number(await c.totalRecords());
  const recs = [];
  for (let i = 0; i < total; i++) {
    try {
      const [citizenHash, serviceType, dataHash, timestamp, ndidsVerified] = await c.records(i);
      recs.push({ id:i, citizenHash, serviceType, dataHash, timestamp:Number(timestamp), ndidsVerified });
    } catch {}
  }
  return recs;
}

// Fetch all records from all ministries (for cross-ministry workflow engine)
async function fetchAllRecords(provider) {
  const all = [];
  for (const [code, addr] of Object.entries(MINISTRY_ADDRS)) {
    try {
      const recs = await fetchMinistryRecords(provider, addr);
      recs.forEach(r => all.push({ ...r, ministryCode:code }));
    } catch {}
  }
  return all;
}

// ---
// RECORDS TAB — shared by all ministry dashboards (v7 preserved)
// ---
function RecordsTab({ records, totalRecords, loading, connected, ministry }) {
  const [search,   setSearch]   = useState("");
  const [filterWf, setFilterWf] = useState("all");

  const myWfIds = MINISTRY_WFS[ministry?.code] || [];

  const filtered = records.filter(r => {
    const matchSearch = !search.trim() ||
      r.serviceType.toLowerCase().includes(search.toLowerCase()) ||
      serviceLabel(r.serviceType).toLowerCase().includes(search.toLowerCase()) ||
      r.citizenHash.toLowerCase().includes(search.toLowerCase());
    const wfMappings = SVC_TO_WF[r.serviceType] || [];
    const matchWf = filterWf === "all" || wfMappings.some(m => m.workflowId === filterWf);
    return matchSearch && matchWf;
  });

  return (
    <>
      <SectionHead
        title="My Records"
        sub={connected ? `${totalRecords} records on-chain · auto-refreshing every 3s` : "Demo records — connect chain for live data"}
      />
      <div style={{ display:"flex", gap:"10px", marginBottom:"14px" }}>
        <div style={{ flex:1, position:"relative" }}>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search by citizen hash, service type…"
            style={{ width:"100%", padding:"11px 14px 11px 38px", borderRadius:"8px", border:`1px solid ${C.ocean}`, background:C.abyss, color:C.white, fontSize:"13px", fontFamily:F.ui, boxSizing:"border-box" }} />
          <span style={{ position:"absolute", left:"13px", top:"50%", transform:"translateY(-50%)", fontSize:"14px", color:C.muted }}>🔍</span>
          {search && <button onClick={()=>setSearch("")} style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:"16px" }}>×</button>}
        </div>
        {myWfIds.length > 0 && (
          <select value={filterWf} onChange={e=>setFilterWf(e.target.value)}
            style={{ background:C.abyss, border:`1px solid ${C.ocean}`, borderRadius:"8px", padding:"9px 14px", color:C.white, fontSize:"12px", fontFamily:F.ui }}>
            <option value="all">All Workflows</option>
            {myWfIds.map(wfId=><option key={wfId} value={wfId}>{WORKFLOW_DEFS[wfId].name}</option>)}
          </select>
        )}
      </div>

      {loading && connected ? <LoadingCard msg="Reading records from contract…" /> : (
        <div style={{ ...card() }}>
          {filtered.length === 0 && (
            <div style={{ padding:"28px", textAlign:"center", color:C.muted, fontSize:"13px" }}>
              {search ? `No records matching "${search}"` : "No records yet — use Record Service tab to add the first one"}
            </div>
          )}
          {filtered.map((r, i) => {
            const wfM = (SVC_TO_WF[r.serviceType] || [])[0];
            return (
              <div key={r.id} style={{ padding:"14px 0", borderBottom:i<filtered.length-1?`1px solid ${C.ocean}`:"none" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"6px" }}>
                  <div style={{ display:"flex", gap:"12px", alignItems:"center" }}>
                    <div style={{ width:"34px", height:"34px", borderRadius:"8px", background:ministry?.color+"22", border:`1px solid ${ministry?.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", flexShrink:0 }}>📋</div>
                    <div>
                      <div style={{ fontWeight:800, fontSize:"13px", color:C.white }}>#{r.id} — {serviceLabel(r.serviceType)}</div>
                      <div style={{ fontSize:"11px", color:C.silver, marginTop:"2px" }}>{serviceDesc(r.serviceType)}</div>
                      {wfM && <div style={{ fontSize:"10px", color:C.amber, marginTop:"2px" }}>🔄 {WORKFLOW_DEFS[wfM.workflowId]?.name} · Step {wfM.stepIndex+1}</div>}
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:"6px", alignItems:"center", flexShrink:0, marginLeft:"12px" }}>
                    {r.ndidsVerified && <span style={{ ...badge(C.seafoam) }}>✓ NDIDS</span>}
                    <span style={{ fontSize:"10px", color:C.muted, fontFamily:F.mono }}>{fmtTs(r.timestamp)}</span>
                  </div>
                </div>
                <div style={{ display:"flex", gap:"16px", marginLeft:"46px", flexWrap:"wrap" }}>
                  <div style={{ fontSize:"10px", color:C.muted }}><span style={{ color:C.silver, fontWeight:700 }}>Citizen: </span><Mono color={C.muted}>{r.citizenHash.slice(0,14)}…</Mono></div>
                  {r.dataHash && r.dataHash !== "0x"+"0".repeat(64) && (
                    <div style={{ fontSize:"10px", color:C.muted }}><span style={{ color:C.silver, fontWeight:700 }}>Data: </span><Mono color={C.muted}>{r.dataHash.slice(0,14)}…</Mono></div>
                  )}
                </div>
                {wfM && <div style={{ marginTop:"8px", marginLeft:"46px" }}><WfBar wfId={wfM.workflowId} stepsCompleted={wfM.stepIndex+1} /></div>}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// ---
// RECORD SERVICE TAB — submits to chain via ethers.js
// ---
function RecordServiceTab({ ministryCode, provider, connected, onSuccess, prefill }) {
  const meta         = MINISTRY_META[ministryCode];
  const addr         = MINISTRY_ADDRS[ministryCode];
  const serviceTypes = SERVICE_TYPES[ministryCode] || [];

  const [form, setForm] = useState({
    citizenId:    prefill?.citizenId    || "",
    serviceType:  prefill?.serviceType  || serviceTypes[0]?.value || "",
    evidenceNote: prefill?.evidenceNote || "",
    amount:       prefill?.amount       || "",
    fee:          prefill?.fee          || "",
    officerId:    "OFFICER-001",
    ndidsVerified: shouldVerifyNDIDS(ministryCode, prefill?.serviceType || serviceTypes[0]?.value || ""),
  });
  const [submitting, setSubmitting] = useState(false);
  const [txMsg,      setTxMsg]      = useState(null);

  // Apply prefill when it changes (from Pending Actions one-click)
  useEffect(() => {
    if (prefill) setForm(f => ({
      ...f,
      ...prefill,
      ndidsVerified: shouldVerifyNDIDS(ministryCode, prefill.serviceType || f.serviceType),
    }));
  }, [prefill]);

  const selectedWf = (SVC_TO_WF[form.serviceType] || [])[0];
  const wfDef      = selectedWf ? WORKFLOW_DEFS[selectedWf.workflowId] : null;
  const stepIdx    = selectedWf?.stepIndex ?? -1;
  const needsFee   = wfDef?.steps[stepIdx]?.fee;

  const handleSubmit = async () => {
    if (!form.citizenId || !form.serviceType) { setTxMsg({ type:"error", text:"Citizen ID and service type are required." }); return; }
    // Guard: warn if NDIDS is ON but policy says this ministry has no access — will revert on chain
    if (form.ndidsVerified && !shouldVerifyNDIDS(ministryCode, form.serviceType)) {
      setTxMsg({ type:"error", text:`⚠ NDIDS verification is ON but ${ministryCode} does not have NDIDS access for ${form.serviceType} citizens. Uncheck "Verify identity via NDIDS" and resubmit.` });
      return;
    }
    setSubmitting(true);
    setTxMsg({ type:"info", text:"Broadcasting to "+CONFIG.NETWORK+"…" });
    try {
      const signer   = getSigner(provider);
      const contract = new ethers.Contract(addr, ABI.MINISTRY, signer);
      const rawId    = form.citizenId.trim();
      // If citizenId is already a bytes32 hex (from pending action prefill), use directly
      const cHash    = (rawId.startsWith("0x") && rawId.length === 66)
        ? rawId
        : ethers.keccak256(ethers.toUtf8Bytes(rawId));
      const evidence = form.evidenceNote?.trim() || `${form.serviceType}|${form.officerId}|${Date.now()}`;
      const dHash    = ethers.keccak256(ethers.toUtf8Bytes(evidence));
      const tx       = await contract.recordService(cHash, form.serviceType, dHash, form.ndidsVerified);
      setTxMsg({ type:"info", text:"Awaiting confirmation…" });
      const receipt  = await tx.wait();
      onSuccess({ txHash:receipt.hash, citizenId:form.citizenId, serviceType:form.serviceType, evidenceNote:form.evidenceNote, amount:form.amount, fee:form.fee, officerId:form.officerId, timestamp:Date.now(), ministry:{ ...meta, code:ministryCode } });
      setTxMsg(null);
    } catch(e) {
      setTxMsg({ type:"error", text:e.reason || e.message || "Transaction failed." });
    } finally { setSubmitting(false); }
  };

  const inStyle = { width:"100%", background:C.abyss, border:`1px solid ${C.ocean}`, borderRadius:"8px", padding:"10px 14px", color:C.white, fontSize:"13px", fontFamily:F.ui, boxSizing:"border-box" };

  return (
    <div style={{ ...card(), maxWidth:"640px" }}>
      <SectionHead title="Record Service" sub="Submit a service record directly to the blockchain" />

      {txMsg && <div style={{ marginBottom:"14px", padding:"10px 14px", borderRadius:"8px", background:txMsg.type==="error"?C.danger+"22":C.seafoam+"22", border:`1px solid ${txMsg.type==="error"?C.danger:C.seafoam}44`, color:txMsg.type==="error"?"#F88":C.seafoam, fontSize:"13px" }}>{txMsg.text}</div>}

      {/* Workflow context banner */}
      {wfDef && (
        <div style={{ marginBottom:"14px", padding:"10px 12px", background:C.amber+"18", border:`1px solid ${C.amber}44`, borderRadius:"8px" }}>
          <div style={{ fontSize:"11px", fontWeight:700, color:C.amber }}>🔄 Workflow: {wfDef.name}</div>
          <div style={{ fontSize:"11px", color:C.silver, marginTop:"3px" }}>
            This is Step {stepIdx+1} of {wfDef.steps.length}.
            {stepIdx > 0 && ` Prev: ${wfDef.steps[stepIdx-1].ministry} — ${wfDef.steps[stepIdx-1].label}.`}
            {stepIdx < wfDef.steps.length-1 && ` Next: ${wfDef.steps[stepIdx+1].ministry} — ${wfDef.steps[stepIdx+1].label}.`}
          </div>
        </div>
      )}

      {prefill && (
        <div style={{ marginBottom:"14px", padding:"10px 12px", background:C.seafoam+"14", border:`1px solid ${C.seafoam}33`, borderRadius:"8px" }}>
          <div style={{ fontSize:"11px", fontWeight:700, color:C.seafoam }}>⚡ Pre-filled from Pending Actions — review and submit</div>
          {prefill.citizenLabel && <div style={{ fontSize:"11px", color:C.silver, marginTop:"4px" }}>👤 {prefill.citizenLabel}</div>}
        </div>
      )}

      {/* Citizen ID */}
      <div style={{ marginBottom:"14px" }}>
        <label style={{ fontSize:"11px", fontWeight:700, color:C.silver, textTransform:"uppercase", letterSpacing:"0.6px", display:"block", marginBottom:"6px" }}>Citizen / Business ID *</label>
        {(form.citizenId?.startsWith("0x") && form.citizenId?.length === 66) ? (
          <div style={{ ...inStyle, background:C.abyss+"88", color:C.seafoam, fontFamily:F.mono, fontSize:"12px" }}>
            {form.citizenId.slice(0,22)}…{form.citizenId.slice(-6)}
            <div style={{ fontSize:"10px", color:C.muted, marginTop:"4px", fontFamily:F.ui }}>Pre-hashed citizen identity from chain — submitted directly</div>
          </div>
        ) : (
          <>
            <input value={form.citizenId} onChange={e=>setForm(f=>({...f,citizenId:e.target.value}))} placeholder="e.g. CITIZEN-WS-001" style={inStyle} />
            {form.citizenId && <div style={{ fontSize:"10px", color:C.muted, marginTop:"4px", fontFamily:F.mono }}>On-chain hash: {ethers.keccak256(ethers.toUtf8Bytes(form.citizenId.trim())).slice(0,22)}…</div>}
          </>
        )}
      </div>

      {/* Service type */}
      <div style={{ marginBottom:"14px" }}>
        <label style={{ fontSize:"11px", fontWeight:700, color:C.silver, textTransform:"uppercase", letterSpacing:"0.6px", display:"block", marginBottom:"6px" }}>Service Type *</label>
        <select value={form.serviceType} onChange={e => setForm(f => ({
          ...f,
          serviceType: e.target.value,
          ndidsVerified: shouldVerifyNDIDS(ministryCode, e.target.value),
        }))} style={inStyle}>
          {serviceTypes.map(st=><option key={st.value} value={st.value}>{st.label}</option>)}
        </select>
        {form.serviceType && <div style={{ fontSize:"11px", color:C.muted, marginTop:"4px" }}>{serviceDesc(form.serviceType)}</div>}
      </div>

      {/* Amount + Fee (when applicable) */}
      {(needsFee || form.amount || form.fee) && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"14px" }}>
          <div>
            <label style={{ fontSize:"11px", fontWeight:700, color:C.silver, textTransform:"uppercase", letterSpacing:"0.6px", display:"block", marginBottom:"6px" }}>Payment Amount (WST)</label>
            <input value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} placeholder="e.g. 500.00" style={inStyle} />
          </div>
          <div>
            <label style={{ fontSize:"11px", fontWeight:700, color:C.silver, textTransform:"uppercase", letterSpacing:"0.6px", display:"block", marginBottom:"6px" }}>Gov Fee (WST)</label>
            <input value={form.fee} onChange={e=>setForm(f=>({...f,fee:e.target.value}))} placeholder="e.g. 50.00" style={inStyle} />
          </div>
        </div>
      )}

      {/* Officer ID */}
      <div style={{ marginBottom:"14px" }}>
        <label style={{ fontSize:"11px", fontWeight:700, color:C.silver, textTransform:"uppercase", letterSpacing:"0.6px", display:"block", marginBottom:"6px" }}>Officer ID</label>
        <input value={form.officerId} onChange={e=>setForm(f=>({...f,officerId:e.target.value}))} placeholder="OFFICER-001" style={inStyle} />
        {form.officerId && <div style={{ fontSize:"10px", color:C.muted, marginTop:"4px", fontFamily:F.mono }}>Officer hash: {officerHashFor(form.officerId).slice(0,18)}…</div>}
      </div>

      {/* Evidence note */}
      <div style={{ marginBottom:"14px" }}>
        <label style={{ fontSize:"11px", fontWeight:700, color:C.silver, textTransform:"uppercase", letterSpacing:"0.6px", display:"block", marginBottom:"6px" }}>Evidence Note (hashed on chain)</label>
        <textarea value={form.evidenceNote} onChange={e=>setForm(f=>({...f,evidenceNote:e.target.value}))} placeholder="Reference number, supporting documents, details…" rows={3} style={{ ...inStyle, resize:"vertical" }} />
      </div>

      {/* NDIDS toggle */}
      <div style={{ marginBottom:"18px", padding:"10px 12px", background:C.ocean, borderRadius:"8px", border:`1px solid ${C.wave}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"4px" }}>
          <input type="checkbox" id="ndids" checked={form.ndidsVerified} onChange={e=>setForm(f=>({...f,ndidsVerified:e.target.checked}))} style={{ width:"16px", height:"16px", accentColor:C.seafoam }} />
          <label htmlFor="ndids" style={{ fontSize:"12px", color:C.silver, cursor:"pointer", fontWeight:700 }}>Verify identity via NDIDS</label>
          <span style={{ ...badge(form.ndidsVerified ? C.seafoam : C.amber), fontSize:"9px" }}>
            {form.ndidsVerified ? "✓ NDIDS ON" : "PAYMENT ONLY"}
          </span>
        </div>
        <div style={{ fontSize:"11px", color:C.muted, marginLeft:"26px" }}>
          {form.ndidsVerified
            ? `${ministryCode} has NDIDS read access for this service — identity will be verified on chain.`
            : `Identity verification not required for this step — upstream ministry already verified. Submitting as payment/processing record only.`
          }
        </div>
        {!shouldVerifyNDIDS(ministryCode, form.serviceType) && form.ndidsVerified && (
          <div style={{ fontSize:"11px", color:C.danger, marginTop:"6px", marginLeft:"26px", fontWeight:700 }}>
            ⚠ Warning: {ministryCode} does not have NDIDS access for {form.serviceType} citizens — this transaction will revert. Uncheck NDIDS above.
          </div>
        )}
      </div>

      <button onClick={handleSubmit} disabled={submitting || !connected} style={{ ...btn(submitting||!connected?"ghost":"primary"), width:"100%", justifyContent:"center", padding:"13px 20px", fontSize:"14px", opacity:!connected?0.5:submitting?0.7:1 }}>
        {!connected ? "⚠ Not connected to chain" : submitting ? "⏳ Broadcasting…" : "📡 Submit to Blockchain"}
      </button>
    </div>
  );
}

// ---
// MINISTRY DASHBOARD — v8: 4 tabs per ministry
// ---
function MinistryDashboard({ ministryCode, provider, connected, blockNumber, onBack, allRecords, allLoading }) {
  const meta    = MINISTRY_META[ministryCode];
  const addr    = MINISTRY_ADDRS[ministryCode];

  const [tab,          setTab]          = useState("pending");
  const [lastReceipt,  setLastReceipt]  = useState(null);
  const [prefill,      setPrefill]      = useState(null);

  // My records from global pool
  const myRecords = (allRecords || []).filter(r => r.ministryCode === ministryCode);

  // Pending actions from cross-ministry engine
  const pendingActions = getPendingActions(ministryCode, allRecords || []);

  // Active workflow state
  const activeWorkflows = getActiveWorkflows(ministryCode, allRecords || []);

  const tabs = [
    { id:"pending",  icon:"⚡", label:"Pending Actions",   badge: pendingActions.length || null },
    { id:"workflows",icon:"🔄", label:"Active Workflows",  badge: activeWorkflows.length || null },
    { id:"record",   icon:"✍", label:"Record Service" },
    { id:"records",  icon:"📂", label:"My Records",        badge: myRecords.length || null },
    ...(lastReceipt ? [{ id:"receipt", icon:"📋", label:"Last Receipt" }] : []),
  ];

  const handleSuccess = (data) => {
    setLastReceipt(data);
    setTab("receipt");
    setPrefill(null);
  };

  const handlePendingAction = (action) => {
    setPrefill({
      citizenId:    action.citizenHash,  // raw bytes32 — detected and used directly on submit
      citizenLabel: `Citizen ${short(action.citizenHash)} · from ${action.prevStep.ministry} ${action.prevStep.label}`,
      serviceType:  action.step.serviceType,
      evidenceNote: `Cross-ministry workflow step. Prev step: "${action.prevStep.label}" completed by ${action.prevStep.ministry}. Workflow: ${action.wfName}.`,
      amount: "", fee: "",
    });
    setTab("record");
  };

  return (
    <div style={{ minHeight:"100vh", background:C.deep, fontFamily:F.ui, color:C.white }}>
      <TopBar
        title={meta.name}
        sub={`${ministryCode} · ${addr}`}
        accent={meta.color}
        blockNumber={blockNumber}
        onBack={onBack}
      />
      <ConnectionBanner connected={connected} error={!connected?"Chain offline — showing demo data":null} network={CONFIG.NETWORK} />
      <TabNav tabs={tabs} active={tab} onChange={setTab} accent={meta.color} />

      <div style={{ maxWidth:"1080px", margin:"0 auto", padding:"28px" }}>

        {/* ─── PENDING ACTIONS ──────────────────────────────────── */}
        {tab === "pending" && (
          <>
            <SectionHead
              title="⚡ Pending Actions"
              sub={`${pendingActions.length} cross-ministry workflow step${pendingActions.length !== 1?"s":""} waiting for ${meta.name}`}
            />
            {pendingActions.length === 0 ? (
              <div style={{ ...card(), textAlign:"center", padding:"48px" }}>
                <div style={{ fontSize:"32px", marginBottom:"10px" }}>✓</div>
                <div style={{ color:C.silver, fontSize:"14px", fontWeight:700 }}>No pending actions</div>
                <div style={{ color:C.muted, fontSize:"12px", marginTop:"6px" }}>All workflow steps are up to date for this ministry.</div>
              </div>
            ) : pendingActions.map((action, i) => (
              <div key={i} style={{ ...card(), marginBottom:"12px", borderLeft:`4px solid ${C.amber}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"10px" }}>
                  <div>
                    <div style={{ fontWeight:800, fontSize:"14px", color:C.white }}>{action.wfName}</div>
                    <div style={{ fontSize:"12px", color:C.amber, marginTop:"2px" }}>Step {action.stepIndex+1}: {action.step.label}</div>
                  </div>
                  <span style={{ ...badge(C.amber) }}>Action Required</span>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"8px", marginBottom:"12px" }}>
                  {[
                    ["Citizen Hash",  <Mono>{short(action.citizenHash)}</Mono>],
                    ["Previous Step", action.prevStep.label],
                    ["Completed By",  action.prevStep.ministry],
                  ].map(([label, val]) => (
                    <div key={label} style={{ background:C.abyss, borderRadius:"6px", padding:"8px 10px" }}>
                      <div style={{ fontSize:"9px", color:C.muted, marginBottom:"3px", textTransform:"uppercase" }}>{label}</div>
                      <div style={{ fontSize:"12px", color:C.silver }}>{val}</div>
                    </div>
                  ))}
                </div>
                <WfBar wfId={action.wfId} stepsCompleted={action.stepIndex} />
                <div style={{ marginTop:"14px" }}>
                  <button onClick={() => handlePendingAction(action)} style={{ ...btn("primary") }}>
                    ⚡ Action Now — Pre-filled Form →
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ─── ACTIVE WORKFLOWS ─────────────────────────────────── */}
        {tab === "workflows" && (
          <>
            <SectionHead
              title="🔄 Active Workflows"
              sub={`All workflows ${meta.name} participates in`}
            />
            {activeWorkflows.length === 0 ? (
              <div style={{ ...card(), textAlign:"center", padding:"48px" }}>
                <div style={{ fontSize:"32px", marginBottom:"10px" }}>📭</div>
                <div style={{ color:C.silver, fontSize:"14px", fontWeight:700 }}>No active workflows yet</div>
                <div style={{ color:C.muted, fontSize:"12px", marginTop:"6px" }}>Submit records in Record Service to begin tracking workflows.</div>
              </div>
            ) : activeWorkflows.map(({ wfId, wf, citizens }) => (
              <div key={wfId} style={{ ...card(), marginBottom:"14px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"12px" }}>
                  <div>
                    <div style={{ fontWeight:800, fontSize:"15px", color:C.white }}>{wf.icon || "🔄"} {wf.name}</div>
                    <div style={{ fontSize:"12px", color:C.silver, marginTop:"2px" }}>{citizens.length} record(s) in progress</div>
                  </div>
                  <span style={{ ...badge(C.seafoam) }}>Active</span>
                </div>

                {/* Step overview — highlight this ministry's steps */}
                <div style={{ display:"flex", gap:"4px", marginBottom:"14px", overflowX:"auto" }}>
                  {wf.steps.map((step, idx) => (
                    <div key={idx} style={{ flex:"1 0 80px", padding:"6px 8px", background:C.abyss, borderRadius:"6px", borderTop:`3px solid ${step.ministry===ministryCode?meta.color:C.ocean}`, textAlign:"center" }}>
                      <div style={{ fontSize:"9px", color:step.ministry===ministryCode?meta.color:C.muted, fontWeight:700 }}>Step {idx+1}</div>
                      <div style={{ fontSize:"10px", color:C.silver, marginTop:"2px" }}>{MINISTRY_META[step.ministry]?.icon} {step.ministry}</div>
                    </div>
                  ))}
                </div>

                {/* Per-citizen progress */}
                {citizens.map((cit, i) => {
                  const blocking = cit.stepsCompleted < wf.steps.length ? wf.steps[cit.stepsCompleted] : null;
                  return (
                    <div key={i} style={{ background:C.abyss, borderRadius:"8px", padding:"10px 14px", marginBottom:"8px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px" }}>
                        <Mono>{short(cit.hash)}</Mono>
                        {blocking ? (
                          <span style={{ fontSize:"11px", color:C.amber }}>⏳ Waiting on {MINISTRY_META[blocking.ministry]?.icon} {blocking.ministry}</span>
                        ) : (
                          <span style={{ ...badge(C.seafoam), fontSize:"9px" }}>Complete ✓</span>
                        )}
                      </div>
                      <WfBar wfId={wfId} stepsCompleted={cit.stepsCompleted} />
                    </div>
                  );
                })}
              </div>
            ))}
          </>
        )}

        {/* ─── RECORD SERVICE ───────────────────────────────────── */}
        {tab === "record" && (
          <RecordServiceTab
            ministryCode={ministryCode}
            provider={provider}
            connected={connected}
            onSuccess={handleSuccess}
            prefill={prefill}
          />
        )}

        {/* ─── MY RECORDS ───────────────────────────────────────── */}
        {tab === "records" && (
          <RecordsTab
            records={myRecords}
            totalRecords={myRecords.length}
            loading={allLoading}
            connected={connected}
            ministry={{ ...meta, code:ministryCode }}
          />
        )}

        {/* ─── LAST RECEIPT ─────────────────────────────────────── */}
        {tab === "receipt" && lastReceipt && (
          <>
            <SectionHead title="📋 Last Receipt" sub="Most recent transaction confirmation" />
            <ReceiptCard
              {...lastReceipt}
              onAnother={() => { setLastReceipt(null); setTab("record"); }}
              onNext={() => {
                const wf = WORKFLOWS[lastReceipt.serviceType];
                if (wf?.nextStep?.ministry) onBack(); // go home so user can click next ministry
              }}
            />
          </>
        )}

      </div>
    </div>
  );
}

// ---
// UNICEF DONOR DASHBOARD — v7 preserved + v8 verifyUsage/releaseTranche
// ---
function UNICEFDashboard({ provider, connected, blockNumber, onBack, allRecords, allLoading }) {
  const [tab, setTab] = useState("overview");
  const aidContract = useContract(ADDR.AID, ABI.AID, provider);

  // Live AID contract reads (v7)
  // ── All state declarations first (must be before any usePoll that references them) ──
  const [selectedGrant, setSelectedGrant] = useState(0);
  const [verForm,     setVerForm]    = useState({ grantId:"0", trancheId:"1", evidence:"", beneficiaries:"" });
  const [relForm,     setRelForm]    = useState({ grantId:"0", trancheId:"2" });
  const [txMsg,       setTxMsg]      = useState(null);
  const [submitting,  setSubmitting] = useState(false);

  // ── Live AID contract reads ───────────────────────────────────
  const { data:totals,    loading:totalsLoading    } = usePoll(async () => {
    if (!aidContract) return null;
    const [grants, disbursed, verified] = await Promise.all([aidContract.totalGrants(), aidContract.totalDisbursed(), aidContract.totalVerified()]);
    return { grants:Number(grants), disbursed:Number(disbursed), verified:Number(verified) };
  }, [aidContract]);

  const { data:allGrantIds } = usePoll(async () => {
    if (!aidContract) return null;
    const count = Number(await aidContract.totalGrants());
    return Array.from({ length: count }, (_, i) => i);
  }, [aidContract]);

  const { data:grantRaw,  loading:grantLoading     } = usePoll(async () => {
    if (!aidContract) return null;
    const g = await aidContract.getGrant(selectedGrant);
    return { id:Number(g[0]), title:g[1], donor:g[2], recipient:g[3], totalAmount:Number(g[4]), releasedAmount:Number(g[5]), verifiedAmount:Number(g[6]), status:Number(g[7]), createdAt:Number(g[8]), targetBeneficiaries:Number(g[9]), actualBeneficiaries:Number(g[10]), sector:g[11] };
  }, [aidContract, selectedGrant]);

  const { data:tranchesRaw, loading:tranchesLoading } = usePoll(async () => {
    if (!aidContract) return null;
    const trail = await aidContract.getAuditTrail(selectedGrant);
    return trail.map(t => ({ amount:Number(t.amount), milestone:t.milestone, evidenceHash:t.evidenceHash, status:Number(t.status), releasedAt:Number(t.releasedAt), verifiedAt:Number(t.verifiedAt), releasedBy:t.releasedBy, verifiedBy:t.verifiedBy }));
  }, [aidContract, selectedGrant]);

  const t        = totals    || { grants:MOCK.totalGrants, disbursed:MOCK.totalDisbursed, verified:MOCK.totalVerified };
  const g        = grantRaw  || MOCK.grant;
  const tranches = tranchesRaw || MOCK.tranches;
  const isLoading= !connected || (totalsLoading && grantLoading);

  const disbPct = g.totalAmount > 0 ? Math.round((g.releasedAmount/g.totalAmount)*100) : 0;
  const verPct  = g.totalAmount > 0 ? Math.round((g.verifiedAmount/g.totalAmount)*100) : 0;
  const tsLabel = ["Pending","Released","Verified"];

  // Auto beneficiary count from Education records
  const enrolmentCount = (allRecords || []).filter(r => r.serviceType === "SCHOOL_ENROLMENT_2025").length;

  const handleVerify = async () => {
    if (!connected) { setTxMsg({ type:"error", text:"Not connected to chain." }); return; }
    setSubmitting(true); setTxMsg({ type:"info", text:"Calling verifyUsage() on AID contract…" });
    try {
      const signer = getSigner(provider);
      const aidW   = new ethers.Contract(ADDR.AID, ABI.AID, signer);
      const evHash = ethers.keccak256(ethers.toUtf8Bytes(verForm.evidence || `UNICEF-VERIFY-${Date.now()}`));
      const bens   = parseInt(verForm.beneficiaries) || enrolmentCount || 1;
      const tx     = await aidW.verifyUsage(parseInt(verForm.grantId), parseInt(verForm.trancheId), evHash, bens);
      await tx.wait();
      setTxMsg({ type:"success", text:`✓ verifyUsage() confirmed on chain! Grant ${verForm.grantId} Tranche ${verForm.trancheId} verified. Beneficiaries: ${bens}. Tx: ${short(tx.hash)}` });
    } catch(e) { setTxMsg({ type:"error", text:e.reason || e.message || "verifyUsage() failed." }); }
    finally { setSubmitting(false); }
  };

  const handleRelease = async () => {
    if (!connected) { setTxMsg({ type:"error", text:"Not connected to chain." }); return; }
    setSubmitting(true); setTxMsg({ type:"info", text:"Calling releaseTranche() on AID contract…" });
    try {
      const signer = getSigner(provider);
      const aidW   = new ethers.Contract(ADDR.AID, ABI.AID, signer);
      const tx     = await aidW.releaseTranche(parseInt(relForm.grantId), parseInt(relForm.trancheId));
      await tx.wait();
      setTxMsg({ type:"success", text:`✓ releaseTranche() confirmed! Tranche ${relForm.trancheId} released. Tx: ${short(tx.hash)}` });
    } catch(e) { setTxMsg({ type:"error", text:e.reason || e.message || "releaseTranche() failed." }); }
    finally { setSubmitting(false); }
  };

  const tabs = [
    { id:"overview",   icon:"📊", label:"Grant Overview"    },
    { id:"tranches",   icon:"💰", label:"Tranches"          },
    { id:"verify",     icon:"✅", label:"Verify Tranche"    },
    { id:"release",    icon:"🚀", label:"Release Tranche"   },
    { id:"audit",      icon:"🔍", label:"Audit Trail"       },
    { id:"impact",     icon:"👧", label:"Impact"            },
  ];

  const inStyle = { width:"100%", background:C.abyss, border:`1px solid ${C.ocean}`, borderRadius:"8px", padding:"10px 14px", color:C.white, fontSize:"13px", fontFamily:F.ui, boxSizing:"border-box" };
  const TxBanner = () => txMsg && (
    <div style={{ marginBottom:"16px", padding:"12px 16px", borderRadius:"8px",
      background:txMsg.type==="error"?C.danger+"22":txMsg.type==="success"?C.seafoam+"22":C.amber+"22",
      border:`1px solid ${txMsg.type==="error"?C.danger:txMsg.type==="success"?C.seafoam:C.amber}44`,
      color:txMsg.type==="error"?"#F88":txMsg.type==="success"?C.seafoam:C.amber, fontSize:"13px" }}>
      {txMsg.text}
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:C.deep, fontFamily:F.ui, color:C.white }}>
      <TopBar title="UNICEF Donor Dashboard" sub="Every dollar tracked · verifyUsage() · releaseTranche() from browser" accent={C.gold} blockNumber={blockNumber} onBack={onBack} />
      <ConnectionBanner connected={connected} error={!connected?"Chain offline — showing demo data":null} network={CONFIG.NETWORK} />
      <TabNav tabs={tabs} active={tab} onChange={setTab} accent={C.gold} />

      {/* ─── GRANT SELECTOR BAR ─────────────────────────────────── */}
      <div style={{ maxWidth:"1080px", margin:"0 auto", padding:"14px 28px 0" }}>
        <div style={{ ...card({ background:C.navy, borderColor:C.gold+"44" }), display:"flex", alignItems:"center", gap:"16px", flexWrap:"wrap" }}>
          <div style={{ fontSize:"11px", fontWeight:800, color:C.gold, textTransform:"uppercase", letterSpacing:"0.8px", flexShrink:0 }}>Grant</div>
          <select
            value={selectedGrant}
            onChange={e => {
              const id = parseInt(e.target.value);
              setSelectedGrant(id);
              setVerForm(f => ({ ...f, grantId:String(id) }));
              setRelForm(f => ({ ...f, grantId:String(id) }));
            }}
            style={{ background:C.ocean, color:C.white, border:`1px solid ${C.gold}44`, borderRadius:"6px", padding:"6px 12px", fontSize:"13px", fontWeight:700, cursor:"pointer" }}
          >
            {(allGrantIds || [0]).map(id => (
              <option key={id} value={id}>Grant #{id}{id===0?" — UNICEF Samoa Education Access Programme 2025":""}</option>
            ))}
          </select>
          <div style={{ flex:1, display:"flex", gap:"10px", flexWrap:"wrap" }}>
            {tranches.map((tr, i) => {
              const s = ["⏳ Pending","🔵 Released","✅ Verified"][tr.status] || "Unknown";
              const col = [C.amber,"#4A9EE0",C.seafoam][tr.status] || C.muted;
              return (
                <span key={i} style={{ fontSize:"11px", fontWeight:700, color:col, background:col+"18", border:`1px solid ${col}44`, borderRadius:"99px", padding:"3px 10px" }}>
                  T{i}: {s}
                </span>
              );
            })}
          </div>
          <div style={{ fontSize:"11px", color:C.muted, flexShrink:0 }}>{allGrantIds?.length || 1} grant{(allGrantIds?.length||1)!==1?"s":""} on chain</div>
        </div>
      </div>

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
              <div style={{ fontSize:"11px", color:C.silver, marginBottom:"5px", display:"flex", justifyContent:"space-between" }}>
                <span>Released: {g.releasedAmount.toLocaleString()} ({disbPct}%)</span>
                <span>Verified: {g.verifiedAmount.toLocaleString()} ({verPct}%)</span>
              </div>
              <div style={{ background:C.abyss, borderRadius:"99px", height:"12px", marginBottom:"5px", overflow:"hidden" }}>
                <div style={{ background:`linear-gradient(90deg, ${C.gold}, ${C.amber})`, borderRadius:"99px", height:"12px", width:`${disbPct}%`, transition:"width 0.8s" }} />
              </div>
              <div style={{ background:C.abyss, borderRadius:"99px", height:"6px", overflow:"hidden" }}>
                <div style={{ background:`linear-gradient(90deg, ${C.seafoam}, ${C.teal})`, borderRadius:"99px", height:"6px", width:`${verPct}%`, transition:"width 0.8s" }} />
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px", marginBottom:"20px" }}>
              <StatPill icon="💰" value={`${(g.releasedAmount/1000).toFixed(0)}K`} label="Released (WST)" color={C.gold}    loading={isLoading} />
              <StatPill icon="✅" value={`${(g.verifiedAmount/1000).toFixed(0)}K`} label="Verified (WST)" color={C.seafoam} loading={isLoading} />
              <StatPill icon="👧" value={g.actualBeneficiaries}                    label="Children served" color={C.coral}  loading={isLoading} />
              <StatPill icon="📋" value={`${(allRecords||[]).filter(r=>r.serviceType==="SCHOOL_ENROLMENT_2025").length}`} label="Education enrolments on chain" color={C.amber} loading={allLoading} />
            </div>

            {/* Auto beneficiary notice */}
            <div style={{ ...card({ background:C.ocean, borderColor:C.seafoam+"44" }), marginBottom:"14px" }}>
              <div style={{ fontSize:"12px", color:C.seafoam, fontWeight:700, marginBottom:"4px" }}>🤖 Auto Beneficiary Count from Education Records</div>
              <div style={{ fontSize:"12px", color:C.silver }}>{enrolmentCount} school enrolments detected on chain. This value is pre-filled when verifying tranches.</div>
            </div>

            <div style={{ ...card(), borderLeft:`3px solid ${C.seafoam}` }}>
              <SectionHead title="Live Contract Addresses" sub="Verify independently on any block explorer" />
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

        {/* ─── TRANCHES (v7) ───────────────────────────────────── */}
        {tab === "tranches" && (
          <>
            <SectionHead title="Milestone-Based Disbursement" sub={connected?"Live from AIDisbursementTracker contract":"Demo data"} />
            {tranchesLoading && connected ? <LoadingCard msg="Reading tranches from chain…" /> : (
              <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                {tranches.map((tr, i) => {
                  const sl = tsLabel[tr.status] || "Pending";
                  const sc = { Verified:C.seafoam, Released:"#4A9EE0", Pending:C.muted }[sl];
                  const ev = fmtEvidence(tr.evidenceHash);
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
                          <div style={{ fontSize:"22px", fontWeight:900, fontFamily:F.display }}>{tr.amount.toLocaleString()}</div>
                          <StatusBadge status={sl} />
                        </div>
                      </div>
                      {ev && <div style={{ marginTop:"12px", padding:"10px 14px", background:C.abyss, borderRadius:"8px", display:"flex", gap:"10px", alignItems:"center" }}><span style={{ fontSize:"11px", color:C.silver }}>Evidence hash:</span><Mono>{ev}</Mono></div>}
                      {sl==="Released" && !ev && <div style={{ marginTop:"10px", padding:"9px 12px", background:C.amber+"18", borderRadius:"8px", fontSize:"11px", color:C.amber, fontWeight:700 }}>⏳ Awaiting field verification</div>}
                      {sl==="Released" && !ev && (
                        <div style={{ marginTop:"10px" }}>
                          <button onClick={() => { setVerForm(f=>({...f,grantId:"0",trancheId:String(i)})); setTab("verify"); }} style={{ ...btn("success"), fontSize:"12px" }}>
                            ✅ Verify This Tranche →
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ─── VERIFY TRANCHE (v8 NEW) ──────────────────────────── */}
        {tab === "verify" && (
          <>
            <SectionHead title="✅ Verify Tranche" sub="Call verifyUsage() directly from browser — no terminal needed" />
            <TxBanner />
            <div style={{ ...card({ background:C.seafoam+"14", borderColor:C.seafoam+"33" }), marginBottom:"14px" }}>
              <div style={{ fontSize:"12px", color:C.seafoam, fontWeight:700, marginBottom:"4px" }}>🤖 Auto-populated from Education enrolment records</div>
              <div style={{ fontSize:"12px", color:C.silver }}>{enrolmentCount} school enrolments on chain — pre-filled as beneficiary count. Edit to override.</div>
              <div style={{ fontSize:"11px", color:C.amber, marginTop:"6px", fontWeight:700 }}>
                ℹ {tranches.map((tr,i)=>`T${i}: ${["⏳Pending","🔵Released","✅Verified"][tr.status]||"?"}`).join(" · ")} — verify a Released tranche
              </div>
            </div>
            <div style={{ ...card(), maxWidth:"580px" }}>
              {[["Grant ID","grantId","0"],["Tranche ID","trancheId","1"]].map(([label,key,ph]) => (
                <div key={key} style={{ marginBottom:"14px" }}>
                  <label style={{ fontSize:"11px", fontWeight:700, color:C.silver, textTransform:"uppercase", letterSpacing:"0.6px", display:"block", marginBottom:"6px" }}>{label}</label>
                  <input value={verForm[key]} onChange={e=>setVerForm(f=>({...f,[key]:e.target.value}))} placeholder={ph} type="number" style={inStyle} />
                </div>
              ))}
              <div style={{ marginBottom:"14px" }}>
                <label style={{ fontSize:"11px", fontWeight:700, color:C.silver, textTransform:"uppercase", letterSpacing:"0.6px", display:"block", marginBottom:"6px" }}>Beneficiaries Served</label>
                <input value={verForm.beneficiaries || enrolmentCount} onChange={e=>setVerForm(f=>({...f,beneficiaries:e.target.value}))} placeholder={String(enrolmentCount || 1)} type="number" style={inStyle} />
                <div style={{ fontSize:"11px", color:C.muted, marginTop:"4px" }}>Auto-filled from Education enrolment count ({enrolmentCount}). Edit to override.</div>
              </div>
              <div style={{ marginBottom:"16px" }}>
                <label style={{ fontSize:"11px", fontWeight:700, color:C.silver, textTransform:"uppercase", letterSpacing:"0.6px", display:"block", marginBottom:"6px" }}>Evidence Note / UNICEF Report Reference</label>
                <textarea value={verForm.evidence} onChange={e=>setVerForm(f=>({...f,evidence:e.target.value}))} placeholder="UNICEF verification report ref, field visit notes…" rows={3} style={{ ...inStyle, resize:"vertical" }} />
                {verForm.evidence && <div style={{ fontSize:"10px", color:C.muted, marginTop:"4px", fontFamily:F.mono }}>Evidence hash: {ethers.keccak256(ethers.toUtf8Bytes(verForm.evidence)).slice(0,20)}…</div>}
              </div>
              <button onClick={handleVerify} disabled={submitting||!connected} style={{ ...btn("success"), width:"100%", justifyContent:"center", padding:"13px 20px", fontSize:"14px", opacity:!connected?0.5:submitting?0.7:1 }}>
                {!connected?"⚠ Not connected":submitting?"⏳ Calling verifyUsage()…":"✅ Verify Tranche On Chain"}
              </button>
            </div>
          </>
        )}

        {/* ─── RELEASE TRANCHE (v8 NEW) ─────────────────────────── */}
        {tab === "release" && (
          <>
            <SectionHead title="🚀 Release Tranche" sub="Call releaseTranche() directly from browser" />
            <TxBanner />
            <div style={{ ...card({ background:C.amber+"18", borderColor:C.amber+"44" }), marginBottom:"14px", maxWidth:"580px" }}>
              <div style={{ fontSize:"12px", color:C.amber, fontWeight:700, marginBottom:"4px" }}>⚠ Caution — Irreversible Action</div>
              <div style={{ fontSize:"12px", color:C.silver }}>releaseTranche() releases grant funds on chain. Ensure verifyUsage() has been called and evidence confirmed first. This cannot be undone.</div>
              <div style={{ fontSize:"11px", color:C.amber, marginTop:"6px", fontWeight:700 }}>
                ℹ {tranches.map((tr,i)=>`T${i}: ${["⏳Pending","🔵Released","✅Verified"][tr.status]||"?"}`).join(" · ")} — release a Pending tranche
              </div>
            </div>
            <div style={{ ...card(), maxWidth:"580px" }}>
              {[["Grant ID","grantId","0"],["Tranche ID","trancheId","1"]].map(([label,key,ph]) => (
                <div key={key} style={{ marginBottom:"14px" }}>
                  <label style={{ fontSize:"11px", fontWeight:700, color:C.silver, textTransform:"uppercase", letterSpacing:"0.6px", display:"block", marginBottom:"6px" }}>{label}</label>
                  <input value={relForm[key]} onChange={e=>setRelForm(f=>({...f,[key]:e.target.value}))} placeholder={ph} type="number" style={inStyle} />
                </div>
              ))}
              <button onClick={handleRelease} disabled={submitting||!connected} style={{ ...btn("amber"), width:"100%", justifyContent:"center", padding:"13px 20px", fontSize:"14px", opacity:!connected?0.5:submitting?0.7:1 }}>
                {!connected?"⚠ Not connected":submitting?"⏳ Calling releaseTranche()…":"🚀 Release Tranche On Chain"}
              </button>
            </div>
          </>
        )}

        {/* ─── AUDIT TRAIL (v7) ────────────────────────────────── */}
        {tab === "audit" && (
          <>
            <SectionHead title="Immutable On-Chain Audit Trail" sub="Every event permanently recorded — tamper-proof by blockchain consensus" />
            <div style={{ ...card() }}>
              {tranches.map((tr, i) => {
                const sl = tsLabel[tr.status] || "Pending";
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
              {tranches.every(tr=>tr.releasedAt===0) && <div style={{ padding:"24px", textAlign:"center", color:C.muted }}>No events yet — run a scenario to create on-chain history</div>}
            </div>
            <div style={{ ...card(), marginTop:"14px", borderTop:`3px solid ${C.gold}` }}>
              <div style={{ fontSize:"12px", fontWeight:700, color:C.gold, marginBottom:"6px" }}>🔒 Why this cannot be falsified</div>
              <div style={{ fontSize:"12px", color:C.silver, lineHeight:"1.8" }}>Every event is stored in an immutable blockchain transaction. No one — not the ministry, not the developer, not Synergy Blockchain Pacific — can alter or delete these records after confirmation. UNICEF can independently verify every disbursement by querying the contract address above on any Polygon block explorer.</div>
            </div>
          </>
        )}

        {/* ─── IMPACT (v7) ─────────────────────────────────────── */}
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

// ---
// HUB DASHBOARD — overview of all ministries + workflows (v7 preserved)
// ---
function HubDashboard({ provider, connected, blockNumber, onBack, allRecords, allLoading, onSelectMinistry }) {
  const [tab, setTab] = useState("ministries");
  const hubContract = useContract(ADDR.HUB, ABI.HUB, provider);
  const ndidsContract = useContract(ADDR.NDIDS, ABI.NDIDS, provider);

  const { data:ndidsData } = usePoll(async () => {
    if (!ndidsContract) return null;
    return { totalRegistered: Number(await ndidsContract.totalRegistered()) };
  }, [ndidsContract]);

  const { data:hubData, loading:hubLoading } = usePoll(async () => {
    if (!hubContract) return null;
    const [minis, perms, wfLog] = await Promise.all([
      hubContract.getAllMinistries(),
      hubContract.getPermissions(),
      hubContract.getWorkflowLog(),
    ]);
    return {
      ministries: minis.map(m => ({ name:m.name, code:m.code, contractAddr:m.contractAddr, active:m.active, registeredAt:Number(m.registeredAt) })),
      permissions: perms.map(p => ({ fromCode:p.fromCode, toCode:p.toCode, active:p.active, grantedAt:Number(p.grantedAt) })),
      workflows: wfLog.map(w => ({ workflowType:w.workflowType, citizenHash:w.citizenHash, ministryCode:w.ministryCode, timestamp:Number(w.timestamp), success:w.success })),
    };
  }, [hubContract]);

  const minis    = hubData?.ministries || MOCK.ministries || [];
  const perms    = hubData?.permissions || MOCK.permissions || [];
  const wfLog    = hubData?.workflows || MOCK.workflows || [];
  const regCount = ndidsData?.totalRegistered || MOCK.totalRegistered;
  const recCount = (allRecords || []).length;

  const tabs = [
    { id:"ministries", icon:"🏛", label:"Ministries" },
    { id:"workflows",  icon:"🔄", label:"Workflows"  },
    { id:"perms",      icon:"🔐", label:"Permissions" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.deep, fontFamily:F.ui, color:C.white }}>
      <TopBar title="Interoperability Hub" sub="Cross-ministry permissions, workflow log, live contract registry" accent={C.seafoam} blockNumber={blockNumber} onBack={onBack} />
      <ConnectionBanner connected={connected} error={!connected?"Chain offline — demo data":null} network={CONFIG.NETWORK} />
      <TabNav tabs={tabs} active={tab} onChange={setTab} accent={C.seafoam} />

      <div style={{ maxWidth:"1080px", margin:"0 auto", padding:"28px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px", marginBottom:"24px" }}>
          <StatPill icon="🏛" value={minis.length || 6}     label="Ministries registered" color={C.seafoam}  />
          <StatPill icon="👤" value={regCount}              label="Citizens (NDIDS)"       color={C.coral}    loading={!connected} />
          <StatPill icon="📋" value={recCount}              label="Records on chain"       color={C.amber}    loading={allLoading} />
          <StatPill icon="🔐" value={perms.filter(p=>p.active).length} label="Active permissions" color={C.gold} loading={!connected} />
        </div>

        {tab === "ministries" && (
          <>
            <SectionHead title="Registered Ministries" sub="Click any ministry card to open its dashboard" />
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"14px" }}>
              {Object.entries(MINISTRY_META).map(([code, meta]) => {
                const myRecs    = (allRecords||[]).filter(r=>r.ministryCode===code).length;
                const pending   = getPendingActions(code, allRecords||[]).length;
                const chainData = minis.find(m=>m.code===code);
                return (
                  <div key={code} onClick={() => onSelectMinistry(code)}
                    style={{ ...card(), cursor:"pointer", borderTop:`3px solid ${meta.color}`, transition:"background 0.15s" }}
                    onMouseEnter={e=>e.currentTarget.style.background=C.ocean}
                    onMouseLeave={e=>e.currentTarget.style.background=C.navy}>
                    {pending>0 && <div style={{ float:"right", background:C.coral, color:C.white, borderRadius:"10px", padding:"1px 8px", fontSize:"10px", fontWeight:800 }}>{pending} pending</div>}
                    <div style={{ fontSize:"28px", marginBottom:"8px" }}>{meta.icon}</div>
                    <div style={{ fontWeight:800, fontSize:"13px", fontFamily:F.display, marginBottom:"3px" }}>{meta.name}</div>
                    <div style={{ fontSize:"11px", color:C.muted, marginBottom:"10px" }}>{code} · {chainData?.active?"Active":"Pending"}</div>
                    <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                      <span style={{ ...badge(meta.color), fontSize:"9px" }}>{myRecs} records</span>
                      {(MINISTRY_WFS[code]||[]).map(wfId=><span key={wfId} style={{ ...badge(C.silver), fontSize:"9px" }}>{WORKFLOW_DEFS[wfId].icon}</span>)}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === "workflows" && (
          <>
            <SectionHead title="Workflow Overview" sub="6 cross-ministry workflows active on chain" />
            {Object.entries(WORKFLOW_DEFS).map(([wfId, wf]) => {
              const citizens = new Set();
              wf.steps.forEach(step => {
                (allRecords||[]).filter(r=>r.serviceType===step.serviceType).forEach(r=>citizens.add(r.citizenHash));
              });
              return (
                <div key={wfId} style={{ ...card(), marginBottom:"12px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"10px" }}>
                    <div>
                      <div style={{ fontWeight:800, fontSize:"14px", color:C.white }}>{wf.icon || "🔄"} {wf.name}</div>
                      <div style={{ fontSize:"11px", color:C.silver, marginTop:"2px" }}>{citizens.size} citizen record(s) in progress</div>
                    </div>
                    <span style={{ ...badge(citizens.size>0?C.seafoam:C.muted) }}>{citizens.size>0?"Active":"No records yet"}</span>
                  </div>
                  <div style={{ display:"flex", gap:"4px", flexWrap:"wrap" }}>
                    {wf.steps.map((step, i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:"4px" }}>
                        <div style={{ padding:"3px 8px", background:C.abyss, borderRadius:"4px", fontSize:"10px", color:C.silver, border:`1px solid ${C.ocean}` }}>
                          {MINISTRY_META[step.ministry]?.icon} {step.ministry}
                        </div>
                        {i<wf.steps.length-1 && <span style={{ color:C.muted, fontSize:"10px" }}>→</span>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {tab === "perms" && (
          <>
            <SectionHead title="Cross-Ministry Read Permissions" sub="Which ministries can read each other's records" />
            <div style={{ ...card() }}>
              {perms.length === 0 && <div style={{ textAlign:"center", padding:"24px", color:C.muted }}>No permissions recorded yet</div>}
              {perms.map((p, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:i<perms.length-1?`1px solid ${C.ocean}`:"none" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                    <span style={{ fontFamily:F.mono, fontSize:"12px", color:C.white, fontWeight:700 }}>{p.fromCode}</span>
                    <span style={{ color:C.seafoam }}>→</span>
                    <span style={{ fontFamily:F.mono, fontSize:"12px", color:C.white, fontWeight:700 }}>{p.toCode}</span>
                    <span style={{ fontSize:"11px", color:C.muted }}>can read {p.toCode} records</span>
                  </div>
                  <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                    <span style={{ ...badge(p.active?C.seafoam:C.muted) }}>{p.active?"Active":"Revoked"}</span>
                    <span style={{ fontSize:"10px", color:C.muted }}>{fmtTs(p.grantedAt)}</span>
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

// ---
// HOME — landing page with all ministry cards + entry points
// ---
function Home({ provider, connected, blockNumber, allRecords, allLoading, onSelect }) {
  const regCount = MOCK.totalRegistered;

  return (
    <div style={{ minHeight:"100vh", background:C.abyss, fontFamily:F.ui, color:C.white }}>
      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg, ${C.deep} 0%, ${C.navy} 60%, ${C.ocean} 100%)`, borderBottom:`1px solid ${C.ocean}`, padding:"40px 32px 32px" }}>
        <div style={{ maxWidth:"1080px", margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"18px", marginBottom:"24px" }}>
            <div style={{ fontSize:"44px" }}>🌺</div>
            <div>
              <div style={{ fontSize:"11px", fontWeight:700, letterSpacing:"3px", textTransform:"uppercase", color:C.seafoam, marginBottom:"6px" }}>Synergy Blockchain Pacific · Samoa</div>
              <h1 style={{ fontFamily:F.display, fontSize:"30px", fontWeight:900, margin:0, lineHeight:1.1 }}>Samoa Pacific Blockchain Hub</h1>
              <div style={{ fontSize:"13px", color:C.silver, marginTop:"6px" }}>Multi-Ministry Digital Government Platform · UNICEF Venture Fund 2026 Application</div>
            </div>
            <div style={{ marginLeft:"auto", textAlign:"right" }}>
              <span style={{ ...badge(connected?C.seafoam:C.amber) }}>{connected?"● LIVE — "+CONFIG.NETWORK:"⚠ Offline"}</span>
              {blockNumber && <div style={{ fontSize:"10px", color:C.muted, marginTop:"4px", fontFamily:F.mono }}>Block #{blockNumber.toLocaleString()}</div>}
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px" }}>
            <StatPill icon="🏛" value={6}                          label="Government Ministries"    color={C.coral}   />
            <StatPill icon="📋" value={(allRecords||[]).length}    label="Records On Chain"         color={C.seafoam} loading={allLoading} />
            <StatPill icon="🔄" value={6}                          label="Active Workflows"         color={C.amber}   />
            <StatPill icon="👤" value={regCount}                   label="Citizens Registered"      color={C.gold}    />
          </div>
        </div>
      </div>

      <div style={{ maxWidth:"1080px", margin:"0 auto", padding:"32px" }}>

        {/* Ministry cards */}
        <SectionHead title="Ministry Dashboards" sub="Select a ministry to manage pending actions, workflows, records and receipts" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"14px", marginBottom:"28px" }}>
          {Object.entries(MINISTRY_META).map(([code, meta]) => {
            const myRecs  = (allRecords||[]).filter(r=>r.ministryCode===code).length;
            const pending = getPendingActions(code, allRecords||[]).length;
            return (
              <div key={code} onClick={() => onSelect("ministry:"+code)}
                style={{ ...card(), cursor:"pointer", borderTop:`3px solid ${meta.color}`, position:"relative" }}
                onMouseEnter={e=>e.currentTarget.style.background=C.ocean}
                onMouseLeave={e=>e.currentTarget.style.background=C.navy}>
                {pending>0 && (
                  <div style={{ position:"absolute", top:"14px", right:"14px", background:C.coral, color:C.white, borderRadius:"12px", padding:"2px 8px", fontSize:"10px", fontWeight:800 }}>
                    {pending} pending
                  </div>
                )}
                <div style={{ fontSize:"30px", marginBottom:"10px" }}>{meta.icon}</div>
                <div style={{ fontWeight:800, fontSize:"14px", fontFamily:F.display, marginBottom:"4px" }}>{meta.name}</div>
                <div style={{ fontSize:"11px", color:C.muted, marginBottom:"12px" }}>{code}</div>
                <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                  <span style={{ ...badge(meta.color), fontSize:"9px" }}>{myRecs} records</span>
                  {(MINISTRY_WFS[code]||[]).map(wfId=>(
                    <span key={wfId} style={{ ...badge(C.silver), fontSize:"9px" }}>{WORKFLOW_DEFS[wfId].icon} {wfId.split("-")[0]}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Special dashboards */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"14px", marginBottom:"28px" }}>
          <div onClick={() => onSelect("unicef")} style={{ ...card(), cursor:"pointer", borderTop:`3px solid ${C.gold}` }}
            onMouseEnter={e=>e.currentTarget.style.background=C.ocean}
            onMouseLeave={e=>e.currentTarget.style.background=C.navy}>
            <div style={{ fontSize:"28px", marginBottom:"8px" }}>🌐</div>
            <div style={{ fontWeight:800, fontSize:"14px", fontFamily:F.display, marginBottom:"4px" }}>UNICEF Donor Dashboard</div>
            <div style={{ fontSize:"12px", color:C.silver }}>Grant lifecycle · verifyUsage() · releaseTranche() · beneficiary auto-count from Education</div>
          </div>
          <div onClick={() => onSelect("community")} style={{ ...card(), cursor:"pointer", borderTop:`3px solid ${C.coral}` }}
            onMouseEnter={e=>e.currentTarget.style.background=C.ocean}
            onMouseLeave={e=>e.currentTarget.style.background=C.navy}>
            <div style={{ fontSize:"28px", marginBottom:"8px" }}>🏘</div>
            <div style={{ fontWeight:800, fontSize:"14px", fontFamily:F.display, marginBottom:"4px" }}>Community Project Dashboard</div>
            <div style={{ fontSize:"12px", color:C.silver }}>PM · Matai · Public views · Real-time spend tracking · Receipt logging · Donor-visible audit trail</div>
          </div>
          <div onClick={() => onSelect("hub")} style={{ ...card(), cursor:"pointer", borderTop:`3px solid ${C.seafoam}` }}
            onMouseEnter={e=>e.currentTarget.style.background=C.ocean}
            onMouseLeave={e=>e.currentTarget.style.background=C.navy}>
            <div style={{ fontSize:"28px", marginBottom:"8px" }}>🔗</div>
            <div style={{ fontWeight:800, fontSize:"14px", fontFamily:F.display, marginBottom:"4px" }}>Interoperability Hub</div>
            <div style={{ fontSize:"12px", color:C.silver }}>Cross-ministry permissions, workflow log, live contract registry</div>
          </div>
        </div>

        {/* Workflow summary */}
        <SectionHead title="🔄 6 Workflow Definitions" sub="Cross-ministry process chains active on chain" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"10px" }}>
          {Object.entries(WORKFLOW_DEFS).map(([wfId, wf]) => {
            const citizens = new Set();
            wf.steps.forEach(step => {
              (allRecords||[]).filter(r=>r.serviceType===step.serviceType).forEach(r=>citizens.add(r.citizenHash));
            });
            return (
              <div key={wfId} style={{ ...card({ padding:"14px" }) }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
                  <span style={{ fontWeight:700, fontSize:"13px" }}>{wf.icon} {wf.name}</span>
                  <span style={{ ...badge(citizens.size>0?C.seafoam:C.muted), fontSize:"9px" }}>{citizens.size} active</span>
                </div>
                <div style={{ display:"flex", gap:"3px", flexWrap:"wrap" }}>
                  {wf.steps.map((step, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:"3px" }}>
                      <span style={{ fontSize:"10px", color:C.silver }}>{MINISTRY_META[step.ministry]?.icon}{step.ministry}</span>
                      {i<wf.steps.length-1 && <span style={{ color:C.muted, fontSize:"9px" }}>→</span>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}


// ---
// COMMUNITY DASHBOARD — Path A (uses existing AIDisbursementTracker)
// 4 role views: Donor · Project Manager · Matai/Leadership · Community
// Real-time project intelligence: KPIs, expenditure tracking, flags
// ---

const COMMUNITY_PROJECTS = [
  {
    id: "BIOGAS-VAIALA-2025",
    name: "Vaiala Village Biogas Project",
    donor: "UNICEF",
    community: "Vaiala, Upolu",
    pm: "COMMUNITY-PM-001",
    matai: "COMMUNITY-MATAI-001",
    grantId: 0,
    totalBudget: 100000,
    description: "Installation of biogas units for 23 households. Reduces reliance on imported fuel, cuts household energy costs by 60%, improves cooking conditions.",
    startDate: "2025-01-15",
    targetDate: "2025-12-31",
    milestones: [
      { id:0, label:"Site assessment & community training",          targetWST:30000, status:"verified" },
      { id:1, label:"Equipment procurement & installation",          targetWST:40000, status:"released" },
      { id:2, label:"Commissioning & end-of-term outcomes",          targetWST:30000, status:"pending"  },
    ],
    categories: ["Labour","Materials","Equipment","Training","Overhead"],
  },
  {
    id: "WATER-SAVAII-2026",
    name: "Savai'i Rural Water Access Programme",
    donor: "World Bank",
    community: "Fagamalo, Savai'i",
    pm: "COMMUNITY-PM-002",
    matai: "COMMUNITY-MATAI-002",
    grantId: null,
    totalBudget: 250000,
    description: "Piped water infrastructure for 4 villages. Target: 850 beneficiaries with clean water access within 18 months.",
    startDate: "2026-03-01",
    targetDate: "2027-09-01",
    milestones: [
      { id:0, label:"Survey, design & community consultation",        targetWST:50000,  status:"pending" },
      { id:1, label:"Pipeline installation phase 1",                  targetWST:100000, status:"pending" },
      { id:2, label:"Pipeline installation phase 2 & connections",    targetWST:75000,  status:"pending" },
      { id:3, label:"Commissioning & handover",                       targetWST:25000,  status:"pending" },
    ],
    categories: ["Labour","Materials","Equipment","Consulting","Overhead"],
  },
];

const EXP_CATEGORIES = {
  Labour:    { icon:"👷", color:"#4A9EE0" },
  Materials: { icon:"🪵", color:"#D4860A" },
  Equipment: { icon:"⚙️",  color:"#0FB894" },
  Training:  { icon:"📚", color:"#9B59B6" },
  Consulting:{ icon:"💼", color:"#E8552A" },
  Overhead:  { icon:"🏢", color:"#5A7A9A" },
  Other:     { icon:"📦", color:"#9EB3CC" },
};

const COMMUNITY_ROLES = {
  donor:  { label:"Donor View",         icon:"🌐", color:"#C9920E", desc:"Real-time project intelligence & KPI dashboard" },
  pm:     { label:"Project Manager",    icon:"📋", color:"#0FB894", desc:"Submit evidence, log expenditures, upload receipts" },
  matai:  { label:"Matai / Leadership", icon:"🏛",  color:"#4A9EE0", desc:"Approve expenditures, community governance" },
  public: { label:"Community / Public", icon:"👥", color:"#9EB3CC", desc:"Transparent view — money in vs money spent" },
};

const SEED_EXPENDITURES = [
  { id:"EXP-001", projectId:"BIOGAS-VAIALA-2025", milestoneId:0, recipient:"Samoa Plumbing Ltd",      amount:8500,  category:"Materials", receiptRef:"INV-SPL-2025-089",   date:"2025-02-10", approvedBy:"COMMUNITY-MATAI-001", status:"approved", confirmedBy:null },
  { id:"EXP-002", projectId:"BIOGAS-VAIALA-2025", milestoneId:0, recipient:"Community Labour Team",   amount:6200,  category:"Labour",    receiptRef:"TIMESHEET-FEB-2025", date:"2025-02-28", approvedBy:"COMMUNITY-MATAI-001", status:"approved", confirmedBy:"COMMUNITY-MEMBER-003" },
  { id:"EXP-003", projectId:"BIOGAS-VAIALA-2025", milestoneId:0, recipient:"Pacific Training Co",    amount:4800,  category:"Training",  receiptRef:"TRAIN-PAC-2025-12",  date:"2025-03-05", approvedBy:"COMMUNITY-MATAI-001", status:"approved", confirmedBy:null },
  { id:"EXP-004", projectId:"BIOGAS-VAIALA-2025", milestoneId:0, recipient:"Project Overhead Q1",    amount:2100,  category:"Overhead",  receiptRef:"OVERHEAD-Q1-2025",   date:"2025-03-15", approvedBy:"COMMUNITY-MATAI-001", status:"approved", confirmedBy:null },
  { id:"EXP-005", projectId:"BIOGAS-VAIALA-2025", milestoneId:1, recipient:"Biogas Equipment NZ",    amount:22000, category:"Equipment", receiptRef:"INV-BENZ-2025-441",  date:"2025-06-01", approvedBy:"COMMUNITY-MATAI-001", status:"approved", confirmedBy:null },
  { id:"EXP-006", projectId:"BIOGAS-VAIALA-2025", milestoneId:1, recipient:"Installation Labour",    amount:9400,  category:"Labour",    receiptRef:"TIMESHEET-JUN-2025", date:"2025-06-30", approvedBy:"COMMUNITY-MATAI-001", status:"approved", confirmedBy:null },
  { id:"EXP-007", projectId:"BIOGAS-VAIALA-2025", milestoneId:1, recipient:"Piping & Fittings",      amount:5800,  category:"Materials", receiptRef:"INV-SPL-2025-210",   date:"2025-07-12", approvedBy:null,                  status:"pending",  confirmedBy:null },
];

const SEED_ACTIVITY = [
  { ts: Date.now()-8*86400000,  actor:"PM",    action:"Expenditure EXP-007 submitted — Piping & Fittings 5,800 WST — awaiting matai approval",            flag:true  },
  { ts: Date.now()-9*86400000,  actor:"CHAIN", action:"Tranche 1 released on chain — 40,000 WST — Grant #0 Milestone 2",                                  flag:false },
  { ts: Date.now()-12*86400000, actor:"MATAI", action:"Expenditure EXP-006 approved — Installation Labour 9,400 WST",                                     flag:false },
  { ts: Date.now()-15*86400000, actor:"CHAIN", action:"verifyUsage() confirmed — Tranche 1 verified by UNICEF officer. Beneficiaries: 23",                flag:false },
  { ts: Date.now()-20*86400000, actor:"PM",    action:"Milestone 1 evidence submitted — 23 households capacity training complete. Ref: REPORT-M1-FINAL",  flag:false },
  { ts: Date.now()-35*86400000, actor:"CHAIN", action:"Tranche 0 verified — 30,000 WST — Site assessment complete",                                       flag:false },
  { ts: Date.now()-40*86400000, actor:"CHAIN", action:"Grant #0 created on chain — UNICEF Samoa Education Access Programme 2025 — 100,000 WST",           flag:false },
];

function CommunityDashboard({ provider, connected, blockNumber, onBack }) {
  const [role,            setRole]            = useState(null);
  const [tab,             setTab]             = useState("overview");
  const [selectedProject, setSelectedProject] = useState("BIOGAS-VAIALA-2025");
  const [expenditures,    setExpenditures]    = useState(SEED_EXPENDITURES);
  const [activityLog,     setActivityLog]     = useState(SEED_ACTIVITY);
  const [pendingExp,      setPendingExp]      = useState({ recipient:"", amount:"", category:"Labour", receiptRef:"", notes:"", milestoneId:"0" });
  const [expTxMsg,        setExpTxMsg]        = useState(null);
  const [submitting,      setSubmitting]      = useState(false);

  const project    = COMMUNITY_PROJECTS.find(p => p.id === selectedProject) || COMMUNITY_PROJECTS[0];
  const projExps   = expenditures.filter(e => e.projectId === project.id);
  const approved   = projExps.filter(e => e.status === "approved");
  const pending    = projExps.filter(e => e.status === "pending");

  const totalReceived = project.milestones.filter(m => m.status==="released"||m.status==="verified").reduce((s,m)=>s+m.targetWST,0);
  const totalVerified = project.milestones.filter(m => m.status==="verified").reduce((s,m)=>s+m.targetWST,0);
  const totalSpent    = approved.reduce((s,e)=>s+e.amount,0);
  const totalPending  = pending.reduce((s,e)=>s+e.amount,0);
  const remaining     = totalReceived - totalSpent;
  const burnRate      = totalReceived>0 ? Math.round((totalSpent/totalReceived)*100) : 0;

  const daysSinceLast = Math.floor((Date.now()-activityLog[0].ts)/86400000);
  const flags = [
    ...(daysSinceLast>=7  ? [{ level:"warning", msg:`No activity logged in ${daysSinceLast} days — possible supply or resource delay. Recommend contacting project manager.` }] : []),
    ...(pending.length>0  ? [{ level:"info",    msg:`${pending.length} expenditure${pending.length>1?"s":""} awaiting matai approval — ${totalPending.toLocaleString()} WST on hold` }] : []),
    ...(burnRate>85       ? [{ level:"warning", msg:`Budget utilisation at ${burnRate}% — approaching tranche limit. Review remaining commitments.` }] : []),
  ];

  const byCategory = {};
  approved.forEach(e => { byCategory[e.category]=(byCategory[e.category]||0)+e.amount; });
  const byMilestone = {};
  approved.forEach(e => { byMilestone[e.milestoneId]=(byMilestone[e.milestoneId]||0)+e.amount; });

  const handleSubmitExp = () => {
    if (!pendingExp.recipient||!pendingExp.amount) { setExpTxMsg({ type:"error", text:"Recipient and amount are required." }); return; }
    const amt = parseFloat(pendingExp.amount);
    if (isNaN(amt)||amt<=0) { setExpTxMsg({ type:"error", text:"Enter a valid amount." }); return; }
    setSubmitting(true);
    const rHash = ethers.keccak256(ethers.toUtf8Bytes(`${pendingExp.receiptRef}|${pendingExp.recipient}|${amt}|${Date.now()}`));
    const newExp = {
      id: `EXP-${String(expenditures.length+1).padStart(3,"0")}`,
      projectId: project.id, milestoneId: parseInt(pendingExp.milestoneId),
      recipient: pendingExp.recipient, amount: amt, category: pendingExp.category,
      receiptRef: pendingExp.receiptRef, receiptHash: rHash.slice(0,22)+"…",
      date: new Date().toISOString().slice(0,10), approvedBy:null, status:"pending", confirmedBy:null,
    };
    setTimeout(() => {
      setExpenditures(p=>[...p,newExp]);
      setActivityLog(p=>[{ ts:Date.now(), actor:"PM", action:`${newExp.id} submitted — ${pendingExp.recipient} ${amt.toLocaleString()} WST (${pendingExp.category}) — awaiting matai approval`, flag:false },...p]);
      setPendingExp({ recipient:"", amount:"", category:"Labour", receiptRef:"", notes:"", milestoneId:"0" });
      setExpTxMsg({ type:"success", text:`✓ ${newExp.id} recorded. Receipt hash: ${rHash.slice(0,20)}… Awaiting matai approval.` });
      setSubmitting(false);
    }, 800);
  };

  const handleApprove = (expId) => {
    setExpenditures(p=>p.map(e=>e.id===expId?{...e,status:"approved",approvedBy:"COMMUNITY-MATAI-001"}:e));
    setActivityLog(p=>[{ ts:Date.now(), actor:"MATAI", action:`${expId} approved by matai — funds cleared for disbursement`, flag:false },...p]);
  };

  const inStyle = { width:"100%", background:C.abyss, border:`1px solid ${C.ocean}`, borderRadius:"8px", padding:"10px 14px", color:C.white, fontSize:"13px", fontFamily:F.ui, boxSizing:"border-box" };

  // ── Role selector ────────────────────────────────────────────────────
  if (!role) return (
    <div style={{ minHeight:"100vh", background:C.deep, fontFamily:F.ui, color:C.white }}>
      <TopBar title="Community Project Dashboard" sub="Donor-funded community accountability — real-time project intelligence" accent="#4A9EE0" blockNumber={blockNumber} onBack={onBack} />
      <div style={{ maxWidth:"960px", margin:"0 auto", padding:"40px 28px" }}>
        <div style={{ textAlign:"center", marginBottom:"36px" }}>
          <div style={{ fontSize:"36px", marginBottom:"12px" }}>🌺</div>
          <div style={{ fontSize:"22px", fontWeight:900, fontFamily:F.display, marginBottom:"8px" }}>Samoa Pacific Blockchain Hub</div>
          <div style={{ fontSize:"14px", color:C.silver, maxWidth:"560px", margin:"0 auto" }}>Every dollar tracked from donor to community. Real-time intelligence for everyone involved in the project.</div>
        </div>
        <div style={{ fontSize:"11px", fontWeight:800, color:C.silver, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:"12px" }}>Active Projects</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"14px", marginBottom:"32px" }}>
          {COMMUNITY_PROJECTS.map(p=>(
            <div key={p.id} onClick={()=>setSelectedProject(p.id)}
              style={{ ...card({ borderColor:selectedProject===p.id?"#4A9EE0":C.ocean, background:selectedProject===p.id?C.ocean:C.navy }), cursor:"pointer" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
                <span style={{ ...badge("#4A9EE0"), fontSize:"9px" }}>{p.donor}</span>
                <span style={{ ...badge(p.grantId!==null?C.seafoam:C.amber), fontSize:"9px" }}>{p.grantId!==null?"ON CHAIN":"SETUP"}</span>
              </div>
              <div style={{ fontWeight:800, fontSize:"14px", marginBottom:"4px" }}>{p.name}</div>
              <div style={{ fontSize:"12px", color:C.silver, marginBottom:"6px" }}>📍 {p.community}</div>
              <div style={{ fontSize:"12px", color:C.gold, fontWeight:700 }}>{p.totalBudget.toLocaleString()} WST total grant</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize:"11px", fontWeight:800, color:C.silver, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:"12px" }}>Select Your Role</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"14px" }}>
          {Object.entries(COMMUNITY_ROLES).map(([key,r])=>(
            <div key={key} onClick={()=>{ setRole(key); setTab("overview"); }}
              style={{ ...card({ borderTop:`3px solid ${r.color}` }), cursor:"pointer" }}
              onMouseEnter={e=>e.currentTarget.style.background=C.ocean}
              onMouseLeave={e=>e.currentTarget.style.background=C.navy}>
              <div style={{ fontSize:"32px", marginBottom:"10px" }}>{r.icon}</div>
              <div style={{ fontWeight:800, fontSize:"15px", fontFamily:F.display, color:r.color, marginBottom:"6px" }}>{r.label}</div>
              <div style={{ fontSize:"12px", color:C.silver }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const roleMeta = COMMUNITY_ROLES[role];
  const tabsByRole = {
    donor:  [
      { id:"overview",  icon:"📊", label:"Portfolio"           },
      { id:"kpi",       icon:"🎯", label:"KPIs"                },
      { id:"spend",     icon:"💸", label:"Expenditure"         },
      { id:"flags",     icon:"🚩", label:"Flags", badge:flags.length||null },
      { id:"audit",     icon:"🔍", label:"Audit Trail"         },
    ],
    pm:     [
      { id:"overview",   icon:"📋", label:"Status"            },
      { id:"evidence",   icon:"📸", label:"Evidence"          },
      { id:"expenditure",icon:"💰", label:"Log Expenditure"   },
      { id:"receipts",   icon:"🧾", label:"Receipts", badge:approved.length||null },
    ],
    matai:  [
      { id:"overview",  icon:"🏛",  label:"Account"           },
      { id:"approve",   icon:"✅", label:"Approvals", badge:pending.length||null },
      { id:"spending",  icon:"📊", label:"Spending"           },
    ],
    public: [
      { id:"overview",  icon:"👁️",  label:"Overview"          },
      { id:"money",     icon:"💵", label:"Money In/Out"       },
      { id:"impact",    icon:"🌱", label:"Impact"             },
    ],
  };
  const tabs = tabsByRole[role]||[];

  return (
    <div style={{ minHeight:"100vh", background:C.deep, fontFamily:F.ui, color:C.white }}>
      <TopBar title={`${roleMeta.icon} ${roleMeta.label} — ${project.name}`} sub={`${project.community} · ${project.donor} · ${project.totalBudget.toLocaleString()} WST`} accent={roleMeta.color} blockNumber={blockNumber} onBack={()=>setRole(null)} />
      <ConnectionBanner connected={connected} error={null} network="Anvil Local" />
      <div style={{ maxWidth:"1080px", margin:"0 auto", padding:"10px 28px 0", display:"flex", gap:"10px", alignItems:"center", flexWrap:"wrap" }}>
        <select value={selectedProject} onChange={e=>{setSelectedProject(e.target.value);setTab("overview");}}
          style={{ background:C.ocean, color:C.white, border:`1px solid ${roleMeta.color}44`, borderRadius:"6px", padding:"5px 10px", fontSize:"12px", fontWeight:700, cursor:"pointer" }}>
          {COMMUNITY_PROJECTS.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div style={{ display:"flex", gap:"4px" }}>
          {Object.entries(COMMUNITY_ROLES).map(([key,r])=>(
            <button key={key} onClick={()=>{ setRole(key); setTab("overview"); }}
              style={{ ...btn(key===role?"primary":"ghost"), padding:"4px 10px", fontSize:"11px", background:key===role?r.color:"transparent", border:key===role?"none":`1px solid ${C.ocean}` }}>
              {r.icon}
            </button>
          ))}
        </div>
      </div>
      <TabNav tabs={tabs} active={tab} onChange={setTab} accent={roleMeta.color} />
      <div style={{ maxWidth:"1080px", margin:"0 auto", padding:"28px" }}>

        {/* OVERVIEW — all roles */}
        {tab==="overview" && (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px", marginBottom:"20px" }}>
              <StatPill icon="💰" value={totalReceived.toLocaleString()}  label="WST received"       color={C.gold}    />
              <StatPill icon="💸" value={totalSpent.toLocaleString()}      label="WST spent"          color={C.seafoam} />
              <StatPill icon="🏦" value={remaining.toLocaleString()}       label="WST remaining"      color="#4A9EE0"   />
              <StatPill icon="🔥" value={`${burnRate}%`}                   label="Budget utilisation" color={burnRate>85?C.coral:C.amber} />
            </div>
            {flags.length>0 && flags.map((f,i)=>(
              <div key={i} style={{ ...card({ background:f.level==="warning"?C.amber+"18":C.ocean+"88", borderColor:f.level==="warning"?C.amber+"55":C.wave }), marginBottom:"10px", display:"flex", gap:"12px", alignItems:"flex-start", padding:"14px 16px" }}>
                <span style={{ fontSize:"18px", flexShrink:0 }}>{f.level==="warning"?"⚠️":"ℹ️"}</span>
                <div>
                  <div style={{ fontSize:"13px", fontWeight:700, color:f.level==="warning"?C.amber:C.silver }}>{f.msg}</div>
                  {f.level==="warning"&&f.msg.includes("activity")&&<div style={{ fontSize:"11px", color:C.muted, marginTop:"4px" }}>Recommendation: Contact PM to confirm project status. Consider releasing contingency or approving scope change if supply chain issue confirmed.</div>}
                </div>
              </div>
            ))}
            <div style={{ ...card(), marginBottom:"16px" }}>
              <SectionHead title="Milestone Progress" sub="Tranche release tied to milestone verification on chain" />
              {project.milestones.map((m,i)=>{
                const spent=byMilestone[i]||0;
                const pct=m.targetWST>0?Math.min(100,Math.round((spent/m.targetWST)*100)):0;
                const sc={ verified:C.seafoam, released:"#4A9EE0", pending:C.amber }[m.status]||C.muted;
                const sl={ verified:"✅ Verified & Complete", released:"🔵 Released — field work in progress", pending:"⏳ Pending — not yet released" }[m.status]||m.status;
                return (
                  <div key={i} style={{ marginBottom:"18px", paddingBottom:"18px", borderBottom:i<project.milestones.length-1?`1px solid ${C.ocean}`:"none" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"8px" }}>
                      <div>
                        <div style={{ fontWeight:700, fontSize:"13px" }}>M{i+1}: {m.label}</div>
                        <div style={{ fontSize:"11px", color:C.silver, marginTop:"2px" }}>Budget: {m.targetWST.toLocaleString()} WST · Spent: {spent.toLocaleString()} WST</div>
                      </div>
                      <span style={{ ...badge(sc), fontSize:"9px" }}>{sl}</span>
                    </div>
                    <div style={{ background:C.abyss, borderRadius:"99px", height:"8px" }}>
                      <div style={{ background:sc, borderRadius:"99px", height:"8px", width:`${pct}%`, transition:"width 0.6s" }} />
                    </div>
                    <div style={{ fontSize:"10px", color:C.muted, marginTop:"3px" }}>{pct}% of milestone budget utilised</div>
                  </div>
                );
              })}
            </div>
            <div style={{ ...card() }}>
              <SectionHead title="Activity Timeline" sub="Live — updates as events occur" />
              {activityLog.slice(0,6).map((ev,i)=>(
                <div key={i} style={{ display:"flex", gap:"12px", padding:"10px 0", borderBottom:i<5?`1px solid ${C.ocean}`:"none", alignItems:"flex-start" }}>
                  <div style={{ width:"30px", height:"30px", borderRadius:"50%", background:ev.actor==="CHAIN"?C.seafoam+"22":ev.actor==="MATAI"?"#4A9EE0"+"22":C.amber+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", flexShrink:0 }}>
                    {ev.actor==="CHAIN"?"⛓":ev.actor==="MATAI"?"🏛":"📋"}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"12px", color:C.silver }}>{ev.action}</div>
                    <div style={{ fontSize:"10px", color:C.muted, marginTop:"2px" }}>{fmtTs(ev.ts/1000)} · {ev.actor}</div>
                  </div>
                  {ev.flag&&<span style={{ ...badge(C.amber), fontSize:"9px" }}>ACTION</span>}
                </div>
              ))}
            </div>
          </>
        )}

        {/* DONOR: KPIs */}
        {tab==="kpi"&&role==="donor"&&(
          <>
            <SectionHead title="🎯 KPI Dashboard" sub="Real-time project performance indicators" />
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"14px", marginBottom:"20px" }}>
              <StatPill icon="👥" value="23"    label="Households benefiting"         color={C.seafoam} />
              <StatPill icon="📅" value="68%"   label="Timeline on track"             color={C.gold}    />
              <StatPill icon="✅" value={`${project.milestones.filter(m=>m.status==="verified").length}/${project.milestones.length}`} label="Milestones verified" color="#4A9EE0" />
              <StatPill icon="🧾" value={String(approved.length)} label="Receipts on chain"           color={C.seafoam} />
              <StatPill icon="⏳" value={String(pending.length)}  label="Awaiting approval"           color={pending.length>0?C.amber:C.seafoam} />
              <StatPill icon="💡" value={`${Math.round((totalSpent/project.totalBudget)*100)}%`} label="Total grant utilisation" color={C.coral} />
            </div>
            <div style={{ ...card(), marginBottom:"16px" }}>
              <SectionHead title="Cost Efficiency" />
              {[["Funds received",totalReceived,project.totalBudget,"#4A9EE0"],["Donor-verified",totalVerified,project.totalBudget,C.seafoam],["Expenditure approved",totalSpent,Math.max(totalReceived,1),C.gold]].map(([l,v,t,col])=>(
                <div key={l} style={{ marginBottom:"14px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:"12px", marginBottom:"4px" }}>
                    <span style={{ fontWeight:700 }}>{l}</span>
                    <span style={{ color:col, fontWeight:800 }}>{Math.round((v/t)*100)}% — {v.toLocaleString()} WST</span>
                  </div>
                  <div style={{ background:C.abyss, borderRadius:"99px", height:"7px" }}>
                    <div style={{ background:col, borderRadius:"99px", height:"7px", width:`${Math.min(100,Math.round((v/t)*100))}%`, transition:"width 0.6s" }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ ...card({ background:C.seafoam+"0A", borderColor:C.seafoam+"33" }) }}>
              <div style={{ fontSize:"12px", fontWeight:700, color:C.seafoam, marginBottom:"6px" }}>🔒 Why this data is trustworthy</div>
              <div style={{ fontSize:"12px", color:C.silver, lineHeight:1.8 }}>Every expenditure, receipt hash, and approval is permanently recorded on the Samoa Pacific Blockchain. No one can alter records after confirmation. {project.donor} can independently verify every transaction by querying the AIDisbursementTracker contract directly.</div>
            </div>
          </>
        )}

        {/* DONOR: EXPENDITURE */}
        {tab==="spend"&&role==="donor"&&(
          <>
            <SectionHead title="💸 Expenditure Analysis" sub="Full breakdown — category, milestone, receipt coverage" />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginBottom:"20px" }}>
              <div style={{ ...card() }}>
                <SectionHead title="By Category" />
                {Object.entries(byCategory).map(([cat,amt])=>{
                  const m=EXP_CATEGORIES[cat]||EXP_CATEGORIES.Other;
                  const pct=totalSpent>0?Math.round((amt/totalSpent)*100):0;
                  return (
                    <div key={cat} style={{ marginBottom:"12px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:"12px", marginBottom:"4px" }}>
                        <span>{m.icon} {cat}</span>
                        <span style={{ color:m.color, fontWeight:700 }}>{amt.toLocaleString()} WST ({pct}%)</span>
                      </div>
                      <div style={{ background:C.abyss, borderRadius:"99px", height:"6px" }}>
                        <div style={{ background:m.color, borderRadius:"99px", height:"6px", width:`${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ ...card() }}>
                <SectionHead title="By Milestone" />
                {project.milestones.map((m,i)=>{
                  const spent=byMilestone[i]||0;
                  const pct=m.targetWST>0?Math.min(100,Math.round((spent/m.targetWST)*100)):0;
                  return (
                    <div key={i} style={{ marginBottom:"12px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:"12px", marginBottom:"4px" }}>
                        <span>M{i+1}: {m.label.length>28?m.label.slice(0,28)+"…":m.label}</span>
                        <span style={{ color:C.gold, fontWeight:700 }}>{spent.toLocaleString()}/{m.targetWST.toLocaleString()}</span>
                      </div>
                      <div style={{ background:C.abyss, borderRadius:"99px", height:"6px" }}>
                        <div style={{ background:C.gold, borderRadius:"99px", height:"6px", width:`${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ ...card() }}>
              <SectionHead title="All Expenditures" sub={`${projExps.length} records · ${totalSpent.toLocaleString()} WST approved · ${totalPending.toLocaleString()} WST pending`} />
              {projExps.map(e=>{
                const cm=EXP_CATEGORIES[e.category]||EXP_CATEGORIES.Other;
                return (
                  <div key={e.id} style={{ display:"flex", gap:"12px", padding:"12px 0", borderBottom:`1px solid ${C.ocean}`, alignItems:"center", flexWrap:"wrap" }}>
                    <span style={{ ...badge(e.status==="approved"?C.seafoam:C.amber), fontSize:"9px", flexShrink:0 }}>{e.status==="approved"?"✓ APPROVED":"⏳ PENDING"}</span>
                    <div style={{ flex:1, minWidth:"160px" }}>
                      <div style={{ fontWeight:700, fontSize:"13px" }}>{e.recipient}</div>
                      <div style={{ fontSize:"11px", color:C.muted }}>M{e.milestoneId+1} · {e.date} · {e.receiptRef||"—"}</div>
                    </div>
                    <span style={{ ...badge(cm.color), fontSize:"9px" }}>{cm.icon} {e.category}</span>
                    <div style={{ fontWeight:800, fontSize:"14px", color:C.gold, flexShrink:0 }}>{e.amount.toLocaleString()} WST</div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* DONOR: FLAGS */}
        {tab==="flags"&&role==="donor"&&(
          <>
            <SectionHead title="🚩 Flags & Alerts" sub="Automated project health monitoring" />
            {flags.length===0?(
              <div style={{ ...card(), textAlign:"center", padding:"48px" }}>
                <div style={{ fontSize:"32px", marginBottom:"10px" }}>✅</div>
                <div style={{ color:C.seafoam, fontSize:"14px", fontWeight:700 }}>All systems normal</div>
                <div style={{ color:C.muted, fontSize:"12px", marginTop:"6px" }}>No flags or alerts at this time.</div>
              </div>
            ):flags.map((f,i)=>(
              <div key={i} style={{ ...card({ background:f.level==="warning"?C.amber+"18":C.ocean+"88", borderColor:f.level==="warning"?C.amber+"55":C.wave }), marginBottom:"14px" }}>
                <div style={{ display:"flex", gap:"14px" }}>
                  <span style={{ fontSize:"28px" }}>{f.level==="warning"?"⚠️":"ℹ️"}</span>
                  <div>
                    <div style={{ fontWeight:800, fontSize:"13px", color:f.level==="warning"?C.amber:C.silver, marginBottom:"6px" }}>{f.msg}</div>
                    <div style={{ fontSize:"12px", color:C.muted }}>Auto-generated · {fmtTs(Date.now()/1000)}</div>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ ...card({ marginTop:"16px" }) }}>
              <SectionHead title="How flags work" />
              <div style={{ fontSize:"12px", color:C.silver, lineHeight:1.8 }}>Flags are generated automatically: (1) No PM activity in 7+ days → supply or resource warning; (2) Expenditures awaiting matai approval → funds on hold alert; (3) Budget utilisation above 85% → tranche limit warning. Thresholds are configurable per grant in the MOU. All flag events are logged immutably on chain.</div>
            </div>
          </>
        )}

        {/* DONOR: AUDIT */}
        {tab==="audit"&&role==="donor"&&(
          <>
            <SectionHead title="🔍 Immutable Audit Trail" sub="Every event permanently recorded — tamper-proof by blockchain consensus" />
            <div style={{ ...card(), marginBottom:"14px" }}>
              {activityLog.map((ev,i)=>(
                <div key={i} style={{ display:"flex", gap:"14px", padding:"14px 0", borderBottom:i<activityLog.length-1?`1px solid ${C.ocean}`:"none" }}>
                  <div style={{ width:"36px", height:"36px", borderRadius:"50%", background:ev.actor==="CHAIN"?C.seafoam+"22":ev.actor==="MATAI"?"#4A9EE0"+"22":C.amber+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", flexShrink:0 }}>
                    {ev.actor==="CHAIN"?"⛓":ev.actor==="MATAI"?"🏛":"📋"}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"13px", color:C.silver }}>{ev.action}</div>
                    <div style={{ fontSize:"10px", color:C.muted, fontFamily:F.mono, marginTop:"3px" }}>{fmtTs(ev.ts/1000)} · {ev.actor}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ ...card({ background:C.seafoam+"0A", borderColor:C.seafoam+"33" }) }}>
              <div style={{ fontSize:"11px", color:C.seafoam, fontWeight:700 }}>🔒 AIDisbursementTracker: {ADDR.AID} · Independently verifiable on any Polygon explorer after mainnet deployment</div>
            </div>
          </>
        )}

        {/* PM: EVIDENCE */}
        {tab==="evidence"&&role==="pm"&&(
          <>
            <SectionHead title="📸 Submit Milestone Evidence" sub="Document hash permanently stored on chain — file stored via IPFS after funding" />
            <div style={{ ...card(), maxWidth:"600px" }}>
              {[["Milestone",null,"select"],["Evidence Description",null,"textarea"],["Document / Photo Reference","e.g. PHOTO-SITE-2025-03-07.jpg","input"],["Beneficiaries This Milestone","23","number"]].map(([label,ph,type])=>(
                <div key={label} style={{ marginBottom:"14px" }}>
                  <label style={{ fontSize:"11px", fontWeight:700, color:C.silver, textTransform:"uppercase", letterSpacing:"0.6px", display:"block", marginBottom:"6px" }}>{label}</label>
                  {type==="select"?<select style={inStyle}>{project.milestones.map((m,i)=><option key={i}>M{i+1}: {m.label}</option>)}</select>
                  :type==="textarea"?<textarea rows={4} style={{ ...inStyle, resize:"vertical" }} />
                  :<input type={type} placeholder={ph||""} style={inStyle} />}
                </div>
              ))}
              <div style={{ ...card({ background:C.amber+"14", borderColor:C.amber+"33" }), marginBottom:"14px" }}>
                <div style={{ fontSize:"11px", color:C.amber, fontWeight:700 }}>ℹ After submission, evidence hash is sent to {project.donor} for verification. Tranche will not be released until donor confirms evidence meets MOU standards.</div>
              </div>
              <button style={{ ...btn("success"), width:"100%", justifyContent:"center", padding:"13px" }}>📸 Submit Evidence to Blockchain</button>
            </div>
          </>
        )}

        {/* PM: EXPENDITURE */}
        {tab==="expenditure"&&role==="pm"&&(
          <>
            <SectionHead title="💰 Log Expenditure" sub="Record every payment from the community account — receipt hash on chain" />
            {expTxMsg&&<div style={{ marginBottom:"14px", padding:"12px 16px", borderRadius:"8px", background:expTxMsg.type==="error"?C.danger+"22":C.seafoam+"22", border:`1px solid ${expTxMsg.type==="error"?C.danger:C.seafoam}44`, color:expTxMsg.type==="error"?"#F88":C.seafoam, fontSize:"13px" }}>{expTxMsg.text}</div>}
            <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:"20px" }}>
              <div style={{ ...card() }}>
                {[["Milestone","select"],["Recipient / Supplier *","input-text"],["Amount (WST) *","input-number"],["Category","select-cat"],["Receipt / Invoice Reference","input-text-ref"],["Notes","textarea"]].map(([label,type])=>(
                  <div key={label} style={{ marginBottom:"14px" }}>
                    <label style={{ fontSize:"11px", fontWeight:700, color:C.silver, textTransform:"uppercase", letterSpacing:"0.6px", display:"block", marginBottom:"6px" }}>{label.replace(" *","")}{label.includes("*")&&<span style={{ color:C.coral }}> *</span>}</label>
                    {type==="select"&&<select value={pendingExp.milestoneId} onChange={e=>setPendingExp(f=>({...f,milestoneId:e.target.value}))} style={inStyle}>{project.milestones.map((m,i)=><option key={i} value={i}>M{i+1}: {m.label}</option>)}</select>}
                    {type==="input-text"&&<input value={pendingExp.recipient} onChange={e=>setPendingExp(f=>({...f,recipient:e.target.value}))} placeholder="e.g. Samoa Plumbing Ltd" style={inStyle} />}
                    {type==="input-number"&&<input type="number" value={pendingExp.amount} onChange={e=>setPendingExp(f=>({...f,amount:e.target.value}))} placeholder="0.00" style={inStyle} />}
                    {type==="select-cat"&&<select value={pendingExp.category} onChange={e=>setPendingExp(f=>({...f,category:e.target.value}))} style={inStyle}>{project.categories.map(c=><option key={c} value={c}>{EXP_CATEGORIES[c]?.icon} {c}</option>)}</select>}
                    {type==="input-text-ref"&&(
                      <>
                        <input value={pendingExp.receiptRef} onChange={e=>setPendingExp(f=>({...f,receiptRef:e.target.value}))} placeholder="e.g. INV-SPL-2025-089" style={inStyle} />
                        {pendingExp.receiptRef&&<div style={{ fontSize:"10px", color:C.muted, marginTop:"4px", fontFamily:F.mono }}>Hash: {ethers.keccak256(ethers.toUtf8Bytes(pendingExp.receiptRef+"|"+pendingExp.recipient+"|"+pendingExp.amount)).slice(0,22)}…</div>}
                      </>
                    )}
                    {type==="textarea"&&<textarea value={pendingExp.notes} onChange={e=>setPendingExp(f=>({...f,notes:e.target.value}))} placeholder="Delivery confirmation, context…" rows={3} style={{ ...inStyle, resize:"vertical" }} />}
                  </div>
                ))}
                <div style={{ ...card({ background:C.amber+"14", borderColor:C.amber+"33" }), marginBottom:"14px", padding:"10px 14px" }}>
                  <div style={{ fontSize:"11px", color:C.amber, fontWeight:700 }}>ℹ Requires matai approval before confirmed as disbursed. Amounts ≥ 5,000 WST visible to donor.</div>
                </div>
                <button onClick={handleSubmitExp} disabled={submitting} style={{ ...btn("success"), width:"100%", justifyContent:"center", padding:"13px", opacity:submitting?0.7:1 }}>
                  {submitting?"⏳ Recording…":"💰 Log Expenditure — Submit to Chain"}
                </button>
              </div>
              <div style={{ ...card() }}>
                <SectionHead title="Recent" sub={`${pending.length} awaiting approval`} />
                {projExps.slice(-6).reverse().map(e=>(
                  <div key={e.id} style={{ padding:"10px 0", borderBottom:`1px solid ${C.ocean}` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"2px" }}>
                      <span style={{ fontWeight:700, fontSize:"12px" }}>{e.recipient}</span>
                      <span style={{ ...badge(e.status==="approved"?C.seafoam:C.amber), fontSize:"8px" }}>{e.status==="approved"?"✓":"⏳"}</span>
                    </div>
                    <div style={{ fontSize:"11px", color:C.gold, fontWeight:700 }}>{e.amount.toLocaleString()} WST · {e.category}</div>
                    <div style={{ fontSize:"10px", color:C.muted }}>{e.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* PM: RECEIPTS */}
        {tab==="receipts"&&role==="pm"&&(
          <>
            <SectionHead title="🧾 Receipt Log" sub="All approved expenditures with receipt hashes on chain" />
            <div style={{ ...card() }}>
              {approved.map(e=>{
                const cm=EXP_CATEGORIES[e.category]||EXP_CATEGORIES.Other;
                return (
                  <div key={e.id} style={{ padding:"14px 0", borderBottom:`1px solid ${C.ocean}` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"6px" }}>
                      <div>
                        <div style={{ fontWeight:700, fontSize:"13px" }}>{e.id} · {e.recipient}</div>
                        <div style={{ fontSize:"11px", color:C.silver }}>M{e.milestoneId+1} · {e.date} · {cm.icon} {e.category}</div>
                      </div>
                      <div style={{ fontWeight:800, fontSize:"15px", color:C.gold }}>{e.amount.toLocaleString()} WST</div>
                    </div>
                    <div style={{ fontSize:"10px", color:C.muted, fontFamily:F.mono }}>Receipt ref: {e.receiptRef||"—"} · Hash: {e.receiptHash||ethers.keccak256(ethers.toUtf8Bytes(e.receiptRef||e.id)).slice(0,18)+"…"}</div>
                    {e.approvedBy&&<div style={{ fontSize:"10px", color:C.seafoam, marginTop:"3px" }}>✓ Approved by {short(e.approvedBy)}</div>}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* MATAI: APPROVALS */}
        {tab==="approve"&&role==="matai"&&(
          <>
            <SectionHead title="✅ Pending Approvals" sub={`${pending.length} expenditure${pending.length!==1?"s":""} awaiting matai sign-off`} />
            {pending.length===0?(
              <div style={{ ...card(), textAlign:"center", padding:"48px" }}>
                <div style={{ fontSize:"32px", marginBottom:"10px" }}>✅</div>
                <div style={{ color:C.seafoam, fontSize:"14px", fontWeight:700 }}>No pending approvals</div>
              </div>
            ):pending.map(e=>{
              const cm=EXP_CATEGORIES[e.category]||EXP_CATEGORIES.Other;
              return (
                <div key={e.id} style={{ ...card({ borderLeft:`4px solid ${C.amber}` }), marginBottom:"14px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"12px" }}>
                    <div>
                      <div style={{ fontWeight:800, fontSize:"15px" }}>{e.recipient}</div>
                      <div style={{ fontSize:"12px", color:C.silver, marginTop:"2px" }}>M{e.milestoneId+1} · {e.date} · {e.receiptRef||"No ref"}</div>
                    </div>
                    <div style={{ fontSize:"24px", fontWeight:900, color:C.gold }}>{e.amount.toLocaleString()} WST</div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"8px", marginBottom:"14px" }}>
                    {[["Category",`${cm.icon} ${e.category}`],["Submitted by","Project Manager"],["Receipt",e.receiptRef||"—"]].map(([l,v])=>(
                      <div key={l} style={{ background:C.abyss, borderRadius:"6px", padding:"8px 10px" }}>
                        <div style={{ fontSize:"9px", color:C.muted, marginBottom:"2px", textTransform:"uppercase" }}>{l}</div>
                        <div style={{ fontSize:"12px", color:C.silver }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {e.amount>=5000&&<div style={{ ...card({ background:C.amber+"18", borderColor:C.amber+"44", padding:"10px 14px" }), marginBottom:"12px" }}><div style={{ fontSize:"11px", color:C.amber, fontWeight:700 }}>⚠ Amount ≥ 5,000 WST — this approval will be visible to {project.donor}</div></div>}
                  <div style={{ display:"flex", gap:"10px" }}>
                    <button onClick={()=>handleApprove(e.id)} style={{ ...btn("success"), flex:1, justifyContent:"center" }}>✅ Approve</button>
                    <button style={{ ...btn("ghost"), flex:1, justifyContent:"center" }}>❌ Reject</button>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* MATAI: SPENDING */}
        {tab==="spending"&&role==="matai"&&(
          <>
            <SectionHead title="📊 Community Account Spending" sub="Full breakdown of grant fund usage" />
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px", marginBottom:"20px" }}>
              <StatPill icon="📥" value={totalReceived.toLocaleString()} label="Received from donor"   color={C.seafoam} />
              <StatPill icon="📤" value={totalSpent.toLocaleString()}    label="Approved & disbursed" color={C.gold}    />
              <StatPill icon="🏦" value={remaining.toLocaleString()}     label="Remaining in account" color="#4A9EE0"   />
            </div>
            <div style={{ ...card() }}>
              <SectionHead title="Approved Expenditures" />
              {approved.map(e=>{
                const cm=EXP_CATEGORIES[e.category]||EXP_CATEGORIES.Other;
                return (
                  <div key={e.id} style={{ display:"flex", gap:"12px", padding:"12px 0", borderBottom:`1px solid ${C.ocean}`, alignItems:"center" }}>
                    <span style={{ fontSize:"20px" }}>{cm.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:"13px" }}>{e.recipient}</div>
                      <div style={{ fontSize:"11px", color:C.muted }}>{e.date} · {e.receiptRef||"—"}</div>
                    </div>
                    <span style={{ ...badge(cm.color), fontSize:"9px" }}>{e.category}</span>
                    <div style={{ fontWeight:800, fontSize:"14px", color:C.gold }}>{e.amount.toLocaleString()} WST</div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* PUBLIC: MONEY */}
        {tab==="money"&&role==="public"&&(
          <>
            <SectionHead title="💵 Money In / Money Out" sub="Simple transparent view of community grant funds" />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginBottom:"16px" }}>
              <div style={{ ...card({ borderTop:`3px solid ${C.seafoam}` }) }}>
                <div style={{ fontSize:"11px", color:C.seafoam, fontWeight:800, textTransform:"uppercase", marginBottom:"8px" }}>💚 Money Received</div>
                <div style={{ fontSize:"32px", fontWeight:900, fontFamily:F.display, color:C.seafoam }}>{totalReceived.toLocaleString()}</div>
                <div style={{ fontSize:"12px", color:C.silver }}>WST from {project.donor}</div>
                <div style={{ fontSize:"11px", color:C.muted, marginTop:"8px" }}>{project.milestones.filter(m=>m.status!=="pending").length} tranches · Verified on blockchain</div>
              </div>
              <div style={{ ...card({ borderTop:`3px solid ${C.gold}` }) }}>
                <div style={{ fontSize:"11px", color:C.gold, fontWeight:800, textTransform:"uppercase", marginBottom:"8px" }}>💛 Money Spent</div>
                <div style={{ fontSize:"32px", fontWeight:900, fontFamily:F.display, color:C.gold }}>{totalSpent.toLocaleString()}</div>
                <div style={{ fontSize:"12px", color:C.silver }}>WST to suppliers & labour</div>
                <div style={{ fontSize:"11px", color:C.muted, marginTop:"8px" }}>{approved.length} payments · Approved by village leadership</div>
              </div>
            </div>
            <div style={{ ...card({ background:C.ocean, borderColor:"#4A9EE044" }), marginBottom:"16px", textAlign:"center", padding:"24px" }}>
              <div style={{ fontSize:"13px", color:C.silver, marginBottom:"6px" }}>Remaining in community account</div>
              <div style={{ fontSize:"40px", fontWeight:900, fontFamily:F.display, color:"#4A9EE0" }}>{remaining.toLocaleString()} WST</div>
            </div>
            <div style={{ ...card() }}>
              <SectionHead title="What was the money spent on?" />
              {approved.map(e=>{
                const cm=EXP_CATEGORIES[e.category]||EXP_CATEGORIES.Other;
                return (
                  <div key={e.id} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${C.ocean}`, alignItems:"center" }}>
                    <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
                      <span style={{ fontSize:"18px" }}>{cm.icon}</span>
                      <div>
                        <div style={{ fontSize:"13px", fontWeight:700 }}>{e.recipient}</div>
                        <div style={{ fontSize:"11px", color:C.muted }}>{e.date} · {e.category}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight:800, color:C.gold }}>{e.amount.toLocaleString()} WST</div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* PUBLIC: IMPACT */}
        {tab==="impact"&&role==="public"&&(
          <>
            <SectionHead title="🌱 Community Impact" sub="What this project means for the village" />
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px", marginBottom:"20px" }}>
              <StatPill icon="🏠" value="23"   label="Households with biogas"      color={C.seafoam} />
              <StatPill icon="🏘" value="~115" label="Community members benefiting" color="#4A9EE0"   />
              <StatPill icon="⛽" value="60%"  label="Reduction in fuel costs"     color={C.gold}    />
            </div>
            <div style={{ ...card({ background:C.seafoam+"0A", borderColor:C.seafoam+"33" }), marginBottom:"16px" }}>
              <div style={{ fontSize:"14px", fontWeight:800, color:C.seafoam, marginBottom:"8px" }}>About this project</div>
              <div style={{ fontSize:"13px", color:C.silver, lineHeight:1.8 }}>{project.description}</div>
            </div>
            <div style={{ ...card({ background:C.gold+"0A", borderColor:C.gold+"33" }) }}>
              <div style={{ fontSize:"12px", fontWeight:700, color:C.gold, marginBottom:"4px" }}>🔒 This data cannot be changed</div>
              <div style={{ fontSize:"12px", color:C.silver }}>Every transaction and approval is permanently recorded on the Samoa Pacific Blockchain. Village leadership and {project.donor} can independently verify all records at any time.</div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

// ---
// ROOT APP
// ---
export default function App() {
  const { provider, connected, error } = useProvider();
  const [view,        setView]        = useState("home");
  const [blockNumber, setBlockNumber] = useState(null);

  // Block number polling
  useEffect(() => {
    if (!provider) return;
    const poll = async () => { try { setBlockNumber(await provider.getBlockNumber()); } catch {} };
    poll();
    const id = setInterval(poll, CONFIG.POLL_MS);
    return () => clearInterval(id);
  }, [provider]);

  // Global all-ministry records — feeds cross-ministry workflow engine
  const { data:allRecords, loading:allLoading } = usePoll(
    () => provider ? fetchAllRecords(provider) : Promise.resolve([]),
    [provider],
  );

  const ministry = view.startsWith("ministry:") ? view.split(":")[1] : null;

  const sharedProps = { provider, connected, blockNumber, allRecords: allRecords||[], allLoading };

  return (
    <div style={{ fontFamily:F.ui }}>
      <ConnectionBanner connected={connected} error={error} network={CONFIG.NETWORK} />

      {view === "home" && (
        <Home {...sharedProps} onSelect={v => setView(v)} />
      )}

      {ministry && (
        <MinistryDashboard
          {...sharedProps}
          ministryCode={ministry}
          onBack={() => setView("home")}
        />
      )}

      {view === "community" && (
        <CommunityDashboard
          {...sharedProps}
          onBack={() => setView("home")}
        />
      )}

      {view === "unicef" && (
        <UNICEFDashboard
          {...sharedProps}
          onBack={() => setView("home")}
        />
      )}

      {view === "hub" && (
        <HubDashboard
          {...sharedProps}
          onBack={() => setView("home")}
          onSelectMinistry={code => setView("ministry:"+code)}
        />
      )}
    </div>
  );
}
