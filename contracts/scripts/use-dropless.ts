import hre from "hardhat";
import { Address, parseEther } from "viem";
import DropLess from "../artifacts/contracts/DropLess.sol/DropLess.json";
import { vechainTestnet } from "./chains/vechain-testnet";

async function main() {
  console.log("Using DropLess...");

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

  const { request } = await publicClient.simulateContract({
    abi: DropLess.abi,
    address: "0x6679a4254aafbbb189c5028bd1a2f0a83daacbe5" as Address,
    functionName: "claimReward",
    args: [parseEther("1")],
    account: walletClient.account,
  });
  const hash = await walletClient.writeContract(request);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Receipt:", receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
