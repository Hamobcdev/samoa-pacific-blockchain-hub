// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/NDIDSRegistry.sol";
import "../src/MinistryNode.sol";
import "../src/InteroperabilityHub.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

/**
 * @title Step2_MinistryNodes
 * @notice Deploys ministry nodes via UUPS proxy.
 *         Phase 1: 7 original nodes (14 txs).
 *         Phase 2: 18 new OPERATIONAL nodes (36 txs).
 *         Each node receives its own dedicated admin key so that
 *         a single compromised key cannot control all ministries.
 *
 * Requires Step 1 to be complete. Set in .env first:
 *   NDIDS_ADDRESS=0x...
 *   HUB_ADDRESS=0x...      (not used here, kept for Step 3)
 *
 *   # Phase 1 per-ministry admin addresses (must be distinct, non-zero)
 *   ADMIN_CBS=0x...
 *   ADMIN_MCIT=0x...
 *   ADMIN_MOF=0x...
 *   ADMIN_MCIL=0x...
 *   ADMIN_EDUCATION=0x...
 *   ADMIN_CUSTOMS=0x...
 *   ADMIN_SBS=0x...
 *   # Phase 2 executive ministries
 *   ADMIN_MPMC=0x...
 *   ADMIN_MOH=0x...
 *   ADMIN_MWTI=0x...
 *   ADMIN_MOJ=0x...
 *   ADMIN_MOR=0x...
 *   ADMIN_MFAT=0x...
 *   ADMIN_MAF=0x...
 *   ADMIN_MWCSD=0x...
 *   ADMIN_MPE=0x...
 *   ADMIN_MLS=0x...
 *   ADMIN_MNRE=0x...
 *   ADMIN_POLICE=0x...
 *   # Phase 2 public bodies
 *   ADMIN_SQA=0x...
 *   ADMIN_LTA=0x...
 *   ADMIN_NHS=0x...
 *   ADMIN_STA=0x...
 *   # Phase 2 SOEs
 *   ADMIN_DBS=0x...
 *   ADMIN_SLC=0x...
 *
 * Run second:
 *   forge script script/Step2_MinistryNodes.s.sol:Step2_MinistryNodes \
 *     --rpc-url $AMOY_RPC_URL \
 *     --account deployer \
 *     --sender $ADMIN_ADDRESS \
 *     --broadcast \
 *     --verify \
 *     --with-gas-price 50gwei \
 *     -vvvv
 *
 * SAVE THE OUTPUT ADDRESSES — needed for Step 3
 */
contract Step2_MinistryNodes is Script {
    function run() external {
        address ndidsAddr = vm.envAddress("NDIDS_ADDRESS");

        // ── Phase 1: Original 7 nodes ────────────────────────────
        address adminCbs       = vm.envOr("ADMIN_CBS",       address(0));
        address adminMcit      = vm.envOr("ADMIN_MCIT",      address(0));
        address adminMof       = vm.envOr("ADMIN_MOF",       address(0));
        address adminMcil      = vm.envOr("ADMIN_MCIL",      address(0));
        address adminEducation = vm.envOr("ADMIN_EDUCATION", address(0));
        address adminCustoms   = vm.envOr("ADMIN_CUSTOMS",   address(0));
        address adminSbs       = vm.envOr("ADMIN_SBS",       address(0));

        require(adminCbs       != address(0), "Missing env var: ADMIN_CBS");
        require(adminMcit      != address(0), "Missing env var: ADMIN_MCIT");
        require(adminMof       != address(0), "Missing env var: ADMIN_MOF");
        require(adminMcil      != address(0), "Missing env var: ADMIN_MCIL");
        require(adminEducation != address(0), "Missing env var: ADMIN_EDUCATION");
        require(adminCustoms   != address(0), "Missing env var: ADMIN_CUSTOMS");
        require(adminSbs       != address(0), "Missing env var: ADMIN_SBS");

        // ── Phase 2: Executive ministries ───────────────────────
        address adminMpmc   = vm.envOr("ADMIN_MPMC",   address(0));
        address adminMoh    = vm.envOr("ADMIN_MOH",    address(0));
        address adminMwti   = vm.envOr("ADMIN_MWTI",   address(0));
        address adminMoj    = vm.envOr("ADMIN_MOJ",    address(0));
        address adminMor    = vm.envOr("ADMIN_MOR",    address(0));
        address adminMfat   = vm.envOr("ADMIN_MFAT",   address(0));
        address adminMaf    = vm.envOr("ADMIN_MAF",    address(0));
        address adminMwcsd  = vm.envOr("ADMIN_MWCSD",  address(0));
        address adminMpe    = vm.envOr("ADMIN_MPE",    address(0));
        address adminMls    = vm.envOr("ADMIN_MLS",    address(0));
        address adminMnre   = vm.envOr("ADMIN_MNRE",   address(0));
        address adminPolice = vm.envOr("ADMIN_POLICE", address(0));

        require(adminMpmc   != address(0), "Missing env var: ADMIN_MPMC");
        require(adminMoh    != address(0), "Missing env var: ADMIN_MOH");
        require(adminMwti   != address(0), "Missing env var: ADMIN_MWTI");
        require(adminMoj    != address(0), "Missing env var: ADMIN_MOJ");
        require(adminMor    != address(0), "Missing env var: ADMIN_MOR");
        require(adminMfat   != address(0), "Missing env var: ADMIN_MFAT");
        require(adminMaf    != address(0), "Missing env var: ADMIN_MAF");
        require(adminMwcsd  != address(0), "Missing env var: ADMIN_MWCSD");
        require(adminMpe    != address(0), "Missing env var: ADMIN_MPE");
        require(adminMls    != address(0), "Missing env var: ADMIN_MLS");
        require(adminMnre   != address(0), "Missing env var: ADMIN_MNRE");
        require(adminPolice != address(0), "Missing env var: ADMIN_POLICE");

        // ── Phase 2: Public bodies ───────────────────────────────
        address adminSqa = vm.envOr("ADMIN_SQA", address(0));
        address adminLta = vm.envOr("ADMIN_LTA", address(0));
        address adminNhs = vm.envOr("ADMIN_NHS", address(0));
        address adminSta = vm.envOr("ADMIN_STA", address(0));

        require(adminSqa != address(0), "Missing env var: ADMIN_SQA");
        require(adminLta != address(0), "Missing env var: ADMIN_LTA");
        require(adminNhs != address(0), "Missing env var: ADMIN_NHS");
        require(adminSta != address(0), "Missing env var: ADMIN_STA");

        // ── Phase 2: SOEs ────────────────────────────────────────
        address adminDbs = vm.envOr("ADMIN_DBS", address(0));
        address adminSlc = vm.envOr("ADMIN_SLC", address(0));

        require(adminDbs != address(0), "Missing env var: ADMIN_DBS");
        require(adminSlc != address(0), "Missing env var: ADMIN_SLC");

        vm.startBroadcast();

        // ── Phase 1 deployments ──────────────────────────────────
        MinistryNode cbsNode;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory d = abi.encodeWithSelector(MinistryNode.initialize.selector, "Central Bank of Samoa", "CBS", adminCbs, ndidsAddr);
            cbsNode = MinistryNode(address(new ERC1967Proxy(address(impl), d)));
        }

        MinistryNode mcitNode;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory d = abi.encodeWithSelector(MinistryNode.initialize.selector, "Ministry of Communications and Information Technology", "MCIT", adminMcit, ndidsAddr);
            mcitNode = MinistryNode(address(new ERC1967Proxy(address(impl), d)));
        }

        MinistryNode mofNode;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory d = abi.encodeWithSelector(MinistryNode.initialize.selector, "Ministry of Finance", "MOF", adminMof, ndidsAddr);
            mofNode = MinistryNode(address(new ERC1967Proxy(address(impl), d)));
        }

        MinistryNode mcilNode;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory d = abi.encodeWithSelector(MinistryNode.initialize.selector, "Ministry of Commerce Industry and Labour", "MCIL", adminMcil, ndidsAddr);
            mcilNode = MinistryNode(address(new ERC1967Proxy(address(impl), d)));
        }

        MinistryNode educationNode;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory d = abi.encodeWithSelector(MinistryNode.initialize.selector, "Ministry of Education Sports and Culture", "EDUCATION", adminEducation, ndidsAddr);
            educationNode = MinistryNode(address(new ERC1967Proxy(address(impl), d)));
        }

        MinistryNode customsNode;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory d = abi.encodeWithSelector(MinistryNode.initialize.selector, "Ministry of Customs and Revenue", "CUSTOMS", adminCustoms, ndidsAddr);
            customsNode = MinistryNode(address(new ERC1967Proxy(address(impl), d)));
        }

        MinistryNode sbsNode;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory d = abi.encodeWithSelector(MinistryNode.initialize.selector, "Samoa Bureau of Statistics", "SBS", adminSbs, ndidsAddr);
            sbsNode = MinistryNode(address(new ERC1967Proxy(address(impl), d)));
        }

        // ── Phase 2: Executive ministry deployments ──────────────
        MinistryNode mpmcNode;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory d = abi.encodeWithSelector(MinistryNode.initialize.selector, "Prime Minister and Cabinet", "MPMC", adminMpmc, ndidsAddr);
            mpmcNode = MinistryNode(address(new ERC1967Proxy(address(impl), d)));
        }

        MinistryNode mohNode;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory d = abi.encodeWithSelector(MinistryNode.initialize.selector, "Ministry of Health", "MOH", adminMoh, ndidsAddr);
            mohNode = MinistryNode(address(new ERC1967Proxy(address(impl), d)));
        }

        // MWTI: Project verifier for MOF fund release — implements IProjectVerification in Phase 2
        MinistryNode mwtiNode;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory d = abi.encodeWithSelector(MinistryNode.initialize.selector, "Ministry of Works Transport Infrastructure", "MWTI", adminMwti, ndidsAddr);
            mwtiNode = MinistryNode(address(new ERC1967Proxy(address(impl), d)));
        }

        MinistryNode mojNode;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory d = abi.encodeWithSelector(MinistryNode.initialize.selector, "Ministry of Justice Courts Administration", "MOJ", adminMoj, ndidsAddr);
            mojNode = MinistryNode(address(new ERC1967Proxy(address(impl), d)));
        }

        MinistryNode morNode;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory d = abi.encodeWithSelector(MinistryNode.initialize.selector, "Ministry of Revenue", "MOR", adminMor, ndidsAddr);
            morNode = MinistryNode(address(new ERC1967Proxy(address(impl), d)));
        }

        MinistryNode mfatNode;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory d = abi.encodeWithSelector(MinistryNode.initialize.selector, "Ministry of Foreign Affairs and Trade", "MFAT", adminMfat, ndidsAddr);
            mfatNode = MinistryNode(address(new ERC1967Proxy(address(impl), d)));
        }

        MinistryNode mafNode;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory d = abi.encodeWithSelector(MinistryNode.initialize.selector, "Ministry of Agriculture and Fisheries", "MAF", adminMaf, ndidsAddr);
            mafNode = MinistryNode(address(new ERC1967Proxy(address(impl), d)));
        }

        MinistryNode mwcsdNode;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory d = abi.encodeWithSelector(MinistryNode.initialize.selector, "Ministry of Women Community Social Development", "MWCSD", adminMwcsd, ndidsAddr);
            mwcsdNode = MinistryNode(address(new ERC1967Proxy(address(impl), d)));
        }

        // MPE: Governance hub for all 27 public bodies
        MinistryNode mpeNode;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory d = abi.encodeWithSelector(MinistryNode.initialize.selector, "Ministry of Public Enterprises", "MPE", adminMpe, ndidsAddr);
            mpeNode = MinistryNode(address(new ERC1967Proxy(address(impl), d)));
        }

        MinistryNode mlsNode;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory d = abi.encodeWithSelector(MinistryNode.initialize.selector, "Ministry of Lands and Survey", "MLS", adminMls, ndidsAddr);
            mlsNode = MinistryNode(address(new ERC1967Proxy(address(impl), d)));
        }

        MinistryNode mnreNode;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory d = abi.encodeWithSelector(MinistryNode.initialize.selector, "Ministry of Natural Resources Environment", "MNRE", adminMnre, ndidsAddr);
            mnreNode = MinistryNode(address(new ERC1967Proxy(address(impl), d)));
        }

        MinistryNode policeNode;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory d = abi.encodeWithSelector(MinistryNode.initialize.selector, "Samoa Police Service", "POLICE", adminPolice, ndidsAddr);
            policeNode = MinistryNode(address(new ERC1967Proxy(address(impl), d)));
        }

        // ── Phase 2: Public body deployments ────────────────────
        // SQA: Qualification credential registry — links MESC, NUS, NDIDS
        MinistryNode sqaNode;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory d = abi.encodeWithSelector(MinistryNode.initialize.selector, "Samoa Qualifications Authority", "SQA", adminSqa, ndidsAddr);
            sqaNode = MinistryNode(address(new ERC1967Proxy(address(impl), d)));
        }

        // LTA: Vehicle registration, driver licensing — links POLICE, CUSTOMS, MWTI
        MinistryNode ltaNode;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory d = abi.encodeWithSelector(MinistryNode.initialize.selector, "Land Transport Authority", "LTA", adminLta, ndidsAddr);
            ltaNode = MinistryNode(address(new ERC1967Proxy(address(impl), d)));
        }

        // NHS: Health service delivery records — links MOH, NDIDS
        MinistryNode nhsNode;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory d = abi.encodeWithSelector(MinistryNode.initialize.selector, "National Health Services", "NHS", adminNhs, ndidsAddr);
            nhsNode = MinistryNode(address(new ERC1967Proxy(address(impl), d)));
        }

        // STA: Tourism licensing and permits — links MCIL, MFAT
        MinistryNode staNode;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory d = abi.encodeWithSelector(MinistryNode.initialize.selector, "Samoa Tourism Authority", "STA", adminSta, ndidsAddr);
            staNode = MinistryNode(address(new ERC1967Proxy(address(impl), d)));
        }

        // ── Phase 2: SOE deployments ─────────────────────────────
        // DBS: WST-DPI retail distributor — implements ICurrencyRegistry retail layer
        MinistryNode dbsNode;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory d = abi.encodeWithSelector(MinistryNode.initialize.selector, "Development Bank of Samoa", "DBS", adminDbs, ndidsAddr);
            dbsNode = MinistryNode(address(new ERC1967Proxy(address(impl), d)));
        }

        // SLC: Land asset management — 24,000 acres
        MinistryNode slcNode;
        {
            MinistryNode impl = new MinistryNode();
            bytes memory d = abi.encodeWithSelector(MinistryNode.initialize.selector, "Samoa Land Corporation", "SLC", adminSlc, ndidsAddr);
            slcNode = MinistryNode(address(new ERC1967Proxy(address(impl), d)));
        }

        vm.stopBroadcast();

        console.log("=== STEP 2 COMPLETE - SAVE THESE ADDRESSES ===");
        console.log("Phase 1 nodes:");
        console.log("CBS:       ", address(cbsNode));
        console.log("MCIT:      ", address(mcitNode));
        console.log("MOF:       ", address(mofNode));
        console.log("MCIL:      ", address(mcilNode));
        console.log("EDUCATION: ", address(educationNode));
        console.log("CUSTOMS:   ", address(customsNode));
        console.log("SBS:       ", address(sbsNode));
        console.log("Phase 2 executive ministries:");
        console.log("MPMC:      ", address(mpmcNode));
        console.log("MOH:       ", address(mohNode));
        console.log("MWTI:      ", address(mwtiNode));
        console.log("MOJ:       ", address(mojNode));
        console.log("MOR:       ", address(morNode));
        console.log("MFAT:      ", address(mfatNode));
        console.log("MAF:       ", address(mafNode));
        console.log("MWCSD:     ", address(mwcsdNode));
        console.log("MPE:       ", address(mpeNode));
        console.log("MLS:       ", address(mlsNode));
        console.log("MNRE:      ", address(mnreNode));
        console.log("POLICE:    ", address(policeNode));
        console.log("Phase 2 public bodies:");
        console.log("SQA:       ", address(sqaNode));
        console.log("LTA:       ", address(ltaNode));
        console.log("NHS:       ", address(nhsNode));
        console.log("STA:       ", address(staNode));
        console.log("Phase 2 SOEs:");
        console.log("DBS:       ", address(dbsNode));
        console.log("SLC:       ", address(slcNode));
        console.log("");
        console.log("Ministry admins:");
        console.log("  CBS admin:       ", adminCbs);
        console.log("  MCIT admin:      ", adminMcit);
        console.log("  MOF admin:       ", adminMof);
        console.log("  MCIL admin:      ", adminMcil);
        console.log("  EDUCATION admin: ", adminEducation);
        console.log("  CUSTOMS admin:   ", adminCustoms);
        console.log("  SBS admin:       ", adminSbs);
        console.log("");
        console.log("Now add these to your .env before running Step 3:");
        console.log("CBS_ADDRESS=",       address(cbsNode));
        console.log("MCIT_ADDRESS=",      address(mcitNode));
        console.log("MOF_ADDRESS=",       address(mofNode));
        console.log("MCIL_ADDRESS=",      address(mcilNode));
        console.log("EDUCATION_ADDRESS=", address(educationNode));
        console.log("CUSTOMS_ADDRESS=",   address(customsNode));
        console.log("SBS_ADDRESS=",       address(sbsNode));
        console.log("MPMC_ADDRESS=",      address(mpmcNode));
        console.log("MOH_ADDRESS=",       address(mohNode));
        console.log("MWTI_ADDRESS=",      address(mwtiNode));
        console.log("MOJ_ADDRESS=",       address(mojNode));
        console.log("MOR_ADDRESS=",       address(morNode));
        console.log("MFAT_ADDRESS=",      address(mfatNode));
        console.log("MAF_ADDRESS=",       address(mafNode));
        console.log("MWCSD_ADDRESS=",     address(mwcsdNode));
        console.log("MPE_ADDRESS=",       address(mpeNode));
        console.log("MLS_ADDRESS=",       address(mlsNode));
        console.log("MNRE_ADDRESS=",      address(mnreNode));
        console.log("POLICE_ADDRESS=",    address(policeNode));
        console.log("SQA_ADDRESS=",       address(sqaNode));
        console.log("LTA_ADDRESS=",       address(ltaNode));
        console.log("NHS_ADDRESS=",       address(nhsNode));
        console.log("STA_ADDRESS=",       address(staNode));
        console.log("DBS_ADDRESS=",       address(dbsNode));
        console.log("SLC_ADDRESS=",       address(slcNode));
    }
}
