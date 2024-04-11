import { unstable_cache } from "next/cache";
import { cache } from "react";

type Callback = (...args: any[]) => Promise<any>;
export function nextCache<T extends Callback>(
  cb: T,
  options: {
    tags: string[];
    revalidateTimeInSeconds?: number;
  }
) {
  return cache(
    unstable_cache(cb, options.tags, {
      tags: options.tags,
      revalidate: options.revalidateTimeInSeconds
    })
  );
}
