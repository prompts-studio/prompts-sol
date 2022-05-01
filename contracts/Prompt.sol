//SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "hardhat/console.sol";

/// @title Prompt
/// @author Burak Arıkan & Sam Hart
/// @notice extends the ERC721 non-fungible token standard to enable time-bound verifiable collaborative authorship

contract Prompt is ERC721URIStorage, Ownable {

    /// ============ Events ============

    event SessionCreated(uint256 tokenId, uint256 end, address[] members, string contributionURI, uint256 contributionPrice, address contributor, address reservedAddress);
    event MemberAdded(uint256 tokenId, address account);
    event Contributed(uint256 tokenId, string contributionURI, address creator, uint256 price);
    event PriceSet(uint256 tokenId, address contributor, uint256 price);
    event Minted(uint256 tokenId, string tokenURI, address creator);

    /// ============ Structs ============

    struct Contribution {
        string contributionURI;
        uint256 createdAt;
        address payable creator;
        uint256 price;
    }

    /// ============ Mutable storage ============

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping (uint256 => uint256) public endsAt; // endsAt[tokenId]
    mapping (uint256 => address) public reservedFor; // reservedFor[tokenId]
    mapping (uint256 => bool) public minted; // minted[tokenId]
    mapping (uint256 => address[]) public members; // members[tokenId]
    mapping (address => uint256[]) public createdSessions; // createdSessions[address]
    mapping (uint256 => mapping (address => bool)) public membership; // membership[tokenId][address]
    mapping (uint256 => uint256) public memberCount; // memberCount[tokenId]
    mapping (uint256 => uint256) public contributionCount; // contributionCount[tokenId]
    mapping (uint256 => mapping (address => Contribution)) public contributed; // contributed[tokenId][address]
    mapping (address => uint256[]) public contributedTokens; // contributedTokens[address]
    mapping (address => bool) public allowlist; // allowlist[address]

    /// ============ Immutable storage ============

    uint256 public memberLimit;
    uint256 public totalSupply;
    uint256 public sessionLimitPerAccount;
    uint256 public baseMintFee;
    uint256 public mintFee;
    address payable feeAddress;

    /// ============ Constructor ============

    /// @notice Creates a new Prompt NFT contract
    /// @param tokenName name of NFT
    /// @param tokenSymbol symbol of NFT
    /// @param _memberLimit member limit of each NFT
    /// @param _totalSupply total NFTs to mint
    /// @param _sessionLimitPerAccount max number of NFTs a member can create
    /// @param _baseMintFee in wei per NFT
    /// @param _mintFee in percentage per NFT
    /// @param _feeAddress where mint fees are paid
    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        uint256 _memberLimit,
        uint256 _totalSupply,
        uint256 _sessionLimitPerAccount,
        uint256 _baseMintFee,
        uint256 _mintFee,
        address _feeAddress
    ) ERC721(
        tokenName,
        tokenSymbol
    ) {
        require(_memberLimit >= 2, "_memberLimit cannot be smaller than 2");
        require(_totalSupply > 0, "_totalSupply cannot be 0");
        require(_baseMintFee > 0, "_mintFee cannot be 0");
        require(_mintFee > 0, "_mintFee cannot be 0");
        require(_feeAddress != address(0), "feeAddress cannot be null address");

        memberLimit = _memberLimit;
        totalSupply = _totalSupply;
        sessionLimitPerAccount = _sessionLimitPerAccount;
        baseMintFee = _baseMintFee;
        mintFee = _mintFee;
        feeAddress = payable(_feeAddress);
        allowlist[msg.sender] = true;
    }

    /// ============ Modifiers ============

    modifier isAllowed() {
        require (allowlist[msg.sender] == true,
            'account is not in allowlist');
        _;
    }
    modifier onlyMemberOf(uint256 _tokenId) {
        if (membership[_tokenId][msg.sender] == false) {
            revert('not a session member');
        }
        _;
    }
    modifier canCreateSession() {
        require (createdSessions[msg.sender].length < sessionLimitPerAccount,
            'account reached session limit');
        _;
    }
    modifier isNotEnded(uint256 _tokenId) {
        require(endsAt[_tokenId] >= block.timestamp,
                'session has ended');
        _;
    }
    modifier isEnded(uint256 _tokenId) {
        require(endsAt[_tokenId] <= block.timestamp,
                'session has not ended yet');
        _;
    }
    modifier isNotEmpty(string memory _content) {
        require(bytes(_content).length != 0,
            'URI cannot be empty');
        _;
    }
    modifier memberNotContributed(uint256 _tokenId) {
        require (contributed[_tokenId][msg.sender].creator == address(0),
            'address already contributed');
        _;
    }
    modifier memberContributed(uint256 _tokenId) {
        require (contributed[_tokenId][msg.sender].creator == msg.sender,
            'address is not the creator of this contribution');
        _;
    }
    modifier isLastContribution(uint _tokenId) {
        require(contributionCount[_tokenId] == memberLimit - 1,
            'is not the last contribution');
        _;
    }
    modifier finalizable(uint _tokenId) {
        require(contributionCount[_tokenId] == memberLimit || (endsAt[_tokenId] != 0 && endsAt[_tokenId] <= block.timestamp),
            'not all members contributed or session has not ended yet');
        _;
    }
    modifier isNotMinted(uint _tokenId) {
        require(minted[_tokenId] == false,
            'session already minted');
        _;
    }

    /// ============ Functions ============

    /// @notice Create a session with tokenID but without minting
    function createSession(address _reservedAddress, uint256 _endsAt, address[] memory _members, string memory _contributionURI, uint256 _contributionPrice)
        external
        isNotEmpty(_contributionURI)
        isAllowed()
        canCreateSession()
    {
        require(_tokenIds.current() < totalSupply, "reached token supply limit");
        require(_members.length <= memberLimit, "reached member limit");

        uint256 newTokenId = _tokenIds.current();

        for (uint256 i=0; i < _members.length; i++) {
            require(_members[i] != address(0), 'address cannot be null address');
            require(!membership[newTokenId][_members[i]], 'address is already a member of session');
            membership[newTokenId][_members[i]] = true;
            memberCount[newTokenId]++;
            members[newTokenId].push(_members[i]);
            allowlist[_members[i]] = true;
        }

        endsAt[newTokenId] = _endsAt;

        if (_reservedAddress != address(0)) {
            reservedFor[newTokenId] = _reservedAddress;
        }

        createdSessions[msg.sender].push(newTokenId);

        contributed[newTokenId][msg.sender] = Contribution(_contributionURI, block.timestamp, payable(msg.sender), _contributionPrice);
        contributedTokens[msg.sender].push(newTokenId);
        contributionCount[newTokenId]++;

        // _safeMint(_to, newTokenId); // Skip minting
        _tokenIds.increment();

        emit SessionCreated(newTokenId, _endsAt, _members, _contributionURI, _contributionPrice, msg.sender, _reservedAddress);
    }

    /// @notice msg.sender contributes to a session with tokenId, contribution URI and price
    function contribute(uint256 _tokenId, string memory _contributionURI, uint256 _contributionPrice)
        external
        isNotEnded(_tokenId)
        onlyMemberOf(_tokenId)
        memberNotContributed(_tokenId)
    {
        contributed[_tokenId][msg.sender] = Contribution(_contributionURI, block.timestamp, payable(msg.sender), _contributionPrice);
        contributedTokens[msg.sender].push(_tokenId);
        contributionCount[_tokenId]++;

        emit Contributed(_tokenId, _contributionURI, msg.sender, _contributionPrice);
    }

    /// @notice Contributor can set price of a contribution, if not yet minted
    function setPrice(uint256 _tokenId, uint256 _price)
        external
        memberContributed(_tokenId)
        isNotMinted(_tokenId)
    {
        Contribution storage _contribution = contributed[_tokenId][msg.sender];
        _contribution.price = _price;

        emit PriceSet(_tokenId, msg.sender, _contribution.price);
    }

    /// @notice Anyone can mint paying the total
    function mint(uint256 _tokenId, string memory _tokenURI)
        external
        payable
        finalizable(_tokenId)
        isNotEmpty(_tokenURI)
    {
        if (reservedFor[_tokenId] != address(0)) {
            require(reservedFor[_tokenId] == msg.sender, "Mint is reserved for another address");
        }

        uint256 finalMintFee = baseMintFee;
        uint256 totalPrice = 0;

        Contribution[] memory contributions = getContributions(_tokenId);

        for (uint256 i=0; i < contributions.length; i++) {
            totalPrice += contributions[i].price;
        }
        if (totalPrice > 0) {
            finalMintFee = totalPrice * mintFee / 100;
        }
        require(msg.value == totalPrice + finalMintFee, "Payment must be equal to listing price + mint fee");

        for (uint256 i=0; i < contributions.length; i++) {
            if (contributions[i].price > 0) {
                contributions[i].creator.transfer(contributions[i].price);
            }
        }

        feeAddress.transfer(finalMintFee);

        _safeMint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);
        minted[_tokenId] = true;

        emit Minted(_tokenId, _tokenURI, msg.sender);
    }

    /// ============ Read-only functions ============

    /// @notice Get current count of minted tokens
    /// @return Returns number
    function tokenCount() external view virtual returns (uint256) {
        return _tokenIds.current();
    }

    /// @notice Check if an address is member of a session
    /// @return Returns true or false
    function isMember(uint256 _tokenId, address _account) external view virtual returns (bool) {
        return membership[_tokenId][_account];
    }

    /// @notice Check if all session members contributed
    /// @return Returns true or false
    function isCompleted(uint256 _tokenId) external view virtual returns (bool) {
        return contributionCount[_tokenId] == memberLimit;
    }

    /// @notice Check if account can create a new session
    /// @return Returns true or false
    function accountCanCreateSession(address _account) external view virtual returns (bool) {
        return createdSessions[_account].length < sessionLimitPerAccount;
    }

    /// @notice Get sessions initiated by an account
    /// @return Returns tokenIds
    function sessionCountByAccount(address _account)  external view virtual returns (uint256[] memory) {
        return createdSessions[_account];
    }

    /// @notice Get tokens contributed by an account
    /// @return Returns tokenIds
    function getContributedTokens(address _account) external view virtual returns (uint256[] memory) {
        return contributedTokens[_account];
    }

    /// @notice Get contributions of a token
    /// @return Returns contributions
    function getContributions(uint256 _tokenId) internal view returns (Contribution[] memory) {
        Contribution[] memory contributions_arr = new Contribution[](members[_tokenId].length);
        for (uint256 i=0; i < members[_tokenId].length; i++) {
            contributions_arr[i] = (contributed[_tokenId][members[_tokenId][i]]);
        }
        return contributions_arr;
    }

    /// @notice Get session data
    /// @return Returns (owner: address, endsAt: blocktime, tokenURI: string, members: address[], contributions: Contribution[], reserved: address)
    function getSession(uint256 _tokenId) external view virtual
        returns (
            address,
            uint256,
            string memory,
            address[] memory,
            Contribution[] memory,
            address
        )
    {
        string memory tokenuri;
        address owner;
        if (minted[_tokenId]) {
            tokenuri = tokenURI(_tokenId);
            owner = ownerOf(_tokenId);
        }
        return(
            owner,
            endsAt[_tokenId],
            tokenuri,
            members[_tokenId],
            getContributions(_tokenId),
            reservedFor[_tokenId]
        );
    }
}