// SPDX-License-Identifier: LicenseRef-VPL WITH AGPL-3.0-only
pragma solidity ^0.8.25;

import {
  Ownable
} from "solady/auth/Ownable.sol";
import {
  ERC721
} from "solady/tokens/ERC721.sol";
import {
  LibString
} from "solady/utils/LibString.sol";

/**
  @custom:benediction DEVS BENEDICAT ET PROTEGAT CONTRACTVM MEVM
  @title A mock ERC-721 token for testing.
  @author Tim Clancy <tim-clancy.eth>
  @custom:terry "I don't reuse as much code as I hoped when I was younger."

  A mock ERC-721 token for testing.

  @custom:date May 22nd, 2024.
*/
contract Mock721 is ERC721, Ownable {
  using LibString for *;

  /// The name of the token.
  string private name_;

  /// The symbol of the token.
  string private symbol_;

  /// The token's metadata base URI.
  string public baseUri;

  /**
    Our very simple constructor to define a mock ERC-721.

    @param _owner The initial owner of the token contract.
    @param _name The name of the token.
    @param _symbol The symbol of the token.
    @param _baseUri The metadata base URI.
  */
  constructor (
    address _owner,
    string memory _name,
    string memory _symbol,
    string memory _baseUri
  ) {
    _initializeOwner(_owner);
    name_ = _name;
    symbol_ = _symbol;
    baseUri = _baseUri;
  }

  /**
    Returns the name of the token.

    @return _ The name of the token.
  */
  function name () override public view returns (string memory) {
    return name_;
  }

  /**
    Returns the symbol of the token.

    @return _ The symbol used as the token ticker.
  */
  function symbol () override public view returns (string memory) {
    return symbol_;
  }

  /**
    Return the metadata URI for the token with ID `id`.

    @param _id The ID of the token to return a metadata URI for.

    @return _ The metadata URI of the token with ID `id`.
  */
  function tokenURI (
    uint256 _id
  ) override public view returns (string memory) {
    return string(abi.encodePacked(baseUri, LibString.toString(_id)));
  }

  /**
    Allow the contract owner to mint a new token.

    @param _to The recipient of the new token.
    @param _id The ID of the new token.
  */
  function mint (
    address _to,
    uint256 _id
  ) external onlyOwner {
    _mint(_to, _id);
  }

  /**
    Allow the contract owner to set a new `baseUri`.

    @param _baseUri The new metadata base URI for the collection.
  */
  function setBaseURI (
    string memory _baseUri
  ) external onlyOwner {
    baseUri = _baseUri;
  }
}

