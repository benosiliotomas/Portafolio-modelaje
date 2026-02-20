
import { GoogleGenAI } from "@google/genai";
import type { AspectRatio } from '../types';

// Lazily initialize to avoid crashing the app on startup if API_KEY is not set.
// The error will be thrown when a Gemini feature is used, which is caught by the UI.
let aiInstance: GoogleGenAI | null = null;
const getAi = (): GoogleGenAI => {
  if (!aiInstance) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY is not configured. Please set it in the environment variables.");
    }
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiInstance;
}

export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  try {
    const ai = getAi();
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image was generated.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    // Re-throw the original error to allow the UI to display a specific message.
    throw error;
  }
};


export const generateArtisticConcept = async (prompt: string): Promise<string> => {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: `Analyze this scene and generate an artistic, evocative, and brief concept or description for it. Focus on mood, emotion, and storytelling. Scene: "${prompt}"`,
      config: {
        systemInstruction: "You are a poetic art critic. Your descriptions are elegant, concise, and profound.",
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating concept:", error);
    // Re-throw the original error to allow the UI to display a specific message.
    throw error;
  }
};
