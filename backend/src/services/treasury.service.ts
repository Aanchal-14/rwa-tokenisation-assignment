import { ethers } from "ethers";
import { provider, treasuryContract, treasuryInterface } from "../chain/contracts.js";
import { config } from "../config.js";

export async function depositPreview(amountEth: string): Promise<string> {
  const rate: bigint = await treasuryContract.rate();
  const tokens = ethers.parseEther(amountEth) * rate;
  return tokens.toString();
}

async function buildUnsignedTx(
  data: string,
  options: { from?: string; valueWei?: string } = {},
) {
  const network = await provider.getNetwork();
  const value = options.valueWei ? BigInt(options.valueWei) : 0n;

  let nonce: number | undefined;
  let gasLimit: bigint | undefined;
  if (options.from) {
    nonce = await provider.getTransactionCount(options.from, "pending");
    gasLimit = await provider.estimateGas({
      to: config.treasuryAddress,
      data,
      value,
      from: options.from,
    });
  }

  const fees = await provider.getFeeData();

  return {
    to: config.treasuryAddress,
    data,
    value: value.toString(),
    chainId: Number(network.chainId),
    from: options.from,
    nonce,
    gasLimit: gasLimit?.toString(),
    maxFeePerGas: fees.maxFeePerGas?.toString(),
    maxPriorityFeePerGas: fees.maxPriorityFeePerGas?.toString(),
    gasPrice: fees.gasPrice?.toString(),
  };
}

export function prepareDeposit(args: { from?: string; amountEth: string; minTokensOut?: string }) {
  const data = treasuryInterface.encodeFunctionData("deposit", [
    BigInt(args.minTokensOut ?? "0"),
  ]);
  return buildUnsignedTx(data, {
    from: args.from,
    valueWei: ethers.parseEther(args.amountEth).toString(),
  });
}

export function prepareWithdraw(args: { from?: string; amountWei: string }) {
  const data = treasuryInterface.encodeFunctionData("withdraw", [BigInt(args.amountWei)]);
  return buildUnsignedTx(data, { from: args.from });
}
