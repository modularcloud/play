import { NextRequest } from "next/server";
import { createWallet, getAddress } from "./auth";
import { Sequencer } from "./sequencer";

export async function middleware(request: NextRequest) {
  console.log("middleware");
  const fromSequencer =
    request.headers.get("x-sequencer") === process.env.SEQUENCER_SECRET;
  const readRequest = request.method === "GET" || request.method === "HEAD";
  if (!fromSequencer && !readRequest) {
    let session = request.cookies.get("session")?.value;
    let address: string | null = null;
    if (session) {
      address = await getAddress(session);
    } else {
      const wallet = await createWallet();
      address = wallet.walletAddress;
      session = wallet.id;
    }
    const body = await request.text();
    if (process.env.NODE_ENV === "production") {
      await Sequencer.enqueue({
        method: request.method,
        path: request.nextUrl.pathname,
        headers: {
          "content-type": request.headers.get("content-type"),
          "next-action": request.headers.get("next-action"),
          "next-router-state-tree": request.headers.get(
            "next-router-state-tree"
          )
        },
        body,
        address
      });
    }

    const response = await fetch(request.url, {
      method: request.method,
      headers: {
        cookie: `session=${session};`,
        "content-type": request.headers.get("content-type"),
        "next-action": request.headers.get("next-action"),
        "next-router-state-tree": request.headers.get("next-router-state-tree")
      } as any,
      body
    });

    if (process.env.NODE_ENV === "production") {
      await Sequencer.next();
    }
    response.headers.set("set-cookie", `session=${session};`);
    return response;
  }
}
