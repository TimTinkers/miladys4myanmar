// SPDX-License-Identifier: LicenseRef-VPL WITH AGPL-3.0-only
pragma solidity ^0.8.25;

import {
  Script, console
} from "forge-std/Script.sol";

import {
  Charity
} from "../src/Charity.sol";

/**
  This is a stripped-down CreateX interface for using CREATE3 to perform
  contract deployment at a predetermined address. Thank you, CreateX.
*/
interface ICreateX {

  /**
    Use the CREATE3 technique to deploy a contract at a predetermined address.

    @param _salt The salt used to determine the contract address.
    @param _initCode The contract creation bytecode.

    @return _ The address of the newly-deployed contract.
  */
  function deployCreate3 (
    bytes32 _salt,
    bytes memory _initCode
  ) external payable returns (address);
}

contract Deploy is Script {

  /// This error is emitted if an expected deployment address is incorrect.
  error UnexpectedAddress ();

  function run () external {

    // Retrieve our configuration details.
    uint256 DEPLOYER_PRIVATE_KEY = vm.envUint("PRIVATE_KEY");
    address DEPLOYER = vm.addr(DEPLOYER_PRIVATE_KEY);
    address CREATEX = 0xba5Ed099633D3B313e4D5F7bdc1305d3c28ba5Ed;
    address EXPECTED_CHARITY_ADDRESS = 0x635Cb66cE14Ba44e78B3105BbB5d93D7d2B073C6;
    bytes32 CHARITY_SALT = 0x1ec7e0b7cd1a79a4afb873aeffe50ddca644656300fba626f729743d000f172f;

    console.log("Environment ...");
    console.log("  - DEPLOYER: %s", DEPLOYER);
    console.log("  - CREATEX: %s", CREATEX);
    console.log("  - EXPECTED_CHARITY_ADDRESS: %s", EXPECTED_CHARITY_ADDRESS);
    console.log("  - CHARITY_SALT:");
    console.logBytes32(CHARITY_SALT);
    console.log("--------------------------------");

    // Begin deploying.
    console.log("Runtime ...");
    vm.startBroadcast(DEPLOYER_PRIVATE_KEY);
    address charityAddress = ICreateX(CREATEX).deployCreate3(
      CHARITY_SALT,
      abi.encodePacked(
        type(Charity).creationCode,
        abi.encode(
          // TODO
        )
      )
    );
    console.log("  - Charity: %s", charityAddress);
    if (charityAddress != EXPECTED_CHARITY_ADDRESS) {
      revert UnexpectedAddress();
    }
    vm.stopBroadcast();
  }
}

