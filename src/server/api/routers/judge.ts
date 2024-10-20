import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import OpenAI from "openai";

export const judgeRouter = createTRPCRouter({
  getPrompt: protectedProcedure.query(async () => {
    const openai = new OpenAI();
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content:
            "Generate a three word sentence where the sentence consists of a random object/animal of your choosing. an adjective to describe the object/animal and a verb to describe what it's doing",
        },
      ],
    });
    if (completion && completion.choices[0])
      return completion.choices[0].message;
    return "Unable to retrieve message";
  }),
  getScore: protectedProcedure.query(({ input }) => {
    return input;
  }),
});
