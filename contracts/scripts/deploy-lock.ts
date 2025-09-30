import hre from "hardhat";
import { Hex } from "viem";
import Lock from "../artifacts/contracts/Lock.sol/Lock.json";
import { vechainTestnet } from "./chains/vechain-testnet";

async function main() {
  console.log("Deploying Lock...");

  if (hre.network.name !== "vechainTestnet") {
    console.error("This script only works on the VeChain Testnet, exiting...");
    return;
  }

  const publicClient = await hre.viem.getPublicClient({
    chain: vechainTestnet,
  });
  const [wallet] = await hre.viem.getWalletClients({ chain: vechainTestnet });

  const hash = await wallet.deployContract({
    abi: Lock.abi,
    bytecode: Lock.bytecode as Hex,
    args: [wallet.account.address],
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  const contractAddress = receipt.contractAddress;
  console.log("Lock deployed to:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
