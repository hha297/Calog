import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const aiService = {
  analyzeFood: async (imageData: string) => {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this food image and provide calorie information" },
            { type: "image_url", image_url: { url: imageData } }
          ]
        }
      ]
    });
    return response.choices[0].message.content;
  },
};
