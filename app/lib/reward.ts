import { appConfig } from "@/config/app";
import { ABIFunction, Address, Clause, Transaction } from "@vechain/sdk-core";
import {
  ProviderInternalBaseWallet,
  TESTNET_URL,
  ThorClient,
  VeChainProvider,
} from "@vechain/sdk-network";
import { hexToBytes, parseEther } from "viem";

// TODO: Implement
export function calculateReward(): {
  consumption: number | undefined;
  avgConsumption: number | undefined;
  saving: number | undefined;
  impact: number | undefined;
  reward: string | undefined;
} {
  const consumption = 20;
  const avgConsumption = 24;
  const saving = 4;
  const impact = saving * 1_000_000; // 1 cubic meter is equal to 1,000,000 mililiters
  const reward = parseEther("4").toString(); // 1 $B3TR per cubic meter saved

  return {
    consumption,
    avgConsumption,
    saving,
    impact,
    reward,
  };
}

export async function sendReward(
  amount: string,
  receiver: string,
  proof: string,
  impact: number
): Promise<string> {
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
  const contractAddress = Address.of(appConfig.contracts.dropless);
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
      BigInt(amount),
      receiver,
      proof,
      impact,
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

  // // Wait for transaction receipt
  // const receipt = await thorClient.transactions.waitForTransaction(
  //   transactionResult.id
  // );

  return transactionResult.id;
}
