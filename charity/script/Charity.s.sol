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
    address EXPECTED_CHARITY_ADDRESS = 0x00000000006B5895b591Bd867A7B3D44e101c17a;
    bytes32 CHARITY_SALT = 0x2a8ed991f8d30def613a54f067e4dbf34e0dd63800f27840e3f48e4403241deb;

    address OWNER = DEPLOYER;
    address RECIPIENT = 0x44107F7E52299D58D749E820be45565eA99B2964;
		address PRIZE = 0x5Af0D9827E0c53E4799BB226655A1de152A425a5;
    uint256 DONOR_PRIZE = 595;
    uint256 RAFFLE_PRIZE = 7930;
    uint256 START = 1743973200;
    uint256 END = 1744578000;
    uint256 INCREMENT = 10000000000000000;
    uint256 THRESHOLD = 900;

    console.log("Environment ...");
    console.log("  - DEPLOYER: %s", DEPLOYER);
    console.log("  - CREATEX: %s", CREATEX);
    console.log("  - EXPECTED_CHARITY_ADDRESS: %s", EXPECTED_CHARITY_ADDRESS);
    console.log("  - CHARITY_SALT:");
    console.logBytes32(CHARITY_SALT);
    console.log("  - OWNER: %s", OWNER);
    console.log("  - RECIPIENT: %s", RECIPIENT);
    console.log("  - PRIZE: %s", PRIZE);
    console.log("  - DONOR_PRIZE: %s", DONOR_PRIZE);
    console.log("  - RAFFLE_PRIZE: %s", RAFFLE_PRIZE);
    console.log("  - START: %s", START);
    console.log("  - END: %s", END);
    console.log("  - INCREMENT: %s", INCREMENT);
    console.log("  - THRESHOLD: %s", THRESHOLD);
    console.log("--------------------------------");

    // Begin deploying.
    console.log("Runtime ...");
    vm.startBroadcast(DEPLOYER_PRIVATE_KEY);
    address charityAddress = ICreateX(CREATEX).deployCreate3(
      CHARITY_SALT,
      abi.encodePacked(
        type(Charity).creationCode,
        abi.encode(
          OWNER,
          RECIPIENT,
          PRIZE,
          DONOR_PRIZE,
          RAFFLE_PRIZE,
          START,
          END,
          INCREMENT,
          THRESHOLD
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

