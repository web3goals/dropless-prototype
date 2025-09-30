import hre from "hardhat";
import { Address } from "viem";
import Lock from "../artifacts/contracts/Lock.sol/Lock.json";
import { vechainTestnet } from "./chains/vechain-testnet";

async function main() {
  console.log("Using Lock...");

  if (hre.network.name !== "vechainTestnet") {
    console.error("This script only works on the VeChain Testnet, exiting...");
    return;
  }

  const publicClient = await hre.viem.getPublicClient({
    chain: vechainTestnet,
  });
  const owner = await publicClient.readContract({
    abi: Lock.abi,
    address: "0x44b70f1a20fe1e22df1e4e78e88c28d179d52476" as Address,
    functionName: "owner",
  });
  console.log("Owner:", owner);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
