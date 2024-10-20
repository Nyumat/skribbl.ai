const createChromaClient = async () => {
  if (typeof window !== "undefined") {
    throw new Error("ChromaClient should only be used on the server side");
  }

  const { ChromaClient } = await import("chromadb");
  const chromaClient = new ChromaClient({ path: "http://localhost:8000" });
  return chromaClient;
};

const globalForChroma = globalThis as unknown as {
  chroma: Awaited<ReturnType<typeof createChromaClient>> | undefined;
};

export const getChroma = async () => {
  if (!globalForChroma.chroma) {
    globalForChroma.chroma = await createChromaClient();
  }
  return globalForChroma.chroma;
};
