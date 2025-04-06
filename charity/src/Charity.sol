// SPDX-License-Identifier: LicenseRef-VPL WITH AGPL-3.0-only
pragma solidity ^0.8.25;

import {
  Ownable
} from "solady/auth/Ownable.sol";
import {
  SafeTransferLib
} from "solady/utils/SafeTransferLib.sol";
import {
  ReentrancyGuard
} from "soledge/utils/ReentrancyGuard.sol";

/// The interface for an ERC-721.
interface IERC721 {

  /**
    Transfer ownership of an NFT.

    @param _from The current owner of the NFT.
    @param _to The new owner of the NFT.
    @param _tokenId The NFT ID to transfer.
  */
  function transferFrom (
    address _from,
    address _to,
    uint256 _tokenId
  ) external payable;
}

/**
  @custom:benediction DEVS BENEDICAT ET PROTEGAT CONTRACTVM MEVM
  @title A charity donation drive and raffle with prize for the highest donor.
  @author Tim Clancy <tim-clancy.eth>
  @custom:terry "... that act caused God to reveal Himself to me and saved me."

  Donate to support earthquake relief in Myanmar.
  I did not optimize this contract.

  @custom:date April 5th, 2025.
*/
contract Charity is Ownable, ReentrancyGuard {

  /// An error emitted if the caller is too early for an operation.
  error TooEarly ();

  /// An error emitted if the caller is too late for an operation.
  error TooLate ();

  /**
    An error emitted if the caller's donation is too small. This only happens
    during the drive extension `THRESHOLD`.
  */
  error TooSmall ();

  /// The recipient of all donations.
  address public immutable RECIPIENT;

	/// The address of the prize ERC-721 contract.
	address public immutable PRIZE;

  /// The token ID of the prize NFT for the highest donor.
  uint256 public immutable DONOR_PRIZE;

  /// The token ID of the prize NFT for the raffle winner.
  uint256 public immutable RAFFLE_PRIZE;

  /// The specified donation drive start time.
  uint256 public immutable START;

  /// The specified donation drive end time.
  uint256 public end;

  /**
    A donation of at least this size with less than `THRESHOLD` time remaining
    on the donation drive will extend the end time of the donation drive.
  */
  uint256 public immutable INCREMENT;

  /// The ending threshold within which the donation drive is extended.
  uint256 public immutable THRESHOLD;

  /// The total amount donated.
  uint256 public totalDonations;

  /// A mapping from each donor to the amount they've donated.
  mapping ( address donor => uint256 amount ) public donations;

  /// An array of all donors.
  address[] public donors;

  /// The address of the highest donor.
  address public highestDonor;

  /// The amount donated by the highest donor.
  uint256 public highestDonation;

  /// Store a future block to use for committed randomness.
  uint256 public committedBlock;

  /**
    This event is emitted when a user has donated.

    @param donor The address of the donor.
    @param amount The donation amount.
    @param message The donation message.
  */
  event Donation (
    address indexed donor,
    uint256 amount,
    string message
  );

  /**
    This event is emitted when the donation drive is settled.

    @param highestDonor The address of the highest donor.
    @param raffleWinner The address of the raffle winner.
  */
  event Settled (
    address indexed highestDonor,
    address indexed raffleWinner
  );

	/**
		Construct a new instance of the charity drive.

    @param _owner The owner of this contract.
    @param _recipient The address of the donation recipient.
		@param _prize The address of the prize ERC-721 token contract.
    @param _donorPrize The token ID of the prize NFT for the highest donor.
    @param _rafflePrize The token ID of the prize NFT for the raffle winner.
    @param _start The donation drive start time.
    @param _end The donation drive end time.
    @param _increment The size of the minimum drive extension donation.
    @param _threshold The time threshold for extending the drive.
	*/
	constructor (
    address _owner,
    address _recipient,
		address _prize,
    uint256 _donorPrize,
    uint256 _rafflePrize,
    uint256 _start,
    uint256 _end,
    uint256 _increment,
    uint256 _threshold
	) {
    _initializeOwner(_owner);
    RECIPIENT = _recipient;
    PRIZE = _prize;
    DONOR_PRIZE = _donorPrize;
    RAFFLE_PRIZE = _rafflePrize;
    START = _start;
    end = _end;
    INCREMENT = _increment;
    THRESHOLD = _threshold;
	}

  /**
    Donate to the charity drive and leave a message of support.

    @param _message A message to accompany the donation.
  */
  function donate (
    string calldata _message
  ) external payable nonReentrant {
    
    // Do not allow early donations.
    if (block.timestamp < START) {
      revert TooEarly();
    }

    // Do not allow late donations.
    if (block.timestamp > end) {
      revert TooLate();
    }

    // Require non-zero donations.
    if (msg.value < 1) {
      revert TooSmall();
    }

    // If the donation drive is within its concluding threshold ...
    if (end - block.timestamp < THRESHOLD) {

      // ... prevent tiny bids and extend the drive.
      if (msg.value < INCREMENT) {
        revert TooSmall();
      }
      end += THRESHOLD;
    }

    // If this is a first-time donor, record them.
    uint256 lastDonorAmount = donations[msg.sender];
    if (lastDonorAmount == 0) {
      donors.push(msg.sender);
    }

    // Update the donation details being tracked.
    uint256 donorAmount = lastDonorAmount + msg.value;
    if (donorAmount > highestDonation) {
      highestDonation = donorAmount;
      highestDonor = msg.sender;
    }
    donations[msg.sender] = donorAmount;
    totalDonations += msg.value;

    // Forward the donation immediately to the recipient.
    bool success = SafeTransferLib.trySafeTransferETH(
      RECIPIENT,
      msg.value,
      SafeTransferLib.GAS_STIPEND_NO_STORAGE_WRITES
    );
    if (!success) {
      SafeTransferLib.forceSafeTransferETH(RECIPIENT, msg.value);
    }

    // Emit a donation event.
    emit Donation(msg.sender, msg.value, _message);
  }

  /**
    Allow the caller to commit to a future block for donation drive settlement.
    If the block proposer meddles across two epochs with the raffle they
    deserve to win.
  */
  function commit () external payable {
    if (block.number <= committedBlock + 256) {
      revert TooEarly();
    }
    committedBlock = block.number + 64;
  }

  /**
    Allow the caller to settle the donation drive.
  */
  function settle () external payable nonReentrant {

    // Only permit settling the donation drive if it has ended.
    if (block.timestamp <= end) {
      revert TooEarly();
    }

    // Only permit settling if the committed block has passed.
    if (block.number < committedBlock) {
      revert TooEarly();
    }

    // Require that a committed random block be in range.
    if (block.number > committedBlock + 256) {
      revert TooLate();
    }
    uint256 random = uint256(blockhash(committedBlock));

    // Select the raffle winner.
    address raffleWinner;
    uint256 accumulator = random % totalDonations;
    for (uint256 i = 0; i < donors.length; ++i) {
      address donor = donors[i];
      if (accumulator < donations[donor]) {
        raffleWinner = donor;
        break;
      }
      accumulator -= donations[donor];
    }

    // Send the prizes to the winners.
    IERC721(PRIZE).transferFrom(address(this), highestDonor, DONOR_PRIZE);
    IERC721(PRIZE).transferFrom(address(this), raffleWinner, RAFFLE_PRIZE);

    // Emit a settled event.
    emit Settled(highestDonor, raffleWinner);
  }

  /**
    Allow the owner to force Ether out of this contract.
  */
  function forceEther () external payable onlyOwner {
    bool success = SafeTransferLib.trySafeTransferETH(
      RECIPIENT,
      address(this).balance,
      SafeTransferLib.GAS_STIPEND_NO_STORAGE_WRITES
    );
    if (!success) {
      SafeTransferLib.forceSafeTransferETH(RECIPIENT, address(this).balance);
    }
  }

  /**
    Allow the owner to transfer ERC-20 tokens out of this contract.

    @param _token The address of the ERC-20 token to transfer.
    @param _to The address to transfer the ERC-20 `_token` to.
    @param _amount The amount of `_token` to transfer.
  */
  function transferToken (
    address _token,
    address _to,
    uint256 _amount
  ) external payable onlyOwner {
    SafeTransferLib.safeTransfer(_token, _to, _amount);
  }
}

