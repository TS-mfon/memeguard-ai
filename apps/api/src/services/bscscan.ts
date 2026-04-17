import { config } from "../config.js";

type BscScanResult<T> = {
  status: string;
  message: string;
  result: T;
};

async function callBscScan<T>(params: Record<string, string>, warnings: string[]): Promise<T | null> {
  if (!config.bscScanApiKey) {
    warnings.push("BSCSCAN_API_KEY is not configured; explorer enrichment skipped.");
    return null;
  }
  const url = new URL("https://api.bscscan.com/api");
  for (const [key, value] of Object.entries({ ...params, apikey: config.bscScanApiKey })) {
    url.searchParams.set(key, value);
  }
  try {
    const response = await fetch(url);
    const json = (await response.json()) as BscScanResult<T>;
    if (json.status === "0" && typeof json.result === "string") {
      warnings.push(`BscScan warning: ${json.result}`);
      return null;
    }
    return json.result;
  } catch (error) {
    warnings.push(error instanceof Error ? error.message : "BscScan request failed");
    return null;
  }
}

export async function fetchBscScanEvidence(address: string, warnings: string[]) {
  const source = await callBscScan<Array<{ SourceCode: string; ABI: string; ContractName: string }>>(
    { module: "contract", action: "getsourcecode", address },
    warnings
  );
  const creator = await callBscScan<Array<{ contractCreator: string; txHash: string }>>(
    { module: "contract", action: "getcontractcreation", contractaddresses: address },
    warnings
  );
  const supply = await callBscScan<string>(
    { module: "stats", action: "tokensupply", contractaddress: address },
    warnings
  );
  const transfers = await callBscScan<Array<{ from: string; to: string; timeStamp: string }>>(
    { module: "account", action: "tokentx", contractaddress: address, page: "1", offset: "100", sort: "desc" },
    warnings
  );

  const sourceEntry = Array.isArray(source) ? source[0] : null;
  const creatorEntry = Array.isArray(creator) ? creator[0] : null;
  const transferList = Array.isArray(transfers) ? transfers : null;
  const participants = new Set<string>();
  transferList?.forEach((transfer) => {
    participants.add(transfer.from.toLowerCase());
    participants.add(transfer.to.toLowerCase());
  });

  return {
    sourceVerified: sourceEntry ? Boolean(sourceEntry.SourceCode && sourceEntry.ABI !== "Contract source code not verified") : null,
    creatorAddress: creatorEntry?.contractCreator ?? null,
    creationTxHash: creatorEntry?.txHash ?? null,
    creationTimestamp: transferList?.at(-1)?.timeStamp ? new Date(Number(transferList.at(-1)?.timeStamp) * 1000).toISOString() : null,
    bscScanSupplyRaw: typeof supply === "string" ? supply : null,
    marketActivity: {
      transferCount: transferList?.length ?? null,
      recentTransferCount: transferList?.filter((transfer) => Date.now() - Number(transfer.timeStamp) * 1000 < 24 * 60 * 60 * 1000).length ?? null,
      uniqueParticipants: transferList ? participants.size : null,
      concentrationFlag: transferList ? participants.size <= 3 && transferList.length >= 10 : null
    }
  };
}
