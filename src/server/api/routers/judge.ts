import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import OpenAI from "openai";
import { z } from "zod";

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
  getScore: protectedProcedure
    .input(
      z.object({
        image: z.string(), // Base64-encoded image string
        text: z.string(), // Text description or content to be graded
      }),
    )
    .mutation(async ({ input }) => {
      const { image, text } = input;

      // Initialize OpenAI client
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY, // Make sure to set your OpenAI API key in environment variables
      });

      // Prepare the input message to GPT-4o
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert art critic. You will be given a text description and an image. Your task is to evaluate how accurately the image matches the description. Please provide a score from 0 to 100 based on the following criteria:

            - **Score Range**:
              - 0-20: The image does not match the description at all.
              - 21-40: The image has some elements of the description, but they are mostly incorrect or missing.
              - 41-60: The image captures a few key aspects of the description but lacks detail or accuracy.
              - 61-80: The image matches the description well, with most elements accurately depicted.
              - 81-100: The image perfectly matches the description, capturing all details accurately and comprehensively.

            - **Considerations**:
              1. **Accuracy**: How closely does the image represent the elements mentioned in the text?
              2. **Relevance**: Are the elements in the image relevant to the description, or are there extraneous details?
              3. **Detail**: How well are the details in the description reflected in the image? Does the image omit any key aspects mentioned in the text?

            Please provide only the score, without any additional comments or explanations.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Text Description: "${text}"`,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${image}`,
                },
              },
            ],
          },
        ],
      });

      // Check for a response
      if (completion && completion.choices[0]) {
        const scoreMessage = completion.choices[0].message?.content;
        const parsedScore = parseFloat(scoreMessage);
        if (!isNaN(parsedScore)) {
          return { score: parsedScore };
        }
        return { error: "Invalid score format received from GPT-4o." };
      }

      return { error: "Unable to retrieve a score" };
    }),
});
