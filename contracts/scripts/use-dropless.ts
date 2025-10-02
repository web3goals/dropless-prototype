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
    address: "0x12d4e8aca8a572fa19d8feacc3d4808dd468106f" as Address,
    functionName: "sendReward",
    args: [
      parseEther("1"),
      "0xc958bebb81048ba99dcea94db4d7d4e4509db23d",
      "https://yellow-mute-echidna-168.mypinata.cloud/ipfs/bafybeie26ryfm3bmud6d5qetjdn3xly5uof4uwwo6yxclavoubuhzcek3e",
      1_000_000,
    ],
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
