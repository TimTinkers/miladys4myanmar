// SPDX-License-Identifier: LicenseRef-VPL WITH AGPL-3.0-only
pragma solidity ^0.8.25;

import {
  Script, console
} from "forge-std/Script.sol";

import {
  Charity
} from "../src/Charity.sol";

contract Deploy is Script {
  function run () external {

    // Retrieve our configuration details.
    uint256 DEPLOYER_PRIVATE_KEY = vm.envUint("PRIVATE_KEY");
    address DEPLOYER = vm.addr(DEPLOYER_PRIVATE_KEY);
    address CHARITY_ADDRESS = 0x00000000006B5895b591Bd867A7B3D44e101c17a;

    console.log("Environment ...");
    console.log("  - DEPLOYER: %s", DEPLOYER);
    console.log("  - CHARITY_ADDRESS: %s", CHARITY_ADDRESS);
    console.log("--------------------------------");

    // Begin deploying.
    console.log("Runtime ...");
    vm.startBroadcast(DEPLOYER_PRIVATE_KEY);
    Charity charity = Charity(CHARITY_ADDRESS);

    // First we must commit.
    // charity.commit();

    // Then we must settle.
    charity.settle();
    vm.stopBroadcast();
  }
}

