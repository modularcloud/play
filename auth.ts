import { kv } from "@vercel/kv";
import { v4 } from "uuid";
import { cookies } from "next/headers";

export async function getAddress(id?: string): Promise<string> {
  const sessionId = id ?? cookies().get("session")?.value;
  let wallet: any;
  if (!sessionId) {
    wallet = await createWallet();
  } else {
    wallet = await kv.get(sessionId);
  }
  if (!wallet) {
    throw new Error("Wallet not found");
  }
  return wallet.walletAddress;
}

async function getAddressByUsershare(
  userShare: string
): Promise<{ walletAddress: string }> {
  return fetch(process.env.MODULAR_CLOUD_WALLET_API + `/v1/wallet/address`, {
    method: "POST",
    body: JSON.stringify({ userShare }),
  }).then((res) => res.json());
}

export async function createWallet() {
  const { userShare } = await fetch(
    process.env.MODULAR_CLOUD_WALLET_API + `/v1/wallet`,
    {
      method: "POST",
    }
  ).then((res) => res.json());
  const { walletAddress } = await getAddressByUsershare(userShare);
  const id = v4();
  await kv.set(id, JSON.stringify({ userShare, walletAddress }));
  return { userShare, walletAddress, id };
}

export async function signMessage(
  userShare: string,
  message: string
): Promise<{ signature: string }> {
  return fetch(process.env.MODULAR_CLOUD_WALLET_API + `/v1/sign-message`, {
    method: "POST",
    body: JSON.stringify({ userShare, message }),
  }).then((res) => res.json());
}
