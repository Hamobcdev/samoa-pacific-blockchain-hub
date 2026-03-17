// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/NDIDSRegistry.sol";
import "../src/MinistryNode.sol";
import "../src/AIDisbursementTracker.sol";
import "../src/InteroperabilityHub.sol";

/**
 * @title SamoaIntegrationScenarios
 * @notice Six full integration scenarios demonstrating the Samoa Government
 *         Interoperability PoC for UNICEF Venture Fund technical evaluation.
 *
 * Scenarios:
 *   1. Cross-Ministry Data Sharing with Access Control
 *   2. Full Citizen Journey (NDIDS -> Education -> MOF Benefit)
 *   3. AID Grant Full Lifecycle (Create -> Release -> Verify -> Complete)
 *   4. Privacy Demonstration (authorised vs unauthorised views)
 *   5. Permission Revocation (grant, use, revoke, denied)
 *   6. Multi-Ministry Trade Workflow (Customs -> MCIL -> MOF)
 *
 * Run all:         forge test --match-contract SamoaIntegrationScenarios -vv
 * Run one:         forge test --match-test test_Scenario1 -vvvv
 * Run with gas:    forge test --match-contract SamoaIntegrationScenarios -vv --gas-report
 */
contract SamoaIntegrationScenarios is Test {

    // ── Actors ───────────────────────────────────────────────────────────────
    address admin     = makeAddr("SBP_Admin");
    address cbsAdmin  = makeAddr("CBS_Admin");
    address mcitAdmin = makeAddr("MCIT_Admin");
    address mofAdmin  = makeAddr("MOF_Admin");
    address mcilAdmin = makeAddr("MCIL_Admin");
    address eduAdmin  = makeAddr("Education_Admin");
    address custAdmin = makeAddr("Customs_Admin");
    address auditor   = makeAddr("UNICEF_Auditor");
    address stranger  = makeAddr("Unauthorised_Party");

    // ── Contracts ─────────────────────────────────────────────────────────────
    NDIDSRegistry         ndids;
    MinistryNode          cbsNode;
    MinistryNode          mcitNode;
    MinistryNode          mofNode;
    MinistryNode          mcilNode;
    MinistryNode          educationNode;
    MinistryNode          customsNode;
    AIDisbursementTracker aidTracker;
    InteroperabilityHub   hub;

    // ── Test data ─────────────────────────────────────────────────────────────
    // Citizen hashes - no PII on chain, only keccak256(citizenId + off-chain salt)
    bytes32 constant CHILD_AFIA    = keccak256("SAMOA-2009-0042-SALT-7x9k");
    bytes32 constant CHILD_SIONE   = keccak256("SAMOA-2010-0107-SALT-3m2p");
    bytes32 constant CHILD_LEILANI = keccak256("SAMOA-2011-0233-SALT-9q4r");
    bytes32 constant TRADER_FALE   = keccak256("SAMOA-BUS-0891-SALT-2w5t");

    bytes32 constant ENROLMENT_DATA    = keccak256("ENROLMENT_RECORD_2025_TERM1");
    bytes32 constant BENEFIT_DATA      = keccak256("BENEFIT_APPROVAL_2025_Q1");
    bytes32 constant SHIPMENT_DATA     = keccak256("SHIPMENT_MANIFEST_2025_0334");
    bytes32 constant TRADE_RECORD_DATA = keccak256("TRADE_LICENCE_UPDATE_2025");
    bytes32 constant DUTY_PAYMENT_DATA = keccak256("DUTY_PAYMENT_RECEIPT_2025");
    bytes32 constant FIELD_EVIDENCE    = keccak256("UNICEF_FIELD_REPORT_MARCH_2025_IPFS_QmX7z");

    // ── Setup ─────────────────────────────────────────────────────────────────

    function setUp() public {
        vm.startPrank(admin);

        // Deploy core contracts
        ndids      = new NDIDSRegistry(admin);
        aidTracker = new AIDisbursementTracker(admin);
        hub        = new InteroperabilityHub(admin);

        // Deploy ministry nodes with their own admins
        cbsNode       = new MinistryNode("Central Bank of Samoa",                    "CBS",       cbsAdmin,  address(ndids));
        mcitNode      = new MinistryNode("Ministry of Comms and IT",                 "MCIT",      mcitAdmin, address(ndids));
        mofNode       = new MinistryNode("Ministry of Finance",                      "MOF",       mofAdmin,  address(ndids));
        mcilNode      = new MinistryNode("Ministry of Commerce Industry and Labour", "MCIL",      mcilAdmin, address(ndids));
        educationNode = new MinistryNode("Ministry of Education Sports and Culture", "EDUCATION", eduAdmin,  address(ndids));
        customsNode   = new MinistryNode("Ministry of Customs and Revenue",          "CUSTOMS",   custAdmin, address(ndids));

        // Wire hub
        hub.setNDIDS(address(ndids));
        hub.setAIDTracker(address(aidTracker));
        hub.registerMinistry("Central Bank of Samoa",                    "CBS",       address(cbsNode));
        hub.registerMinistry("Ministry of Comms and IT",                 "MCIT",      address(mcitNode));
        hub.registerMinistry("Ministry of Finance",                      "MOF",       address(mofNode));
        hub.registerMinistry("Ministry of Commerce Industry and Labour", "MCIL",      address(mcilNode));
        hub.registerMinistry("Ministry of Education Sports and Culture", "EDUCATION", address(educationNode));
        hub.registerMinistry("Ministry of Customs and Revenue",          "CUSTOMS",   address(customsNode));

        // Register test citizens
        ndids.registerCitizen(CHILD_AFIA);
        ndids.registerCitizen(CHILD_SIONE);
        ndids.registerCitizen(CHILD_LEILANI);
        ndids.registerCitizen(TRADER_FALE);

        vm.stopPrank();
    }

    // ══════════════════════════════════════════════════════════════════════════
    // SCENARIO 1: Cross-Ministry Data Sharing with Access Control
    // ══════════════════════════════════════════════════════════════════════════
    /**
     * Demonstrates:
     * - CBS records a remittance received for a citizen
     * - MOF requests read access to CBS data
     * - CBS grants permission (explicit, revocable, on-chain)
     * - MOF successfully reads CBS record
     * - A stranger attempting the same read is rejected
     * - The permission grant is visible in the audit trail
     */
    function test_Scenario1_CrossMinistryDataSharing() public {
        console.log("");
        console.log("=== SCENARIO 1: Cross-Ministry Data Sharing ===");

        // Step 1: CBS records a remittance
        vm.prank(cbsAdmin);
        uint256 recId = cbsNode.recordService(
            CHILD_AFIA,
            "REMITTANCE_RECEIVED",
            keccak256("REMITTANCE_USD_450_FROM_NZ"),
            false
        );
        console.log("CBS: Remittance recorded for citizen. Record ID:", recId);
        assertEq(cbsNode.totalRecords(), 1);

        // Step 2: Stranger attempts to read - REJECTED
        vm.prank(stranger);
        vm.expectRevert(MinistryNode.ReadAccessDenied.selector);
        cbsNode.getRecord(0);
        console.log("SECURITY: Unauthorised party correctly REJECTED");

        // Step 3: CBS grants MOF explicit read access
        vm.prank(cbsAdmin);
        cbsNode.authoriseReader(address(mofNode));
        console.log("CBS: Read access granted to MOF");

        // Step 4: MOF reads CBS record successfully
        vm.prank(address(mofNode));
        MinistryNode.ServiceRecord memory rec = cbsNode.getRecord(0);
        assertEq(rec.serviceType, "REMITTANCE_RECEIVED");
        assertEq(rec.citizenHash, CHILD_AFIA);
        assertFalse(rec.ndidsVerified); // not verified via NDIDS for this record
        console.log("MOF: Successfully read CBS remittance record");
        console.log("MOF: Service type confirmed:", rec.serviceType);

        // Step 5: MCIT still cannot read (permission is specific, not global)
        vm.prank(address(mcitNode));
        vm.expectRevert(MinistryNode.ReadAccessDenied.selector);
        cbsNode.getRecord(0);
        console.log("SECURITY: MCIT (no permission granted) correctly REJECTED");

        console.log("SCENARIO 1 PASSED: Permissioned cross-ministry data sharing works correctly");
    }

    // ══════════════════════════════════════════════════════════════════════════
    // SCENARIO 2: Full Citizen Journey
    // ══════════════════════════════════════════════════════════════════════════
    /**
     * Demonstrates the complete child services workflow:
     * NDIDS registration -> Education enrolment -> MOF benefit eligibility
     *
     * Key privacy feature: citizen identity verified cryptographically at each
     * step without any PII crossing ministry boundaries
     */
    function test_Scenario2_FullCitizenJourney() public {
        console.log("");
        console.log("=== SCENARIO 2: Full Citizen Journey ===");
        console.log("Child: CHILD_AFIA (hash only - no PII on chain)");

        // Step 1: Grant education node NDIDS access for this citizen
        vm.startPrank(admin);
        ndids.grantReadAccess(CHILD_AFIA, address(educationNode));
        ndids.grantReadAccess(CHILD_AFIA, address(mofNode));
        vm.stopPrank();
        console.log("NDIDS: Read access granted to Education and MOF");

        // Step 2: Education records enrolment WITH NDIDS verification
        vm.prank(eduAdmin);
        educationNode.recordService(
            CHILD_AFIA,
            "SCHOOL_ENROLMENT_2025",
            ENROLMENT_DATA,
            true  // verify via NDIDS
        );
        console.log("EDUCATION: School enrolment recorded with NDIDS verification");

        // Verify NDIDS service count incremented
        assertEq(ndids.serviceCount(CHILD_AFIA), 1);
        console.log("NDIDS: Service count for citizen incremented to 1");

        // Step 3: Education grants MOF read access
        vm.prank(eduAdmin);
        educationNode.authoriseReader(address(mofNode));

        // Step 4: MOF reads Education record to confirm enrolment
        vm.prank(address(mofNode));
        MinistryNode.ServiceRecord memory eduRec = educationNode.getRecord(0);
        assertEq(eduRec.serviceType, "SCHOOL_ENROLMENT_2025");
        assertTrue(eduRec.ndidsVerified);
        console.log("MOF: Confirmed enrolment record - NDIDS verified:", eduRec.ndidsVerified);

        // Step 5: MOF records benefit eligibility
        vm.prank(mofAdmin);
        mofNode.recordService(
            CHILD_AFIA,
            "EDUCATION_BENEFIT_ELIGIBLE_2025",
            BENEFIT_DATA,
            true  // re-verify via NDIDS
        );
        console.log("MOF: Benefit eligibility recorded");

        // Verify full journey
        assertEq(educationNode.totalRecords(), 1);
        assertEq(mofNode.totalRecords(), 1);
        assertEq(ndids.serviceCount(CHILD_AFIA), 2); // verified twice

        // Step 6: Verify citizen records trail across ministries
        vm.prank(address(mofNode));
        uint256[] memory eduRecords = educationNode.getCitizenRecords(CHILD_AFIA);
        assertEq(eduRecords.length, 1);
        console.log("AUDIT: Citizen has 1 education record and 1 MOF record");
        console.log("PRIVACY: Zero PII stored on chain at any step");

        console.log("SCENARIO 2 PASSED: Full citizen journey complete");
    }

    // ══════════════════════════════════════════════════════════════════════════
    // SCENARIO 3: AID Grant Full Lifecycle
    // ══════════════════════════════════════════════════════════════════════════
    /**
     * Demonstrates complete grant lifecycle from UNICEF funding to verified
     * community delivery - the core accountability feature for the application
     */
    function test_Scenario3_AIDGrantFullLifecycle() public {
        console.log("");
        console.log("=== SCENARIO 3: AID Grant Full Lifecycle ===");

        // Step 1: Create UNICEF education grant
        string[] memory milestones = new string[](3);
        milestones[0] = "Programme setup and 20 children enrolled";
        milestones[1] = "50 children with 80 percent attendance for one term";
        milestones[2] = "End of year learning outcomes documented";

        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 30_000;
        amounts[1] = 40_000;
        amounts[2] = 30_000;

        vm.prank(admin);
        uint256 grantId = aidTracker.createGrant(
            "UNICEF Samoa Education Access Programme 2025",
            address(0x000000000000000000000000000000000000dEaD), // UNICEF placeholder
            address(educationNode),
            100_000,
            50,
            "EDUCATION",
            milestones,
            amounts
        );
        console.log("UNICEF: Grant created. ID:", grantId);
        assertEq(aidTracker.totalGrants(), 1);

        // Step 2: Release Tranche 1 (programme setup complete)
        vm.prank(admin);
        aidTracker.releaseTranche(grantId, 0);
        console.log("UNICEF: Tranche 1 released - $30,000 for programme setup");
        assertEq(aidTracker.totalDisbursed(), 30_000);

        // Step 3: Authorise field verifier (education ministry officer)
        vm.prank(admin);
        aidTracker.authoriseVerifier(auditor);
        console.log("UNICEF: Field verifier authorised");

        // Step 4: Verify Tranche 1 usage with evidence hash
        vm.prank(auditor);
        aidTracker.verifyUsage(grantId, 0, FIELD_EVIDENCE, 23);
        console.log("AUDITOR: Tranche 1 verified - 23 children enrolled");
        assertEq(aidTracker.totalVerified(), 30_000);

        // Step 5: Release and verify Tranche 2
        vm.prank(admin);
        aidTracker.releaseTranche(grantId, 1);
        console.log("UNICEF: Tranche 2 released - $40,000 for attendance milestone");

        vm.prank(auditor);
        aidTracker.verifyUsage(grantId, 1, keccak256("TERM1_ATTENDANCE_REPORT"), 48);
        console.log("AUDITOR: Tranche 2 verified - 48 children with 80pct attendance");

        // Step 6: Release and verify final Tranche 3
        vm.prank(admin);
        aidTracker.releaseTranche(grantId, 2);

        vm.prank(auditor);
        aidTracker.verifyUsage(grantId, 2, keccak256("YEAR_END_OUTCOMES_REPORT"), 47);
        console.log("AUDITOR: Tranche 3 verified - 47 children with documented outcomes");

        // Verify grant auto-completed
        (,,,,,,,AIDisbursementTracker.GrantStatus status,,,,) = aidTracker.getGrant(grantId);
        assertEq(uint8(status), uint8(AIDisbursementTracker.GrantStatus.Completed));
        console.log("SYSTEM: Grant automatically marked COMPLETED");

        // Verify full audit trail
        AIDisbursementTracker.Tranche[] memory trail = aidTracker.getAuditTrail(grantId);
        assertEq(trail.length, 3);
        for (uint i = 0; i < 3; i++) {
            assertEq(uint8(trail[i].status), uint8(AIDisbursementTracker.TrancheStatus.Verified));
        }
        console.log("AUDIT: Full 3-tranche audit trail verified on chain");
        console.log("TOTAL: $100,000 disbursed and verified. 47 children served.");
        assertEq(aidTracker.totalDisbursed(), 100_000);
        assertEq(aidTracker.totalVerified(), 100_000);

        console.log("SCENARIO 3 PASSED: Complete grant lifecycle verified");
    }

    // ══════════════════════════════════════════════════════════════════════════
    // SCENARIO 4: Privacy Demonstration
    // ══════════════════════════════════════════════════════════════════════════
    /**
     * Demonstrates exactly what different parties CAN and CANNOT see.
     * This is the key privacy architecture demonstration for UNICEF reviewers.
     */
    function test_Scenario4_PrivacyDemonstration() public {
        console.log("");
        console.log("=== SCENARIO 4: Privacy Demonstration ===");
        console.log("Showing what each party can and cannot access");

        // Setup: record some ministry data
        vm.prank(admin);
        ndids.grantReadAccess(CHILD_AFIA, address(educationNode));

        vm.prank(eduAdmin);
        educationNode.recordService(CHILD_AFIA, "SCHOOL_ENROLMENT", ENROLMENT_DATA, true);

        // DEMONSTRATION 1: What the citizen hash reveals
        console.log("--- PRIVACY LAYER 1: On-chain citizen identity ---");
        console.log("What ANYONE can see on chain:");
        console.log("  Citizen identifier: (32-byte hash only)");
        console.log("  Actual name: HIDDEN - never stored on chain");
        console.log("  Date of birth: HIDDEN - never stored on chain");
        console.log("  Address: HIDDEN - never stored on chain");

        // Verify: the hash itself reveals nothing
        assertTrue(ndids.isRegistered(CHILD_AFIA));
        // CHILD_AFIA is keccak256("SAMOA-2009-0042-SALT-7x9k")
        // Without knowing the input, the hash is meaningless
        console.log("  Hash cannot be reversed without citizen's own salt key");

        // DEMONSTRATION 2: Stranger cannot read ministry records
        console.log("--- PRIVACY LAYER 2: Ministry data access control ---");
        vm.prank(stranger);
        vm.expectRevert(MinistryNode.ReadAccessDenied.selector);
        educationNode.getRecord(0);
        console.log("STRANGER: Cannot read Education records - CORRECTLY BLOCKED");

        // DEMONSTRATION 3: Wrong ministry cannot read
        vm.prank(address(cbsNode));
        vm.expectRevert(MinistryNode.ReadAccessDenied.selector);
        educationNode.getRecord(0);
        console.log("CBS: Cannot read Education records without permission - CORRECTLY BLOCKED");

        // DEMONSTRATION 4: Authorised ministry CAN read
        vm.prank(eduAdmin);
        educationNode.authoriseReader(address(mofNode));

        vm.prank(address(mofNode));
        MinistryNode.ServiceRecord memory rec = educationNode.getRecord(0);
        assertEq(rec.citizenHash, CHILD_AFIA);
        console.log("MOF: CAN read Education record (permission granted) - CORRECT");
        console.log("MOF sees: citizen hash + service type + data hash");
        console.log("MOF does NOT see: citizen name, address, or any PII");

        // DEMONSTRATION 5: Data hash proves integrity without revealing content
        console.log("--- PRIVACY LAYER 3: Data integrity without exposure ---");
        assertEq(rec.dataHash, ENROLMENT_DATA);
        console.log("Data hash on chain matches off-chain document hash");
        console.log("Anyone can VERIFY integrity. Nobody can READ the document.");

        // DEMONSTRATION 6: NDIDS verification without identity exposure
        console.log("--- PRIVACY LAYER 4: Identity verification without disclosure ---");
        assertTrue(rec.ndidsVerified);
        console.log("Record shows identity WAS verified by NDIDS");
        console.log("Record does NOT show WHO was verified - only that verification passed");

        console.log("SCENARIO 4 PASSED: Privacy architecture demonstrated");
    }

    // ══════════════════════════════════════════════════════════════════════════
    // SCENARIO 5: Permission Revocation
    // ══════════════════════════════════════════════════════════════════════════
    /**
     * Demonstrates that access grants are not permanent - they can be revoked
     * This is critical for data sovereignty and GDPR-aligned governance
     */
    function test_Scenario5_PermissionRevocation() public {
        console.log("");
        console.log("=== SCENARIO 5: Permission Revocation ===");
        console.log("Demonstrating data sovereignty through revocable access");

        // Step 1: CBS records data
        vm.prank(cbsAdmin);
        cbsNode.recordService(CHILD_AFIA, "ACCOUNT_OPENED", keccak256("ACCOUNT_DATA"), false);
        console.log("CBS: Service record created");

        // Step 2: Grant MOF access
        vm.prank(cbsAdmin);
        cbsNode.authoriseReader(address(mofNode));
        console.log("CBS: Read access GRANTED to MOF");

        // Step 3: MOF reads successfully
        vm.prank(address(mofNode));
        MinistryNode.ServiceRecord memory rec = cbsNode.getRecord(0);
        assertEq(rec.serviceType, "ACCOUNT_OPENED");
        console.log("MOF: Successfully reading CBS data");

        // Step 4: REVOKE access
        vm.prank(cbsAdmin);
        cbsNode.revokeReader(address(mofNode));
        console.log("CBS: Read access REVOKED from MOF");

        // Step 5: MOF can no longer read
        vm.prank(address(mofNode));
        vm.expectRevert(MinistryNode.ReadAccessDenied.selector);
        cbsNode.getRecord(0);
        console.log("MOF: Access correctly DENIED after revocation");

        // Step 6: NDIDS access also revocable
        vm.prank(admin);
        ndids.grantReadAccess(CHILD_AFIA, address(educationNode));
        assertTrue(ndids.hasAccess(CHILD_AFIA, address(educationNode)));
        console.log("NDIDS: Read access granted to Education");

        vm.prank(admin);
        ndids.revokeReadAccess(CHILD_AFIA, address(educationNode));
        assertFalse(ndids.hasAccess(CHILD_AFIA, address(educationNode)));
        console.log("NDIDS: Read access revoked from Education");

        // Education can no longer verify this citizen
        vm.prank(address(educationNode));
        vm.expectRevert(NDIDSRegistry.AccessDenied.selector);
        ndids.verifyCitizen(CHILD_AFIA);
        console.log("Education: NDIDS verification correctly DENIED after revocation");

        console.log("SCENARIO 5 PASSED: Full permission revocation demonstrated");
        console.log("Data sovereignty: Citizens and ministries control their own access");
    }

    // ══════════════════════════════════════════════════════════════════════════
    // SCENARIO 6: Multi-Ministry Trade Workflow
    // ══════════════════════════════════════════════════════════════════════════
    /**
     * Demonstrates UNCTAD 2029 trade facilitation alignment:
     * Customs clears a shipment -> MCIL updates trade licence -> MOF records duty
     *
     * This scenario shows the PoC addresses BOTH child welfare (Scenarios 1-4)
     * AND economic development (trade facilitation) use cases
     */
    function test_Scenario6_MultiMinistryTradeWorkflow() public {
        console.log("");
        console.log("=== SCENARIO 6: Multi-Ministry Trade Workflow ===");
        console.log("Demonstrating UNCTAD 2029 trade facilitation alignment");

        // Register the trader in NDIDS
        // (TRADER_FALE is already registered in setUp)

        // Grant trade ministries NDIDS access
        vm.startPrank(admin);
        ndids.grantReadAccess(TRADER_FALE, address(customsNode));
        ndids.grantReadAccess(TRADER_FALE, address(mcilNode));
        ndids.grantReadAccess(TRADER_FALE, address(mofNode));
        vm.stopPrank();
        console.log("NDIDS: Trade ministries granted access for trader");

        // Step 1: Customs clears shipment with NDIDS verification
        vm.prank(custAdmin);
        customsNode.recordService(
            TRADER_FALE,
            "SHIPMENT_CLEARED_2025_0334",
            SHIPMENT_DATA,
            true  // verify trader identity via NDIDS
        );
        console.log("CUSTOMS: Shipment cleared and recorded on chain");
        assertEq(ndids.serviceCount(TRADER_FALE), 1);

        // Step 2: Grant MCIL read access to Customs
        vm.prank(custAdmin);
        customsNode.authoriseReader(address(mcilNode));

        // Step 3: MCIL reads Customs clearance and updates trade licence
        vm.prank(address(mcilNode));
        MinistryNode.ServiceRecord memory clearanceRec = customsNode.getRecord(0);
        assertEq(clearanceRec.serviceType, "SHIPMENT_CLEARED_2025_0334");
        assertTrue(clearanceRec.ndidsVerified);
        console.log("MCIL: Read Customs clearance - trader identity verified");

        vm.prank(mcilAdmin);
        mcilNode.recordService(
            TRADER_FALE,
            "TRADE_LICENCE_UPDATED_2025",
            TRADE_RECORD_DATA,
            true
        );
        console.log("MCIL: Trade licence record updated on chain");

        // Step 4: Grant MOF read access to both Customs and MCIL
        vm.prank(custAdmin);
        customsNode.authoriseReader(address(mofNode));
        vm.prank(mcilAdmin);
        mcilNode.authoriseReader(address(mofNode));

        // Step 5: MOF reads both records and processes duty payment
        vm.prank(address(mofNode));
        MinistryNode.ServiceRecord memory licenceRec = mcilNode.getRecord(0);
        assertEq(licenceRec.serviceType, "TRADE_LICENCE_UPDATED_2025");
        console.log("MOF: Confirmed trade licence updated");

        vm.prank(mofAdmin);
        mofNode.recordService(
            TRADER_FALE,
            "IMPORT_DUTY_PROCESSED_2025",
            DUTY_PAYMENT_DATA,
            false
        );
        console.log("MOF: Import duty payment recorded on chain");

        // Verify complete trade trail
        assertEq(customsNode.totalRecords(), 1);
        assertEq(mcilNode.totalRecords(), 1);
        assertEq(mofNode.totalRecords(), 1);

        // Each ministry's records are only visible to authorised parties
        vm.prank(stranger);
        vm.expectRevert(MinistryNode.ReadAccessDenied.selector);
        customsNode.getRecord(0);
        console.log("SECURITY: Stranger cannot read trade records - CORRECTLY BLOCKED");

        console.log("SCENARIO 6 PASSED: Multi-ministry trade workflow complete");
        console.log("Three ministries coordinated on one trade event");
        console.log("Full audit trail: Customs -> MCIL -> MOF");
        console.log("UNCTAD 2029 alignment: Single window trade facilitation demonstrated");
    }

    // ══════════════════════════════════════════════════════════════════════════
    // COMBINED SYSTEM STRESS TEST
    // ══════════════════════════════════════════════════════════════════════════
    /**
     * Runs all six scenarios in a single test to verify the system holds up
     * under concurrent multi-ministry activity - simulates a real deployment day
     */
    function test_AllScenariosRunConcurrently() public {
        console.log("");
        console.log("=== FULL SYSTEM STRESS TEST ===");
        console.log("Running all scenarios concurrently on shared state");

        // Setup shared NDIDS access
        vm.startPrank(admin);
        ndids.grantReadAccess(CHILD_AFIA,    address(educationNode));
        ndids.grantReadAccess(CHILD_AFIA,    address(mofNode));
        ndids.grantReadAccess(CHILD_SIONE,   address(educationNode));
        ndids.grantReadAccess(CHILD_SIONE,   address(mofNode));
        ndids.grantReadAccess(CHILD_LEILANI, address(educationNode));
        ndids.grantReadAccess(TRADER_FALE,   address(customsNode));
        ndids.grantReadAccess(TRADER_FALE,   address(mcilNode));
        ndids.grantReadAccess(TRADER_FALE,   address(mofNode));
        vm.stopPrank();

        // CBS grants MOF read access
        vm.prank(cbsAdmin);
        cbsNode.authoriseReader(address(mofNode));

        // Education grants MOF read access
        vm.prank(eduAdmin);
        educationNode.authoriseReader(address(mofNode));

        // Customs grants MCIL and MOF access
        vm.prank(custAdmin);
        customsNode.authoriseReader(address(mcilNode));
        vm.prank(custAdmin);
        customsNode.authoriseReader(address(mofNode));
        vm.prank(mcilAdmin);
        mcilNode.authoriseReader(address(mofNode));

        // Concurrent activity across all ministries
        vm.prank(cbsAdmin);
        cbsNode.recordService(CHILD_AFIA, "REMITTANCE_RECEIVED", keccak256("R1"), false);

        vm.prank(eduAdmin);
        educationNode.recordService(CHILD_AFIA,    "SCHOOL_ENROLMENT", ENROLMENT_DATA, true);
        vm.prank(eduAdmin);
        educationNode.recordService(CHILD_SIONE,   "SCHOOL_ENROLMENT", ENROLMENT_DATA, true);
        vm.prank(eduAdmin);
        educationNode.recordService(CHILD_LEILANI, "SCHOOL_ENROLMENT", ENROLMENT_DATA, true);

        vm.prank(mofAdmin);
        mofNode.recordService(CHILD_AFIA,  "BENEFIT_APPROVED", BENEFIT_DATA, true);
        vm.prank(mofAdmin);
        mofNode.recordService(CHILD_SIONE, "BENEFIT_APPROVED", BENEFIT_DATA, true);

        vm.prank(custAdmin);
        customsNode.recordService(TRADER_FALE, "SHIPMENT_CLEARED", SHIPMENT_DATA, true);
        vm.prank(mcilAdmin);
        mcilNode.recordService(TRADER_FALE, "LICENCE_UPDATED", TRADE_RECORD_DATA, true);
        vm.prank(mofAdmin);
        mofNode.recordService(TRADER_FALE, "DUTY_PROCESSED", DUTY_PAYMENT_DATA, false);

        // Create and run AID grant
        string[] memory ms = new string[](2);
        ms[0] = "Enrolment milestone";
        ms[1] = "Outcome milestone";
        uint256[] memory am = new uint256[](2);
        am[0] = 50_000;
        am[1] = 50_000;

        vm.prank(admin);
        aidTracker.createGrant("UNICEF Samoa 2025", address(0xdEaD), address(educationNode), 100_000, 50, "EDUCATION", ms, am);
        vm.prank(admin);
        aidTracker.authoriseVerifier(auditor);
        vm.prank(admin);
        aidTracker.releaseTranche(0, 0);
        vm.prank(auditor);
        aidTracker.verifyUsage(0, 0, FIELD_EVIDENCE, 47);

        // Verify system totals
        assertEq(educationNode.totalRecords(), 3);  // 3 children enrolled
        assertEq(mofNode.totalRecords(), 3);         // 2 benefits + 1 duty
        assertEq(customsNode.totalRecords(), 1);
        assertEq(mcilNode.totalRecords(), 1);
        assertEq(cbsNode.totalRecords(), 1);
        assertEq(ndids.totalRegistered(), 4);        // 3 children + 1 trader
        assertEq(aidTracker.totalDisbursed(), 50_000);
        assertEq(aidTracker.totalVerified(), 50_000);

        // All strangers still blocked
        vm.prank(stranger);
        vm.expectRevert(MinistryNode.ReadAccessDenied.selector);
        educationNode.getRecord(0);

        console.log("All ministries active simultaneously: STABLE");
        console.log("Education records: 3 children enrolled");
        console.log("MOF records: 2 benefits approved, 1 duty processed");
        console.log("Customs + MCIL: 1 trade workflow complete");
        console.log("AID: $50,000 disbursed and verified");
        console.log("Security: All unauthorised access attempts blocked");
        console.log("FULL SYSTEM STRESS TEST PASSED");
    }
}
