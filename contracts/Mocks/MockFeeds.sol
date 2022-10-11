// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// Contract by CAT6#2699
contract MockFeedTether is AggregatorV3Interface {
    function decimals() public pure override returns (uint8) {
        return 8;
    }

    function description() public pure override returns (string memory) {
        return "USDT / USD";
    }

    function version() public pure override returns (uint256) {
        return 42069;
    }

    function getRoundData(uint80 _roundId)
        public
        pure
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        roundId = _roundId;
        startedAt = 2;
        updatedAt = 3;
        answeredInRound = 4;
        _roundId++;
        answer = 98 * (10**7);
    }

    function latestRoundData()
        public
        pure
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        roundId = 1;
        startedAt = 2;
        updatedAt = 3;
        answeredInRound = 4;
        answer = 98 * (10**7);
    }
}

contract MockFeedEthereum is AggregatorV3Interface {
    function decimals() public pure override returns (uint8) {
        return 8;
    }

    function description() public pure override returns (string memory) {
        return "ETH / USD";
    }

    function version() public pure override returns (uint256) {
        return 42069;
    }

    function getRoundData(uint80 _roundId)
        public
        pure
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        roundId = _roundId;
        startedAt = 2;
        updatedAt = 3;
        answeredInRound = 4;
        _roundId++;
        answer = 2048 * (10**8);
    }

    function latestRoundData()
        public
        pure
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        roundId = 1;
        startedAt = 2;
        updatedAt = 3;
        answeredInRound = 4;
        answer = 2048 * (10**8);
    }
}

contract MockFeedChainlink is AggregatorV3Interface {
    function decimals() public pure override returns (uint8) {
        return 8;
    }

    function description() public pure override returns (string memory) {
        return "LINK / USD";
    }

    function version() public pure override returns (uint256) {
        return 42069;
    }

    function getRoundData(uint80 _roundId)
        public
        pure
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        roundId = _roundId;
        startedAt = 2;
        updatedAt = 3;
        answeredInRound = 4;
        _roundId++;
        answer = 999 * (10**7);
    }

    function latestRoundData()
        public
        pure
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        roundId = 1;
        startedAt = 2;
        updatedAt = 3;
        answeredInRound = 4;
        answer = 999 * (10**7);
    }
}

contract MockFeedPolygon is AggregatorV3Interface {
    function decimals() public pure override returns (uint8) {
        return 8;
    }

    function description() public pure override returns (string memory) {
        return "MATIC / USD";
    }

    function version() public pure override returns (uint256) {
        return 42069;
    }

    function getRoundData(uint80 _roundId)
        public
        pure
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        roundId = _roundId;
        startedAt = 2;
        updatedAt = 3;
        answeredInRound = 4;
        _roundId++;
        answer = 2 * (10**8);
    }

    function latestRoundData()
        public
        pure
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        roundId = 1;
        startedAt = 2;
        updatedAt = 3;
        answeredInRound = 4;
        answer = 2 * (10**8);
    }
}

contract MockFeedBitcoin is AggregatorV3Interface {
    function decimals() public pure override returns (uint8) {
        return 8;
    }

    function description() public pure override returns (string memory) {
        return "BTC / USD";
    }

    function version() public pure override returns (uint256) {
        return 42069;
    }

    function getRoundData(uint80 _roundId)
        public
        pure
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        roundId = _roundId;
        startedAt = 2;
        updatedAt = 3;
        answeredInRound = 4;
        _roundId++;
        answer = 20000 * (10**8);
    }

    function latestRoundData()
        public
        pure
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        roundId = 1;
        startedAt = 2;
        updatedAt = 3;
        answeredInRound = 4;
        answer = 20000 * (10**8);
    }
}

contract MockFeedWrappedBitcoin is AggregatorV3Interface {
    function decimals() public pure override returns (uint8) {
        return 8;
    }

    function description() public pure override returns (string memory) {
        return "wBTC / BTC";
    }

    function version() public pure override returns (uint256) {
        return 42069;
    }

    function getRoundData(uint80 _roundId)
        public
        pure
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        roundId = _roundId;
        startedAt = 2;
        updatedAt = 3;
        answeredInRound = 4;
        _roundId++;
        answer = 1 * (10**8);
    }

    function latestRoundData()
        public
        pure
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        roundId = 1;
        startedAt = 2;
        updatedAt = 3;
        answeredInRound = 4;
        answer = 1 * (10**8);
    }
}
