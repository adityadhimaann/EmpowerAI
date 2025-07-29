import { GoogleGenAI, Type } from "@google/genai";
import { SlideData, RepoNode, TemplateData } from '../types';

if (!import.meta.env.VITE_API_KEY) {
    throw new Error("VITE_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

const presentationSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: "A concise and engaging title for the slide.",
        },
        content: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
          description: "An array of 3-4 bullet points for the slide content. Each point should be a complete sentence.",
        },
        speakerNotes: {
            type: Type.STRING,
            description: "Brief speaker notes for the presenter for this slide."
        }
      },
      required: ["title", "content"],
    },
};

const repoStructureSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    type: { type: Type.STRING, enum: ['folder'] },
    children: {
      type: Type.ARRAY,
      items: {
        // Level 1 nodes
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['folder', 'file'] },
          children: {
            type: Type.ARRAY,
            items: {
              // Level 2 nodes
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['folder', 'file'] },
                children: {
                  type: Type.ARRAY,
                  items: {
                    // Level 3 nodes
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      type: { type: Type.STRING, enum: ['folder', 'file'] },
                    },
                    required: ["name", "type"],
                  },
                },
              },
              required: ["name", "type"],
            },
          },
        },
        required: ["name", "type"],
      },
    },
  },
  required: ["name", "type", "children"],
};


export const generatePresentation = async (projectIdea: string, template?: TemplateData): Promise<SlideData[]> => {
  try {
    let prompt = '';
    
    if (template) {
      // Generate based on template structure
      prompt = `
        You are an expert presentation creator. Create a compelling presentation based on the user's project idea using the provided template structure.
        
        Template: ${template.name}
        Template Description: ${template.description}
        Template Category: ${template.category}
        
        Template Structure:
        ${template.slides.map((slide: any, index: number) => `
        - Slide ${index + 1}: ${slide.title} (${slide.content?.join(', ') || 'Create relevant content'})
        `).join('')}
        
        Create exactly ${template.slides.length} slides following this structure. For each slide, create:
        1. A compelling title based on the template structure
        2. 3-4 bullet points of content relevant to the project idea
        3. Brief and engaging speaker notes
        
        Make sure the content is specifically tailored to: "${projectIdea}"
        
        The presentation should be professional, engaging, and follow the ${template.category} category style.
      `;
    } else {
      // Default hackathon pitch deck structure
      prompt = `
        You are an expert pitch deck creator for tech hackathons. Your task is to generate a compelling 5-slide presentation based on the user's project idea.
        The presentation must follow this structure:
        - Slide 1: The Problem (Hook the audience by clearly defining the problem).
        - Slide 2: Our Solution (Introduce the project as the clear solution).
        - Slide 3: Key Features (Showcase the 3-4 most impactful features).
        - Slide 4: Tech Stack & Architecture (Briefly explain the technology used).
        - Slide 5: Impact & Vision (End with a strong call to action or future vision).
        
        For each slide, create a short, powerful title and 3-4 bullet points of content. Also provide brief speaker notes.
        
        Project Idea: "${projectIdea}"
      `;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: presentationSchema,
        thinkingConfig: { thinkingBudget: 0 }
      },
    });
    
    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Empty response from AI");
    }
    const slides = JSON.parse(jsonText) as SlideData[];
    return slides;

  } catch (error) {
    console.error("Error generating presentation:", error);
    throw new Error("Failed to generate presentation from AI. The model may be unavailable or the request was invalid.");
  }
};

export const generateRepoStructure = async (projectIdea: string): Promise<RepoNode> => {
  try {
    const prompt = `
      You are a senior software architect. Based on the following project idea, generate a logical and well-structured repository directory.
      - The root folder should be named after the project idea (e.g., 'my-ai-app').
      - Include common folders like 'src', 'public', 'components', 'services', 'hooks', 'utils'.
      - Include standard configuration files like 'package.json', 'README.md', '.gitignore', and a framework-specific config (e.g., 'vite.config.ts' for a React/Vite project).
      - The structure should be logical for a modern web application, assume a React with Vite setup.
      
      Project Idea: "${projectIdea}"
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: repoStructureSchema,
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Empty response from AI");
    }
    return JSON.parse(jsonText) as RepoNode;

  } catch (error) {
    console.error("Error generating repository structure:", error);
    throw new Error("Failed to generate repository structure from AI.");
  }
}

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequestsPerMinute: 8, // Conservative limit, below the 10/min free tier limit
  requestTimestamps: [] as number[]
};

// Utility function to wait
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Rate limiter function
const waitForRateLimit = async () => {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  
  // Remove timestamps older than 1 minute
  RATE_LIMIT.requestTimestamps = RATE_LIMIT.requestTimestamps.filter(
    timestamp => timestamp > oneMinuteAgo
  );
  
  // If we're at the limit, wait
  if (RATE_LIMIT.requestTimestamps.length >= RATE_LIMIT.maxRequestsPerMinute) {
    const oldestRequest = Math.min(...RATE_LIMIT.requestTimestamps);
    const waitTime = oldestRequest + 60000 - now + 1000; // Add 1 second buffer
    
    if (waitTime > 0) {
      console.log(`Rate limit reached. Waiting ${Math.ceil(waitTime / 1000)} seconds...`);
      await delay(waitTime);
    }
  }
  
  // Record this request
  RATE_LIMIT.requestTimestamps.push(now);
};

// Retry function with exponential backoff
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const isRateLimit = error?.message?.includes('429') || 
                         error?.message?.includes('RESOURCE_EXHAUSTED') ||
                         error?.message?.includes('quota');
      
      if (isRateLimit && attempt < maxRetries - 1) {
        const waitTime = baseDelay * Math.pow(2, attempt); // Exponential backoff
        console.log(`Rate limit hit, retrying in ${waitTime / 1000} seconds... (attempt ${attempt + 1}/${maxRetries})`);
        await delay(waitTime);
        continue;
      }
      
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
};

export const generateFileContent = async (projectIdea: string, structure: RepoNode, filePath: string): Promise<string> => {
    try {
        // Wait for rate limit before making request
        await waitForRateLimit();
        
        // Helper function to clean markdown code blocks from generated content
        const cleanCodeContent = (content: string): string => {
            // Remove markdown code blocks (```language and ```)
            return content
                .replace(/^```[\w\-]*\n?/gm, '') // Remove opening code blocks
                .replace(/\n?```$/gm, '') // Remove closing code blocks
                .replace(/```/g, '') // Remove any remaining triple backticks
                .trim();
        };
        
        const generateContent = async () => {
            const prompt = `
            You are an expert software developer specializing in React and TypeScript.
            Your task is to generate the complete and correct code for a single file within a larger project.

            Project Context:
            - Main Idea: "${projectIdea}"
            - Full Repository Structure: ${JSON.stringify(structure, null, 2)}
            - Target File Path: "${filePath}"

            Instructions:
            - Generate the full, runnable source code for the specified file path.
            - The code should be production-quality, clean, and follow modern best practices.
            - Ensure the generated code is consistent with the other files in the repository structure (e.g., import paths, component names).
            - For a 'package.json', include necessary dependencies like 'react', 'react-dom', 'vite', 'tailwindcss', etc.
            - For components, generate functional React components with TypeScript.
            - For CSS or style files, provide appropriate styles for a modern, clean UI.
            
            CRITICAL: Return ONLY the raw source code for the file. NO markdown code blocks, NO explanations, NO additional text. Just the pure code content.
            `;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });

            const responseText = response.text;
            if (!responseText) {
                throw new Error("Empty response from AI");
            }
            
            // Clean any markdown formatting that might be present
            return cleanCodeContent(responseText);
        };

        return await retryWithBackoff(generateContent);

    } catch (error: any) {
        console.error(`Error generating content for ${filePath}:`, error);
        
        // Provide more specific error messages
        if (error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
            throw new Error(`Rate limit exceeded for ${filePath}. Please wait a moment and try again.`);
        } else if (error?.message?.includes('quota')) {
            throw new Error(`API quota exceeded for ${filePath}. Please check your billing or try again later.`);
        } else {
            throw new Error(`Failed to generate code for file: ${filePath}. ${error?.message || 'Unknown error'}`);
        }
    }
};