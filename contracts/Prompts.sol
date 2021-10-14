//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "hardhat/console.sol";

/// @title Prompts
/// @author Burak Arıkan & Sam Hart
/// @dev compliant with ERC721 OpenZeppelin implementation
/// @dev extends ERC721 with duration and verified contributions

contract Prompts is ERC721URIStorage, Ownable {

    event Minted(
        uint256 tokenId,
        address beneficiary,
        string promptURI,
        address minter,
        uint256 end
    );
    event MemberAdded(
        uint256 tokenId,
        address account
    );
    event Contributed(
        uint256 tokenId,
        string metadata,
        address creator
    );
    event Filled(
        uint256 tokenId,
        string tokenURI
    );

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _contributionIds;

    struct Prompt {
        string metadata; // URI of a JSON
        uint256 end;
    }
    struct Contribution {
        string metadata; // URI of a JSON
        uint256 createdAt;
        address creator;
    }

    Prompt[] public prompts;
    mapping (uint256 => mapping (address => bool)) public promptMembers;
    mapping (uint256 => uint256) private promptMemberCount;
    Contribution[] public contributions;
    mapping (uint256 => uint256) public promptContributions;

    constructor(
        string memory tokenName,
        string memory tokenSymbol
    ) ERC721(
        tokenName,
        tokenSymbol
    ) {}

    modifier onlyMemberOf(uint _tokenId) {
        if (promptMembers[_tokenId][msg.sender] == false) {
            revert('not a prompt member');
        }
        _;
    }
    modifier isNotEnded(uint _tokenId) {
        require(prompts[_tokenId].end <= block.timestamp,
                'prompt has ended');
        _;
    }
    modifier isEnded(uint _tokenId) {
        require(prompts[_tokenId].end >= block.timestamp,
                'prompt has not ended yet');
        _;
    }

    function mint(address _to, string memory _promptURI, uint256 _end) external {
        uint256 newTokenId = _tokenIds.current();
        _mint(_to, newTokenId);
        // _setTokenURI(newTokenId, _tokenURI); // empty NFT

        prompts.push(Prompt(_promptURI, _end));
        promptMembers[newTokenId][msg.sender] = true;
        promptMemberCount[newTokenId]++;
        _tokenIds.increment();

        // console.log('newTokenId: %s, _promptURI: %s, _end: %s', newTokenId, _promptURI, _end);
        emit Minted(newTokenId, _to, _promptURI, msg.sender, _end);
    }

    function addMember(uint256 _tokenId, address _account)
        external
        isNotEnded(_tokenId)
    {
        require(_account != address(0), 'address cannot be null address');
        require(!promptMembers[_tokenId][_account], 'address is already a member of prompt');
        promptMembers[_tokenId][_account] = true;
        promptMemberCount[_tokenId]++;

        emit MemberAdded(_tokenId, _account);
    }

    // membership is not required: onlyMemberOf(_tokenId)
    function contribute(uint256 _tokenId, string memory _metadata)
        external
        isNotEnded(_tokenId)
    {
        _contributionIds.increment();
        uint256 contributionId = _contributionIds.current();
        contributions.push(Contribution(_metadata, block.timestamp, msg.sender));
        promptContributions[_tokenId] = contributionId;

        emit Contributed(_tokenId, _metadata, msg.sender);
    }

    // onlyOwner of deployed contract can finalize
    // isEnded(_tokenId) removed for testing, no time iteration
    function fill(uint256 _tokenId, string memory _tokenURI)
        external
        onlyOwner()
    {
        _setTokenURI(_tokenId, _tokenURI);

        // TODO: distrubute ownership to contributors
        // // Check if all multisig addresses are contributors
        // for(uint i=0; i < multisig.addresses.length; i++) {
        //         break;
        //     if(promptContributions[_tokenId][multisig.addresses[i]] == false) {
        //     }
        // }
        // // If check passes, send transfer ownership
        // // either send the token to the multisig address
        // transfer(msg.sender, multisig, _tokenId);
        // // or fractionalize to the multisig addresses
        // fractionalize(_tokenId, multisig.addresses);

        emit Filled(_tokenId, _tokenURI);
    }

    function isMember(uint256 _tokenId, address _account) external view returns (bool) {
        return promptMembers[_tokenId][_account];
    }

    function getContributionContent(uint256 _contributionId) external view returns (string memory) {
        return contributions[_contributionId].metadata;
    }

    function memberCount(uint256 _tokenId) external view virtual returns (uint256) {
        return promptMemberCount[_tokenId];
    }
}
