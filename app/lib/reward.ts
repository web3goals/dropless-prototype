import { appConfig } from "@/config/app";
import { Household } from "@/mongodb/models/household";
import { ABIFunction, Address, Clause, Transaction } from "@vechain/sdk-core";
import {
  ProviderInternalBaseWallet,
  TESTNET_URL,
  ThorClient,
  VeChainProvider,
} from "@vechain/sdk-network";
import { hexToBytes, parseEther } from "viem";

const CONSUMPTION_PER_PERSON_PER_HOUR = 12 / 30 / 24;

export function calculateReward(
  household: Household,
  newReadingValue: number,
  newReadingDate: Date
): {
  consumption: number;
  avgConsumption: number;
  saving: number;
  impact: bigint;
  reward: bigint;
} {
  console.log("Calculating reward...");

  // Get last reading value
  const lastReading = household.readings.slice(-1)[0];
  if (!lastReading) {
    throw new Error("No previous reading found");
  }
  const lastReadingValue = lastReading.value;
  if (!lastReadingValue) {
    throw new Error("Last reading value is undefined");
  }

  // Calculate consumption
  const consumption = newReadingValue - lastReadingValue;
  if (consumption < 0) {
    throw new Error("Consumption is negative");
  }

  // Calculate average consumption
  const hoursBetweenReadings =
    (newReadingDate.getTime() - lastReading.created.getTime()) /
    (1000 * 60 * 60);
  const avgConsumption =
    household.size * CONSUMPTION_PER_PERSON_PER_HOUR * hoursBetweenReadings;

  // Calculate saving and impact
  const saving = avgConsumption - consumption;
  const impact = BigInt(Math.floor(saving * 1_000_000)); // 1 cubic meter is equal to 1,000,000 mililiters

  // Calculate reward
  const reward =
    saving > 0 ? parseEther(Math.floor(saving).toString()) : parseEther("0"); // 1 $B3TR per cubic meter saved

  return {
    consumption,
    avgConsumption,
    saving,
    impact,
    reward,
  };
}

export async function sendReward(
  amount: bigint,
  receiver: string,
  proof: string,
  impact: bigint
): Promise<string> {
  console.log("Sending reward...");

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
      amount,
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
