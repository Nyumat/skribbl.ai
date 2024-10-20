import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { dot, norm } from "mathjs";

export const embeddingRouter = createTRPCRouter({
  calculateAndStore: protectedProcedure
    .input(
      z.object({
        embedding1: z.array(z.number()),
        embedding2: z.array(z.number()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { embedding1, embedding2 } = input;

      if (embedding1.length !== embedding2.length) {
        throw new Error("Embeddings must be of the same dimension.");
      }

      const norm1 = norm(embedding1) as number;
      const norm2 = norm(embedding2) as number;
      const normalizedEmbedding1 = embedding1.map((val) => val / norm1);
      const normalizedEmbedding2 = embedding2.map((val) => val / norm2);

      const dotProduct = dot(normalizedEmbedding1, normalizedEmbedding2);

      const id1: string = crypto.randomUUID();
      const id2: string = crypto.randomUUID();

      const metadata1 = { id: id1 };
      const metadata2 = { id: id2 };

      // Ensure the collection exists or create it
      let collection;
      try {
        collection = await ctx.chroma.getOrCreateCollection({
          name: "embeddingsCollection",
          metadata: { description: "Collection for storing user embeddings." },
        });
      } catch (error) {
        console.error("Failed to get or create Chroma collection:", error);
        throw new Error("Error ensuring collection exists in Chroma.");
      }

      // Store embeddings in the Chroma collection
      try {
        await collection.add({
          ids: [id1, id2],
          embeddings: [normalizedEmbedding1, normalizedEmbedding2],
        });
      } catch (error) {
        console.error("Failed to store embeddings in Chroma:", error);
        throw new Error("Error storing embeddings in Chroma.");
      }

      // Store in the PostgreSQL database using Prisma
      try {
        const result = await ctx.db.embedding.create({
          data: {
            id1: id1,
            id2: id2,
            dotProduct: dotProduct,
            createdById: ctx.session.user.id,
          },
        });

        // Return metadata and dot product score
        return {
          metadata1,
          metadata2,
          dotProduct,
          result,
        };
      } catch (error) {
        console.error("Failed to store embeddings in the database:", error);
        throw new Error("Error storing embeddings in the database.");
      }
    }),
});
