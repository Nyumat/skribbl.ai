import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import OpenAI from "openai";

export const judgeRouter = createTRPCRouter({
  getPrompt: protectedProcedure.query(async () => {
    const openai = new OpenAI();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content:
            "Generate a creative idea for something to draw. It can be a character, animal, or object. Examples of animals include a cat, dog, or tiger. Examples of characters include classic figures like Mickey Mouse, Winnie the Pooh, or the Lorax. You can also suggest objects like a car, table, or chair. Please make the suggestion imaginative and fun, and feel free to combine different elements, like a flying tiger or a robot cat playing a guitar. Please limit your response to just the idea and nothing else",
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
