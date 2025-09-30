// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./interfaces/IX2EarnRewardsPool.sol";

contract DropLess {
    event RewardClaimed(uint256 amount, address receiver);

    IX2EarnRewardsPool public x2EarnRewardsPool;
    bytes32 public appId;

    constructor(IX2EarnRewardsPool _x2EarnRewardsPool, bytes32 _appId) {
        x2EarnRewardsPool = _x2EarnRewardsPool;
        appId = _appId;
    }

    function claimReward(uint256 _amount) external {
        x2EarnRewardsPool.distributeReward(
            appId,
            _amount,
            msg.sender,
            "" // proof and impacts not provided
        );

        emit RewardClaimed(_amount, msg.sender);
    }
}
