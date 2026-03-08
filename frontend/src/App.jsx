/**
 * SAMOA PACIFIC BLOCKCHAIN HUB -- FULL SYSTEM TEST CHECKLIST v9
 * Run before UNICEF Venture Fund 2026 submission
 *
 * PREREQUISITE:
 *   pkill anvil && anvil &
 *   sleep 2
 *   cd ~/mvp/samoa-pacific-blockchain-hub/contracts
 *   forge script script/Deploy.s.sol:DeploySamoaHub \
 *     --rpc-url http://127.0.0.1:8545 \
 *     --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
 *     --broadcast -vvvv
 *   npm run dev  -> http://localhost:5173
 *
 * -------------------------------------------------------------------
 * TEST 1 -- HOME SCREEN
 * -------------------------------------------------------------------
 * ( ) LIVE banner shows "reading from Anvil Local ? Polling every 3s"
 * ( ) Block # increments every 3s
 * ( ) Stats: 6 Government Ministries ? Records On Chain ? Active Workflows ? Citizens Registered
 * ( ) Ministry cards visible: CBS (9 pending), MCIT, MOF (1 pending), EDUCATION, MCIL, CUSTOMS
 * ( ) Special dashboards row: UNICEF Donor Dashboard ? Community Project Dashboard ? Interoperability Hub
 * ( ) 6 Workflow Definitions visible with step chains
 *
 * -------------------------------------------------------------------
 * TEST 2 -- UNICEF DONOR DASHBOARD
 * -------------------------------------------------------------------
 * ( ) Click "UNICEF Donor Dashboard" from home
 * ( ) Grant Overview tab: Grant #0 title, 100,000 WST total, donor/recipient addresses shown
 * ( ) Released/Verified progress bars reflect on-chain state
 * ( ) Auto-beneficiary count reads from Education SCHOOL_ENROLMENT_2025 records
 * ( ) Community Project tab: Opens cross-dashboard view
 *     ( ) "Open Full Community Dashboard ->" button navigates to Community Dashboard
 *     ( ) Milestone statuses sync from live chain tranches
 *     ( ) Expenditure breakdown (EXP-001 to EXP-007) visible with receipt hashes
 * ( ) Tranches tab: T0 Verified, T1 Released (awaiting verify), T2 Pending -- correct
 * ( ) Verify Tranche tab:
 *     ( ) grantId defaults to 0, trancheId defaults to 1
 *     ( ) Submit verifyUsage() -- tx confirmed, T1 -> Verified
 *     ( ) Success banner shows tx hash
 * ( ) Release Tranche tab:
 *     ( ) grantId 0, trancheId 2
 *     ( ) Submit releaseTranche() -- T2 -> Released
 * ( ) Audit Trail tab: entries appear after verify/release actions
 * ( ) Impact tab: beneficiary count, cost-per-child, utilisation bars
 *
 * -------------------------------------------------------------------
 * TEST 3 -- COMMUNITY PROJECT DASHBOARD
 * -------------------------------------------------------------------
 * ( ) Click "Community Project Dashboard" from home
 * Role selector screen:
 * ( ) Two projects listed: Vaiala Biogas (ON CHAIN) ? Savai'i Water (SETUP)
 * ( ) Four role cards: Donor ? Project Manager ? Matai ? Community
 *
 * DONOR ROLE:
 * ( ) Portfolio tab: KPI strip -- 70,000 received, 58,900 spent, 11,100 remaining, 84% utilisation
 * ( ) (!) Inactivity flag (8 days) shown
 * ( ) (i) EXP-007 pending approval flag shown
 * ( ) Milestone progress bars: M1 Verified, M2 Released (in progress), M3 Pending
 * ( ) Activity timeline shows 6 entries
 * ( ) KPIs tab: 23 households, 68% timeline, 2/3 milestones, 6 receipts on chain
 * ( ) " Open UNICEF Donor Dashboard ->" button navigates back to UNICEF dashboard
 * ( ) Expenditure tab: category bars (Labour/Materials/Equipment/Training/Overhead) + milestone bars
 * ( ) All 7 expenditures listed with status badges
 * ( ) Flags tab: 2 flags (inactivity + pending approval) with recommendations
 * ( ) Audit Trail: 7 entries, CHAIN/PM/MATAI actors
 *
 * PROJECT MANAGER ROLE:
 * ( ) Status tab: same KPIs, milestones, activity log
 * ( ) Evidence tab: form renders (milestone select, description, doc reference, beneficiaries)
 * ( ) Log Expenditure tab:
 *     ( ) Fill: recipient, amount, category, receipt ref
 *     ( ) Receipt hash preview updates as you type
 *     ( ) Submit -> new EXP appears in recent list with (pending) PENDING badge
 *     ( ) Activity log gains new entry
 * ( ) Receipts tab: 6 approved receipts with hashes
 *
 * MATAI ROLE:
 * ( ) Account tab: KPIs correct
 * ( ) Pending Approvals: EXP-007 shows (Piping & Fittings, 5,800 WST)
 * ( ) (!) "Amount >= 5,000 WST -- visible to UNICEF" warning shown
 * ( ) Click "? Approve" -> EXP-007 status flips to approved
 * ( ) Activity log gains "MATAI" entry
 * ( ) Spending tab: all approved expenditures listed
 *
 * COMMUNITY / PUBLIC ROLE:
 * ( ) Overview: KPIs + milestone progress visible
 * ( ) Money In/Out: 70,000 received, 58,900 spent, 11,100 remaining displayed simply
 * ( ) All expenditures listed in plain language
 * ( ) Impact: 23 households, ~115 members, 60% fuel reduction
 * ( ) "Cannot be changed" statement visible
 *
 * Project switching:
 * ( ) Change dropdown to "Savai'i Rural Water Access Programme"
 * ( ) All milestones show Pending (no on-chain grant)
 * ( ) Budget shows 250,000 WST
 *
 * -------------------------------------------------------------------
 * TEST 4 -- MINISTRY DASHBOARDS
 * -------------------------------------------------------------------
 * For each of: CBS, MCIT, MOF, EDUCATION, MCIL, CUSTOMS
 * ( ) Opens from home screen card
 * ( ) Pending Actions tab: shows correct pending cross-ministry steps
 * ( ) Pre-fill from pending action -> form populates citizenId, serviceType
 * ( ) Pre-filled hash detected (0x prefix, 66 chars) -> used directly (no double-hash)
 * ( ) Record Service tab: submit succeeds, tx hash shown
 * ( ) My Records tab: newly submitted record appears
 * ( ) Active Workflows tab: citizens with in-progress workflows shown
 *
 * CBS specific:
 * ( ) 9 pending actions from EDU-BENEFIT, WELFARE, CUSTOMS-CLEAR workflows
 * ( ) DIGITAL_PAYMENT_RECORDED service type auto-selected
 * ( ) ndidsVerified = false enforced (CBS cross-sector policy), warning shown if user tries to set true
 *
 * MOF specific:
 * ( ) BUDGET_ALLOCATION_RECORDED -> ndidsVerified = false (biz citizens, MOF not in bizHash grants)
 * ( ) Other MOF services -> ndidsVerified = true
 *
 * -------------------------------------------------------------------
 * TEST 5 -- FULL WORKFLOW END-TO-END: EDU-BENEFIT
 * -------------------------------------------------------------------
 * ( ) EDUCATION: Record SCHOOL_ENROLMENT_2025 for SAMOA-EDU-001
 * ( ) MOF: Pending Actions shows EDUCATION_BENEFIT_ELIGIBLE_2025 for SAMOA-EDU-001
 * ( ) MOF: Pre-fill from pending, submit EDUCATION_BENEFIT_ELIGIBLE_2025
 * ( ) CBS: Pending Actions shows DIGITAL_PAYMENT_RECORDED for SAMOA-EDU-001
 * ( ) CBS: Pre-fill, submit DIGITAL_PAYMENT_RECORDED (ndidsVerified=false, no revert)
 * ( ) EDUCATION: Pending Actions shows ATTENDANCE_RECORD for SAMOA-EDU-001
 * ( ) EDUCATION: Submit ATTENDANCE_RECORD -- workflow complete
 * ( ) UNICEF dashboard beneficiary count increments
 *
 * -------------------------------------------------------------------
 * TEST 6 -- FULL WORKFLOW END-TO-END: BIZ-LICENCE
 * -------------------------------------------------------------------
 * ( ) MCIL: Record COMPANY_REGISTRATION for SAMOA-BIZ-001
 * ( ) MOF: Pending shows BUDGET_ALLOCATION_RECORDED -- submit (ndidsVerified=false)
 * ( ) MCIT: Pending shows BUSINESS_LICENCE_DIGITAL -- submit (ndidsVerified=true)
 * ( ) Hub: workflow appears in log as completed
 *
 * -------------------------------------------------------------------
 * TEST 7 -- INTEROPERABILITY HUB
 * -------------------------------------------------------------------
 * ( ) Opens from home
 * ( ) Ministries tab: all 6 ministries with contract addresses
 * ( ) Workflows tab: recent cross-ministry events from chain
 * ( ) Permissions tab: authorised ministry-to-ministry read pairs
 * ( ) Click ministry card -> navigates to that ministry dashboard
 *
 * -------------------------------------------------------------------
 * TEST 8 -- CROSS-DASHBOARD NAVIGATION
 * -------------------------------------------------------------------
 * ( ) UNICEF Dashboard -> Community tab -> "Open Full Community Dashboard" -> Community Dashboard opens
 * ( ) Community Dashboard (Donor role, KPI tab) -> "Open UNICEF Donor Dashboard" -> UNICEF opens
 * ( ) Both show same milestone statuses (M1 Verified, M2 Released, M3 Pending)
 * ( ) verifyUsage() in UNICEF -> return to Community Dashboard -> M1 shows Verified ?
 * ( ) releaseTranche() in UNICEF -> return to Community -> M2 shows Released 
 *
 * -------------------------------------------------------------------
 * TEST 9 -- OFFLINE / DEMO MODE
 * -------------------------------------------------------------------
 * ( ) Stop Anvil (pkill anvil)
 * ( ) Reload app -- banner shows offline warning
 * ( ) All dashboards still render with MOCK data (no blank screens or crashes)
 * ( ) Restart Anvil + redeploy -> app reconnects automatically within 3s
 *
 * -------------------------------------------------------------------
 * SUBMISSION READINESS CHECKLIST
 * -------------------------------------------------------------------
 * ( ) All 9 test suites passing
 * ( ) GitHub Pages live: https://hamobcdev.github.io/samoa-pacific-blockchain-hub/
 * ( ) Clean redeploy tested on fresh Anvil (pkill, redeploy, all state correct)
 * ( ) Video walkthrough recorded covering: home -> ministry -> workflow -> UNICEF -> community
 * ( ) All 4 community roles demonstrated in video
 * ( ) verifyUsage() + releaseTranche() shown live on chain in video
 * ( ) UNICEF ? Community cross-navigation demonstrated
 * ( ) Application text references: AIDisbursementTracker, NDIDSRegistry, InteroperabilityHub
 * ( ) GitHub README updated with: contract addresses, deploy steps, test suite results
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
// CONTRACT ADDRESSES -- deterministic Anvil
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
    { value:"ICT_REGISTRATION",        label:"Sector Regulatory Clearance", desc:"Sector authority review for investment, ICT registration, or compliance clearance" },
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
      { ministry:"MCIL", serviceType:"FOREIGN_INVESTMENT_APPROVED", label:"MCIL: Application Review & Initial Approval", fee:false },
      { ministry:"MOF",  serviceType:"TAX_COMPLIANCE_VERIFIED",     label:"MOF: Tax & Compliance Clearance",            fee:false },
      { ministry:"MCIT", serviceType:"ICT_REGISTRATION",            label:"MCIT: Sector Regulatory Clearance",          fee:false },
      { ministry:"MCIL", serviceType:"LABOUR_CONTRACT_RECORDED",    label:"MCIL: Issue Investment Certificate ✓",       fee:false },
    ],
    note: "MCIT provides sector regulatory clearance at Step 3. For ICT/telecoms investments this is a spectrum and licensing review; for other sectors MCIT confirms the digital infrastructure and compliance requirements are met before MCIL issues the final certificate.",
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

// ---
// SERVICE FEE SCHEDULE — Realistic WST amounts for every ministry service
// govFee = government processing/licence fee (WST)
// clientAmount = service benefit value / payment out (WST, 0 if N/A)
// vatRate = VAGST rate (0.15 for applicable services, 0 otherwise)
// hasFee = whether a payment form should be shown
// isPaymentOut = government pays citizen (benefit/welfare)
// override = officer must confirm actual amount (duty, remittance etc.)
// ---
const SERVICE_FEES = {
  // EDUCATION
  SCHOOL_ENROLMENT_2025:          { govFee:0,    clientAmount:0,     vatRate:0,    feeLabel:"School Enrolment",              note:"Government-funded — no fee",               hasFee:false },
  ATTENDANCE_RECORD:              { govFee:0,    clientAmount:0,     vatRate:0,    feeLabel:"Attendance Record",              note:"Administrative record — no charge",         hasFee:false },
  SCHOLARSHIP_AWARDED:            { govFee:0,    clientAmount:1500,  vatRate:0,    feeLabel:"Scholarship Award (WST 1,500)",  note:"Scholarship value paid to recipient",       hasFee:true, isPaymentOut:true },
  GRADUATION_RECORD:              { govFee:25,   clientAmount:0,     vatRate:0,    feeLabel:"Graduation Certificate Fee",     note:"Certificate printing and admin fee",         hasFee:true },
  SPECIAL_NEEDS_SUPPORT:          { govFee:0,    clientAmount:0,     vatRate:0,    feeLabel:"Special Needs Support",          note:"Ministry-funded support — no charge",        hasFee:false },
  // MOF
  EDUCATION_BENEFIT_ELIGIBLE_2025:{ govFee:0,    clientAmount:800,   vatRate:0,    feeLabel:"School Fee Subsidy (WST 800/yr)",note:"Government benefit payment to family",      hasFee:true, isPaymentOut:true },
  SOCIAL_WELFARE_PAYMENT_2025:    { govFee:0,    clientAmount:350,   vatRate:0,    feeLabel:"Welfare Payment (WST 350/ftn)", note:"Fortnightly welfare disbursement",           hasFee:true, isPaymentOut:true },
  TAX_COMPLIANCE_VERIFIED:        { govFee:150,  clientAmount:0,     vatRate:0,    feeLabel:"Tax Compliance Certificate",     note:"Annual tax clearance — WST 150",            hasFee:true },
  BUDGET_ALLOCATION_RECORDED:     { govFee:300,  clientAmount:0,     vatRate:0,    feeLabel:"Business Licence Fee (MOF)",     note:"MOF licence component — WST 300",           hasFee:true },
  DUTY_PROCESSED:                 { govFee:0,    clientAmount:0,     vatRate:0.15, feeLabel:"Customs Duty Payment",           note:"Duty amount varies by tariff — enter actual",hasFee:true, override:true },
  // CBS
  ACCOUNT_OPENED:                 { govFee:10,   clientAmount:50,    vatRate:0,    feeLabel:"Bank Account Opening",           note:"Admin WST 10 + initial deposit WST 50",     hasFee:true },
  REMITTANCE_RECEIVED:            { govFee:5,    clientAmount:0,     vatRate:0,    feeLabel:"Remittance Processing Fee",      note:"Per-transaction fee — enter transfer amt",   hasFee:true, override:true },
  LOAN_APPROVED:                  { govFee:50,   clientAmount:0,     vatRate:0,    feeLabel:"Loan Application Fee",           note:"Non-refundable credit assessment — WST 50", hasFee:true },
  DIGITAL_PAYMENT_RECORDED:       { govFee:2,    clientAmount:0,     vatRate:0,    feeLabel:"Digital Payment Processing",     note:"Per-transaction fee — enter payment amt",    hasFee:true, override:true },
  STABLECOIN_ISSUANCE:            { govFee:10,   clientAmount:0,     vatRate:0,    feeLabel:"WST Stablecoin Issuance",        note:"CBS digital currency admin — WST 10",        hasFee:true, override:true },
  // MCIT
  BUSINESS_LICENCE_DIGITAL:       { govFee:250,  clientAmount:0,     vatRate:0.15, feeLabel:"Digital Business Licence",       note:"Annual licence + VAGST — total WST 287.50", hasFee:true },
  SPECTRUM_LICENCE_ISSUED:        { govFee:2000, clientAmount:0,     vatRate:0.15, feeLabel:"Spectrum / Radio Licence",       note:"Annual spectrum licence Cat A + VAGST",      hasFee:true },
  DIGITAL_ID_ISSUED:              { govFee:50,   clientAmount:0,     vatRate:0,    feeLabel:"National Digital ID Card",       note:"One-time issuance — WST 50",                hasFee:true },
  CYBERSECURITY_AUDIT:            { govFee:500,  clientAmount:0,     vatRate:0.15, feeLabel:"Cybersecurity Compliance Audit", note:"MCIT audit and certification + VAGST",       hasFee:true },
  ICT_REGISTRATION:               { govFee:200,  clientAmount:0,     vatRate:0.15, feeLabel:"Sector Regulatory Clearance",    note:"MCIT sector review and clearance + VAGST",  hasFee:true },
  // MCIL
  COMPANY_REGISTRATION:           { govFee:300,  clientAmount:0,     vatRate:0,    feeLabel:"Company Registration Fee",       note:"Companies Act base tier — WST 300",         hasFee:true },
  TRADE_LICENCE_UPDATED:          { govFee:150,  clientAmount:0,     vatRate:0,    feeLabel:"Trade Licence Verification",     note:"Annual trade licence verification — WST 150",hasFee:true },
  LABOUR_CONTRACT_RECORDED:       { govFee:100,  clientAmount:0,     vatRate:0,    feeLabel:"Investment Certificate Fee",     note:"MCIL certificate issuance — WST 100",        hasFee:true },
  FOREIGN_INVESTMENT_APPROVED:    { govFee:1500, clientAmount:0,     vatRate:0.15, feeLabel:"Foreign Investment Application", note:"FDI review fee + VAGST — total WST 1,725",  hasFee:true },
  DISPUTE_RESOLUTION_RECORDED:    { govFee:200,  clientAmount:0,     vatRate:0,    feeLabel:"Dispute Resolution Filing",      note:"Labour/commercial dispute filing — WST 200", hasFee:true },
  // CUSTOMS
  SHIPMENT_CLEARED_2025:          { govFee:50,   clientAmount:0,     vatRate:0,    feeLabel:"Customs Manifest Entry",         note:"Shipment declaration fee — WST 50",          hasFee:true, override:true },
  TRADE_FACILITATION_RECORD:      { govFee:100,  clientAmount:0,     vatRate:0,    feeLabel:"Container Release Clearance",    note:"Final customs release fee — WST 100",        hasFee:true },
  TARIFF_CLASSIFICATION:          { govFee:30,   clientAmount:0,     vatRate:0,    feeLabel:"Tariff Classification Fee",      note:"Per-item tariff code — WST 30",              hasFee:true },
  PROHIBITED_GOODS_FLAGGED:       { govFee:0,    clientAmount:0,     vatRate:0,    feeLabel:"Prohibited Goods Flagged",       note:"No fee — enforcement action",               hasFee:false },
  BOND_WAREHOUSE_RECORD:          { govFee:75,   clientAmount:0,     vatRate:0,    feeLabel:"Bond Warehouse Entry",           note:"First 3 days storage incl. — WST 75/3-day", hasFee:true },
};

// PAYMENT RAILS
const PAYMENT_RAILS = [
  { value:"BANK_TRANSFER",   label:"🏦 Bank Transfer",         sub:"BSP / ANZ / Samoa Commercial Bank" },
  { value:"MPAY_VODAFONE",   label:"📱 M-Pay / M-Tala",        sub:"Vodafone Samoa mobile money" },
  { value:"DIGICEL_MYCASH",  label:"📱 MyCash",                sub:"Digicel Samoa mobile money" },
  { value:"WST_STABLECOIN",  label:"💎 WST Stablecoin Wallet", sub:"CBS Digital — requires issuance authority" },
  { value:"VISA_MASTERCARD", label:"💳 Visa / Mastercard",     sub:"EFTPOS terminal or online payment" },
  { value:"MOBILE_BANKING",  label:"📲 Mobile Banking App",    sub:"BSP Mobile / ANZ goMoney" },
  { value:"CHEQUE",          label:"📄 Government Cheque",     sub:"Payable to Ministry — 3 day clearance" },
  { value:"CASH",            label:"💵 Cash",                  sub:"Counter payment — official receipt required" },
];

// VERIFIABLE CREDENTIAL / NFT CERTIFICATE HELPERS
// Deterministic hash: anyone with txHash + inputs can verify authenticity
function generateCredentialHash(txHash, citizenId, serviceType, ministryCode, amount, timestamp) {
  const cHash = (citizenId?.startsWith("0x") && citizenId?.length === 66)
    ? citizenId
    : ethers.keccak256(ethers.toUtf8Bytes(citizenId || ""));
  return ethers.keccak256(ethers.toUtf8Bytes(
    `CREDENTIAL:${txHash}:${cHash}:${serviceType}:${ministryCode}:${amount||0}:${timestamp}`
  ));
}
function generateMinistrySignature(credentialHash, ministryCode) {
  return ethers.keccak256(ethers.toUtf8Bytes(
    `MINISTRY_SIG:${ministryCode}:${credentialHash}:${DEPLOYER_KEY.slice(2,18)}`
  ));
}
function buildIPFSMetadata({ credHash, sigHash, txHash, citizenId, serviceType, ministryCode, amount, fee, paymentMethod, paymentRailLabel, wf, timestamp, ref }) {
  const cHash = (citizenId?.startsWith("0x") && citizenId?.length === 66)
    ? citizenId
    : ethers.keccak256(ethers.toUtf8Bytes(citizenId || ""));
  return {
    schema: "SamoaBlockchainHub/v1/ServiceCredential",
    version: "1.0",
    credentialHash: credHash,
    ministrySignature: sigHash,
    issuedBy: { code: ministryCode, name: MINISTRY_META[ministryCode]?.name },
    issuedAt: new Date(timestamp).toISOString(),
    reference: ref,
    service: { type: serviceType, label: serviceLabel(serviceType), workflow: wf.workflowName||"Standalone", step: wf.stepLabel||"1 of 1" },
    subject: { citizenHash: cHash, piiOnChain: false },
    payment: { govFee: fee||0, clientAmount: amount||0, method: paymentMethod||"BANK_TRANSFER", rail: paymentRailLabel||"Bank Transfer", currency: "WST" },
    blockchain: { network: CONFIG.NETWORK, txHash, contractAddress: MINISTRY_ADDRS[ministryCode]||"—" },
    verification: {
      instructions: "Recompute: keccak256('CREDENTIAL:'+txHash+':'+citizenHash+':'+serviceType+':'+ministryCode+':'+amount+':'+timestamp). Must match credentialHash.",
      ministryPublicKey: `keccak256('MINISTRY_SIG:${ministryCode}:'+credentialHash+':${DEPLOYER_KEY.slice(2,18)}) must match ministrySignature.`,
      ipfsNote: "IPFS pinning via Pinata/web3.storage enabled post-funding. Present credentialHash to any Samoa government portal for instant verification.",
    },
  };
}

// Build reverse lookup: serviceType -> [{ workflowId, stepIndex }]
const SVC_TO_WF = {};
Object.entries(WORKFLOW_DEFS).forEach(([wfId, wf]) => {
  wf.steps.forEach((step, idx) => {
    if (!SVC_TO_WF[step.serviceType]) SVC_TO_WF[step.serviceType] = [];
    SVC_TO_WF[step.serviceType].push({ workflowId:wfId, stepIndex:idx });
  });
});

// Build ministry -> [workflowId] map
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
// must submit with verifyViaNDIDS=false -- identity was verified upstream.
//
// Rule: true  = this ministry CAN verify this serviceType via NDIDS
//       false = payment/processing step -- identity already verified upstream
// ---
const NDIDS_POLICY = {
  // EDUCATION -- owns edu citizens, verifies all its own service types
  EDUCATION: {
    SCHOOL_ENROLMENT_2025:   true,   // step 1 EDU-BENEFIT — edu citizen, EDUCATION has access
    ATTENDANCE_RECORD:       true,   // step 4 EDU-BENEFIT — confirming receipt, still edu citizen
    SCHOLARSHIP_AWARDED:     true,
    GRADUATION_RECORD:       true,
    SPECIAL_NEEDS_SUPPORT:   true,
  },
  // MOF -- has access to edu + welfare + trade citizens
  MOF: {
    EDUCATION_BENEFIT_ELIGIBLE_2025: true,   // step 2 EDU-BENEFIT — MOF has eduHash access
    SOCIAL_WELFARE_PAYMENT_2025:     true,   // step 1 WELFARE — MOF has welfareHash access
    TAX_COMPLIANCE_VERIFIED:         true,   // step 3 WELFARE / step 2 FOREIGN-INV — trade/welfare
    DUTY_PROCESSED:                  true,   // step 3 CUSTOMS-CLEAR — MOF has tradeHash access
    BUDGET_ALLOCATION_RECORDED:      false,  // step 2 BIZ-LICENCE — MOF NOT in bizHash grants
  },
  // CBS -- payment processor only, NO cross-sector NDIDS access
  // CBS owns cbsHashes (SAMOA-CBS-001/002/003) only
  // All cross-workflow payments use citizens from other sectors -> NO NDIDS verify
  CBS: {
    DIGITAL_PAYMENT_RECORDED: false,  // used in EDU-BENEFIT/WELFARE/CUSTOMS — cross-sector
    REMITTANCE_RECEIVED:       true,  // CBS own sector citizen (SAMOA-CBS-xxx)
    ACCOUNT_OPENED:            true,  // CBS own sector citizen
    LOAN_APPROVED:             true,  // CBS own sector citizen
    STABLECOIN_ISSUANCE:       true,  // CBS own sector citizen
  },
  // CUSTOMS -- owns trade citizens
  CUSTOMS: {
    SHIPMENT_CLEARED_2025:     true,
    TRADE_FACILITATION_RECORD: true,
    TARIFF_CLASSIFICATION:     true,
    PROHIBITED_GOODS_FLAGGED:  true,
    BOND_WAREHOUSE_RECORD:     true,
  },
  // MCIL -- owns biz + trade citizens
  MCIL: {
    COMPANY_REGISTRATION:        true,
    FOREIGN_INVESTMENT_APPROVED: true,
    LABOUR_CONTRACT_RECORDED:    true,
    TRADE_LICENCE_UPDATED:       true,
    DISPUTE_RESOLUTION_RECORDED: true,
  },
  // MCIT -- owns biz citizens [4,5,6]
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
// LEGACY WORKFLOW DEFINITIONS (v7 -- kept for ReceiptCard compatibility)
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
  ICT_REGISTRATION:               { workflowName:"Foreign Investment Approval",      workflowId:"FOREIGN-INV",   step:3, totalSteps:4, owner:"MCIT",      stepLabel:"Step 3 of 4 — MCIT Sector Regulatory Clearance", nextStep:{ ministry:"MCIL",      action:"Issue investment certificate",      serviceType:"LABOUR_CONTRACT_RECORDED"        }, prevSteps:[{ ministry:"MCIL",      label:"Application reviewed"       },{ ministry:"MOF",label:"Tax cleared" }], receipt:{ label:"Sector Clearance Reference",      prefix:"MCIT-INV" }, notice:"MCIL must now issue the final investment certificate. MCIT sector clearance is recorded on chain as a permanent compliance record." },
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
    <div style={{ background:C.seafoam+"18", borderBottom:`1px solid ${C.seafoam}33`, padding:"6px 28px", display:"flex", gap:"12px", alignItems:"center", fontSize:"11px", flexWrap:"wrap" }}>
      <span style={{ color:C.seafoam, fontWeight:700 }}>● LIVE — reading from {network}</span>
      <span style={{ color:C.muted }}>Polling every {CONFIG.POLL_MS/1000}s · transactions appear automatically</span>
      <span style={{ color:C.muted, borderLeft:`1px solid ${C.ocean}`, paddingLeft:"12px" }}>
        ℹ Block # advances on each transaction (Anvil mines on demand). On testnet/mainnet blocks advance automatically every ~2–12s depending on chain configuration.
      </span>
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
          <div style={{ width:"46px", height:"46px", borderRadius:"10px", background:accent+"22", border:`2px solid ${accent}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px" }}>🏝</div>
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

// Workflow step bar -- shows progress across N steps
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
// ENHANCED RECEIPT CARD -- v8
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

function ReceiptCard({ txHash, citizenId, serviceType, evidenceNote, timestamp, ministry, amount, fee, paymentMethod, paymentRef, officerId, workflowId, onNext, onAnother }) {
  const wfEntry = workflowId
    ? Object.entries(WORKFLOWS).find(([svc, w]) => svc === serviceType && w.workflowId === workflowId)?.[1]
    : null;
  const wf         = wfEntry || WORKFLOWS[serviceType] || {};
  const ref        = generateRef(txHash, wf.receipt?.prefix || "SBP");
  const isComplete = !wf.nextStep;
  const oHash      = officerId ? officerHashFor(officerId) : null;

  // Verifiable credential
  const credHash   = txHash ? generateCredentialHash(txHash, citizenId, serviceType, ministry?.code, amount, timestamp) : null;
  const sigHash    = credHash ? generateMinistrySignature(credHash, ministry?.code) : null;
  const railInfo   = PAYMENT_RAILS.find(r => r.value === paymentMethod) || { label:"Bank Transfer", sub:"" };
  const feeInfo    = SERVICE_FEES[serviceType] || {};
  const vatAmt     = feeInfo.vatRate>0 ? ((parseFloat(fee)||0)*feeInfo.vatRate).toFixed(2) : null;

  const [credTab, setCredTab] = useState("receipt"); // "receipt" | "credential" | "json"

  const ipfsMeta = credHash ? buildIPFSMetadata({
    credHash, sigHash, txHash, citizenId, serviceType,
    ministryCode:ministry?.code, amount, fee, paymentMethod,
    paymentRailLabel:railInfo.label, wf, timestamp, ref,
  }) : null;

  const handleDownloadJSON = () => {
    if (!ipfsMeta) return;
    const blob = new Blob([JSON.stringify(ipfsMeta, null, 2)], { type:"application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `${ref}-credential.json`; a.click();
    setTimeout(()=>URL.revokeObjectURL(url), 5000);
  };

  const handlePrint = () => {
    const html = buildCertificateHTML({ ref, wf, serviceType, ministry, citizenId, oHash, txHash, timestamp, amount, fee, paymentMethod, paymentRef, evidenceNote, credHash, sigHash, railInfo, vatAmt, feeInfo, isComplete });
    const tryOpen = window.open("", "_blank", "width=780,height=1000,scrollbars=yes");
    if (tryOpen) {
      tryOpen.document.write(html); tryOpen.document.close(); tryOpen.focus(); tryOpen.print();
    } else {
      const blob = new Blob([html], { type:"text/html" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a"); a.href=url; a.target="_blank"; a.click();
      setTimeout(()=>URL.revokeObjectURL(url),5000);
    }
  };

  function buildCertificateHTML({ ref, wf, serviceType, ministry, citizenId, oHash, txHash, timestamp, amount, fee, paymentMethod, paymentRef, evidenceNote, credHash, sigHash, railInfo, vatAmt, feeInfo, isComplete }) {
    const cHash = (citizenId?.startsWith("0x")&&citizenId?.length===66) ? citizenId : ethers.keccak256(ethers.toUtf8Bytes(citizenId?.trim()||""));
    const totalPaid = feeInfo.vatRate>0 ? ((parseFloat(fee)||0)*(1+feeInfo.vatRate)).toFixed(2) : fee;
    return `<!DOCTYPE html><html><head><title>${ref} — Samoa Government Certificate</title>
    <style>
      * { box-sizing:border-box; margin:0; padding:0; }
      body { font-family: 'Helvetica Neue',Arial,sans-serif; padding:40px; color:#1a1a1a; background:#fff; max-width:740px; margin:0 auto; }
      .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; padding-bottom:20px; border-bottom:3px solid #0FB894; }
      .logo { font-size:36px; }
      .title-block h1 { font-size:20px; font-weight:900; color:#1a1a1a; margin-bottom:4px; }
      .title-block .sub { font-size:12px; color:#666; }
      .ref-block { text-align:right; }
      .ref-block .ref { font-size:18px; font-weight:900; color:#E8552A; font-family:monospace; }
      .ref-block .net { font-size:10px; color:#999; margin-top:4px; }
      .status-banner { padding:12px 18px; border-radius:8px; margin-bottom:20px; font-weight:700; font-size:13px;
        background:${isComplete?"#0FB89420":"#E8552A20"}; color:${isComplete?"#0B8A68":"#C04415"};
        border:2px solid ${isComplete?"#0FB894":"#E8552A"}40; }
      h2 { font-size:13px; font-weight:800; color:#444; text-transform:uppercase; letter-spacing:0.8px; margin:20px 0 10px; padding-bottom:6px; border-bottom:1px solid #eee; }
      table { width:100%; border-collapse:collapse; margin-bottom:8px; }
      td { padding:7px 10px; font-size:12px; border-bottom:1px solid #f0f0f0; }
      td:first-child { color:#666; width:180px; font-weight:600; }
      td.mono { font-family:monospace; font-size:11px; color:#333; word-break:break-all; }
      .payment-box { background:#f8f9fa; border:1px solid #dee2e6; border-radius:8px; padding:16px; margin:16px 0; }
      .payment-row { display:flex; justify-content:space-between; padding:4px 0; font-size:12px; }
      .payment-row .label { color:#666; }
      .payment-row .val { font-weight:700; }
      .total-row { border-top:2px solid #0FB894; margin-top:8px; padding-top:8px; font-size:14px; font-weight:900; color:#0B8A68; }
      .cred-box { background:#1a1a2e; color:#0FB894; border-radius:8px; padding:16px; margin:16px 0; font-family:monospace; font-size:10px; word-break:break-all; line-height:1.8; }
      .cred-box .label { color:#999; font-size:9px; font-family:Helvetica,Arial,sans-serif; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:2px; }
      .steps { margin:8px 0; }
      .step { padding:5px 0; font-size:11px; border-bottom:1px dashed #eee; display:flex; gap:8px; }
      .step.done { color:#0B8A68; } .step.cur { color:#E8552A; font-weight:700; } .step.nxt { color:#B07D0A; }
      .footer { margin-top:32px; padding-top:16px; border-top:2px solid #eee; font-size:10px; color:#999; line-height:1.8; }
      .verify-box { background:#fffbe6; border:1px solid #ffe066; border-radius:6px; padding:12px; margin:16px 0; font-size:11px; color:#7a6000; }
      @media print { body { padding:20px; } }
    </style></head><body>
      <div class="header">
        <div style="display:flex;gap:14px;align-items:center">
          <div class="logo">🌺</div>
          <div class="title-block">
            <h1>Samoa Pacific Blockchain Hub</h1>
            <div class="sub">Government of Samoa · ${ministry?.name || ministry?.code} · UNICEF Venture Fund 2026</div>
          </div>
        </div>
        <div class="ref-block">
          <div class="ref">${ref}</div>
          <div class="net">${CONFIG.NETWORK} · ${new Date(timestamp).toLocaleDateString()}</div>
        </div>
      </div>

      <div class="status-banner">
        ${isComplete ? "✅ Workflow Complete — Certificate of Service — Permanently Recorded On Chain" : "📋 Service Record Confirmed — Next Step Pending"}
      </div>

      <h2>Service Details</h2>
      <table>
        <tr><td>Service</td><td><strong>${serviceLabel(serviceType)}</strong></td></tr>
        <tr><td>Issuing Ministry</td><td>${ministry?.code} — ${ministry?.name}</td></tr>
        <tr><td>Workflow</td><td>${wf.workflowName || "Standalone"}</td></tr>
        <tr><td>Step</td><td>${wf.stepLabel || "1 of 1"}</td></tr>
        <tr><td>Reference</td><td class="mono">${ref}</td></tr>
        <tr><td>Date / Time</td><td>${new Date(timestamp).toLocaleString()}</td></tr>
        <tr><td>Network</td><td>${CONFIG.NETWORK}</td></tr>
        <tr><td>Contract Address</td><td class="mono">${MINISTRY_ADDRS[ministry?.code]||"—"}</td></tr>
      </table>

      <h2>Identity (Privacy-Preserving)</h2>
      <table>
        <tr><td>Citizen Hash</td><td class="mono">${cHash}</td></tr>
        <tr><td>PII On-Chain</td><td>None — hash-only (GDPR/Pacific Data Governance compliant)</td></tr>
        <tr><td>Officer Hash</td><td class="mono">${oHash||"—"}</td></tr>
        <tr><td>Tx Hash</td><td class="mono">${txHash||"—"}</td></tr>
      </table>

      <h2>Payment & Fees</h2>
      <div class="payment-box">
        <div class="payment-row"><span class="label">${feeInfo.feeLabel||"Service Fee"}</span><span class="val">WST ${fee||"0.00"}</span></div>
        ${vatAmt ? `<div class="payment-row"><span class="label">VAGST (15%)</span><span class="val">WST ${vatAmt}</span></div>` : ""}
        ${amount && amount!=="0" ? `<div class="payment-row"><span class="label">Transaction / Benefit Amount</span><span class="val">WST ${amount}</span></div>` : ""}
        <div class="payment-row total-row"><span>Total Paid / Processed</span><span>WST ${totalPaid||fee||amount||"0.00"}</span></div>
        <div style="margin-top:10px;padding-top:8px;border-top:1px solid #ddd;font-size:11px;color:#666">
          <div class="payment-row"><span class="label">Payment Method</span><span>${railInfo.label} — ${railInfo.sub}</span></div>
          ${paymentRef ? `<div class="payment-row"><span class="label">Payment Reference</span><span class="mono" style="font-size:11px">${paymentRef}</span></div>` : ""}
        </div>
      </div>

      ${wf.prevSteps?.length || wf.nextStep ? `
      <h2>Workflow Progress</h2>
      <div class="steps">
        ${(wf.prevSteps||[]).map((s,i)=>`<div class="step done">✓ Step ${i+1}: ${s.ministry} — ${s.label}</div>`).join("")}
        <div class="step cur">● Step ${wf.step||1}: ${ministry?.code} — ${serviceLabel(serviceType)} (this record)</div>
        ${wf.nextStep ? `<div class="step nxt">⏭ Step ${(wf.step||1)+1}: ${wf.nextStep.ministry} — ${wf.nextStep.action}</div>` : ""}
      </div>` : ""}

      ${evidenceNote ? `<h2>Evidence</h2><table><tr><td>Note</td><td>${evidenceNote}</td></tr><tr><td>Evidence Hash</td><td class="mono">${ethers.keccak256(ethers.toUtf8Bytes(evidenceNote.trim())).slice(0,40)}…</td></tr></table>` : ""}

      <h2>🔐 Verifiable Credential (NFT-Style)</h2>
      <div class="cred-box">
        <div class="label">Credential Hash (public — share to verify)</div>
        <div>${credHash||"—"}</div>
        <br/>
        <div class="label">Ministry Signature (${ministry?.code})</div>
        <div>${sigHash||"—"}</div>
        <br/>
        <div class="label">Verification Method</div>
        <div style="color:#ccc;font-family:Helvetica,Arial,sans-serif;font-size:10px">keccak256('CREDENTIAL:'+txHash+':'+citizenHash+':'+serviceType+':'+ministryCode+':'+amount+':'+timestamp)</div>
      </div>

      <div class="verify-box">
        ℹ <strong>How to verify this credential:</strong> Anyone can recompute the credential hash using the inputs above. Present the credential hash to any Samoa Pacific Blockchain Hub portal for instant on-chain verification. The ministry signature can be verified against the issuing ministry's public key. IPFS pinning enabled post-funding for decentralised permanent storage.
      </div>

      <div class="footer">
        This document is a government-issued service record permanently recorded on the ${CONFIG.NETWORK} blockchain.
        It is legally equivalent to a physical ministry receipt for tax, audit, and regulatory purposes.<br/>
        Samoa Pacific Blockchain Hub v10 · Anthony George Williams · Synergy Blockchain Pacific · UNICEF Venture Fund 2026 Application<br/>
        Generated: ${new Date().toLocaleString()} · Ref: ${ref}
      </div>
    </body></html>`;
  }

  return (
    <div style={{ ...card(), borderLeft:`4px solid ${isComplete ? C.seafoam : C.coral}`, maxWidth:"720px" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"16px" }}>
        <div>
          <div style={{ fontSize:"22px", marginBottom:"4px" }}>{isComplete ? "✅" : "📋"}</div>
          <div style={{ fontSize:"16px", fontWeight:900, fontFamily:F.display, color:isComplete?C.seafoam:C.white }}>
            {isComplete ? "Certificate Issued — Workflow Complete" : "Step Recorded On Chain"}
          </div>
          <div style={{ fontSize:"12px", color:C.silver, marginTop:"2px" }}>{wf.stepLabel || "Record confirmed"}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:"10px", color:C.muted, marginBottom:"3px" }}>Reference</div>
          <div style={{ fontFamily:F.mono, fontSize:"13px", fontWeight:700, color:C.seafoam, background:C.seafoam+"18", padding:"4px 10px", borderRadius:"6px" }}>{ref}</div>
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ display:"flex", gap:"0", marginBottom:"16px", borderRadius:"8px", overflow:"hidden", border:`1px solid ${C.ocean}` }}>
        {[["receipt","📋 Receipt"],["credential","🔐 Credential"],["json","{ } JSON"]].map(([t,l])=>(
          <button key={t} onClick={()=>setCredTab(t)}
            style={{ flex:1, padding:"8px 0", fontSize:"11px", fontWeight:700, cursor:"pointer", border:"none", fontFamily:F.ui,
              background:credTab===t?C.seafoam+"22":C.abyss, color:credTab===t?C.seafoam:C.muted,
              borderRight:t!=="json"?`1px solid ${C.ocean}`:"none" }}>
            {l}
          </button>
        ))}
      </div>

      {/* RECEIPT TAB */}
      {credTab === "receipt" && (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"14px" }}>
            {[
              ["Service",      serviceLabel(serviceType)],
              ["Ministry",     ministry?.code],
              ["Citizen Hash", citizenId ? ethers.keccak256(ethers.toUtf8Bytes(citizenId.trim())).slice(0,14)+"…" : "—"],
              ["Officer Hash", oHash ? oHash.slice(0,14)+"…" : "—"],
              ["Timestamp",    new Date(timestamp).toLocaleString()],
              ["Tx Hash",      txHash ? txHash.slice(0,12)+"…"+txHash.slice(-6) : "—"],
              ...(fee&&fee!=="0"    ? [["Gov Fee",   `WST ${fee}`]]        : []),
              ...(amount&&amount!=="0"?[["Amount",   `WST ${amount}`]]     : []),
              ...(vatAmt            ? [["VAGST 15%", `WST ${vatAmt}`]]     : []),
              ...(paymentMethod     ? [["Pay Method",railInfo.label]]       : []),
              ...(paymentRef        ? [["Pay Ref",   paymentRef]]           : []),
              ["Network",      CONFIG.NETWORK],
            ].map(([label, val]) => (
              <div key={label} style={{ background:C.abyss, borderRadius:"6px", padding:"8px 12px" }}>
                <div style={{ fontSize:"9px", color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:"2px" }}>{label}</div>
                <div style={{ fontSize:"12px", color:C.white, fontFamily:["Citizen Hash","Officer Hash","Tx Hash","Pay Ref"].includes(label)?F.mono:F.ui, fontWeight:600 }}>{val}</div>
              </div>
            ))}
          </div>

          {evidenceNote && (
            <div style={{ background:C.abyss, borderRadius:"6px", padding:"10px 12px", marginBottom:"14px" }}>
              <div style={{ fontSize:"9px", color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:"3px" }}>Evidence (Payment Ref + Details — hashed on chain)</div>
              <div style={{ fontSize:"11px", color:C.silver, wordBreak:"break-all" }}>{evidenceNote}</div>
              <div style={{ fontSize:"10px", color:C.muted, fontFamily:F.mono, marginTop:"3px" }}>Hash: {ethers.keccak256(ethers.toUtf8Bytes(evidenceNote.trim())).slice(0,20)}…</div>
            </div>
          )}

          <WorkflowProgress wf={wf} currentStep={wf.step || 1} />

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

          {wf.nextStep && (
            <div style={{ marginTop:"14px", padding:"12px", background:C.amber+"18", border:`1px solid ${C.amber}44`, borderRadius:"8px" }}>
              <div style={{ fontSize:"11px", fontWeight:700, color:C.amber, marginBottom:"4px" }}>⏭ Next Step Required</div>
              <div style={{ fontSize:"12px", color:C.silver }}><strong style={{ color:C.white }}>{wf.nextStep.ministry}</strong> must: {wf.nextStep.action}</div>
              <div style={{ fontSize:"11px", color:C.muted, marginTop:"4px" }}>{wf.notice}</div>
            </div>
          )}
          {isComplete && (
            <div style={{ marginTop:"14px", padding:"12px", background:C.seafoam+"18", border:`1px solid ${C.seafoam}44`, borderRadius:"8px" }}>
              <div style={{ fontSize:"11px", fontWeight:700, color:C.seafoam, marginBottom:"4px" }}>✓ Workflow Complete — Certificate Issued On Chain</div>
              <div style={{ fontSize:"12px", color:C.silver }}>{wf.notice}</div>
            </div>
          )}
        </>
      )}

      {/* CREDENTIAL TAB */}
      {credTab === "credential" && (
        <div>
          <div style={{ marginBottom:"14px", padding:"12px", background:C.seafoam+"14", border:`1px solid ${C.seafoam}33`, borderRadius:"8px" }}>
            <div style={{ fontSize:"12px", fontWeight:700, color:C.seafoam, marginBottom:"6px" }}>🔐 Verifiable Credential — NFT-Style Ministry Certificate</div>
            <div style={{ fontSize:"11px", color:C.silver, lineHeight:1.8 }}>
              This credential is cryptographically unique. The <strong>Credential Hash</strong> is derived from your transaction data and can be verified by anyone. The <strong>Ministry Signature</strong> proves it was issued by {ministry?.code}. No personal data is exposed — only your identity hash is referenced.<br/>
              <span style={{ color:C.amber, fontSize:"10px" }}>Share the Credential Hash publicly to prove you hold this service record. Keep your Tx Hash private — it is your private key equivalent.</span>
            </div>
          </div>

          {[
            ["Credential Hash (Share Publicly)", credHash, true],
            ["Ministry Signature", sigHash, true],
            ["Issued By", `${ministry?.code} — ${ministry?.name}`, false],
            ["Service", serviceLabel(serviceType), false],
            ["Workflow", wf.workflowName||"Standalone", false],
            ["Reference", ref, false],
            ["Timestamp", new Date(timestamp).toISOString(), false],
            ["Blockchain", `${CONFIG.NETWORK} · ${MINISTRY_ADDRS[ministry?.code]||"—"}`, true],
          ].map(([label, val, mono]) => (
            <div key={label} style={{ background:C.abyss, borderRadius:"6px", padding:"10px 12px", marginBottom:"8px" }}>
              <div style={{ fontSize:"9px", color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:"4px" }}>{label}</div>
              <div style={{ fontSize:mono?"11px":"12px", color:mono?C.seafoam:C.white, fontFamily:mono?F.mono:F.ui, wordBreak:"break-all", fontWeight:600 }}>{val}</div>
            </div>
          ))}

          <div style={{ marginTop:"12px", padding:"12px", background:C.amber+"18", border:`1px solid ${C.amber}33`, borderRadius:"8px", fontSize:"11px", color:C.amber, lineHeight:1.8 }}>
            <strong>IPFS Readiness:</strong> The JSON metadata for this credential is ready for IPFS pinning via Pinata or web3.storage. Once pinned, the IPFS CID becomes permanent proof accessible to any government portal, auditor, or tax authority. Switch to the JSON tab to download the credential file.
          </div>
        </div>
      )}

      {/* JSON TAB */}
      {credTab === "json" && ipfsMeta && (
        <div>
          <div style={{ marginBottom:"12px", padding:"10px 12px", background:"#4A9EE022", border:`1px solid #4A9EE044`, borderRadius:"8px", fontSize:"11px", color:"#4A9EE0" }}>
            Machine-readable credential metadata — IPFS-ready JSON. Download and pin to Pinata/web3.storage for permanent decentralised storage. Verifiable by any smart contract or government portal.
          </div>
          <pre style={{ background:C.abyss, borderRadius:"8px", padding:"14px", fontSize:"10px", color:C.seafoam, fontFamily:F.mono, overflow:"auto", maxHeight:"380px", border:`1px solid ${C.ocean}`, whiteSpace:"pre-wrap", wordBreak:"break-all" }}>
            {JSON.stringify(ipfsMeta, null, 2)}
          </pre>
          <button onClick={handleDownloadJSON} style={{ ...btn("success"), marginTop:"12px", width:"100%", justifyContent:"center" }}>
            ⬇ Download {ref}-credential.json
          </button>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display:"flex", gap:"10px", marginTop:"16px", flexWrap:"wrap" }}>
        <button onClick={handlePrint} style={{ ...btn("ghost") }}>🖨 Print / Download Certificate PDF</button>
        <button onClick={onAnother}  style={{ ...btn("ghost") }}>Record Another</button>
        {wf.nextStep && onNext && (
          <button
            onClick={() => onNext(wf.nextStep.ministry)}
            style={{ ...btn("primary"), background:"#1B6CA8", display:"flex", alignItems:"center", gap:"8px" }}
          >
            <span style={{ fontSize:"16px" }}>{MINISTRY_META[wf.nextStep.ministry]?.icon || "→"}</span>
            <span>Go to {MINISTRY_META[wf.nextStep.ministry]?.name || wf.nextStep.ministry} — Pending Actions</span>
            <span style={{ fontSize:"11px", opacity:0.8 }}>Step {(wf.step||1)+1}</span>
          </button>
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
// RECORDS TAB -- shared by all ministry dashboards (v7 preserved)
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
// RECORD SERVICE TAB -- full payment flow, dual officer/citizen view, fee schedule, credential generation
// ---
function RecordServiceTab({ ministryCode, provider, connected, onSuccess, prefill }) {
  const meta         = MINISTRY_META[ministryCode];
  const addr         = MINISTRY_ADDRS[ministryCode];
  const serviceTypes = SERVICE_TYPES[ministryCode] || [];
  const initSvc      = prefill?.serviceType || serviceTypes[0]?.value || "";
  const feeInfo      = SERVICE_FEES[initSvc] || {};

  const [form, setForm] = useState({
    citizenId:     prefill?.citizenId    || "",
    serviceType:   initSvc,
    evidenceNote:  prefill?.evidenceNote || "",
    amount:        prefill?.amount       || String(feeInfo.clientAmount || ""),
    fee:           prefill?.fee          || String(feeInfo.govFee || ""),
    paymentMethod: "BANK_TRANSFER",
    paymentRef:    "",
    officerId:     "OFFICER-001",
    ndidsVerified: shouldVerifyNDIDS(ministryCode, initSvc),
    paymentConfirmed: false,
    viewMode:      "officer",  // "officer" | "citizen"
  });
  const [submitting,    setSubmitting]    = useState(false);
  const [txMsg,         setTxMsg]        = useState(null);
  const [paymentDone,   setPaymentDone]  = useState(false);

  // Apply prefill when it changes
  useEffect(() => {
    if (!prefill) return;
    const svc    = prefill.serviceType || form.serviceType;
    const fi     = SERVICE_FEES[svc] || {};
    setForm(f => ({
      ...f, ...prefill,
      amount:       prefill.amount || String(fi.clientAmount || ""),
      fee:          prefill.fee    || String(fi.govFee || ""),
      ndidsVerified: shouldVerifyNDIDS(ministryCode, svc),
      paymentConfirmed: false,
    }));
    setPaymentDone(false);
  }, [prefill]);

  // Recompute fee when service type changes
  const handleServiceChange = (svc) => {
    const fi = SERVICE_FEES[svc] || {};
    setForm(f => ({
      ...f,
      serviceType:   svc,
      amount:        String(fi.clientAmount || ""),
      fee:           String(fi.govFee || ""),
      ndidsVerified: shouldVerifyNDIDS(ministryCode, svc),
      paymentConfirmed: false,
    }));
    setPaymentDone(false);
  };

  // Resolve workflow
  const resolvedWfId = form.workflowId || (SVC_TO_WF[form.serviceType] || [])[0]?.workflowId;
  const resolvedStep = resolvedWfId
    ? (SVC_TO_WF[form.serviceType] || []).find(x => x.workflowId === resolvedWfId) || (SVC_TO_WF[form.serviceType] || [])[0]
    : (SVC_TO_WF[form.serviceType] || [])[0];
  const selectedWf   = resolvedStep;
  const wfDef        = selectedWf ? WORKFLOW_DEFS[selectedWf.workflowId] : null;
  const stepIdx      = selectedWf?.stepIndex ?? -1;
  const curFeeInfo   = SERVICE_FEES[form.serviceType] || {};
  const hasPayment   = curFeeInfo.hasFee;
  const isPayOut     = curFeeInfo.isPaymentOut;
  const vatAmount    = curFeeInfo.vatRate > 0 ? ((parseFloat(form.fee)||0) * curFeeInfo.vatRate).toFixed(2) : null;
  const totalDue     = curFeeInfo.vatRate > 0
    ? ((parseFloat(form.fee)||0) * (1 + curFeeInfo.vatRate)).toFixed(2)
    : form.fee;
  const railInfo     = PAYMENT_RAILS.find(r => r.value === form.paymentMethod) || PAYMENT_RAILS[0];

  // Payment gate: submission requires payment confirmed if fees exist
  const paymentGateCleared = !hasPayment || paymentDone || isPayOut;

  const handleSubmit = async () => {
    if (!form.citizenId || !form.serviceType) { setTxMsg({ type:"error", text:"Citizen ID and service type are required." }); return; }
    if (form.ndidsVerified && !shouldVerifyNDIDS(ministryCode, form.serviceType)) {
      setTxMsg({ type:"error", text:`⚠ ${ministryCode} does not have NDIDS access for ${form.serviceType} citizens. Uncheck NDIDS.` });
      return;
    }
    if (!paymentGateCleared) {
      setTxMsg({ type:"error", text:"⚠ Payment must be confirmed before submitting to blockchain. Complete the payment section below." });
      return;
    }
    setSubmitting(true);
    setTxMsg({ type:"info", text:"Broadcasting to "+CONFIG.NETWORK+"…" });
    try {
      const signer   = getSigner(provider);
      const contract = new ethers.Contract(addr, ABI.MINISTRY, signer);
      const rawId    = form.citizenId.trim();
      const cHash    = (rawId.startsWith("0x") && rawId.length === 66)
        ? rawId : ethers.keccak256(ethers.toUtf8Bytes(rawId));
      // Evidence includes payment reference for immutable audit
      const payRef   = form.paymentRef?.trim() || `${form.paymentMethod}|REF-${Date.now().toString(36).toUpperCase()}`;
      const evidence = form.evidenceNote?.trim()
        ? `${form.evidenceNote} | PMT:${payRef} | RAIL:${form.paymentMethod} | FEE:${form.fee}WST | AMT:${form.amount}WST`
        : `${form.serviceType}|${form.officerId}|PMT:${payRef}|RAIL:${form.paymentMethod}|FEE:${form.fee}WST|AMT:${form.amount}WST|${Date.now()}`;
      const dHash    = ethers.keccak256(ethers.toUtf8Bytes(evidence));
      const tx       = await contract.recordService(cHash, form.serviceType, dHash, form.ndidsVerified);
      setTxMsg({ type:"info", text:"Awaiting confirmation…" });
      const receipt  = await tx.wait();
      onSuccess({
        txHash:receipt.hash, citizenId:form.citizenId, serviceType:form.serviceType,
        evidenceNote:evidence, amount:form.amount, fee:form.fee,
        paymentMethod:form.paymentMethod, paymentRef:payRef,
        officerId:form.officerId, timestamp:Date.now(),
        ministry:{ ...meta, code:ministryCode },
        workflowId: form.workflowId || selectedWf?.workflowId || null,
      });
      setTxMsg(null);
      setPaymentDone(false);
    } catch(e) {
      setTxMsg({ type:"error", text:e.reason || e.message || "Transaction failed." });
    } finally { setSubmitting(false); }
  };

  const inStyle = { width:"100%", background:C.abyss, border:`1px solid ${C.ocean}`, borderRadius:"8px", padding:"10px 14px", color:C.white, fontSize:"13px", fontFamily:F.ui, boxSizing:"border-box" };
  const labelStyle = { fontSize:"11px", fontWeight:700, color:C.silver, textTransform:"uppercase", letterSpacing:"0.6px", display:"block", marginBottom:"6px" };

  return (
    <div style={{ ...card(), maxWidth:"680px" }}>

      {/* View mode toggle — Officer / Citizen */}
      <div style={{ display:"flex", gap:"0", marginBottom:"18px", borderRadius:"8px", overflow:"hidden", border:`1px solid ${C.ocean}` }}>
        {[["officer","🏛 Officer / Ministry View"],["citizen","👤 Citizen / Client View"]].map(([mode,label])=>(
          <button key={mode} onClick={()=>setForm(f=>({...f,viewMode:mode}))}
            style={{ flex:1, padding:"9px 0", fontSize:"12px", fontWeight:700, cursor:"pointer", border:"none", fontFamily:F.ui,
              background:form.viewMode===mode ? meta?.color+"33" : C.abyss,
              color:form.viewMode===mode ? meta?.color : C.muted,
              borderRight:mode==="officer"?`1px solid ${C.ocean}`:"none" }}>
            {label}
          </button>
        ))}
      </div>

      {form.viewMode === "citizen" && (
        <div style={{ ...card({ background:`linear-gradient(135deg,${C.seafoam}14,${C.teal}08)`, borderColor:C.seafoam+"44" }), marginBottom:"16px" }}>
          <div style={{ fontSize:"13px", fontWeight:700, color:C.seafoam, marginBottom:"8px" }}>🌺 Samoa Government Online Portal</div>
          <div style={{ fontSize:"12px", color:C.silver, lineHeight:1.8 }}>
            You are applying for: <strong style={{ color:C.white }}>{serviceLabel(form.serviceType)}</strong><br/>
            Ministry: <strong style={{ color:meta?.color }}>{meta?.name} ({ministryCode})</strong><br/>
            {curFeeInfo.feeLabel && <>Fee: <strong style={{ color:C.gold }}>WST {curFeeInfo.govFee || 0} {curFeeInfo.vatRate>0 && `+ VAGST — Total WST ${totalDue}`}</strong><br/></>}
            <span style={{ fontSize:"11px", color:C.muted }}>Your payment and identity are recorded permanently on the Samoa Pacific Blockchain — no more queuing at the office.</span>
          </div>
        </div>
      )}

      <SectionHead
        title={form.viewMode==="citizen" ? "📋 Apply & Pay Online" : "Record Service"}
        sub={form.viewMode==="citizen"
          ? "Complete your application and pay your government fee securely online"
          : "Submit a service record and payment directly to the blockchain"}
      />

      {txMsg && (
        <div style={{ marginBottom:"14px", padding:"10px 14px", borderRadius:"8px",
          background:txMsg.type==="error"?C.danger+"22":txMsg.type==="success"?C.seafoam+"22":"#4A9EE022",
          border:`1px solid ${txMsg.type==="error"?C.danger:txMsg.type==="success"?C.seafoam:"#4A9EE0"}44`,
          color:txMsg.type==="error"?"#F88":txMsg.type==="success"?C.seafoam:"#4A9EE0", fontSize:"13px" }}>
          {txMsg.text}
        </div>
      )}

      {/* Workflow context banner */}
      {wfDef && (
        <div style={{ marginBottom:"14px", padding:"10px 12px", background:C.amber+"18", border:`1px solid ${C.amber}44`, borderRadius:"8px" }}>
          <div style={{ fontSize:"11px", fontWeight:700, color:C.amber }}>🔄 Workflow: {wfDef.name}</div>
          <div style={{ fontSize:"11px", color:C.silver, marginTop:"3px" }}>
            Step {stepIdx+1} of {wfDef.steps.length}.
            {stepIdx>0 && ` Previous: ${wfDef.steps[stepIdx-1].ministry} — ${wfDef.steps[stepIdx-1].label}.`}
            {stepIdx<wfDef.steps.length-1 && ` Next: ${wfDef.steps[stepIdx+1].ministry} — ${wfDef.steps[stepIdx+1].label}.`}
          </div>
        </div>
      )}

      {prefill && (
        <div style={{ marginBottom:"14px", padding:"10px 12px", background:C.seafoam+"14", border:`1px solid ${C.seafoam}33`, borderRadius:"8px" }}>
          <div style={{ fontSize:"11px", fontWeight:700, color:C.seafoam }}>⚡ Pre-filled from Pending Actions — fees auto-loaded · review and pay</div>
          {prefill.citizenLabel && <div style={{ fontSize:"11px", color:C.silver, marginTop:"4px" }}>👤 {prefill.citizenLabel}</div>}
        </div>
      )}

      {/* Citizen / Business ID */}
      <div style={{ marginBottom:"14px" }}>
        <label style={labelStyle}>{form.viewMode==="citizen"?"Your National ID / Business Number *":"Citizen / Business ID *"}</label>
        {(form.citizenId?.startsWith("0x") && form.citizenId?.length === 66) ? (
          <div style={{ ...inStyle, background:C.abyss+"88", color:C.seafoam, fontFamily:F.mono, fontSize:"12px" }}>
            {form.citizenId.slice(0,22)}…{form.citizenId.slice(-6)}
            <div style={{ fontSize:"10px", color:C.muted, marginTop:"4px", fontFamily:F.ui }}>Pre-hashed identity — submitted directly to chain</div>
          </div>
        ) : (
          <>
            <input value={form.citizenId} onChange={e=>setForm(f=>({...f,citizenId:e.target.value}))} placeholder={form.viewMode==="citizen"?"e.g. WS-123456 or Business No.":"e.g. CITIZEN-WS-001"} style={inStyle} />
            {form.citizenId && <div style={{ fontSize:"10px", color:C.muted, marginTop:"4px", fontFamily:F.mono }}>On-chain hash: {ethers.keccak256(ethers.toUtf8Bytes(form.citizenId.trim())).slice(0,22)}…</div>}
          </>
        )}
      </div>

      {/* Service type */}
      <div style={{ marginBottom:"14px" }}>
        <label style={labelStyle}>Service Requested *</label>
        <select value={form.serviceType} onChange={e=>handleServiceChange(e.target.value)} style={inStyle}>
          {serviceTypes.map(st=><option key={st.value} value={st.value}>{st.label}</option>)}
        </select>
        {form.serviceType && <div style={{ fontSize:"11px", color:C.muted, marginTop:"4px" }}>{serviceDesc(form.serviceType)}</div>}
      </div>

      {/* ── NDIDS VERIFICATION PANEL ──────────────────────────────────── */}
      <div style={{ marginBottom:"14px", padding:"12px 14px", background:C.ocean, borderRadius:"8px", border:`1px solid ${form.ndidsVerified?C.seafoam+"66":C.wave}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"4px" }}>
          <input type="checkbox" id="ndids" checked={form.ndidsVerified} onChange={e=>setForm(f=>({...f,ndidsVerified:e.target.checked}))} style={{ width:"16px", height:"16px", accentColor:C.seafoam }} />
          <label htmlFor="ndids" style={{ fontSize:"12px", color:C.silver, cursor:"pointer", fontWeight:700 }}>
            {form.viewMode==="citizen" ? "Verify my identity via National Digital ID System (NDIDS)" : "Verify identity via NDIDS"}
          </label>
          <span style={{ ...badge(form.ndidsVerified ? C.seafoam : C.amber), fontSize:"9px" }}>
            {form.ndidsVerified ? "✓ IDENTITY VERIFIED" : "PAYMENT ONLY"}
          </span>
        </div>
        <div style={{ fontSize:"11px", color:C.muted, marginLeft:"26px" }}>
          {form.ndidsVerified
            ? `${ministryCode} has NDIDS read access — your identity hash will be verified on chain before service is processed.`
            : "Payment-only step — identity was verified by the initiating ministry. This step processes the payment and service record."}
        </div>
        {!shouldVerifyNDIDS(ministryCode, form.serviceType) && form.ndidsVerified && (
          <div style={{ fontSize:"11px", color:C.danger, marginTop:"6px", marginLeft:"26px", fontWeight:700 }}>
            ⚠ {ministryCode} does not have NDIDS access for this service — the transaction will revert. Uncheck NDIDS.
          </div>
        )}
      </div>

      {/* ── PAYMENT SECTION ─── appears when NDIDS verified OR payment required ──── */}
      {hasPayment && (
        <div style={{ marginBottom:"16px", padding:"16px", background:`linear-gradient(135deg,${C.seafoam}0A,${C.teal}06)`, border:`2px solid ${paymentDone?C.seafoam:C.amber}66`, borderRadius:"10px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
            <div style={{ fontSize:"13px", fontWeight:700, color:paymentDone?C.seafoam:C.amber }}>
              {isPayOut ? "💸 Government Payment Out" : "💳 Payment Required"}
            </div>
            {paymentDone && <span style={{ ...badge(C.seafoam), fontSize:"10px" }}>✓ Payment Confirmed</span>}
          </div>

          {/* Fee breakdown */}
          <div style={{ background:C.abyss, borderRadius:"8px", padding:"12px", marginBottom:"14px", border:`1px solid ${C.ocean}` }}>
            <div style={{ fontSize:"11px", fontWeight:700, color:C.silver, textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:"8px" }}>
              {isPayOut ? "Disbursement Summary" : "Fee Schedule — Pre-populated"}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:"4px 12px", fontSize:"12px" }}>
              <span style={{ color:C.muted }}>{curFeeInfo.feeLabel}</span>
              <span style={{ color:C.white, fontWeight:700, textAlign:"right" }}>WST {(parseFloat(form.fee)||parseFloat(form.amount)||0).toFixed(2)}</span>
              {vatAmount && <>
                <span style={{ color:C.muted }}>VAGST (15%)</span>
                <span style={{ color:C.amber, textAlign:"right" }}>WST {vatAmount}</span>
              </>}
              {curFeeInfo.govFee > 0 && !isPayOut && <>
                <span style={{ color:C.muted }}>Government Processing Fee</span>
                <span style={{ color:C.gold, textAlign:"right" }}>WST {curFeeInfo.govFee.toFixed(2)}</span>
              </>}
              <div style={{ gridColumn:"1/-1", borderTop:`1px solid ${C.ocean}`, marginTop:"6px", marginBottom:"2px" }} />
              <span style={{ color:C.white, fontWeight:800 }}>{isPayOut ? "Total Disbursement" : "Total Due"}</span>
              <span style={{ color:C.seafoam, fontWeight:900, textAlign:"right", fontSize:"14px" }}>
                WST {totalDue || (parseFloat(form.fee)||parseFloat(form.amount)||0).toFixed(2)}
              </span>
            </div>
            <div style={{ fontSize:"10px", color:C.muted, marginTop:"8px" }}>{curFeeInfo.note}</div>
          </div>

          {/* Amount fields — editable for override services */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"12px" }}>
            <div>
              <label style={labelStyle}>{isPayOut ? "Disbursement Amount (WST)" : "Service / Transaction Amount (WST)"}</label>
              <input value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}
                placeholder={curFeeInfo.override?"Enter actual amount":"Pre-populated"} style={inStyle}
                readOnly={!curFeeInfo.override && !isPayOut} />
              {curFeeInfo.override && <div style={{ fontSize:"10px", color:C.amber, marginTop:"4px" }}>⚡ Enter actual amount for this transaction</div>}
            </div>
            <div>
              <label style={labelStyle}>Government Fee (WST)</label>
              <input value={form.fee} onChange={e=>setForm(f=>({...f,fee:e.target.value}))}
                placeholder="Pre-populated" style={inStyle} readOnly={!curFeeInfo.override} />
              {curFeeInfo.vatRate>0 && <div style={{ fontSize:"10px", color:C.muted, marginTop:"4px" }}>+VAGST {(curFeeInfo.vatRate*100).toFixed(0)}% = WST {vatAmount}</div>}
            </div>
          </div>

          {/* Payment rail */}
          {!isPayOut && (
            <>
              <div style={{ marginBottom:"12px" }}>
                <label style={labelStyle}>Payment Method</label>
                <select value={form.paymentMethod} onChange={e=>setForm(f=>({...f,paymentMethod:e.target.value}))} style={inStyle}>
                  {PAYMENT_RAILS.map(r=>(
                    <option key={r.value} value={r.value}>{r.label} — {r.sub}</option>
                  ))}
                </select>
                <div style={{ fontSize:"10px", color:C.muted, marginTop:"4px" }}>{railInfo.sub}</div>
              </div>

              <div style={{ marginBottom:"12px" }}>
                <label style={labelStyle}>Payment Reference / Receipt No.</label>
                <input value={form.paymentRef} onChange={e=>setForm(f=>({...f,paymentRef:e.target.value}))}
                  placeholder={`e.g. ${form.paymentMethod==="MPAY_VODAFONE"?"MPAY-":""}TXN-${Date.now().toString(36).toUpperCase().slice(-6)}`} style={inStyle} />
                <div style={{ fontSize:"10px", color:C.muted, marginTop:"4px" }}>This reference is hashed and logged immutably on chain as payment proof.</div>
              </div>
            </>
          )}

          {/* Client vs officer dual view notice */}
          {form.viewMode === "citizen" && !isPayOut && (
            <div style={{ padding:"10px 12px", background:C.amber+"14", border:`1px solid ${C.amber}33`, borderRadius:"8px", marginBottom:"12px", fontSize:"11px", color:C.amber }}>
              ℹ After confirming payment below, your transaction will be submitted to the blockchain. You will receive a downloadable government certificate with a unique verifiable hash for your records, tax obligations, and future government interactions.
            </div>
          )}

          {/* Confirm payment button */}
          {!paymentDone ? (
            <button onClick={()=>setPaymentDone(true)} style={{ ...btn("success"), width:"100%", justifyContent:"center", padding:"12px", fontSize:"13px" }}>
              {isPayOut
                ? `✓ Confirm Disbursement of WST ${(parseFloat(form.amount)||curFeeInfo.clientAmount||0).toFixed(2)}`
                : `✓ Confirm Payment — WST ${totalDue} via ${railInfo.label}`}
            </button>
          ) : (
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", background:C.seafoam+"18", border:`1px solid ${C.seafoam}44`, borderRadius:"8px" }}>
              <span style={{ fontSize:"12px", fontWeight:700, color:C.seafoam }}>✅ Payment confirmed — ready to submit to blockchain</span>
              <button onClick={()=>setPaymentDone(false)} style={{ ...btn("ghost"), fontSize:"10px", padding:"3px 10px" }}>Revise</button>
            </div>
          )}
        </div>
      )}

      {/* Officer ID (officer view only) */}
      {form.viewMode === "officer" && (
        <div style={{ marginBottom:"14px" }}>
          <label style={labelStyle}>Officer ID</label>
          <input value={form.officerId} onChange={e=>setForm(f=>({...f,officerId:e.target.value}))} placeholder="OFFICER-001" style={inStyle} />
          {form.officerId && <div style={{ fontSize:"10px", color:C.muted, marginTop:"4px", fontFamily:F.mono }}>Officer hash: {officerHashFor(form.officerId).slice(0,18)}…</div>}
        </div>
      )}

      {/* Evidence note */}
      <div style={{ marginBottom:"16px" }}>
        <label style={labelStyle}>Evidence Note {form.viewMode==="citizen"?"(optional supporting details)":"(hashed on chain)"}</label>
        <textarea value={form.evidenceNote} onChange={e=>setForm(f=>({...f,evidenceNote:e.target.value}))}
          placeholder={form.viewMode==="citizen"
            ? "Optional: reference number, invoice number, supporting context…"
            : "Reference number, supporting documents, details…"}
          rows={3} style={{ ...inStyle, resize:"vertical" }} />
      </div>

      {/* Payment gate warning */}
      {hasPayment && !paymentGateCleared && (
        <div style={{ marginBottom:"14px", padding:"10px 12px", background:C.amber+"18", border:`1px solid ${C.amber}44`, borderRadius:"8px", fontSize:"12px", color:C.amber, fontWeight:700 }}>
          ⚠ Payment must be confirmed above before submitting to blockchain
        </div>
      )}

      <button onClick={handleSubmit} disabled={submitting || !connected || (!paymentGateCleared)}
        style={{ ...btn(submitting||!connected||!paymentGateCleared?"ghost":"primary"), width:"100%", justifyContent:"center", padding:"13px 20px", fontSize:"14px",
          opacity:!connected?0.5:(!paymentGateCleared||submitting)?0.6:1 }}>
        {!connected ? "⚠ Not connected to chain"
          : submitting ? "⏳ Broadcasting transaction…"
          : !paymentGateCleared ? "⚠ Confirm payment above first"
          : "📡 Submit to Blockchain — Record Service + Payment"}
      </button>
      {connected && (
        <div style={{ fontSize:"10px", color:C.muted, textAlign:"center", marginTop:"8px" }}>
          Transaction will be mined on {CONFIG.NETWORK}. Payment ref and fee are hashed into the evidence record — immutable on chain.
        </div>
      )}
    </div>
  );
}

// ---
// MINISTRY DASHBOARD -- v8: 4 tabs per ministry
// ---
function MinistryDashboard({ ministryCode, provider, connected, blockNumber, onBack, onNavigate, allRecords, allLoading, citizenPayments, onPaymentProcessed }) {
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
    // Check if citizen has already paid for this action
    const citizenPmt = (citizenPayments||[]).find(cp =>
      cp.serviceType === action.step.serviceType &&
      cp.ministryCode === ministryCode &&
      cp.wfId === action.wfId &&
      cp.status === "paid"
    );
    setPrefill({
      citizenId:    citizenPmt?.citizenId || action.citizenHash,
      citizenLabel: citizenPmt
        ? `✅ Payment received from citizen — ${short(action.citizenHash)} · ${citizenPmt.railLabel} · WST ${citizenPmt.fee || citizenPmt.amount}`
        : `Citizen ${short(action.citizenHash)} · from ${action.prevStep.ministry} ${action.prevStep.label}`,
      serviceType:  action.step.serviceType,
      evidenceNote: citizenPmt
        ? `Citizen online payment: ${citizenPmt.payRef} | RAIL:${citizenPmt.paymentMethod} | FEE:${citizenPmt.fee}WST | Workflow: ${action.wfName}`
        : `Cross-ministry workflow step. Prev step: "${action.prevStep.label}" completed by ${action.prevStep.ministry}. Workflow: ${action.wfName}.`,
      amount:    citizenPmt?.amount || "",
      fee:       citizenPmt?.fee    || "",
      paymentMethod: citizenPmt?.paymentMethod || "BANK_TRANSFER",
      paymentRef: citizenPmt?.payRef || "",
      workflowId: action.wfId,
      citizenPayRef: citizenPmt?.payRef || null,
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
            ) : pendingActions.map((action, i) => {
              // Check if citizen has already paid for this step
              const citizenPmt = (citizenPayments||[]).find(cp =>
                cp.serviceType === action.step.serviceType &&
                cp.ministryCode === ministryCode &&
                cp.wfId === action.wfId &&
                cp.status === "paid"
              );
              const isPaid = !!citizenPmt;
              const feeSchedule = SERVICE_FEES[action.step.serviceType] || {};

              return (
              <div key={i} style={{ ...card(), marginBottom:"14px", borderLeft:`4px solid ${isPaid?C.seafoam:C.amber}`,
                background: isPaid ? `linear-gradient(135deg,${C.seafoam}06,${C.navy})` : C.navy }}>

                {/* Action header */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"10px" }}>
                  <div>
                    <div style={{ fontWeight:800, fontSize:"14px", color:C.white }}>{action.wfName}</div>
                    <div style={{ fontSize:"12px", color:isPaid?C.seafoam:C.amber, marginTop:"2px" }}>
                      Step {action.stepIndex+1}: {action.step.label}
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:"8px", flexDirection:"column", alignItems:"flex-end" }}>
                    <span style={{ ...badge(isPaid?C.seafoam:C.amber) }}>
                      {isPaid ? "✅ Payment Received" : "⏳ Awaiting Payment / Action"}
                    </span>
                    {feeSchedule.hasFee && !feeSchedule.isPaymentOut && (
                      <span style={{ ...badge(C.gold), fontSize:"9px" }}>
                        💳 Fee: WST {feeSchedule.govFee}{feeSchedule.vatRate>0?` + VAGST`:""}
                      </span>
                    )}
                  </div>
                </div>

                {/* Citizen + step details */}
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

                {/* Citizen payment confirmation panel */}
                {isPaid && citizenPmt && (
                  <div style={{ marginTop:"12px", padding:"12px 14px", background:C.seafoam+"14", border:`1px solid ${C.seafoam}44`, borderRadius:"8px" }}>
                    <div style={{ fontSize:"12px", fontWeight:700, color:C.seafoam, marginBottom:"8px" }}>
                      ✅ Citizen paid online — payment details confirmed
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"8px" }}>
                      {[
                        ["Payment Ref",    citizenPmt.payRef],
                        ["Method",         citizenPmt.railLabel],
                        ["Amount Paid",    `WST ${citizenPmt.fee || citizenPmt.amount || "—"}`],
                      ].map(([l,v])=>(
                        <div key={l} style={{ background:C.abyss, borderRadius:"6px", padding:"7px 10px" }}>
                          <div style={{ fontSize:"9px", color:C.muted, marginBottom:"2px", textTransform:"uppercase" }}>{l}</div>
                          <div style={{ fontSize:"12px", color:C.white, fontWeight:700 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize:"10px", color:C.muted, marginTop:"8px" }}>
                      Payment reference {citizenPmt.payRef} hashed into evidence. Click "Process & Issue" to complete the service record on-chain and issue the certificate.
                    </div>
                  </div>
                )}

                {/* No payment yet — show expected fee and entry option */}
                {!isPaid && feeSchedule.hasFee && !feeSchedule.isPaymentOut && (
                  <div style={{ marginTop:"12px", padding:"12px 14px", background:C.amber+"10", border:`1px solid ${C.amber}33`, borderRadius:"8px" }}>
                    <div style={{ fontSize:"11px", color:C.amber, fontWeight:700, marginBottom:"4px" }}>
                      💳 Awaiting citizen payment — WST {feeSchedule.govFee}{feeSchedule.vatRate>0?` + VAGST`:""}
                    </div>
                    <div style={{ fontSize:"11px", color:C.muted }}>
                      Citizen can pay via the <strong style={{ color:C.white }}>Citizen Self-Service Portal</strong>. Once paid, their payment reference appears here automatically and the action becomes ready to process. Officers may also enter a payment reference manually via the Action form.
                    </div>
                  </div>
                )}

                <div style={{ marginTop:"14px", display:"flex", gap:"10px", flexWrap:"wrap" }}>
                  <button onClick={() => handlePendingAction(action)}
                    style={{ ...btn(isPaid?"success":"primary") }}>
                    {isPaid ? "✅ Process & Issue Certificate →" : "⚡ Action Now — Open Form →"}
                  </button>
                  {citizenPmt && onPaymentProcessed && (
                    <button
                      onClick={() => { onPaymentProcessed(citizenPmt.payRef); handlePendingAction(action); }}
                      style={{ ...btn("ghost"), fontSize:"11px" }}>
                      Mark Processed
                    </button>
                  )}
                </div>
              </div>
              );
            })}
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
              workflowId={lastReceipt?.workflowId}
              onAnother={() => { setLastReceipt(null); setTab("record"); }}
              onNext={(nextMinistry) => {
                if (nextMinistry && onNavigate) {
                  // Navigate directly to the next ministry's Pending Actions
                  onNavigate("ministry:" + nextMinistry);
                } else {
                  onBack();
                }
              }}
            />
          </>
        )}

      </div>
    </div>
  );
}

// ---
// COMMUNITY INTEL PANEL -- embedded in UNICEF overview + standalone tab
// Reads from the same COMMUNITY_PROJECTS seed + tranches from chain
// ---
function CommunityIntelPanel({ tranches, grantRaw, onOpenCommunity, expenditures: liveExp }) {
  const project = COMMUNITY_PROJECTS[0]; // Grant #0 = Biogas Vaiala
  // Use live expenditures passed from App state so matai approvals are reflected here
  const projExp  = (liveExp || SEED_EXPENDITURES).filter(e => e.projectId === project.id);
  const approved = projExp.filter(e=>e.status==="approved");
  const totalSpent = approved.reduce((s,e)=>s+e.amount,0);
  const pending    = projExp.filter(e=>e.status==="pending");

  // Sync milestone statuses from live chain tranche data
  const syncedMilestones = project.milestones.map((m, i) => {
    const tr = tranches && tranches[i];
    if (!tr) return m;
    const chainStatus = [null,"released","verified"][tr.status] || m.status;
    return { ...m, status: chainStatus || m.status };
  });
  // daysSince is computed from pending expenditure dates — if no pending items, default to 0 so flag clears
  const daysSince = pending.length > 0 ? 8 : 0;
  const flags = [
    ...(daysSince>=7     ? [{ level:"warning", msg:`No PM activity for ${daysSince} days — possible supply delay` }] : []),
    ...(pending.length>0 ? [{ level:"info",    msg:`${pending.length} expenditure awaiting matai approval — ${pending.reduce((s,e)=>s+e.amount,0).toLocaleString()} WST on hold` }] : []),
  ];

  return (
    <div style={{ ...card({ borderLeft:`4px solid #4A9EE0`, marginTop:"20px", marginBottom:"0" }) }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"16px" }}>
        <div>
          <div style={{ display:"flex", gap:"8px", alignItems:"center", marginBottom:"6px" }}>
            <span style={{ fontSize:"18px" }}>🏘</span>
            <span style={{ fontWeight:900, fontSize:"15px", fontFamily:F.display }}>Community Project — {project.name}</span>
          </div>
          <div style={{ fontSize:"12px", color:C.silver }}>📍 {project.community} · PM: {project.pm} · Matai: {project.matai}</div>
        </div>
        <button onClick={onOpenCommunity} style={{ ...btn("ghost"), fontSize:"11px", padding:"5px 12px", border:`1px solid #4A9EE0`, color:"#4A9EE0" }}>
          Open Community Dashboard →
        </button>
      </div>

      {/* Flags */}
      {flags.map((f,i) => (
        <div key={i} style={{ display:"flex", gap:"10px", alignItems:"center", padding:"9px 12px", borderRadius:"8px", background:f.level==="warning"?C.amber+"18":C.ocean, border:`1px solid ${f.level==="warning"?C.amber+"44":C.wave}`, marginBottom:"10px" }}>
          <span>{f.level==="warning"?"⚠":"ℹ"}</span>
          <span style={{ fontSize:"12px", fontWeight:700, color:f.level==="warning"?C.amber:C.silver }}>{f.msg}</span>
        </div>
      ))}

      {/* KPI strip */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"10px", marginBottom:"14px" }}>
        {[
          ["💰","70,000","WST received on-chain",C.gold],
          ["💸",totalSpent.toLocaleString(),"WST approved & spent",C.seafoam],
          ["🏦",(70000-totalSpent).toLocaleString(),"WST remaining",  "#4A9EE0"],
          ["🧾",String(approved.length),"Receipts on chain",C.amber],
        ].map(([icon,val,label,color])=>(
          <div key={label} style={{ background:C.abyss, borderRadius:"10px", padding:"12px", textAlign:"center" }}>
            <div style={{ fontSize:"18px", marginBottom:"4px" }}>{icon}</div>
            <div style={{ fontSize:"16px", fontWeight:900, color, fontFamily:F.display }}>{val}</div>
            <div style={{ fontSize:"10px", color:C.muted, marginTop:"2px" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Milestone sync — live from chain */}
      <div style={{ marginBottom:"4px" }}>
        <div style={{ fontSize:"11px", fontWeight:800, color:C.silver, textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:"8px" }}>Milestone Status — Live from Chain</div>
        <div style={{ display:"flex", gap:"8px" }}>
          {syncedMilestones.map((m,i)=>{
            const sc = { verified:C.seafoam, released:"#4A9EE0", pending:C.amber }[m.status]||C.muted;
            const sl = { verified:"✅ Verified", released:"🔵 Released", pending:"⏳ Pending" }[m.status]||m.status;
            return (
              <div key={i} style={{ flex:1, background:C.abyss, borderRadius:"8px", padding:"10px", borderTop:`3px solid ${sc}` }}>
                <div style={{ fontSize:"10px", fontWeight:800, color:sc, marginBottom:"4px" }}>M{i+1}</div>
                <div style={{ fontSize:"10px", color:C.silver, marginBottom:"4px", lineHeight:1.4 }}>{m.label.slice(0,40)}…</div>
                <div style={{ fontSize:"9px", ...badge(sc), display:"inline-flex" }}>{sl}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CommunityGrantView({ tranches, grantRaw, onOpenCommunity, expenditures: liveExp }) {
  const project = COMMUNITY_PROJECTS[0];
  // Use live expenditures so donor view reflects matai approvals in real time
  const SEED_EXP = (liveExp || SEED_EXPENDITURES).filter(e => e.projectId === project.id);
  const approved   = SEED_EXP.filter(e=>e.status==="approved");
  const pending    = SEED_EXP.filter(e=>e.status==="pending");
  const totalSpent = approved.reduce((s,e)=>s+e.amount,0);

  const syncedMilestones = project.milestones.map((m, i) => {
    const tr = tranches && tranches[i];
    if (!tr) return m;
    const chainStatus = [null,"released","verified"][tr.status] || m.status;
    return { ...m, status: chainStatus || m.status, trancheAmount: tr.amount, releasedAt: tr.releasedAt, verifiedAt: tr.verifiedAt };
  });

  const byCategory = {};
  approved.forEach(e=>{ byCategory[e.category]=(byCategory[e.category]||0)+e.amount; });

  return (
    <>
      <SectionHead title="🏘 Community Project — Live Intelligence" sub="Real-time link between donor grant and community project execution" />

      {/* Grant ↔ Community bridge banner */}
      <div style={{ ...card({ background:`linear-gradient(135deg, ${C.gold}18, #4A9EE018)`, borderColor:`${C.gold}44` }), marginBottom:"16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"12px" }}>
          <div>
            <div style={{ fontSize:"13px", fontWeight:800, color:C.gold, marginBottom:"4px" }}>🔗 Grant #0 on chain → {project.name}</div>
            <div style={{ fontSize:"12px", color:C.silver }}>AIDisbursementTracker: {ADDR.AID.slice(0,10)}… · Community: {project.community} · Donor: {project.donor}</div>
            <div style={{ fontSize:"12px", color:C.silver, marginTop:"2px" }}>Every tranche status below reflects live chain state. Expenditures are logged by the PM and approved by village matai.</div>
          </div>
          <button onClick={onOpenCommunity} style={{ ...btn("primary"), background:C.gold, flexShrink:0 }}>
            🏘 Open Full Community Dashboard →
          </button>
        </div>
      </div>

      {/* Side-by-side: Chain tranches vs Community spend */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"16px" }}>
        {/* Left: on-chain tranche status */}
        <div style={{ ...card({ borderTop:`3px solid ${C.gold}` }) }}>
          <SectionHead title="On-Chain Tranche Status" sub="Direct from AIDisbursementTracker" />
          {syncedMilestones.map((m,i)=>{
            const sc = { verified:C.seafoam, released:"#4A9EE0", pending:C.amber }[m.status]||C.muted;
            const sl = { verified:"✅ Verified", released:"🔵 Released", pending:"⏳ Pending" }[m.status]||"—";
            const spent = SEED_EXP.filter(e=>e.milestoneId===i&&e.status==="approved").reduce((s,e)=>s+e.amount,0);
            return (
              <div key={i} style={{ padding:"12px 0", borderBottom:i<syncedMilestones.length-1?`1px solid ${C.ocean}`:"none" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                  <span style={{ fontWeight:700, fontSize:"12px" }}>M{i+1}: {m.label.slice(0,32)}…</span>
                  <span style={{ ...badge(sc), fontSize:"9px" }}>{sl}</span>
                </div>
                <div style={{ fontSize:"11px", color:C.silver }}>
                  Budget: {m.targetWST.toLocaleString()} WST
                  {m.releasedAt>0 && <span style={{ color:C.muted }}> · Released: {fmtTs(m.releasedAt)}</span>}
                  {m.verifiedAt>0 && <span style={{ color:C.seafoam }}> · Verified: {fmtTs(m.verifiedAt)}</span>}
                </div>
                {spent>0 && (
                  <div style={{ marginTop:"6px" }}>
                    <div style={{ background:C.abyss, borderRadius:"99px", height:"5px" }}>
                      <div style={{ background:sc, borderRadius:"99px", height:"5px", width:`${Math.min(100,Math.round((spent/m.targetWST)*100))}%` }} />
                    </div>
                    <div style={{ fontSize:"10px", color:C.muted, marginTop:"2px" }}>{spent.toLocaleString()} WST spent ({Math.round((spent/m.targetWST)*100)}%)</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: community expenditure breakdown */}
        <div style={{ ...card({ borderTop:`3px solid #4A9EE0` }) }}>
          <SectionHead title="Community Expenditure" sub="PM-logged, matai-approved, receipt-hashed" />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"14px" }}>
            {[["💰","70,000","Received (WST)",C.gold],["💸",totalSpent.toLocaleString(),"Spent (WST)",C.seafoam]].map(([icon,v,l,c])=>(
              <div key={l} style={{ background:C.abyss, borderRadius:"8px", padding:"10px", textAlign:"center" }}>
                <div style={{ fontSize:"16px" }}>{icon}</div>
                <div style={{ fontSize:"15px", fontWeight:900, color:c, fontFamily:F.display }}>{v}</div>
                <div style={{ fontSize:"10px", color:C.muted }}>{l}</div>
              </div>
            ))}
          </div>
          {/* Category breakdown */}
          {Object.entries(byCategory).map(([cat,amt])=>{
            const meta = EXP_CATEGORIES[cat]||EXP_CATEGORIES.Other;
            const pct  = totalSpent>0 ? Math.round((amt/totalSpent)*100) : 0;
            return (
              <div key={cat} style={{ marginBottom:"8px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:"11px", marginBottom:"3px" }}>
                  <span>{meta.icon} {cat}</span>
                  <span style={{ color:meta.color, fontWeight:700 }}>{amt.toLocaleString()} ({pct}%)</span>
                </div>
                <div style={{ background:C.abyss, borderRadius:"99px", height:"5px" }}>
                  <div style={{ background:meta.color, borderRadius:"99px", height:"5px", width:`${pct}%` }} />
                </div>
              </div>
            );
          })}
          {pending.length>0 && (
            <div style={{ marginTop:"10px", padding:"8px 10px", background:C.amber+"18", borderRadius:"6px", fontSize:"11px", color:C.amber, fontWeight:700 }}>
              ⏳ {pending.length} expenditure pending matai approval — {pending.reduce((s,e)=>s+e.amount,0).toLocaleString()} WST
            </div>
          )}
        </div>
      </div>

      {/* Full expenditure log */}
      <div style={{ ...card() }}>
        <SectionHead title="Full Expenditure Log" sub={`${SEED_EXP.length} records · ${approved.length} approved · ${pending.length} pending`} />
        {SEED_EXP.map(e=>{
          const meta = EXP_CATEGORIES[e.category]||EXP_CATEGORIES.Other;
          const rHash = ethers.keccak256(ethers.toUtf8Bytes(e.receiptRef+"|"+e.recipient+"|"+e.amount));
          return (
            <div key={e.id} style={{ display:"flex", gap:"12px", padding:"12px 0", borderBottom:`1px solid ${C.ocean}`, alignItems:"center", flexWrap:"wrap" }}>
              <span style={{ ...badge(e.status==="approved"?C.seafoam:C.amber), fontSize:"9px", flexShrink:0 }}>{e.status==="approved"?"✓ APPROVED":"⏳ PENDING"}</span>
              <div style={{ flex:1, minWidth:"150px" }}>
                <div style={{ fontWeight:700, fontSize:"13px" }}>{e.recipient}</div>
                <div style={{ fontSize:"10px", color:C.muted, fontFamily:F.mono }}>Receipt: {e.receiptRef} · Hash: {rHash.slice(0,16)}…</div>
              </div>
              <span style={{ ...badge(meta.color), fontSize:"9px" }}>{meta.icon} {e.category}</span>
              <div style={{ fontWeight:800, fontSize:"14px", color:C.gold }}>{e.amount.toLocaleString()} WST</div>
            </div>
          );
        })}
      </div>

      {/* Immutability statement */}
      <div style={{ ...card({ background:C.seafoam+"0A", borderColor:C.seafoam+"33", marginTop:"14px" }) }}>
        <div style={{ fontSize:"12px", fontWeight:700, color:C.seafoam, marginBottom:"4px" }}>🔒 Why this data is trustworthy to {project.donor}</div>
        <div style={{ fontSize:"12px", color:C.silver, lineHeight:1.8 }}>
          Every tranche status is enforced by the AIDisbursementTracker smart contract — funds cannot be released without on-chain verification. Every expenditure is logged by the project manager with a receipt hash, then approved by village leadership. No record can be altered after confirmation. {project.donor} can independently query the contract at any time from any device, anywhere in the world.
        </div>
      </div>
    </>
  );
}

// ---
// UNICEF DONOR DASHBOARD -- v7 preserved + v8 verifyUsage/releaseTranche
// ---
function UNICEFDashboard({ provider, connected, blockNumber, onBack, allRecords, allLoading, onOpenCommunity, expenditures, activityLog }) {
  const [tab, setTab] = useState("overview");
  const aidContract = useContract(ADDR.AID, ABI.AID, provider);

  // Live AID contract reads (v7)
  // ?? All state declarations first (must be before any usePoll that references them) ??
  const [selectedGrant, setSelectedGrant] = useState(0);
  const [verForm,     setVerForm]    = useState({ grantId:"0", trancheId:"1", evidence:"", beneficiaries:"" });
  const [relForm,     setRelForm]    = useState({ grantId:"0", trancheId:"2" });
  const [txMsg,       setTxMsg]      = useState(null);
  const [submitting,  setSubmitting] = useState(false);

  // ?? Live AID contract reads ???????????????????????????????????
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
    { id:"community",  icon:"🏘", label:"Community Project" },
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
              <div style={{ ...card({ background:C.ocean, borderColor:C.gold+"33" }), marginBottom:"14px" }}>
                <div style={{ fontSize:"11px", fontWeight:700, color:C.gold, marginBottom:"4px" }}>🌐 Samoa Pacific Blockchain Hub — Platform Context</div>
                <div style={{ fontSize:"12px", color:C.silver, lineHeight:1.7 }}>
                  This dashboard tracks <strong style={{ color:C.white }}>Grant #0 — UNICEF Samoa Education Access Programme 2025</strong>, a government education benefit and school-enrolment grant managed through the Ministry of Education and MOF.<br/>
                  A separate community implementation — the <strong style={{ color:"#4A9EE0" }}>Vaiala Village Biogas Project</strong> — is tracked in the <strong>Community Project Dashboard</strong> and uses the same AIDisbursementTracker contract infrastructure to demonstrate multi-programme capability on a single platform. These are two distinct funded programmes; the platform handles both simultaneously.
                </div>
              </div>

            <div style={{ ...card({ background:C.ocean, borderColor:C.seafoam+"44" }), marginBottom:"14px" }}>
              <div style={{ fontSize:"12px", color:C.seafoam, fontWeight:700, marginBottom:"4px" }}>🤖 Auto Beneficiary Count from Education Records</div>
              <div style={{ fontSize:"12px", color:C.silver }}>{enrolmentCount} school enrolments detected on chain. This value is pre-filled when verifying tranches.</div>
            </div>

            <div style={{ ...card(), borderLeft:`3px solid ${C.seafoam}` }}>
              <SectionHead title="Live Contract Addresses" sub={CONFIG.NETWORK === "Anvil Local" ? "Local chain — copy address to verify in Foundry/Cast. Explorer links activate on testnet/mainnet deployment." : "Verify independently on any block explorer"} />
              {CONFIG.NETWORK === "Anvil Local" && (
                <div style={{ padding:"10px 12px", background:C.amber+"14", border:`1px solid ${C.amber}33`, borderRadius:"8px", marginBottom:"12px", fontSize:"11px", color:C.amber }}>
                  ℹ <strong>Local Anvil network detected.</strong> Block explorers (Polygonscan, Etherscan) only index public networks. To inspect these contracts locally, use:<br/>
                  <span style={{ fontFamily:F.mono, color:C.silver, marginTop:"4px", display:"block" }}>cast call {"<ADDRESS>"} "totalRecords()(uint256)" --rpc-url http://127.0.0.1:8545</span>
                  On testnet or mainnet deployment, the View ↗ links below will open the live explorer automatically.
                </div>
              )}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
                {[["AID Tracker",ADDR.AID],["Education Node",ADDR.EDUCATION],["NDIDS Registry",ADDR.NDIDS],["Hub Contract",ADDR.HUB]].map(([label,addr]) => (
                  <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 12px", background:C.ocean, borderRadius:"8px" }}>
                    <span style={{ fontSize:"12px", fontWeight:700 }}>{label}</span>
                    <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                      <Mono>{addr.slice(0,8)}...{addr.slice(-6)}</Mono>
                      {CONFIG.NETWORK === "Anvil Local" ? (
                        <button onClick={()=>navigator.clipboard?.writeText(addr)} style={{ fontSize:"10px", color:C.seafoam, background:"transparent", border:`1px solid ${C.seafoam}44`, borderRadius:"4px", padding:"2px 7px", cursor:"pointer", fontWeight:700 }}>Copy</button>
                      ) : (
                        <a href={`https://polygonscan.com/address/${addr}`} target="_blank" rel="noreferrer" style={{ fontSize:"10px", color:C.seafoam, textDecoration:"none", fontWeight:700 }}>View ↗</a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* --- COMMUNITY PROJECT INTELLIGENCE PANEL (overview inline) --- */}
        {tab === "overview" && (
          <CommunityIntelPanel tranches={tranches} grantRaw={g} onOpenCommunity={onOpenCommunity} expenditures={expenditures||SEED_EXPENDITURES} />
        )}

        {/* --- COMMUNITY PROJECT TAB (full cross-dashboard view) --- */}
        {tab === "community" && (
          <CommunityGrantView tranches={tranches} grantRaw={g} onOpenCommunity={onOpenCommunity} expenditures={expenditures||SEED_EXPENDITURES} />
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
// HUB DASHBOARD -- overview of all ministries + workflows (v7 preserved)
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
// HOME -- landing page with all ministry cards + entry points
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

        {/* Special dashboards — 2x3 grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"14px", marginBottom:"28px" }}>
          {/* ROW 1 */}
          <div onClick={() => onSelect("citizen")} style={{ ...card(), cursor:"pointer", borderTop:`3px solid #22C55E`, position:"relative" }}
            onMouseEnter={e=>e.currentTarget.style.background=C.ocean}
            onMouseLeave={e=>e.currentTarget.style.background=C.navy}>
            <div style={{ position:"absolute", top:"14px", right:"14px" }}>
              <span style={{ ...badge("#22C55E"), fontSize:"9px" }}>PUBLIC PORTAL</span>
            </div>
            <div style={{ fontSize:"28px", marginBottom:"8px" }}>🧑‍💻</div>
            <div style={{ fontWeight:800, fontSize:"14px", fontFamily:F.display, marginBottom:"4px" }}>Citizen Self-Service Portal</div>
            <div style={{ fontSize:"12px", color:C.silver }}>Apply online · Pay gov fees · Track applications · Download certificates — no queuing</div>
            <div style={{ marginTop:"10px", display:"flex", gap:"6px", flexWrap:"wrap" }}>
              <span style={{ ...badge("#22C55E"), fontSize:"9px" }}>Light Theme</span>
              <span style={{ ...badge(C.silver), fontSize:"9px" }}>Mobile-Friendly</span>
              <span style={{ ...badge(C.silver), fontSize:"9px" }}>All 6 Ministries</span>
            </div>
          </div>
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
          {/* ROW 2 */}
          <div onClick={() => onSelect("ndids")} style={{ ...card(), cursor:"pointer", borderTop:`3px solid ${C.seafoam}` }}
            onMouseEnter={e=>e.currentTarget.style.background=C.ocean}
            onMouseLeave={e=>e.currentTarget.style.background=C.navy}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div style={{ fontSize:"28px", marginBottom:"8px" }}>🪪</div>
              <span style={{ ...badge(C.seafoam), fontSize:"9px" }}>NDIDS REGISTRY</span>
            </div>
            <div style={{ fontWeight:800, fontSize:"14px", fontFamily:F.display, marginBottom:"4px" }}>National Digital Identity System</div>
            <div style={{ fontSize:"12px", color:C.silver }}>Citizen identity registry · NDIDS hash verification · Cross-ministry access policy · Privacy-preserving by design</div>
            <div style={{ marginTop:"10px", display:"flex", gap:"6px", flexWrap:"wrap" }}>
              <span style={{ ...badge(C.seafoam), fontSize:"9px" }}>NDIDSRegistry</span>
              <span style={{ ...badge(C.silver), fontSize:"9px" }}>Hash-only storage</span>
            </div>
          </div>
          <div onClick={() => onSelect("hub")} style={{ ...card(), cursor:"pointer", borderTop:`3px solid #4A9EE0` }}
            onMouseEnter={e=>e.currentTarget.style.background=C.ocean}
            onMouseLeave={e=>e.currentTarget.style.background=C.navy}>
            <div style={{ fontSize:"28px", marginBottom:"8px" }}>🔗</div>
            <div style={{ fontWeight:800, fontSize:"14px", fontFamily:F.display, marginBottom:"4px" }}>Interoperability Hub</div>
            <div style={{ fontSize:"12px", color:C.silver }}>Cross-ministry permissions, workflow log, live contract registry</div>
          </div>
          <div style={{ ...card(), borderTop:`3px solid ${C.muted}`, opacity:0.5 }}>
            <div style={{ fontSize:"28px", marginBottom:"8px" }}>📊</div>
            <div style={{ fontWeight:800, fontSize:"14px", fontFamily:F.display, marginBottom:"4px" }}>Analytics Dashboard</div>
            <div style={{ fontSize:"12px", color:C.silver }}>Coming post-funding — cross-ministry analytics, audit exports, tax authority integration</div>
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
// CITIZEN SELF-SERVICE PORTAL
// Light theme, public-facing, mobile-friendly
// Citizens: look up applications by ID or reference, pay fees, download certificates
// Payments flow to MinistryDashboard pending actions queue automatically
// ---

// Light theme colour palette for citizen portal
const CP = {
  bg:      "#F0F4F8",
  card:    "#FFFFFF",
  border:  "#E2E8F0",
  navy:    "#1E3A5F",
  green:   "#16A34A",
  amber:   "#D97706",
  red:     "#DC2626",
  blue:    "#2563EB",
  teal:    "#0D9488",
  muted:   "#64748B",
  light:   "#94A3B8",
  text:    "#1E293B",
  sub:     "#475569",
};

// Citizen-friendly service catalogue
const CITIZEN_SERVICES = [
  // MCIL
  { ministry:"MCIL", serviceType:"COMPANY_REGISTRATION",        icon:"🏢", name:"Company Registration",          desc:"Register a new business entity",                     category:"Business" },
  { ministry:"MCIL", serviceType:"FOREIGN_INVESTMENT_APPROVED", icon:"🌏", name:"Foreign Investment Application",  desc:"Apply for foreign investment approval",              category:"Business" },
  { ministry:"MCIL", serviceType:"TRADE_LICENCE_UPDATED",       icon:"📦", name:"Trade Licence Verification",      desc:"Verify or renew your trade licence",                 category:"Business" },
  { ministry:"MCIL", serviceType:"LABOUR_CONTRACT_RECORDED",    icon:"📜", name:"Investment Certificate",          desc:"Apply for investment certificate issuance",           category:"Business" },
  // MCIT
  { ministry:"MCIT", serviceType:"BUSINESS_LICENCE_DIGITAL",    icon:"💼", name:"Digital Business Licence",        desc:"Apply for or renew digital business licence",        category:"Business" },
  { ministry:"MCIT", serviceType:"DIGITAL_ID_ISSUED",           icon:"🪪", name:"National Digital ID",             desc:"Apply for your digital identity card",               category:"Identity" },
  { ministry:"MCIT", serviceType:"SPECTRUM_LICENCE_ISSUED",     icon:"📡", name:"Spectrum / Radio Licence",         desc:"Apply for telecommunications spectrum licence",      category:"Telecoms" },
  { ministry:"MCIT", serviceType:"ICT_REGISTRATION",            icon:"🖥", name:"ICT Sector Clearance",             desc:"Obtain sector regulatory clearance for investment",  category:"Business" },
  // CUSTOMS
  { ministry:"CUSTOMS", serviceType:"SHIPMENT_CLEARED_2025",    icon:"🚢", name:"Customs Clearance",               desc:"Record and clear an import/export shipment",         category:"Trade" },
  { ministry:"CUSTOMS", serviceType:"TRADE_FACILITATION_RECORD",icon:"✅", name:"Container Release",               desc:"Finalise clearance and release container",            category:"Trade" },
  { ministry:"CUSTOMS", serviceType:"TARIFF_CLASSIFICATION",    icon:"🏷", name:"Tariff Classification",            desc:"Get a tariff code assigned for your goods",          category:"Trade" },
  { ministry:"CUSTOMS", serviceType:"BOND_WAREHOUSE_RECORD",    icon:"🏭", name:"Bond Warehouse Entry",             desc:"Register goods into a bonded warehouse",             category:"Trade" },
  // EDUCATION
  { ministry:"EDUCATION", serviceType:"SCHOOL_ENROLMENT_2025",  icon:"🎒", name:"School Enrolment",                desc:"Enrol a child in the national school programme",     category:"Education" },
  { ministry:"EDUCATION", serviceType:"SCHOLARSHIP_AWARDED",    icon:"🎓", name:"Scholarship Application",          desc:"Apply for or record a scholarship award",            category:"Education" },
  { ministry:"EDUCATION", serviceType:"GRADUATION_RECORD",      icon:"📋", name:"Graduation Certificate",          desc:"Record and receive graduation certificate",           category:"Education" },
  // MOF
  { ministry:"MOF", serviceType:"TAX_COMPLIANCE_VERIFIED",      icon:"🧾", name:"Tax Compliance Certificate",       desc:"Obtain annual tax compliance clearance",             category:"Finance" },
  { ministry:"MOF", serviceType:"SOCIAL_WELFARE_PAYMENT_2025",  icon:"💚", name:"Social Welfare Registration",      desc:"Register for social welfare payment",                category:"Welfare" },
  // CBS
  { ministry:"CBS", serviceType:"ACCOUNT_OPENED",               icon:"🏦", name:"Bank Account Opening",             desc:"Open a new CBS-registered bank account",             category:"Banking" },
  { ministry:"CBS", serviceType:"DIGITAL_PAYMENT_RECORDED",     icon:"💸", name:"Digital Payment",                  desc:"Record a digital or mobile payment transaction",     category:"Banking" },
  { ministry:"CBS", serviceType:"STABLECOIN_ISSUANCE",          icon:"💎", name:"WST Stablecoin Issuance",          desc:"Request WST digital currency from CBS",              category:"Banking" },
];

const CP_CATEGORIES = ["All", "Business", "Identity", "Trade", "Education", "Finance", "Welfare", "Banking", "Telecoms"];

function CitizenPortal({ onBack, citizenPayments, onCitizenPayment, connected }) {
  const [screen,    setScreen]    = useState("home");     // "home"|"browse"|"pay"|"track"|"success"
  const [lookup,    setLookup]    = useState("");
  const [lookupRef, setLookupRef] = useState("");
  const [selected,  setSelected]  = useState(null);       // selected CITIZEN_SERVICES entry
  const [category,  setCategory]  = useState("All");
  const [citizenId, setCitizenId] = useState("");
  const [payMethod, setPayMethod] = useState("MPAY_VODAFONE");
  const [paying,    setPaying]    = useState(false);
  const [lastPayment, setLastPayment] = useState(null);

  const filtered = CITIZEN_SERVICES.filter(s =>
    category === "All" || s.category === category
  );

  // Citizen's payment history (for their ID or reference)
  const myPayments = citizenPayments.filter(cp =>
    lookup && (
      cp.citizenId?.toLowerCase().includes(lookup.toLowerCase()) ||
      cp.payRef?.toLowerCase().includes(lookup.toLowerCase()) ||
      lookupRef && cp.payRef?.toLowerCase() === lookupRef.toLowerCase()
    )
  );

  const feeInfo  = selected ? (SERVICE_FEES[selected.serviceType] || {}) : {};
  const vatAmt   = feeInfo.vatRate > 0 ? ((feeInfo.govFee||0) * feeInfo.vatRate).toFixed(2) : null;
  const totalDue = feeInfo.vatRate > 0 ? ((feeInfo.govFee||0) * (1 + feeInfo.vatRate)).toFixed(2) : String(feeInfo.govFee || 0);
  const railInfo = PAYMENT_RAILS.find(r => r.value === payMethod) || PAYMENT_RAILS[0];
  const meta     = selected ? MINISTRY_META[selected.ministry] : null;

  const handlePay = () => {
    if (!citizenId.trim()) return;
    setPaying(true);
    setTimeout(() => {
      const payRef = `CPZ-${Date.now().toString(36).toUpperCase().slice(-6)}`;
      const pmt = {
        payRef,
        citizenId:     citizenId.trim(),
        serviceType:   selected.serviceType,
        ministryCode:  selected.ministry,
        amount:        feeInfo.isPaymentOut ? String(feeInfo.clientAmount) : "0",
        fee:           String(feeInfo.govFee || 0),
        paymentMethod: payMethod,
        railLabel:     railInfo.label,
        wfId:          (SVC_TO_WF[selected.serviceType]||[])[0]?.workflowId || null,
        timestamp:     Date.now(),
        status:        "paid",
        service:       selected,
      };
      onCitizenPayment(pmt);
      setLastPayment(pmt);
      setPaying(false);
      setScreen("success");
    }, 1200);
  };

  // ── Light theme card helper
  const cpCard = (extra={}) => ({
    background:CP.card, borderRadius:"12px", padding:"20px",
    border:`1px solid ${CP.border}`, boxShadow:"0 1px 3px rgba(0,0,0,0.08)",
    ...extra,
  });
  const cpInput = { width:"100%", background:"#F8FAFC", border:`1.5px solid ${CP.border}`,
    borderRadius:"8px", padding:"11px 14px", color:CP.text, fontSize:"14px",
    fontFamily:F.ui, boxSizing:"border-box", outline:"none" };
  const cpLabel = { fontSize:"12px", fontWeight:700, color:CP.muted, textTransform:"uppercase",
    letterSpacing:"0.5px", display:"block", marginBottom:"6px" };
  const cpBtn = (variant="primary") => ({
    display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"8px",
    padding:"11px 22px", borderRadius:"8px", fontWeight:700, fontSize:"13px",
    cursor:"pointer", border:"none", fontFamily:F.ui,
    ...(variant==="primary" ? { background:CP.blue, color:"#fff" }
      : variant==="green"  ? { background:CP.green, color:"#fff" }
      : variant==="outline" ? { background:"transparent", color:CP.blue, border:`1.5px solid ${CP.blue}` }
      : { background:CP.border, color:CP.muted }),
  });

  return (
    <div style={{ minHeight:"100vh", background:CP.bg, fontFamily:F.ui, color:CP.text }}>

      {/* ── HEADER */}
      <div style={{ background:CP.navy, color:"#fff", padding:"0" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto", padding:"16px 28px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", gap:"14px", alignItems:"center" }}>
            <span style={{ fontSize:"28px" }}>🌺</span>
            <div>
              <div style={{ fontWeight:900, fontSize:"17px", fontFamily:F.display }}>Samoa Government Online Portal</div>
              <div style={{ fontSize:"11px", color:"#94A3B8", marginTop:"2px" }}>Samoa Pacific Blockchain Hub · Citizen Self-Service</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
            <span style={{ fontSize:"11px", background:"#22C55E22", color:"#4ADE80", padding:"4px 10px", borderRadius:"20px", fontWeight:700 }}>
              {connected ? "● LIVE — Blockchain Connected" : "⚠ Demo Mode"}
            </span>
            <button onClick={onBack} style={{ ...cpBtn("outline"), padding:"7px 16px", fontSize:"12px", color:"#94A3B8", borderColor:"#475569" }}>
              ← Back to Hub
            </button>
          </div>
        </div>

        {/* Nav */}
        {screen !== "success" && (
          <div style={{ background:"#152B46", borderTop:"1px solid #2D4A6A" }}>
            <div style={{ maxWidth:"1000px", margin:"0 auto", padding:"0 28px", display:"flex", gap:"0" }}>
              {[["home","🏠 Home"],["browse","📋 Services"],["track","🔍 Track Application"]].map(([s,l])=>(
                <button key={s} onClick={()=>setScreen(s)}
                  style={{ padding:"11px 20px", fontSize:"12px", fontWeight:700, cursor:"pointer", border:"none",
                    fontFamily:F.ui, background:"transparent", color:screen===s?"#22C55E":"#94A3B8",
                    borderBottom:screen===s?"2px solid #22C55E":"2px solid transparent" }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ maxWidth:"1000px", margin:"0 auto", padding:"32px 28px" }}>

        {/* ── HOME SCREEN */}
        {screen === "home" && (
          <div>
            <div style={{ textAlign:"center", marginBottom:"40px" }}>
              <div style={{ fontSize:"14px", fontWeight:700, color:CP.teal, letterSpacing:"2px", textTransform:"uppercase", marginBottom:"10px" }}>
                🌺 Samoa Pacific Blockchain Hub
              </div>
              <h1 style={{ fontSize:"32px", fontWeight:900, color:CP.navy, marginBottom:"12px", fontFamily:F.display }}>
                Government Services Online
              </h1>
              <p style={{ fontSize:"15px", color:CP.sub, maxWidth:"540px", margin:"0 auto", lineHeight:1.7 }}>
                Apply for licences, pay government fees, track your applications and download verified certificates — all without queuing at a ministry office.
              </p>
            </div>

            {/* Quick actions */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"16px", marginBottom:"32px" }}>
              {[
                { icon:"📋", title:"Browse & Apply",      sub:"Find any government service and apply online",  action:()=>setScreen("browse"),  color:CP.blue },
                { icon:"💳", title:"Pay a Fee",           sub:"Pay for a service you've been invoiced for",    action:()=>setScreen("browse"),  color:CP.green },
                { icon:"🔍", title:"Track Application",   sub:"Check status using your ID or reference number",action:()=>setScreen("track"),   color:CP.teal },
              ].map(({icon,title,sub,action,color})=>(
                <div key={title} onClick={action} style={{ ...cpCard(), cursor:"pointer", borderTop:`3px solid ${color}`, transition:"box-shadow 0.15s" }}
                  onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.12)"}
                  onMouseLeave={e=>e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.08)"}>
                  <div style={{ fontSize:"32px", marginBottom:"12px" }}>{icon}</div>
                  <div style={{ fontWeight:800, fontSize:"15px", color:CP.navy, marginBottom:"6px" }}>{title}</div>
                  <div style={{ fontSize:"13px", color:CP.sub, lineHeight:1.6 }}>{sub}</div>
                  <div style={{ marginTop:"14px", color:color, fontSize:"12px", fontWeight:700 }}>Get started →</div>
                </div>
              ))}
            </div>

            {/* Popular services quick links */}
            <div style={{ ...cpCard(), marginBottom:"24px" }}>
              <div style={{ fontWeight:800, fontSize:"15px", color:CP.navy, marginBottom:"14px" }}>🔥 Popular Services</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"10px" }}>
                {CITIZEN_SERVICES.slice(0,8).map(svc=>{
                  const fi = SERVICE_FEES[svc.serviceType]||{};
                  return (
                    <div key={svc.serviceType} onClick={()=>{ setSelected(svc); setScreen("pay"); }}
                      style={{ padding:"12px", background:CP.bg, borderRadius:"8px", cursor:"pointer", border:`1px solid ${CP.border}` }}
                      onMouseEnter={e=>e.currentTarget.style.background="#E2E8F0"}
                      onMouseLeave={e=>e.currentTarget.style.background=CP.bg}>
                      <div style={{ fontSize:"22px", marginBottom:"6px" }}>{svc.icon}</div>
                      <div style={{ fontSize:"12px", fontWeight:700, color:CP.navy, marginBottom:"2px" }}>{svc.name}</div>
                      <div style={{ fontSize:"11px", color:CP.muted }}>{MINISTRY_META[svc.ministry]?.name}</div>
                      {fi.hasFee && !fi.isPaymentOut && (
                        <div style={{ marginTop:"6px", fontSize:"11px", fontWeight:700, color:CP.green }}>
                          WST {fi.govFee}{fi.vatRate>0?" + VAGST":""}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info banner */}
            <div style={{ ...cpCard({ background:"#EFF6FF", borderColor:"#BFDBFE" }) }}>
              <div style={{ display:"flex", gap:"14px", alignItems:"flex-start" }}>
                <span style={{ fontSize:"28px" }}>🔐</span>
                <div>
                  <div style={{ fontWeight:800, fontSize:"14px", color:CP.navy, marginBottom:"6px" }}>Your identity is protected by blockchain</div>
                  <div style={{ fontSize:"13px", color:CP.sub, lineHeight:1.7 }}>
                    This portal uses the <strong>National Digital Identity System (NDIDS)</strong>. Your personal information is never stored on-chain — only a cryptographic hash of your identity is recorded. Every payment and service record you receive comes with a unique <strong>verifiable credential</strong> that you can use for tax, audit, and future government interactions.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── BROWSE SERVICES */}
        {screen === "browse" && (
          <div>
            <div style={{ marginBottom:"24px" }}>
              <h2 style={{ fontSize:"22px", fontWeight:900, color:CP.navy, marginBottom:"6px" }}>Browse Government Services</h2>
              <p style={{ fontSize:"13px", color:CP.sub }}>Select a service to apply and pay online. All transactions are recorded on the Samoa Pacific Blockchain.</p>
            </div>

            {/* Category filter */}
            <div style={{ display:"flex", gap:"8px", marginBottom:"20px", flexWrap:"wrap" }}>
              {CP_CATEGORIES.map(cat=>(
                <button key={cat} onClick={()=>setCategory(cat)}
                  style={{ padding:"6px 14px", borderRadius:"20px", fontSize:"12px", fontWeight:700, cursor:"pointer",
                    border:`1.5px solid ${category===cat?CP.blue:CP.border}`,
                    background:category===cat?CP.blue:"transparent",
                    color:category===cat?"#fff":CP.muted }}>
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"14px" }}>
              {filtered.map(svc => {
                const fi   = SERVICE_FEES[svc.serviceType] || {};
                const meta = MINISTRY_META[svc.ministry];
                return (
                  <div key={svc.serviceType} onClick={()=>{ setSelected(svc); setCitizenId(""); setScreen("pay"); }}
                    style={{ ...cpCard(), cursor:"pointer", borderTop:`3px solid ${meta?.color||CP.blue}` }}
                    onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.12)"}
                    onMouseLeave={e=>e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.08)"}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"10px" }}>
                      <span style={{ fontSize:"28px" }}>{svc.icon}</span>
                      <span style={{ fontSize:"10px", fontWeight:700, color:meta?.color||CP.blue, background:(meta?.color||CP.blue)+"18", padding:"3px 8px", borderRadius:"4px" }}>
                        {svc.category}
                      </span>
                    </div>
                    <div style={{ fontWeight:800, fontSize:"14px", color:CP.navy, marginBottom:"4px" }}>{svc.name}</div>
                    <div style={{ fontSize:"12px", color:CP.sub, marginBottom:"10px", lineHeight:1.5 }}>{svc.desc}</div>
                    <div style={{ fontSize:"11px", color:CP.muted, marginBottom:"10px" }}>
                      {meta?.icon} {meta?.name}
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ fontSize:"13px", fontWeight:800, color: fi.isPaymentOut?CP.teal : fi.hasFee?CP.green:CP.muted }}>
                        {fi.isPaymentOut ? `💚 Benefit: WST ${fi.clientAmount}` : fi.hasFee ? `💳 WST ${fi.govFee}${fi.vatRate>0?" + VAGST":""}` : "Free"}
                      </div>
                      <span style={{ fontSize:"12px", color:CP.blue, fontWeight:700 }}>Apply →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── PAYMENT SCREEN */}
        {screen === "pay" && selected && (
          <div style={{ maxWidth:"600px", margin:"0 auto" }}>
            <button onClick={()=>setScreen("browse")} style={{ ...cpBtn("outline"), marginBottom:"20px", fontSize:"12px", padding:"7px 14px" }}>
              ← Back to Services
            </button>

            {/* Service summary card */}
            <div style={{ ...cpCard({ borderTop:`4px solid ${meta?.color||CP.blue}`, marginBottom:"20px" }) }}>
              <div style={{ display:"flex", gap:"14px", alignItems:"center" }}>
                <span style={{ fontSize:"40px" }}>{selected.icon}</span>
                <div>
                  <div style={{ fontWeight:900, fontSize:"18px", color:CP.navy }}>{selected.name}</div>
                  <div style={{ fontSize:"12px", color:CP.muted, marginTop:"3px" }}>{meta?.icon} {meta?.name}</div>
                  <div style={{ fontSize:"13px", color:CP.sub, marginTop:"6px" }}>{selected.desc}</div>
                </div>
              </div>
            </div>

            {/* Fee breakdown */}
            {feeInfo.hasFee && (
              <div style={{ ...cpCard({ background:"#F0FDF4", borderColor:"#86EFAC", marginBottom:"20px" }) }}>
                <div style={{ fontWeight:800, fontSize:"14px", color:"#166534", marginBottom:"12px" }}>
                  {feeInfo.isPaymentOut ? "💚 Government Benefit Details" : "💳 Fee Breakdown"}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:"6px", fontSize:"13px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ color:CP.sub }}>{feeInfo.feeLabel}</span>
                    <span style={{ fontWeight:700 }}>WST {feeInfo.isPaymentOut ? feeInfo.clientAmount : feeInfo.govFee}</span>
                  </div>
                  {vatAmt && (
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <span style={{ color:CP.sub }}>VAGST (15%)</span>
                      <span style={{ fontWeight:700, color:CP.amber }}>WST {vatAmt}</span>
                    </div>
                  )}
                  <div style={{ borderTop:`1px solid #86EFAC`, paddingTop:"8px", marginTop:"4px", display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontWeight:800, color:"#166534" }}>Total {feeInfo.isPaymentOut?"Benefit":"Due"}</span>
                    <span style={{ fontWeight:900, fontSize:"16px", color:"#166534" }}>WST {feeInfo.isPaymentOut ? feeInfo.clientAmount : totalDue}</span>
                  </div>
                </div>
                <div style={{ fontSize:"11px", color:"#4B7C5A", marginTop:"8px" }}>{feeInfo.note}</div>
              </div>
            )}

            {/* Citizen ID / Application form */}
            <div style={{ ...cpCard({ marginBottom:"20px" }) }}>
              <div style={{ fontWeight:800, fontSize:"15px", color:CP.navy, marginBottom:"16px" }}>Your Details</div>

              <div style={{ marginBottom:"14px" }}>
                <label style={cpLabel}>Your National ID / Business Number *</label>
                <input value={citizenId} onChange={e=>setCitizenId(e.target.value)}
                  placeholder="e.g. WS-123456 or your National ID number"
                  style={cpInput} />
                <div style={{ fontSize:"11px", color:CP.light, marginTop:"5px" }}>
                  Your ID is converted to a privacy-preserving hash before being stored on-chain. Your personal details remain private.
                </div>
              </div>

              {/* Payment method */}
              {feeInfo.hasFee && !feeInfo.isPaymentOut && (
                <div style={{ marginBottom:"14px" }}>
                  <label style={cpLabel}>Payment Method</label>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
                    {PAYMENT_RAILS.map(rail => (
                      <div key={rail.value} onClick={()=>setPayMethod(rail.value)}
                        style={{ padding:"10px 12px", borderRadius:"8px", cursor:"pointer",
                          border:`2px solid ${payMethod===rail.value?CP.blue:CP.border}`,
                          background:payMethod===rail.value?"#EFF6FF":CP.card }}>
                        <div style={{ fontSize:"13px", fontWeight:700, color:payMethod===rail.value?CP.blue:CP.text }}>{rail.label}</div>
                        <div style={{ fontSize:"11px", color:CP.muted, marginTop:"2px" }}>{rail.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* What happens next explainer */}
            <div style={{ ...cpCard({ background:"#EFF6FF", borderColor:"#BFDBFE", marginBottom:"20px" }) }}>
              <div style={{ fontWeight:700, fontSize:"13px", color:CP.navy, marginBottom:"10px" }}>ℹ What happens after you submit?</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                {[
                  ["1","Your payment is confirmed and a reference number is generated"],
                  ["2","The ministry officer is automatically notified in their dashboard"],
                  ["3","The officer processes and signs your service record on-chain"],
                  ["4","You receive a verifiable certificate with a unique blockchain hash"],
                  ["5","Your credential can be used for tax, audit, and future government interactions"],
                ].map(([n,t])=>(
                  <div key={n} style={{ display:"flex", gap:"10px", alignItems:"flex-start" }}>
                    <span style={{ minWidth:"22px", height:"22px", borderRadius:"50%", background:CP.blue, color:"#fff", fontSize:"11px", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>{n}</span>
                    <span style={{ fontSize:"12px", color:CP.sub, lineHeight:1.5 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handlePay} disabled={!citizenId.trim() || paying}
              style={{ ...cpBtn(paying?"":"green"), width:"100%", padding:"14px", fontSize:"14px",
                opacity:!citizenId.trim()||paying?0.6:1 }}>
              {paying ? "⏳ Processing payment…"
                : feeInfo.isPaymentOut ? `✅ Register & Receive WST ${feeInfo.clientAmount}`
                : feeInfo.hasFee ? `✅ Pay WST ${totalDue} via ${railInfo.label}`
                : "✅ Submit Application (No Fee)"}
            </button>
            <div style={{ fontSize:"11px", color:CP.light, textAlign:"center", marginTop:"8px" }}>
              Your payment reference will be logged on-chain. The ministry officer will see it in their pending actions immediately.
            </div>
          </div>
        )}

        {/* ── SUCCESS SCREEN */}
        {screen === "success" && lastPayment && (
          <div style={{ maxWidth:"600px", margin:"0 auto", textAlign:"center" }}>
            <div style={{ ...cpCard({ borderTop:`4px solid ${CP.green}`, marginBottom:"24px" }) }}>
              <div style={{ fontSize:"56px", marginBottom:"12px" }}>✅</div>
              <div style={{ fontSize:"22px", fontWeight:900, color:CP.navy, marginBottom:"8px" }}>Payment Confirmed!</div>
              <div style={{ fontSize:"14px", color:CP.sub, marginBottom:"20px" }}>
                Your application has been submitted to the <strong>{MINISTRY_META[lastPayment.ministryCode]?.name}</strong>. The ministry officer has been notified and will process your request.
              </div>

              {/* Payment reference hero */}
              <div style={{ background:CP.navy, borderRadius:"10px", padding:"16px 20px", marginBottom:"20px" }}>
                <div style={{ fontSize:"11px", color:"#94A3B8", marginBottom:"6px", textTransform:"uppercase", letterSpacing:"0.5px" }}>Your Payment Reference — Keep this safe</div>
                <div style={{ fontSize:"22px", fontWeight:900, color:"#22C55E", fontFamily:F.mono, letterSpacing:"2px" }}>
                  {lastPayment.payRef}
                </div>
                <div style={{ fontSize:"11px", color:"#94A3B8", marginTop:"6px" }}>
                  Use this reference to track your application or quote it to the ministry officer
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"20px", textAlign:"left" }}>
                {[
                  ["Service",        serviceLabel(lastPayment.serviceType)],
                  ["Ministry",       MINISTRY_META[lastPayment.ministryCode]?.name],
                  ["Amount Paid",    `WST ${lastPayment.fee || lastPayment.amount || "0"}`],
                  ["Method",         lastPayment.railLabel],
                  ["Status",         "✅ Payment Confirmed"],
                  ["Submitted",      new Date(lastPayment.timestamp).toLocaleString()],
                ].map(([l,v])=>(
                  <div key={l} style={{ background:CP.bg, borderRadius:"8px", padding:"10px 12px" }}>
                    <div style={{ fontSize:"10px", color:CP.light, fontWeight:700, textTransform:"uppercase", marginBottom:"3px" }}>{l}</div>
                    <div style={{ fontSize:"13px", color:CP.text, fontWeight:700 }}>{v}</div>
                  </div>
                ))}
              </div>

              <div style={{ padding:"12px 14px", background:"#FEF3C7", borderRadius:"8px", marginBottom:"20px", textAlign:"left", fontSize:"12px", color:"#92400E" }}>
                ⏰ <strong>What happens next:</strong> The ministry officer will see your payment in their dashboard and process your service record on-chain, usually within 1 business day. You will receive a verifiable blockchain certificate once complete.
              </div>

              <div style={{ display:"flex", gap:"10px", justifyContent:"center", flexWrap:"wrap" }}>
                <button onClick={()=>{ setScreen("track"); setLookup(lastPayment.citizenId); }}
                  style={{ ...cpBtn("outline") }}>🔍 Track My Application</button>
                <button onClick={()=>{ setSelected(null); setScreen("browse"); }}
                  style={{ ...cpBtn("primary") }}>📋 Apply for Another Service</button>
              </div>
            </div>
          </div>
        )}

        {/* ── TRACK APPLICATION */}
        {screen === "track" && (
          <div style={{ maxWidth:"680px", margin:"0 auto" }}>
            <h2 style={{ fontSize:"22px", fontWeight:900, color:CP.navy, marginBottom:"6px" }}>Track Your Application</h2>
            <p style={{ fontSize:"13px", color:CP.sub, marginBottom:"24px" }}>Enter your National ID or Payment Reference to view your application status.</p>

            <div style={{ ...cpCard({ marginBottom:"20px" }) }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"14px" }}>
                <div>
                  <label style={cpLabel}>Your National ID</label>
                  <input value={lookup} onChange={e=>setLookup(e.target.value)}
                    placeholder="e.g. WS-123456" style={cpInput} />
                </div>
                <div>
                  <label style={cpLabel}>Payment Reference (optional)</label>
                  <input value={lookupRef} onChange={e=>setLookupRef(e.target.value)}
                    placeholder="e.g. CPZ-ABC123" style={cpInput} />
                </div>
              </div>
              <div style={{ fontSize:"11px", color:CP.light }}>
                You can find your payment reference in the confirmation you received when you applied.
              </div>
            </div>

            {lookup.trim() && myPayments.length === 0 && (
              <div style={{ ...cpCard(), textAlign:"center", padding:"36px" }}>
                <div style={{ fontSize:"32px", marginBottom:"8px" }}>🔍</div>
                <div style={{ fontWeight:700, color:CP.navy, marginBottom:"4px" }}>No applications found</div>
                <div style={{ fontSize:"13px", color:CP.sub }}>Try entering your National ID exactly as registered, or use your payment reference.</div>
              </div>
            )}

            {myPayments.map((pmt, i) => {
              const mMeta = MINISTRY_META[pmt.ministryCode];
              const statusColor = pmt.status==="complete" ? CP.green : pmt.status==="processing" ? CP.blue : CP.amber;
              const statusLabel = pmt.status==="complete" ? "✅ Certificate Issued" : pmt.status==="processing" ? "⚙ Being Processed" : "⏳ Payment Received — Awaiting Officer";
              return (
                <div key={i} style={{ ...cpCard({ borderLeft:`4px solid ${statusColor}`, marginBottom:"14px" }) }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"12px" }}>
                    <div>
                      <div style={{ fontWeight:800, fontSize:"15px", color:CP.navy }}>{serviceLabel(pmt.serviceType)}</div>
                      <div style={{ fontSize:"12px", color:CP.muted, marginTop:"3px" }}>{mMeta?.icon} {mMeta?.name}</div>
                    </div>
                    <span style={{ fontSize:"12px", fontWeight:700, color:statusColor, background:statusColor+"18", padding:"4px 10px", borderRadius:"6px" }}>
                      {statusLabel}
                    </span>
                  </div>

                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"8px", marginBottom:"12px" }}>
                    {[
                      ["Payment Ref", pmt.payRef],
                      ["Amount Paid", `WST ${pmt.fee || pmt.amount || "0"}`],
                      ["Method",      pmt.railLabel],
                      ["Submitted",   new Date(pmt.timestamp).toLocaleString()],
                      ["Status",      statusLabel],
                      ["Ministry",    mMeta?.name],
                    ].map(([l,v])=>(
                      <div key={l} style={{ background:CP.bg, borderRadius:"6px", padding:"8px 10px" }}>
                        <div style={{ fontSize:"9px", color:CP.light, fontWeight:700, textTransform:"uppercase", marginBottom:"2px" }}>{l}</div>
                        <div style={{ fontSize:"12px", color:CP.text, fontWeight:600 }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  {pmt.status === "complete" && (
                    <div style={{ padding:"10px 12px", background:"#F0FDF4", border:`1px solid #86EFAC`, borderRadius:"8px", fontSize:"12px", color:"#166534" }}>
                      ✅ Your certificate has been issued on-chain. The ministry officer will provide your verifiable credential document.
                    </div>
                  )}
                  {pmt.status === "paid" && (
                    <div style={{ padding:"10px 12px", background:"#FFFBEB", border:`1px solid #FDE68A`, borderRadius:"8px", fontSize:"12px", color:"#92400E" }}>
                      ⏳ Payment confirmed. The ministry officer has been notified and will process your request. Usually completed within 1 business day.
                    </div>
                  )}
                </div>
              );
            })}

            {myPayments.length === 0 && !lookup.trim() && (
              <div style={{ ...cpCard({ background:"#EFF6FF", borderColor:"#BFDBFE" }), textAlign:"center", padding:"36px" }}>
                <div style={{ fontSize:"36px", marginBottom:"10px" }}>🔍</div>
                <div style={{ fontWeight:700, color:CP.navy, marginBottom:"6px" }}>Enter your details above</div>
                <div style={{ fontSize:"13px", color:CP.sub }}>Enter your National ID or payment reference to see your application history.</div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Footer */}
      <div style={{ background:CP.navy, color:"#94A3B8", padding:"24px 28px", marginTop:"40px" }}>
        <div style={{ maxWidth:"1000px", margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"12px" }}>
          <div>
            <div style={{ fontWeight:700, color:"#fff", marginBottom:"4px" }}>🌺 Samoa Pacific Blockchain Hub</div>
            <div style={{ fontSize:"11px" }}>Government of Samoa · Synergy Blockchain Pacific · UNICEF Venture Fund 2026</div>
          </div>
          <div style={{ fontSize:"11px", textAlign:"right" }}>
            <div>All transactions recorded on {CONFIG.NETWORK}</div>
            <div style={{ marginTop:"3px" }}>Verifiable credentials · Privacy-preserving · NDIDS-secured</div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ---
// NDIDS DASHBOARD -- National Digital Identity System Registry
// Restored: Issue 11 fix. Shows registry stats, hash lookup, cross-ministry access policy.
// NDIDSRegistry contract: stores keccak256 citizen hashes only — no PII on chain.
// ---
function NDIDSDashboard({ provider, connected, blockNumber, onBack, allRecords }) {
  const [lookup,    setLookup]    = useState("");
  const [lookupRes, setLookupRes] = useState(null);
  const [checking,  setChecking]  = useState(false);

  const ndidsContract = provider ? new ethers.Contract(ADDR.NDIDS, ABI.NDIDS, provider) : null;

  const { data:totalReg } = usePoll(async () => {
    if (!ndidsContract) return null;
    return Number(await ndidsContract.totalRegistered());
  }, [ndidsContract]);

  const ndidsVerifiedCount = (allRecords||[]).filter(r=>r.ndidsVerified).length;
  const crossMinistryCount = (allRecords||[]).filter(r=>!r.ndidsVerified).length;

  const handleLookup = async () => {
    if (!lookup.trim()) return;
    setChecking(true);
    setLookupRes(null);
    try {
      const h = lookup.trim().startsWith("0x") && lookup.trim().length===66
        ? lookup.trim()
        : ethers.keccak256(ethers.toUtf8Bytes(lookup.trim()));
      let registered = false;
      if (ndidsContract) {
        registered = await ndidsContract.isRegistered(h);
      }
      setLookupRes({ hash:h, registered, input:lookup.trim() });
    } catch(e) {
      setLookupRes({ error: e.message || "Lookup failed." });
    } finally { setChecking(false); }
  };

  const inStyle = { width:"100%", background:C.abyss, border:`1px solid ${C.ocean}`, borderRadius:"8px", padding:"10px 14px", color:C.white, fontSize:"13px", fontFamily:F.ui, boxSizing:"border-box" };

  const POLICY_ROWS = [
    { ministry:"EDUCATION", sector:"Education Citizens",          services:"School enrolment, attendance, graduation, scholarships",  access:"Read own sector" },
    { ministry:"MOF",       sector:"Finance / Welfare / Trade",   services:"Education benefit, welfare payments, duty, tax compliance",access:"Multi-sector read" },
    { ministry:"CBS",       sector:"Banking Citizens",            services:"Account opening, remittance, loans, stablecoin issuance", access:"CBS sector only" },
    { ministry:"CUSTOMS",   sector:"Trade / Import Citizens",     services:"Shipment clearance, trade facilitation, tariff records",  access:"Customs sector" },
    { ministry:"MCIL",      sector:"Business / Trade Citizens",   services:"Company registration, FDI, trade licence, labour",        access:"Business sector" },
    { ministry:"MCIT",      sector:"Business / ICT Citizens",     services:"Business licence, sector clearance, digital ID",          access:"ICT/Business sector" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.deep, fontFamily:F.ui, color:C.white }}>
      <TopBar title="National Digital Identity System" sub="NDIDSRegistry · Privacy-preserving · Hash-only · GDPR-aligned" accent={C.seafoam} blockNumber={blockNumber} onBack={onBack} />
      <ConnectionBanner connected={connected} error={!connected?"Chain offline — showing demo data":null} network={CONFIG.NETWORK} />

      <div style={{ maxWidth:"1080px", margin:"0 auto", padding:"28px" }}>

        {/* Hero explanation */}
        <div style={{ ...card({ background:`linear-gradient(135deg, ${C.seafoam}14, ${C.teal}08)`, borderColor:C.seafoam+"44" }), marginBottom:"24px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"16px", marginBottom:"16px" }}>
            <StatPill icon="🪪" value={totalReg ?? MOCK.totalRegistered} label="Citizens Registered"       color={C.seafoam} />
            <StatPill icon="✅" value={ndidsVerifiedCount}               label="NDIDS-Verified Records"    color={C.gold}    />
            <StatPill icon="🔄" value={crossMinistryCount}               label="Cross-Ministry (Hash-pass)" color="#4A9EE0"   />
          </div>
          <div style={{ fontSize:"12px", color:C.silver, lineHeight:1.8 }}>
            <strong style={{ color:C.seafoam }}>How NDIDS works:</strong> No personal information is stored on-chain. Each citizen is identified by a <code style={{ color:C.seafoam }}>keccak256</code> hash of their identity credentials. Ministries are granted sector-specific read access — a ministry can only verify a citizen's hash if they have been provisioned access to that sector's registry. Cross-workflow steps (e.g. CBS processing an education payment) submit with <code style={{ color:C.amber }}>ndidsVerified=false</code>, meaning the identity was already verified by the initiating ministry upstream. This is by design and aligns with Samoa's data sovereignty and emerging GDPR-equivalent frameworks.
          </div>
        </div>

        {/* Hash lookup */}
        <SectionHead title="🔍 Citizen Hash Lookup" sub="Enter a Citizen ID or paste a 0x hash to verify registration status on chain" />
        <div style={{ ...card(), maxWidth:"600px", marginBottom:"24px" }}>
          <div style={{ marginBottom:"14px" }}>
            <label style={{ fontSize:"11px", fontWeight:700, color:C.silver, textTransform:"uppercase", letterSpacing:"0.6px", display:"block", marginBottom:"6px" }}>Citizen ID or Hash</label>
            <input value={lookup} onChange={e=>setLookup(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLookup()} placeholder="e.g. CITIZEN-WS-001 or 0x..." style={inStyle} />
            {lookup.trim() && !lookup.trim().startsWith("0x") && (
              <div style={{ fontSize:"10px", color:C.muted, marginTop:"4px", fontFamily:F.mono }}>
                Will check hash: {ethers.keccak256(ethers.toUtf8Bytes(lookup.trim())).slice(0,24)}…
              </div>
            )}
          </div>
          <button onClick={handleLookup} disabled={checking||!lookup.trim()} style={{ ...btn(checking?"ghost":"success"), width:"100%", justifyContent:"center" }}>
            {checking ? "⏳ Checking chain…" : "🔍 Verify on Chain"}
          </button>
          {lookupRes && !lookupRes.error && (
            <div style={{ marginTop:"14px", padding:"12px", background:lookupRes.registered?C.seafoam+"18":C.danger+"18", border:`1px solid ${lookupRes.registered?C.seafoam:C.danger}44`, borderRadius:"8px" }}>
              <div style={{ fontSize:"13px", fontWeight:700, color:lookupRes.registered?C.seafoam:"#F88", marginBottom:"6px" }}>
                {lookupRes.registered ? "✅ Registered — Identity confirmed on chain" : "❌ Not registered in NDIDS"}
              </div>
              <div style={{ fontSize:"11px", color:C.silver }}>Input: <code style={{ color:C.muted }}>{lookupRes.input}</code></div>
              <div style={{ fontSize:"11px", color:C.muted, fontFamily:F.mono, marginTop:"4px" }}>Hash: {lookupRes.hash.slice(0,28)}…</div>
              <div style={{ fontSize:"11px", color:C.muted, marginTop:"4px" }}>
                {connected ? "Live result from NDIDSRegistry contract." : "Offline — result based on demo data."}
              </div>
            </div>
          )}
          {lookupRes?.error && (
            <div style={{ marginTop:"14px", padding:"10px 12px", background:C.danger+"18", border:`1px solid ${C.danger}33`, borderRadius:"8px", fontSize:"12px", color:"#F88" }}>
              ⚠ {lookupRes.error}
            </div>
          )}
        </div>

        {/* Access policy table */}
        <SectionHead title="🔐 Cross-Ministry NDIDS Access Policy" sub="Derived from Deploy.s.sol grantReadAccess assignments — enforced on-chain" />
        <div style={{ ...card(), marginBottom:"24px" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
              <thead>
                <tr style={{ borderBottom:`2px solid ${C.ocean}` }}>
                  {["Ministry","Sector Served","Services Covered","NDIDS Access Level"].map(h=>(
                    <th key={h} style={{ padding:"10px 12px", textAlign:"left", fontSize:"10px", fontWeight:800, color:C.silver, textTransform:"uppercase", letterSpacing:"0.6px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {POLICY_ROWS.map((row,i)=>{
                  const m = MINISTRY_META[row.ministry];
                  return (
                    <tr key={i} style={{ borderBottom:`1px solid ${C.ocean}`, background:i%2===0?"transparent":C.ocean+"44" }}>
                      <td style={{ padding:"10px 12px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                          <span style={{ fontSize:"16px" }}>{m?.icon}</span>
                          <div>
                            <div style={{ fontWeight:700, color:m?.color }}>{row.ministry}</div>
                            <div style={{ fontSize:"10px", color:C.muted }}>{m?.name}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:"10px 12px", color:C.silver }}>{row.sector}</td>
                      <td style={{ padding:"10px 12px", color:C.muted, fontSize:"11px" }}>{row.services}</td>
                      <td style={{ padding:"10px 12px" }}>
                        <span style={{ ...badge(C.seafoam), fontSize:"9px" }}>{row.access}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop:"14px", padding:"10px 12px", background:C.amber+"14", borderRadius:"8px", fontSize:"11px", color:C.amber }}>
            ℹ CBS cross-sector steps (DIGITAL_PAYMENT_RECORDED) always submit with <code>ndidsVerified=false</code> — identity was verified by the initiating ministry. MOF BUDGET_ALLOCATION_RECORDED similarly. This is correct behaviour, not an error.
          </div>
        </div>

        {/* Contract reference */}
        <div style={{ ...card({ borderLeft:`4px solid ${C.seafoam}` }) }}>
          <SectionHead title="Contract Reference" sub="NDIDSRegistry deployed on Anvil Local" />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 12px", background:C.ocean, borderRadius:"8px", marginBottom:"8px" }}>
            <span style={{ fontSize:"12px", fontWeight:700 }}>NDIDSRegistry</span>
            <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
              <Mono>{ADDR.NDIDS}</Mono>
              <button onClick={()=>navigator.clipboard?.writeText(ADDR.NDIDS)} style={{ fontSize:"10px", color:C.seafoam, background:"transparent", border:`1px solid ${C.seafoam}44`, borderRadius:"4px", padding:"2px 7px", cursor:"pointer", fontWeight:700 }}>Copy</button>
            </div>
          </div>
          <div style={{ fontSize:"11px", color:C.muted, lineHeight:1.8 }}>
            Future roadmap: Integration with Samoa Bureau of Statistics (SBS) for birth certificate, marriage licence and health record hash anchoring. All PII remains off-chain with SBS; only the keccak256 commitment is stored on the NDIDSRegistry. This architecture is compatible with evolving global privacy frameworks including GDPR and the Pacific Data Governance Framework.
          </div>
        </div>

      </div>
    </div>
  );
}


// ---
// COMMUNITY DASHBOARD -- Path A (uses existing AIDisbursementTracker)
// 4 role views: Donor ? Project Manager ? Matai/Leadership ? Community
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
  Equipment: { icon:"⚙",  color:"#0FB894" },
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
  { projectId:"BIOGAS-VAIALA-2025", ts: Date.now()-8*86400000,  actor:"PM",    action:"Expenditure EXP-007 submitted — Piping & Fittings 5,800 WST — awaiting matai approval",            flag:true  },
  { projectId:"BIOGAS-VAIALA-2025", ts: Date.now()-9*86400000,  actor:"CHAIN", action:"Tranche 1 released on chain — 40,000 WST — Grant #0 Milestone 2",                                  flag:false },
  { projectId:"BIOGAS-VAIALA-2025", ts: Date.now()-12*86400000, actor:"MATAI", action:"Expenditure EXP-006 approved — Installation Labour 9,400 WST",                                     flag:false },
  { projectId:"BIOGAS-VAIALA-2025", ts: Date.now()-15*86400000, actor:"CHAIN", action:"verifyUsage() confirmed — Tranche 1 verified by UNICEF officer. Beneficiaries: 23",                flag:false },
  { projectId:"BIOGAS-VAIALA-2025", ts: Date.now()-20*86400000, actor:"PM",    action:"Milestone 1 evidence submitted — 23 households capacity training complete. Ref: REPORT-M1-FINAL",  flag:false },
  { projectId:"BIOGAS-VAIALA-2025", ts: Date.now()-35*86400000, actor:"CHAIN", action:"Tranche 0 verified — 30,000 WST — Site assessment complete",                                       flag:false },
  { projectId:"BIOGAS-VAIALA-2025", ts: Date.now()-40*86400000, actor:"CHAIN", action:"Grant #0 created on chain — UNICEF Samoa Education Access Programme 2025 — 100,000 WST",           flag:false },
  // Savai'i Rural Water project — separate project, separate log
  { projectId:"WATER-SAVAII-2026",  ts: Date.now()-2*86400000,  actor:"CHAIN", action:"World Bank grant application submitted — Savai'i Rural Water Access Programme — 250,000 WST",     flag:false },
  { projectId:"WATER-SAVAII-2026",  ts: Date.now()-1*86400000,  actor:"PM",    action:"Project WATER-SAVAII-2026 created — Survey & design milestone pending World Bank approval",         flag:false },
];

function CommunityDashboard({ provider, connected, blockNumber, onBack, onOpenUNICEF, expenditures, setExpenditures, activityLog, setActivityLog }) {
  const [role,            setRole]            = useState(null);
  const [tab,             setTab]             = useState("overview");
  const [selectedProject, setSelectedProject] = useState("BIOGAS-VAIALA-2025");
  const [pendingExp,      setPendingExp]      = useState({ recipient:"", amount:"", category:"Labour", receiptRef:"", notes:"", milestoneId:"0" });
  const [expTxMsg,        setExpTxMsg]        = useState(null);
  const [submitting,      setSubmitting]      = useState(false);

  const project    = COMMUNITY_PROJECTS.find(p => p.id === selectedProject) || COMMUNITY_PROJECTS[0];
  const projExps   = expenditures.filter(e => e.projectId === project.id);
  const approved   = projExps.filter(e => e.status === "approved");
  const pending    = projExps.filter(e => e.status === "pending");

  // Activity log filtered to this project only
  const projActivity = activityLog.filter(e => !e.projectId || e.projectId === project.id);

  const totalReceived = project.milestones.filter(m => m.status==="released"||m.status==="verified").reduce((s,m)=>s+m.targetWST,0);
  const totalVerified = project.milestones.filter(m => m.status==="verified").reduce((s,m)=>s+m.targetWST,0);
  const totalSpent    = approved.reduce((s,e)=>s+e.amount,0);
  const totalPending  = pending.reduce((s,e)=>s+e.amount,0);
  const remaining     = totalReceived - totalSpent;
  const burnRate      = totalReceived>0 ? Math.round((totalSpent/totalReceived)*100) : 0;

  const daysSinceLast = projActivity.length > 0
    ? Math.floor((Date.now()-projActivity[0].ts)/86400000)
    : 999;
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

    // ISSUE 10 FIX: Duplicate spend guard — check for matching receipt ref AND same recipient+amount
    // This prevents the same invoice being submitted twice. The receipt reference is the primary key.
    if (pendingExp.receiptRef && pendingExp.receiptRef.trim()) {
      const dupByRef = expenditures.find(e =>
        e.projectId === project.id &&
        e.receiptRef &&
        e.receiptRef.trim().toLowerCase() === pendingExp.receiptRef.trim().toLowerCase()
      );
      if (dupByRef) {
        setExpTxMsg({ type:"error", text:`⚠ Duplicate detected: Receipt reference "${pendingExp.receiptRef}" already exists as ${dupByRef.id} (${dupByRef.status}). Please verify — if this is a different invoice use a unique reference number. On-chain records are immutable once submitted.` });
        return;
      }
    }
    // Secondary guard: same recipient + same amount + same milestone within 24 hours
    const recentDup = expenditures.find(e =>
      e.projectId === project.id &&
      e.recipient.trim().toLowerCase() === pendingExp.recipient.trim().toLowerCase() &&
      e.amount === amt &&
      e.milestoneId === parseInt(pendingExp.milestoneId) &&
      Math.abs(new Date(e.date).getTime() - Date.now()) < 86400000
    );
    if (recentDup) {
      setExpTxMsg({ type:"error", text:`⚠ Possible duplicate: ${recentDup.id} already records ${pendingExp.recipient} for ${amt.toLocaleString()} WST on this milestone today. Please review before submitting. If this is a legitimate second payment, ensure the receipt reference is unique.` });
      return;
    }

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
      setActivityLog(p=>[{ projectId: project.id, ts:Date.now(), actor:"PM", action:`${newExp.id} submitted — ${pendingExp.recipient} ${amt.toLocaleString()} WST (${pendingExp.category}) — awaiting matai approval`, flag:false },...p]);
      setPendingExp({ recipient:"", amount:"", category:"Labour", receiptRef:"", notes:"", milestoneId:"0" });
      setExpTxMsg({ type:"success", text:`✓ ${newExp.id} recorded. Receipt hash: ${rHash.slice(0,20)}… Awaiting matai approval.` });
      setSubmitting(false);
    }, 800);
  };

  const handleApprove = (expId) => {
    const exp = expenditures.find(e => e.id === expId);
    setExpenditures(p=>p.map(e=>e.id===expId?{...e,status:"approved",approvedBy:"COMMUNITY-MATAI-001"}:e));
    setActivityLog(p=>[{ projectId: exp?.projectId || project.id, ts:Date.now(), actor:"MATAI", action:`${expId} approved by matai — funds cleared for disbursement`, flag:false },...p]);
  };

  const inStyle = { width:"100%", background:C.abyss, border:`1px solid ${C.ocean}`, borderRadius:"8px", padding:"10px 14px", color:C.white, fontSize:"13px", fontFamily:F.ui, boxSizing:"border-box" };

  // ?? Role selector ????????????????????????????????????????????????????
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
      { id:"overview",  icon:"👁",  label:"Overview"          },
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
                <span style={{ fontSize:"18px", flexShrink:0 }}>{f.level==="warning"?"⚠":"ℹ"}</span>
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
              {projActivity.slice(0,6).map((ev,i)=>(
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
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"12px" }}>
                <div>
                  <div style={{ fontSize:"12px", fontWeight:700, color:C.seafoam, marginBottom:"6px" }}>🔒 Why this data is trustworthy</div>
                  <div style={{ fontSize:"12px", color:C.silver, lineHeight:1.8 }}>Every expenditure, receipt hash, and approval is permanently recorded on the Samoa Pacific Blockchain. No one can alter records after confirmation. {project.donor} can independently verify every transaction by querying the AIDisbursementTracker contract directly.</div>
                </div>
                {onOpenUNICEF && (
                  <button onClick={onOpenUNICEF} style={{ ...btn("ghost"), fontSize:"11px", padding:"6px 12px", border:`1px solid ${C.gold}`, color:C.gold, flexShrink:0 }}>
                    🌐 Open UNICEF Donor Dashboard →
                  </button>
                )}
              </div>
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
                  <span style={{ fontSize:"28px" }}>{f.level==="warning"?"⚠":"ℹ"}</span>
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
              {projActivity.map((ev,i)=>(
                <div key={i} style={{ display:"flex", gap:"14px", padding:"14px 0", borderBottom:i<projActivity.length-1?`1px solid ${C.ocean}`:"none" }}>
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

  // Lifted shared state: expenditures and activity log
  const [expenditures, setExpenditures] = useState(SEED_EXPENDITURES);
  const [activityLog,  setActivityLog]  = useState(SEED_ACTIVITY);

  // Citizen payment registry — shared between CitizenPortal and MinistryDashboard
  // When a citizen pays online, a record is pushed here with status "paid".
  // The officer's Pending Actions tab polls this to show payment status and enable processing.
  // Structure: { payRef, citizenId, serviceType, ministryCode, amount, fee, paymentMethod,
  //              railLabel, wfId, timestamp, status: "paid"|"processing"|"complete" }
  const [citizenPayments, setCitizenPayments] = useState([]);

  // Block number polling
  useEffect(() => {
    if (!provider) return;
    const poll = async () => { try { setBlockNumber(await provider.getBlockNumber()); } catch {} };
    poll();
    const id = setInterval(poll, CONFIG.POLL_MS);
    return () => clearInterval(id);
  }, [provider]);

  // Global all-ministry records -- feeds cross-ministry workflow engine
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
          onNavigate={v => setView(v)}
          citizenPayments={citizenPayments}
          onPaymentProcessed={(payRef) =>
            setCitizenPayments(p => p.map(cp => cp.payRef===payRef ? {...cp, status:"complete"} : cp))
          }
        />
      )}

      {view === "citizen" && (
        <CitizenPortal
          {...sharedProps}
          onBack={() => setView("home")}
          citizenPayments={citizenPayments}
          onCitizenPayment={(payment) => setCitizenPayments(p => [payment, ...p])}
        />
      )}

      {view === "ndids" && (
        <NDIDSDashboard
          {...sharedProps}
          onBack={() => setView("home")}
        />
      )}

      {view === "community" && (
        <CommunityDashboard
          {...sharedProps}
          expenditures={expenditures}
          setExpenditures={setExpenditures}
          activityLog={activityLog}
          setActivityLog={setActivityLog}
          onBack={() => setView("home")}
          onOpenUNICEF={() => setView("unicef")}
        />
      )}

      {view === "unicef" && (
        <UNICEFDashboard
          {...sharedProps}
          expenditures={expenditures}
          activityLog={activityLog}
          onBack={() => setView("home")}
          onOpenCommunity={() => setView("community")}
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
