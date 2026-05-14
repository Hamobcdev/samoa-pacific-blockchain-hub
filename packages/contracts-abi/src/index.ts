// Copied from frontend/src/App.jsx (ABI object, line 267) — DO NOT modify the monolith.
// Human-readable ABI format (ethers.js Fragment strings).

export const NDIDS_ABI = [
  "function totalRegistered() view returns (uint256)",
  "function isRegistered(bytes32) view returns (bool)",
  "function hasAccess(bytes32, address) view returns (bool)",
  "function serviceCount(bytes32) view returns (uint256)",
  "function registerCitizen(bytes32 citizenHash) external",
  "function batchRegister(bytes32[] hashes) external",
  "event CitizenRegistered(bytes32 indexed citizenHash, uint256 timestamp)",
] as const;

export const AID_ABI = [
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
] as const;

export const HUB_ABI = [
  "function getMinistryCount() view returns (uint256)",
  "function getAllMinistries() view returns (tuple(string name, string code, address contractAddr, bool active, uint256 registeredAt)[])",
  "function getPermissions() view returns (tuple(string fromCode, string toCode, bool active, uint256 grantedAt)[])",
  "function getWorkflowLog() view returns (tuple(string workflowType, bytes32 citizenHash, string ministryCode, uint256 timestamp, bool success)[])",
] as const;

export const MINISTRY_ABI = [
  "function totalRecords() view returns (uint256)",
  "function ministryName() view returns (string)",
  "function ministryCode() view returns (string)",
  "function authorisedReaders(address) view returns (bool)",
  "function recordService(bytes32 citizenHash, string serviceType, bytes32 dataHash, bool ndidsVerified) external",
  "function authoriseReader(address reader) external",
  "function revokeReader(address reader) external",
] as const;

export { ADDR, ADDR_EXTENDED } from './addresses';
export type { ContractKey, ExtendedContractKey } from './addresses';
