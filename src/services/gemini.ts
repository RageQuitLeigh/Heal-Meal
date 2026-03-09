import { GoogleGenAI, Type } from "@google/genai";
import { HealthCondition, Recipe } from "../types";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export async function generateRecipe(
  mealName: string,
  condition: HealthCondition,
  servings: number,
  unitSystem: 'US' | 'Metric'
): Promise<Recipe> {
  const prompt = `
    Create a detailed recipe for "${mealName}" specifically adapted for someone with the health condition: "${condition}".
    
    Requirements:
    1. The recipe must be safe for the condition: ${condition}.
    2. Use ${unitSystem} units.
    3. Scale the recipe for ${servings} servings.
    4. Do not just omit ingredients; find creative, safe alternatives that maintain the essence of the original meal.
    5. Include nutritional information per serving.
    6. Provide a "modifications" section explaining what was changed from a traditional version and why.
    7. Suggest 3 similar alternative meals that are also safe for this condition.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          servings: { type: Type.NUMBER },
          prepTime: { type: Type.STRING },
          cookTime: { type: Type.STRING },
          ingredients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                item: { type: Type.STRING },
                amount: { type: Type.STRING },
                unit: { type: Type.STRING },
              },
              required: ["item", "amount", "unit"],
            },
          },
          instructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          nutrition: {
            type: Type.OBJECT,
            properties: {
              calories: { type: Type.NUMBER },
              protein: { type: Type.STRING },
              carbs: { type: Type.STRING },
              fat: { type: Type.STRING },
              fiber: { type: Type.STRING },
              sodium: { type: Type.STRING },
              sugar: { type: Type.STRING },
            },
            required: ["calories", "protein", "carbs", "fat"],
          },
          modifications: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING },
                replacement: { type: Type.STRING },
                reason: { type: Type.STRING },
              },
              required: ["original", "replacement", "reason"],
            },
          },
          suggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ["title", "description"],
            },
          },
        },
        required: [
          "title", "description", "servings", "prepTime", "cookTime", 
          "ingredients", "instructions", "nutrition", "modifications", "suggestions"
        ],
      },
    },
  });

  return JSON.parse(response.text || "{}") as Recipe;
}

export async function generateRecipeImage(recipeTitle: string, condition: string): Promise<string> {
  const prompt = `A high-quality, professional food photography shot of ${recipeTitle}. The meal is prepared specifically for a ${condition} diet. It looks appetizing, fresh, and beautifully plated on a clean background. Natural lighting.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: prompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  return "";
}
