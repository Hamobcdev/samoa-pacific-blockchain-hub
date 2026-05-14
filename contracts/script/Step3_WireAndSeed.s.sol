// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/NDIDSRegistry.sol";
import "../src/MinistryNode.sol";
import "../src/AIDisbursementTracker.sol";
import "../src/InteroperabilityHub.sol";

/**
 * @title Step3_WireAndSeed
 * @notice Wires the hub, registers ministries, seeds demo data — 8 transactions
 *
 * Requires Steps 1 and 2 complete. All addresses must be set in .env:
 *   NDIDS_ADDRESS, AID_ADDRESS, HUB_ADDRESS,
 *   CBS_ADDRESS, MCIT_ADDRESS, MOF_ADDRESS,
 *   MCIL_ADDRESS, EDUCATION_ADDRESS, CUSTOMS_ADDRESS
 *
 * Run third:
 *   forge script script/Step3_WireAndSeed.s.sol:Step3_WireAndSeed \
 *     --rpc-url $AMOY_RPC_URL \
 *     --account deployer \
 *     --sender $ADMIN_ADDRESS \
 *     --broadcast \
 *     --with-gas-price 50gwei \
 *     -vvvv
 */
contract Step3_WireAndSeed is Script {
    function run() external {
        address adminAddr      = vm.envAddress("ADMIN_ADDRESS");
        address ndidsAddr      = vm.envAddress("NDIDS_ADDRESS");
        address aidAddr        = vm.envAddress("AID_ADDRESS");
        address hubAddr        = vm.envAddress("HUB_ADDRESS");
        address cbsAddr        = vm.envAddress("CBS_ADDRESS");
        address mcitAddr       = vm.envAddress("MCIT_ADDRESS");
        address mofAddr        = vm.envAddress("MOF_ADDRESS");
        address mcilAddr       = vm.envAddress("MCIL_ADDRESS");
        address educationAddr  = vm.envAddress("EDUCATION_ADDRESS");
        address customsAddr    = vm.envAddress("CUSTOMS_ADDRESS");
        address sbsAddr        = vm.envAddress("SBS_ADDRESS");

        NDIDSRegistry         ndids      = NDIDSRegistry(ndidsAddr);
        AIDisbursementTracker aidTracker = AIDisbursementTracker(aidAddr);
        InteroperabilityHub   hub        = InteroperabilityHub(hubAddr);

        vm.startBroadcast();

        // Tx 1-6: Wire hub address into each ministry node
        MinistryNode(cbsAddr).setHub(hubAddr);
        require(MinistryNode(cbsAddr).hub() == hubAddr, "CBS: hub not set");

        MinistryNode(mcitAddr).setHub(hubAddr);
        require(MinistryNode(mcitAddr).hub() == hubAddr, "MCIT: hub not set");

        MinistryNode(mofAddr).setHub(hubAddr);
        require(MinistryNode(mofAddr).hub() == hubAddr, "MOF: hub not set");

        MinistryNode(mcilAddr).setHub(hubAddr);
        require(MinistryNode(mcilAddr).hub() == hubAddr, "MCIL: hub not set");

        MinistryNode(educationAddr).setHub(hubAddr);
        require(MinistryNode(educationAddr).hub() == hubAddr, "EDUCATION: hub not set");

        MinistryNode(customsAddr).setHub(hubAddr);
        require(MinistryNode(customsAddr).hub() == hubAddr, "CUSTOMS: hub not set");

        MinistryNode(sbsAddr).setHub(hubAddr);
        require(MinistryNode(sbsAddr).hub() == hubAddr, "SBS: hub not set");

        // Tx 7: Wire NDIDS into hub
        hub.setNDIDS(ndidsAddr);
        require(address(hub.ndids()) == ndidsAddr, "Hub: NDIDS not wired");

        // Tx 8: Wire AID tracker into hub
        hub.setAIDTracker(aidAddr);
        require(address(hub.aidTracker()) == aidAddr, "Hub: AIDTracker not wired");

        // Tx 9: Register all 6 ministries (single tx — internal loop)
        hub.registerMinistry("Central Bank of Samoa",                    "CBS",       cbsAddr);
        hub.registerMinistry("Ministry of Comms and IT",                 "MCIT",      mcitAddr);
        hub.registerMinistry("Ministry of Finance",                      "MOF",       mofAddr);
        hub.registerMinistry("Ministry of Commerce Industry and Labour", "MCIL",      mcilAddr);
        hub.registerMinistry("Ministry of Education Sports and Culture", "EDUCATION", educationAddr);
        hub.registerMinistry("Ministry of Customs and Revenue",          "CUSTOMS",   customsAddr);
        hub.registerMinistry("Samoa Bureau of Statistics",               "SBS",       sbsAddr);

        // ── Observer and Regulatory Node Registration ────────────
        address obsLEGIS  = vm.envOr("OBSERVER_LEGIS",  address(0x1001));
        address obsFINCOM = vm.envOr("OBSERVER_FINCOM", address(0x1002));
        address obsATTGEN = vm.envOr("OBSERVER_ATTGEN", address(0x1003));
        address obsLTC    = vm.envOr("OBSERVER_LTC",    address(0x2001));
        address obsSCOURT = vm.envOr("OBSERVER_SCOURT", address(0x2002));
        address obsELECTC = vm.envOr("OBSERVER_ELECTC", address(0x2003));
        address obsPTO    = vm.envOr("OBSERVER_PTO",    address(0x4020));
        address obsSIFA   = vm.envOr("OBSERVER_SIFA",   address(0x3001));
        address obsAUDIT  = vm.envOr("OBSERVER_AUDIT",  address(0x3002));
        address obsOMBUDS = vm.envOr("OBSERVER_OMBUDS", address(0x3003));
        address obsOOTR   = vm.envOr("OBSERVER_OOTR",   address(0x3004));
        address obsEPC    = vm.envOr("OBSERVER_EPC",    address(0x4001));
        address obsSWA    = vm.envOr("OBSERVER_SWA",    address(0x4002));
        address obsSAA    = vm.envOr("OBSERVER_SAA",    address(0x4003));
        address obsSPA    = vm.envOr("OBSERVER_SPA",    address(0x4004));
        address obsSSC    = vm.envOr("OBSERVER_SSC",    address(0x4005));
        address obsSHC    = vm.envOr("OBSERVER_SHC",    address(0x4006));
        address obsSNPF   = vm.envOr("OBSERVER_SNPF",   address(0x4007));
        address obsACC    = vm.envOr("OBSERVER_ACC",    address(0x4008));
        address obsPAL    = vm.envOr("OBSERVER_PAL",    address(0x4009));
        address obsUTOS   = vm.envOr("OBSERVER_UTOS",   address(0x4010));
        address obsSLAC   = vm.envOr("OBSERVER_SLAC",   address(0x4011));
        address obsSTEC   = vm.envOr("OBSERVER_STEC",   address(0x4012));
        address obsSFES   = vm.envOr("OBSERVER_SFES",   address(0x4013));
        address obsSSFA   = vm.envOr("OBSERVER_SSFA",   address(0x4014));
        address obsSEA    = vm.envOr("OBSERVER_SEA",    address(0x4015));
        address obsGCA    = vm.envOr("OBSERVER_GCA",    address(0x4016));
        address obsNKF    = vm.envOr("OBSERVER_NKF",    address(0x4017));
        address obsSROS   = vm.envOr("OBSERVER_SROS",   address(0x4018));
        address obsPOST   = vm.envOr("OBSERVER_POST",   address(0x4019));

        // Legislative branch
        hub.registerObserver(obsLEGIS,  "Legislative Assembly of Samoa",          InteroperabilityHub.GovBranch.LEGISLATIVE);
        hub.registerObserver(obsFINCOM, "Parliamentary Finance Committee",         InteroperabilityHub.GovBranch.LEGISLATIVE);
        hub.registerObserver(obsATTGEN, "Office of the Attorney General",          InteroperabilityHub.GovBranch.LEGISLATIVE);

        // Judicial branch
        hub.registerObserver(obsLTC,    "Land and Titles Court",                   InteroperabilityHub.GovBranch.JUDICIAL);
        hub.registerObserver(obsSCOURT, "Supreme Court of Samoa",                  InteroperabilityHub.GovBranch.JUDICIAL);
        hub.registerObserver(obsELECTC, "Office of the Electoral Commissioner",    InteroperabilityHub.GovBranch.JUDICIAL);
        hub.registerObserver(obsPTO,    "Public Trust Office",                     InteroperabilityHub.GovBranch.JUDICIAL);

        // Regulatory authorities
        // SIFA: Public Trading Body reclassified 2020 — generates revenue + regulatory role
        hub.registerObserver(obsSIFA,   "Samoa International Finance Authority",   InteroperabilityHub.GovBranch.REGULATORY);
        hub.registerObserver(obsAUDIT,  "Samoa Audit Office",                      InteroperabilityHub.GovBranch.REGULATORY);
        hub.registerObserver(obsOMBUDS, "Office of the Ombudsman",                 InteroperabilityHub.GovBranch.REGULATORY);
        // OOTR: Telecom, broadcast, spectrum regulator — under MCIT but functions independently
        hub.registerObserver(obsOOTR,   "Office of the Regulator",                 InteroperabilityHub.GovBranch.REGULATORY);

        // Public trading bodies (SOE observers)
        hub.registerObserver(obsEPC,    "Electric Power Corporation",              InteroperabilityHub.GovBranch.SOE);
        hub.registerObserver(obsSWA,    "Samoa Water Authority",                   InteroperabilityHub.GovBranch.SOE);
        hub.registerObserver(obsSAA,    "Samoa Airport Authority",                 InteroperabilityHub.GovBranch.SOE);
        hub.registerObserver(obsSPA,    "Samoa Ports Authority",                   InteroperabilityHub.GovBranch.SOE);
        hub.registerObserver(obsSSC,    "Samoa Shipping Corporation",              InteroperabilityHub.GovBranch.SOE);
        hub.registerObserver(obsSHC,    "Samoa Housing Corporation",               InteroperabilityHub.GovBranch.SOE);
        hub.registerObserver(obsSNPF,   "Samoa National Provident Fund",           InteroperabilityHub.GovBranch.SOE);
        hub.registerObserver(obsACC,    "Accident Compensation Corporation",       InteroperabilityHub.GovBranch.SOE);
        // PAL: Operates as Samoa Airways — PAL is the legal entity
        hub.registerObserver(obsPAL,    "Polynesian Airlines Ltd",                 InteroperabilityHub.GovBranch.SOE);
        hub.registerObserver(obsUTOS,   "Unit Trust of Samoa",                     InteroperabilityHub.GovBranch.SOE);
        hub.registerObserver(obsSLAC,   "Samoa Life Assurance Corporation",        InteroperabilityHub.GovBranch.SOE);
        hub.registerObserver(obsSTEC,   "Samoa Trust Estates Corporation",         InteroperabilityHub.GovBranch.SOE);
        hub.registerObserver(obsPOST,   "Samoa Post",                              InteroperabilityHub.GovBranch.SOE);

        // Public beneficial bodies (observer)
        hub.registerObserver(obsSFES,   "Samoa Fire and Emergency Services",       InteroperabilityHub.GovBranch.SOE);
        hub.registerObserver(obsSSFA,   "Samoa Sports Facilities Authority",       InteroperabilityHub.GovBranch.SOE);
        hub.registerObserver(obsSEA,    "Samoa Export Authority",                  InteroperabilityHub.GovBranch.SOE);
        hub.registerObserver(obsGCA,    "Gambling Control Authority",              InteroperabilityHub.GovBranch.SOE);
        hub.registerObserver(obsNKF,    "National Kidney Foundation of Samoa",     InteroperabilityHub.GovBranch.SOE);
        hub.registerObserver(obsSROS,   "Scientific Research Organisation of Samoa", InteroperabilityHub.GovBranch.SOE);

        // Tx 4-8: Seed 5 demo citizens with Education node access
        for (uint256 i = 0; i < 5; i++) {
            bytes32 h = keccak256(abi.encodePacked("SAMOA_DEMO_CITIZEN_", i));
            ndids.registerCitizen(h);
            ndids.grantReadAccess(h, educationAddr);
        }

        // Tx 9: Create UNICEF demo grant
        string[] memory milestones = new string[](3);
        milestones[0] = "Programme setup and capacity training complete";
        milestones[1] = "50 children enrolled with verified attendance";
        milestones[2] = "End-of-term outcomes documented and verified";

        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 1000;
        amounts[1] = 1500;
        amounts[2] = 2000;
        aidTracker.createGrant(
            bytes32("WST"),
            uint8(2),
            educationAddr,
            "UNICEF Samoa Education Access Programme 2025",
            amounts
        );

        // Tx 10: Release first tranche
        aidTracker.releaseTranche(0, 0);

        vm.stopBroadcast();

        console.log("=== STEP 3 COMPLETE - FULL DEPLOYMENT DONE ===");
        console.log("");
        console.log("=== PASTE INTO frontend/src/contracts.js ===");
        console.log("NDIDS:     ", ndidsAddr);
        console.log("HUB:       ", hubAddr);
        console.log("AID:       ", aidAddr);
        console.log("CBS:       ", cbsAddr);
        console.log("MCIT:      ", mcitAddr);
        console.log("MOF:       ", mofAddr);
        console.log("EDUCATION: ", educationAddr);
        console.log("CUSTOMS:   ", customsAddr);
        console.log("SBS:       ", sbsAddr);
        console.log("");
        console.log("Verify on Polygonscan:");
        console.log("https://amoy.polygonscan.com/address/", hubAddr);

        // Suppress unused variable warnings
        adminAddr;
        mcilAddr;
    }
}
