import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { dot, norm } from "mathjs";

export const embeddingRouter = createTRPCRouter({
  computeClipEmbeddings: protectedProcedure
    .input(
      z.object({
        image: z.string(), // Base64-encoded image string
        text: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (typeof window !== "undefined") {
        throw new Error("This procedure can only be called on the server.");
      }

      // Dynamically import required modules
      const { pipeline } = await import("@xenova/transformers");
      const fs = await import("fs");
      const { join } = await import("path");
      const { Buffer } = await import("buffer");

      const { image: base64Image, text } = input;

      // Decode the base64 image
      const imageBuffer = Buffer.from(base64Image, "base64");

      // Save the image temporarily
      const tempImagePath = join("/tmp", `temp_image_${Date.now()}.png`);
      await fs.promises.writeFile(tempImagePath, imageBuffer);

      try {
        // Create a pipeline for the CLIP model
        const pipe = await pipeline(
          "feature-extraction",
          "Xenova/clip-vit-base-patch32",
        );

        // Compute image embedding
        const imageEmbedding = await pipe(tempImagePath);

        // Compute text embedding
        const textEmbedding = await pipe(text);

        // Optionally normalize embeddings
        // const normImage = norm(imageEmbedding.data) as number;
        // const normText = norm(textEmbedding.data) as number;
        // const normalizedImageEmbedding = imageEmbedding.data.map((val: number) => val / normImage);
        // const normalizedTextEmbedding = textEmbedding.data.map((val: number) => val / normText);

        console.log(imageEmbedding);
        console.log(textEmbedding);

        // Return the embeddings
        return {
          imageEmbedding: imageEmbedding.data,
          textEmbedding: textEmbedding.data,
        };
      } catch (error) {
        console.error("Error computing embeddings:", error);
        throw new Error("Failed to compute embeddings.");
      } finally {
        // Clean up the temporary image file
        await fs.promises.unlink(tempImagePath);
      }
    }),
  calculateAndStore: protectedProcedure
    .input(
      z.object({
        embedding1: z.array(z.number()),
        embedding2: z.array(z.number()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { embedding1, embedding2 } = input;

      // const { getChroma } = await import("~/server/chroma");
      // const chroma = await getChroma();

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
      // let collection;
      // try {
      //   collection = await chroma.getOrCreateCollection({
      //     name: "embeddingsCollection",
      //     metadata: { description: "Collection for storing user embeddings." },
      //   });
      // } catch (error) {
      //   console.error("Failed to get or create Chroma collection:", error);
      //   throw new Error("Error ensuring collection exists in Chroma.");
      // }

      // // Store embeddings in the Chroma collection
      // try {
      //   await collection.add({
      //     ids: [id1, id2],
      //     embeddings: [normalizedEmbedding1, normalizedEmbedding2],
      //   });
      // } catch (error) {
      //   console.error("Failed to store embeddings in Chroma:", error);
      //   throw new Error("Error storing embeddings in Chroma.");
      // }

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
  getEmbeddingById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      // const { getChroma } = await import("~/server/chroma");
      // const chroma = await getChroma();

      // Ensure the collection exists or create it
      //   let collection;
      //   try {
      //     collection = await chroma.getOrCreateCollection({
      //       name: "embeddingsCollection",
      //     });
      //   } catch (error) {
      //     console.error("Failed to get or create Chroma collection:", error);
      //     throw new Error("Error ensuring collection exists in Chroma.");
      //   }

      //   // Retrieve embedding from the Chroma collection
      //   try {
      //     const result = await collection.get({
      //       ids: [id],
      //     });

      //     if (result.embeddings.length === 0) {
      //       throw new Error(`Embedding with ID ${id} not found.`);
      //     }

      //     return {
      //       id: id,
      //       embedding: result.embeddings[0],
      //       metadata: result.metadatas ? result.metadatas[0] : null,
      //     };
      //   } catch (error) {
      //     console.error("Failed to retrieve embedding from Chroma:", error);
      //     throw new Error("Error retrieving embedding from Chroma.");
      //   }
      return;
    }),
});
