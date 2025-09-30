import hre from "hardhat";
import { Hex } from "viem";
import DropLess from "../artifacts/contracts/DropLess.sol/DropLess.json";
import { vechainTestnet } from "./chains/vechain-testnet";

async function main() {
  console.log("Deploying DropLess...");

  if (hre.network.name !== "vechainTestnet") {
    console.error("This script only works on the VeChain Testnet, exiting...");
    return;
  }

  const publicClient = await hre.viem.getPublicClient({
    chain: vechainTestnet,
  });
  const [walletClient] = await hre.viem.getWalletClients({
    chain: vechainTestnet,
  });

  const x2EarnRewardsPool = "0x5F8f86B8D0Fa93cdaE20936d150175dF0205fB38";
  const appId =
    "0x00127a8f5162281cd3a25c7c124269217951a93490ec0e8ba3ba3a6edd6b9c24";

  const hash = await walletClient.deployContract({
    abi: DropLess.abi,
    bytecode: DropLess.bytecode as Hex,
    args: [x2EarnRewardsPool, appId],
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  const contractAddress = receipt.contractAddress;
  console.log("DropLess deployed to:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
