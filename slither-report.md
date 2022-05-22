```
slither . -- checklist
```
Summary
 - [unused-return](#unused-return) (1 results) (Medium)
 - [calls-loop](#calls-loop) (1 results) (Low)
 - [variable-scope](#variable-scope) (3 results) (Low)
 - [reentrancy-benign](#reentrancy-benign) (1 results) (Low)
 - [reentrancy-events](#reentrancy-events) (1 results) (Low)
 - [assembly](#assembly) (4 results) (Informational)
 - [pragma](#pragma) (1 results) (Informational)
 - [solc-version](#solc-version) (16 results) (Informational)
 - [low-level-calls](#low-level-calls) (4 results) (Informational)
 - [naming-convention](#naming-convention) (22 results) (Informational)
 - [reentrancy-unlimited-gas](#reentrancy-unlimited-gas) (1 results) (Informational)
 - [similar-names](#similar-names) (1 results) (Informational)
 - [too-many-digits](#too-many-digits) (1 results) (Informational)
 - [external-function](#external-function) (9 results) (Optimization)

## unused-return
Impact: Medium
Confidence: Medium
 - [ ] ID-0
[ERC721._checkOnERC721Received(address,address,uint256,bytes)](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L382-L403) ignores return value by [IERC721Receiver(to).onERC721Received(_msgSender(),from,tokenId,_data)](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L389-L399)

node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L382-L403


## calls-loop
Impact: Low
Confidence: Medium
 - [ ] ID-1
[Prompt.mint(uint256,string)](contracts/Prompt.sol#L227-L265) has external calls inside a loop: [contributions[i_scope_0].creator.transfer(contributions[i_scope_0].price)](contracts/Prompt.sol#L253)

contracts/Prompt.sol#L227-L265


## variable-scope
Impact: Low
Confidence: High
 - [ ] ID-2
Variable '[ERC721._checkOnERC721Received(address,address,uint256,bytes).reason](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L391)' in [ERC721._checkOnERC721Received(address,address,uint256,bytes)](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L382-L403) potentially used before declaration: [revert(uint256,uint256)(32 + reason,mload(uint256)(reason))](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L396)

node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L391


 - [ ] ID-3
Variable '[ERC721._checkOnERC721Received(address,address,uint256,bytes).reason](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L391)' in [ERC721._checkOnERC721Received(address,address,uint256,bytes)](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L382-L403) potentially used before declaration: [reason.length == 0](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L392)

node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L391


 - [ ] ID-4
Variable '[ERC721._checkOnERC721Received(address,address,uint256,bytes).retval](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L389)' in [ERC721._checkOnERC721Received(address,address,uint256,bytes)](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L382-L403) potentially used before declaration: [retval == IERC721Receiver.onERC721Received.selector](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L390)

node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L389


## reentrancy-benign
Impact: Low
Confidence: Medium
 - [ ] ID-5
Reentrancy in [Prompt.mint(uint256,string)](contracts/Prompt.sol#L227-L265):
	External calls:
	- [_safeMint(msg.sender,_tokenId)](contracts/Prompt.sol#L261)
		- [IERC721Receiver(to).onERC721Received(_msgSender(),from,tokenId,_data)](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L389-L399)
	External calls sending eth:
	- [feeAddress.transfer(finalMintFee)](contracts/Prompt.sol#L259)
	State variables written after the call(s):
	- [_setTokenURI(_tokenId,_tokenURI)](contracts/Prompt.sol#L262)
		- [_tokenURIs[tokenId] = _tokenURI](node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol#L47)

contracts/Prompt.sol#L227-L265


## reentrancy-events
Impact: Low
Confidence: Medium
 - [ ] ID-6
Reentrancy in [Prompt.mint(uint256,string)](contracts/Prompt.sol#L227-L265):
	External calls:
	- [_safeMint(msg.sender,_tokenId)](contracts/Prompt.sol#L261)
		- [IERC721Receiver(to).onERC721Received(_msgSender(),from,tokenId,_data)](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L389-L399)
	External calls sending eth:
	- [feeAddress.transfer(finalMintFee)](contracts/Prompt.sol#L259)
	Event emitted after the call(s):
	- [Minted(_tokenId,_tokenURI,msg.sender)](contracts/Prompt.sol#L264)

contracts/Prompt.sol#L227-L265


## assembly
Impact: Informational
Confidence: High
 - [ ] ID-7
[console._sendLogPayload(bytes)](node_modules/hardhat/console.sol#L7-L14) uses assembly
	- [INLINE ASM](node_modules/hardhat/console.sol#L10-L13)

node_modules/hardhat/console.sol#L7-L14


 - [ ] ID-8
[Address.isContract(address)](node_modules/@openzeppelin/contracts/utils/Address.sol#L27-L37) uses assembly
	- [INLINE ASM](node_modules/@openzeppelin/contracts/utils/Address.sol#L33-L35)

node_modules/@openzeppelin/contracts/utils/Address.sol#L27-L37


 - [ ] ID-9
[ERC721._checkOnERC721Received(address,address,uint256,bytes)](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L382-L403) uses assembly
	- [INLINE ASM](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L395-L397)

node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L382-L403


 - [ ] ID-10
[Address.verifyCallResult(bool,bytes,string)](node_modules/@openzeppelin/contracts/utils/Address.sol#L196-L216) uses assembly
	- [INLINE ASM](node_modules/@openzeppelin/contracts/utils/Address.sol#L208-L211)

node_modules/@openzeppelin/contracts/utils/Address.sol#L196-L216


## pragma
Impact: Informational
Confidence: High
 - [ ] ID-11
Different versions of Solidity are used:
	- Version used: ['0.8.12', '>=0.4.22<0.9.0', '^0.8.0']
	- [^0.8.0](node_modules/@openzeppelin/contracts/access/Ownable.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts/utils/Address.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts/utils/Context.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts/utils/Counters.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts/utils/Strings.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts/utils/introspection/ERC165.sol#L4)
	- [^0.8.0](node_modules/@openzeppelin/contracts/utils/introspection/IERC165.sol#L4)
	- [0.8.12](contracts/Prompt.sol#L2)
	- [>=0.4.22<0.9.0](node_modules/hardhat/console.sol#L2)

node_modules/@openzeppelin/contracts/access/Ownable.sol#L4


## solc-version
Impact: Informational
Confidence: High
 - [ ] ID-12
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts/utils/Context.sol#L4) allows old versions

node_modules/@openzeppelin/contracts/utils/Context.sol#L4


 - [ ] ID-13
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol#L4) allows old versions

node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol#L4


 - [ ] ID-14
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts/utils/Strings.sol#L4) allows old versions

node_modules/@openzeppelin/contracts/utils/Strings.sol#L4


 - [ ] ID-15
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol#L4) allows old versions

node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol#L4


 - [ ] ID-16
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol#L4) allows old versions

node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol#L4


 - [ ] ID-17
solc-0.8.12 is not recommended for deployment

 - [ ] ID-18
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol#L4) allows old versions

node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol#L4


 - [ ] ID-19
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts/utils/Counters.sol#L4) allows old versions

node_modules/@openzeppelin/contracts/utils/Counters.sol#L4


 - [ ] ID-20
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts/utils/introspection/ERC165.sol#L4) allows old versions

node_modules/@openzeppelin/contracts/utils/introspection/ERC165.sol#L4


 - [ ] ID-21
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol#L4) allows old versions

node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol#L4


 - [ ] ID-22
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts/utils/Address.sol#L4) allows old versions

node_modules/@openzeppelin/contracts/utils/Address.sol#L4


 - [ ] ID-23
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts/access/Ownable.sol#L4) allows old versions

node_modules/@openzeppelin/contracts/access/Ownable.sol#L4


 - [ ] ID-24
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts/utils/introspection/IERC165.sol#L4) allows old versions

node_modules/@openzeppelin/contracts/utils/introspection/IERC165.sol#L4


 - [ ] ID-25
Pragma version[^0.8.0](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L4) allows old versions

node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L4


 - [ ] ID-26
Pragma version[0.8.12](contracts/Prompt.sol#L2) necessitates a version too recent to be trusted. Consider deploying with 0.6.12/0.7.6/0.8.7

contracts/Prompt.sol#L2


 - [ ] ID-27
Pragma version[>=0.4.22<0.9.0](node_modules/hardhat/console.sol#L2) is too complex

node_modules/hardhat/console.sol#L2


## low-level-calls
Impact: Informational
Confidence: High
 - [ ] ID-28
Low level call in [Address.functionStaticCall(address,bytes,string)](node_modules/@openzeppelin/contracts/utils/Address.sol#L152-L161):
	- [(success,returndata) = target.staticcall(data)](node_modules/@openzeppelin/contracts/utils/Address.sol#L159)

node_modules/@openzeppelin/contracts/utils/Address.sol#L152-L161


 - [ ] ID-29
Low level call in [Address.sendValue(address,uint256)](node_modules/@openzeppelin/contracts/utils/Address.sol#L55-L60):
	- [(success) = recipient.call{value: amount}()](node_modules/@openzeppelin/contracts/utils/Address.sol#L58)

node_modules/@openzeppelin/contracts/utils/Address.sol#L55-L60


 - [ ] ID-30
Low level call in [Address.functionDelegateCall(address,bytes,string)](node_modules/@openzeppelin/contracts/utils/Address.sol#L179-L188):
	- [(success,returndata) = target.delegatecall(data)](node_modules/@openzeppelin/contracts/utils/Address.sol#L186)

node_modules/@openzeppelin/contracts/utils/Address.sol#L179-L188


 - [ ] ID-31
Low level call in [Address.functionCallWithValue(address,bytes,uint256,string)](node_modules/@openzeppelin/contracts/utils/Address.sol#L123-L134):
	- [(success,returndata) = target.call{value: value}(data)](node_modules/@openzeppelin/contracts/utils/Address.sol#L132)

node_modules/@openzeppelin/contracts/utils/Address.sol#L123-L134


## naming-convention
Impact: Informational
Confidence: High
 - [ ] ID-32
Parameter [Prompt.createSession(address,uint256,address[],string,uint256)._reservedAddress](contracts/Prompt.sol#L163) is not in mixedCase

contracts/Prompt.sol#L163


 - [ ] ID-33
Parameter [Prompt.isCompleted(uint256)._tokenId](contracts/Prompt.sol#L283) is not in mixedCase

contracts/Prompt.sol#L283


 - [ ] ID-34
Parameter [Prompt.createSession(address,uint256,address[],string,uint256)._contributionURI](contracts/Prompt.sol#L163) is not in mixedCase

contracts/Prompt.sol#L163


 - [ ] ID-35
Parameter [Prompt.getContributions(uint256)._tokenId](contracts/Prompt.sol#L307) is not in mixedCase

contracts/Prompt.sol#L307


 - [ ] ID-36
Parameter [Prompt.createSession(address,uint256,address[],string,uint256)._members](contracts/Prompt.sol#L163) is not in mixedCase

contracts/Prompt.sol#L163


 - [ ] ID-37
Parameter [Prompt.isMember(uint256,address)._tokenId](contracts/Prompt.sol#L277) is not in mixedCase

contracts/Prompt.sol#L277


 - [ ] ID-38
Parameter [Prompt.createSession(address,uint256,address[],string,uint256)._endsAt](contracts/Prompt.sol#L163) is not in mixedCase

contracts/Prompt.sol#L163


 - [ ] ID-39
Parameter [ERC721.safeTransferFrom(address,address,uint256,bytes)._data](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L179) is not in mixedCase

node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L179


 - [ ] ID-40
Parameter [Prompt.contribute(uint256,string,uint256)._tokenId](contracts/Prompt.sol#L201) is not in mixedCase

contracts/Prompt.sol#L201


 - [ ] ID-41
Contract [console](node_modules/hardhat/console.sol#L4-L1532) is not in CapWords

node_modules/hardhat/console.sol#L4-L1532


 - [ ] ID-42
Parameter [Prompt.sessionCountByAccount(address)._account](contracts/Prompt.sol#L295) is not in mixedCase

contracts/Prompt.sol#L295


 - [ ] ID-43
Parameter [Prompt.mint(uint256,string)._tokenURI](contracts/Prompt.sol#L227) is not in mixedCase

contracts/Prompt.sol#L227


 - [ ] ID-44
Parameter [Prompt.getSession(uint256)._tokenId](contracts/Prompt.sol#L317) is not in mixedCase

contracts/Prompt.sol#L317


 - [ ] ID-45
Parameter [Prompt.accountCanCreateSession(address)._account](contracts/Prompt.sol#L289) is not in mixedCase

contracts/Prompt.sol#L289


 - [ ] ID-46
Parameter [Prompt.isMember(uint256,address)._account](contracts/Prompt.sol#L277) is not in mixedCase

contracts/Prompt.sol#L277


 - [ ] ID-47
Parameter [Prompt.getContributedTokens(address)._account](contracts/Prompt.sol#L301) is not in mixedCase

contracts/Prompt.sol#L301


 - [ ] ID-48
Parameter [Prompt.setPrice(uint256,uint256)._tokenId](contracts/Prompt.sol#L215) is not in mixedCase

contracts/Prompt.sol#L215


 - [ ] ID-49
Parameter [Prompt.mint(uint256,string)._tokenId](contracts/Prompt.sol#L227) is not in mixedCase

contracts/Prompt.sol#L227


 - [ ] ID-50
Parameter [Prompt.contribute(uint256,string,uint256)._contributionPrice](contracts/Prompt.sol#L201) is not in mixedCase

contracts/Prompt.sol#L201


 - [ ] ID-51
Parameter [Prompt.setPrice(uint256,uint256)._price](contracts/Prompt.sol#L215) is not in mixedCase

contracts/Prompt.sol#L215


 - [ ] ID-52
Parameter [Prompt.createSession(address,uint256,address[],string,uint256)._contributionPrice](contracts/Prompt.sol#L163) is not in mixedCase

contracts/Prompt.sol#L163


 - [ ] ID-53
Parameter [Prompt.contribute(uint256,string,uint256)._contributionURI](contracts/Prompt.sol#L201) is not in mixedCase

contracts/Prompt.sol#L201


## reentrancy-unlimited-gas
Impact: Informational
Confidence: Medium
 - [ ] ID-54
Reentrancy in [Prompt.mint(uint256,string)](contracts/Prompt.sol#L227-L265):
	External calls:
	- [feeAddress.transfer(finalMintFee)](contracts/Prompt.sol#L259)
	State variables written after the call(s):
	- [_safeMint(msg.sender,_tokenId)](contracts/Prompt.sol#L261)
		- [_balances[to] += 1](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L286)
	- [_safeMint(msg.sender,_tokenId)](contracts/Prompt.sol#L261)
		- [_owners[tokenId] = to](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L287)
	- [_setTokenURI(_tokenId,_tokenURI)](contracts/Prompt.sol#L262)
		- [_tokenURIs[tokenId] = _tokenURI](node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol#L47)
	Event emitted after the call(s):
	- [Minted(_tokenId,_tokenURI,msg.sender)](contracts/Prompt.sol#L264)
	- [Transfer(address(0),to,tokenId)](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L289)
		- [_safeMint(msg.sender,_tokenId)](contracts/Prompt.sol#L261)

contracts/Prompt.sol#L227-L265


## similar-names
Impact: Informational
Confidence: Medium
 - [ ] ID-55
Variable [Prompt.setPrice(uint256,uint256)._contribution](contracts/Prompt.sol#L220) is too similar to [Prompt.mint(uint256,string).contributions](contracts/Prompt.sol#L241)

contracts/Prompt.sol#L220


## too-many-digits
Impact: Informational
Confidence: Medium
 - [ ] ID-56
[console.slitherConstructorConstantVariables()](node_modules/hardhat/console.sol#L4-L1532) uses literals with too many digits:
	- [CONSOLE_ADDRESS = address(0x000000000000000000636F6e736F6c652e6c6f67)](node_modules/hardhat/console.sol#L5)

node_modules/hardhat/console.sol#L4-L1532


## external-function
Impact: Optimization
Confidence: High
 - [ ] ID-57
symbol() should be declared external:
	- [ERC721.symbol()](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L86-L88)

node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L86-L88


 - [ ] ID-58
renounceOwnership() should be declared external:
	- [Ownable.renounceOwnership()](node_modules/@openzeppelin/contracts/access/Ownable.sol#L54-L56)

node_modules/@openzeppelin/contracts/access/Ownable.sol#L54-L56


 - [ ] ID-59
safeTransferFrom(address,address,uint256) should be declared external:
	- [ERC721.safeTransferFrom(address,address,uint256)](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L164-L170)

node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L164-L170


 - [ ] ID-60
transferFrom(address,address,uint256) should be declared external:
	- [ERC721.transferFrom(address,address,uint256)](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L150-L159)

node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L150-L159


 - [ ] ID-61
approve(address,uint256) should be declared external:
	- [ERC721.approve(address,uint256)](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L112-L122)

node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L112-L122


 - [ ] ID-62
transferOwnership(address) should be declared external:
	- [Ownable.transferOwnership(address)](node_modules/@openzeppelin/contracts/access/Ownable.sol#L62-L65)

node_modules/@openzeppelin/contracts/access/Ownable.sol#L62-L65


 - [ ] ID-63
name() should be declared external:
	- [ERC721.name()](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L79-L81)

node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L79-L81


 - [ ] ID-64
balanceOf(address) should be declared external:
	- [ERC721.balanceOf(address)](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L62-L65)

node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L62-L65


 - [ ] ID-65
setApprovalForAll(address,bool) should be declared external:
	- [ERC721.setApprovalForAll(address,bool)](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L136-L138)

node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol#L136-L138