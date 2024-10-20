import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const judgeRouter = createTRPCRouter({
  getPrompt: protectedProcedure.query(() => {
    return "hello world";
  }),
  getScore: protectedProcedure.query(({ input }) => {
    return input;
  }),
});
