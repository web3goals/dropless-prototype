import { createFailedApiResponse, createSuccessApiResponse } from "@/lib/api";
import { ABIFunction, Address, Clause, Transaction } from "@vechain/sdk-core";
import {
  ProviderInternalBaseWallet,
  TESTNET_URL,
  ThorClient,
  VeChainProvider,
} from "@vechain/sdk-network";
import { hexToBytes, parseEther } from "viem";

export async function POST() {
  try {
    console.log("Using contracts...");

    // Init VeChain client
    const thorClient = ThorClient.at(TESTNET_URL);

    // Init wallet, provider and signer
    const accountAddress = process.env.ACCOUNT_ADDRESS as string;
    const accountPrivateKey = hexToBytes(
      process.env.ACCOUNT_PRIVATE_KEY as `0x${string}`
    );
    const wallet = new ProviderInternalBaseWallet([
      { privateKey: accountPrivateKey, address: accountAddress },
    ]);
    const provider = new VeChainProvider(thorClient, wallet, false);
    const signer = await provider.getSigner(accountAddress);
    if (!signer) {
      throw new Error("Failed to get signer");
    }

    // Init clauses
    const contractAddress = Address.of(
      "0x12d4e8aca8a572fa19d8feacc3d4808dd468106f"
    );
    const functionAbi = new ABIFunction({
      type: "function",
      name: "sendReward",
      inputs: [
        { name: "_amount", type: "uint256" },
        { name: "_receiver", type: "address" },
        { name: "_proof", type: "string" },
        { name: "_impact", type: "uint256" },
      ],
      outputs: [],
      constant: false,
      payable: false,
      stateMutability: "nonpayable",
    });
    const clauses = [
      Clause.callFunction(contractAddress, functionAbi, [
        parseEther("1"),
        "0xc958bebb81048ba99dcea94db4d7d4e4509db23d",
        "https://yellow-mute-echidna-168.mypinata.cloud/ipfs/bafybeie26ryfm3bmud6d5qetjdn3xly5uof4uwwo6yxclavoubuhzcek3e",
        1_000_000,
      ]),
    ];

    // Estimate gas
    const gasResult = await thorClient.transactions.estimateGas(
      clauses,
      accountAddress
    );

    // Build transaction
    const txBody = await thorClient.transactions.buildTransactionBody(
      clauses,
      gasResult.totalGas
    );

    // Sign and send transaction
    const signedTransaction = Transaction.of(txBody).sign(accountPrivateKey);
    const transactionResult = await thorClient.transactions.sendTransaction(
      signedTransaction
    );
    console.log("Transaction id:", transactionResult.id);

    // Wait for transaction receipt
    const receipt = await thorClient.transactions.waitForTransaction(
      transactionResult.id
    );
    console.log("Transaction receipt:", receipt);

    return createSuccessApiResponse();
  } catch (error) {
    console.error("Failed to use contracts:", error);
    return createFailedApiResponse(
      { message: "Internal server error, try again later" },
      500
    );
  }
}
