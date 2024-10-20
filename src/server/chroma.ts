import { ChromaClient } from "chromadb";

import { env } from "~/env";

const createChromaClient = () => {
  const chromaClient = new ChromaClient({ path: "http://localhost:8000" });
  return chromaClient;
};

const globalForChroma = globalThis as unknown as {
  chroma: ReturnType<typeof createChromaClient> | undefined;
};

export const chroma = globalForChroma.chroma ?? createChromaClient();

if (env.NODE_ENV !== "production") globalForChroma.chroma = chroma;
