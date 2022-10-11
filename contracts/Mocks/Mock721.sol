// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Contract by CAT6#2699
abstract contract Mock721Base is ERC721 {
    uint private _tokenIds;

    function quickMint() public returns (uint) {
        _tokenIds++;
        _mint(msg.sender, _tokenIds);
        return _tokenIds;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmQvYD4LqDdB8gMaVh7vzGfBmApv1kdfGmToQ2B3t2QsU1";
    }

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        quickMint();
    }
}

contract SkeletonKey is Mock721Base {
    constructor() Mock721Base("Override Token", "SKEL") {}
}

contract ExecutiveKey is Mock721Base {
    constructor() Mock721Base("Executive Token", "EXEC") {}
}

contract AdminKey is Mock721Base {
    constructor() Mock721Base("Admin Token", "ADMIN") {}
}

contract ExpensiveJpeg is Mock721Base {
    constructor() Mock721Base("Expensive JPEG", "$JPG") {}
}
