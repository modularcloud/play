import { NextRequest, NextResponse } from "next/server";
import { createWallet, getAddress } from "./auth";
// import { Sequencer } from "./sequencer";

export async function middleware(request: NextRequest) {
  const readRequest = request.method === "GET" || request.method === "HEAD";

  let session = request.cookies.get("session")?.value;
  let address: string | null = null;
  if (session) {
    address = await getAddress(session);
  } else {
    const wallet = await createWallet();
    address = wallet.walletAddress;
    session = wallet.id;
  }

  if (readRequest) {
    let response = NextResponse.next();

    if (!request.cookies.get("session")?.value) {
      request.cookies.set({
        name: "session",
        value: session,
      });

      response = NextResponse.next({
        request,
      });
      response.cookies.set({
        name: "session",
        value: session,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }

    return response;
  }

  const body = await request.text();

  // await Sequencer.enqueue({
  //   method: request.method,
  //   path: request.nextUrl.pathname,
  //   headers: {
  //     "accept": request.headers.get("accept") || "*/*",
  //     "content-type": request.headers.get("content-type"),
  //     "next-action": request.headers.get("next-action"),
  //     "next-router-state-tree": request.headers.get("next-router-state-tree"),
  //   },
  //   body,
  //   address,
  // });

  console.log("next-action", request.headers.get("next-action"));

  const response = await fetch(
    request.url.replace(
      String(process.env.BASE_URL),
      "https://play.modular.cloud"
    ),
    {
      method: request.method,
      headers: {
        cookie: `session=${session};`,
        accept: request.headers.get("accept") || "*/*",
        "content-type": request.headers.get("content-type"),
        "next-action": request.headers.get("next-action"),
        "next-router-state-tree": request.headers.get("next-router-state-tree"),
      } as any,
      body,
    }
  );

  // await Sequencer.next();
  return response;
}
