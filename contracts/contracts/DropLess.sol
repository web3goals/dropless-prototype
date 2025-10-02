// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IX2EarnRewardsPool.sol";

contract DropLess is Ownable, ReentrancyGuard {
    event RewardClaimed(uint256 amount, address receiver);
    event RewardSent(uint256 amount, address receiver);

    IX2EarnRewardsPool public x2EarnRewardsPool;
    bytes32 public appId;

    constructor(
        IX2EarnRewardsPool _x2EarnRewardsPool,
        bytes32 _appId
    ) Ownable(msg.sender) {
        x2EarnRewardsPool = _x2EarnRewardsPool;
        appId = _appId;
    }

    function sendReward(
        uint256 _amount,
        address _receiver,
        string memory _proof,
        uint256 _impact
    ) external onlyOwner nonReentrant {
        string[] memory proofTypes = new string[](1);
        proofTypes[0] = "link";

        string[] memory proofValues = new string[](1);
        proofValues[0] = _proof;

        string[] memory impactCodes = new string[](1);
        impactCodes[0] = "water";

        uint256[] memory impactValues = new uint256[](1);
        impactValues[0] = _impact;

        string
            memory description = "User consumed less water than the average household";

        x2EarnRewardsPool.distributeRewardWithProof(
            appId,
            _amount,
            _receiver,
            proofTypes,
            proofValues,
            impactCodes,
            impactValues,
            description
        );

        emit RewardSent(_amount, _receiver);
    }
}
