import { createPublicClient, formatUnits, http, type Address } from "viem";
import { bsc } from "viem/chains";
import { config } from "../config.js";
import { ownershipStatus } from "@memeguard/shared";

const erc20Abi = [
  { type: "function", name: "name", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "symbol", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "decimals", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  { type: "function", name: "totalSupply", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "owner", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] }
] as const;

const client = createPublicClient({
  chain: bsc,
  transport: http(config.bscRpcUrl)
});

async function safeRead<T>(fn: () => Promise<T>, warnings: string[]): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    warnings.push(error instanceof Error ? error.message : "RPC read failed");
    return null;
  }
}

export async function fetchRpcEvidence(address: string, warnings: string[]) {
  const tokenAddress = address as Address;
  const bytecode = await safeRead(() => client.getBytecode({ address: tokenAddress }), warnings);
  const name = await safeRead(() => client.readContract({ address: tokenAddress, abi: erc20Abi, functionName: "name" }), warnings);
  const symbol = await safeRead(() => client.readContract({ address: tokenAddress, abi: erc20Abi, functionName: "symbol" }), warnings);
  const decimals = await safeRead(() => client.readContract({ address: tokenAddress, abi: erc20Abi, functionName: "decimals" }), warnings);
  const totalSupply = await safeRead(() => client.readContract({ address: tokenAddress, abi: erc20Abi, functionName: "totalSupply" }), warnings);
  const owner = await safeRead(() => client.readContract({ address: tokenAddress, abi: erc20Abi, functionName: "owner" }), warnings);

  return {
    token: {
      address,
      name: typeof name === "string" ? name : null,
      symbol: typeof symbol === "string" ? symbol : null,
      decimals: typeof decimals === "number" ? decimals : null,
      totalSupplyRaw: typeof totalSupply === "bigint" ? totalSupply.toString() : null,
      totalSupplyFormatted: typeof totalSupply === "bigint" && typeof decimals === "number" ? formatUnits(totalSupply, decimals) : null,
      bytecodeFound: Boolean(bytecode && bytecode !== "0x")
    },
    ownerAddress: typeof owner === "string" ? owner : null,
    ownershipStatus: ownershipStatus(typeof owner === "string" ? owner : null)
  };
}
