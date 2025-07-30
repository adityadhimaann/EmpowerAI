import { GoogleGenAI, Type } from "@google/genai";
import { SlideData, RepoNode, TemplateData, CodeQuality } from '../types';

// Enhanced environment validation
const validateEnvironment = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    throw new Error("VITE_API_KEY environment variable not set");
  }
  if (apiKey.length < 20) {
    throw new Error("Invalid API key format");
  }
  return apiKey;
};

const ai = new GoogleGenAI({ apiKey: validateEnvironment() });

// Enhanced schemas with validation and metadata
const presentationSchema = {
  type: Type.OBJECT,
  properties: {
    metadata: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        estimatedDuration: { type: Type.NUMBER },
        targetAudience: { type: Type.STRING },
        difficulty: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced'] },
        tags: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["title", "description", "estimatedDuration", "targetAudience", "difficulty"]
    },
    slides: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: {
            type: Type.STRING,
            description: "A compelling, action-oriented title that captures attention",
          },
          subtitle: {
            type: Type.STRING,
            description: "An optional subtitle for additional context"
          },
          content: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3-5 impactful bullet points, each a complete, engaging sentence",
          },
          speakerNotes: {
            type: Type.STRING,
            description: "Detailed speaker notes with timing, emphasis, and transition cues"
          },
          slideType: {
            type: Type.STRING,
            enum: ['title', 'content', 'comparison', 'demo', 'closing'],
            description: "The type of slide for better formatting"
          },
          visualSuggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Suggestions for visuals, charts, or graphics"
          },
          keyTakeaways: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "1-2 key points the audience should remember"
          }
        },
        required: ["id", "title", "content", "speakerNotes", "slideType"],
      },
    },
    transitions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          fromSlide: { type: Type.STRING },
          toSlide: { type: Type.STRING },
          transitionText: { type: Type.STRING }
        }
      }
    }
  },
  required: ["metadata", "slides"]
};

const repoStructureSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    type: { type: Type.STRING, enum: ['folder'] },
    description: { type: Type.STRING },
    metadata: {
      type: Type.OBJECT,
      properties: {
        framework: { type: Type.STRING },
        language: { type: Type.STRING },
        packageManager: { type: Type.STRING },
        buildTool: { type: Type.STRING },
        estimatedFiles: { type: Type.NUMBER },
        complexity: { type: Type.STRING, enum: ['Simple', 'Moderate', 'Complex', 'Enterprise'] }
      }
    },
    children: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['folder', 'file'] },
          description: { type: Type.STRING },
          purpose: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ['critical', 'important', 'optional'] },
          children: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['folder', 'file'] },
                description: { type: Type.STRING },
                purpose: { type: Type.STRING },
                priority: { type: Type.STRING, enum: ['critical', 'important', 'optional'] },
                children: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      type: { type: Type.STRING, enum: ['folder', 'file'] },
                      description: { type: Type.STRING },
                      purpose: { type: Type.STRING },
                      priority: { type: Type.STRING, enum: ['critical', 'important', 'optional'] }
                    },
                    required: ["name", "type", "purpose"]
                  }
                }
              },
              required: ["name", "type", "purpose"]
            }
          }
        },
        required: ["name", "type", "purpose"]
      }
    }
  },
  required: ["name", "type", "description", "metadata", "children"]
};

const codeQualitySchema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER, minimum: 0, maximum: 100 },
    metrics: {
      type: Type.OBJECT,
      properties: {
        complexity: { type: Type.NUMBER },
        maintainability: { type: Type.NUMBER },
        testability: { type: Type.NUMBER },
        performance: { type: Type.NUMBER },
        security: { type: Type.NUMBER }
      }
    },
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ['error', 'warning', 'suggestion'] },
          message: { type: Type.STRING },
          line: { type: Type.NUMBER },
          fix: { type: Type.STRING }
        }
      }
    },
    bestPractices: { type: Type.ARRAY, items: { type: Type.STRING } }
  }
};

// Advanced rate limiting with circuit breaker pattern
class AdvancedRateLimiter {
  private requestQueue: Array<{ timestamp: number; resolve: Function; reject: Function }> = [];
  private isProcessing = false;
  private circuitBreaker = {
    failures: 0,
    threshold: 5,
    resetTime: 300000, // 5 minutes
    lastFailureTime: 0,
    state: 'closed' as 'closed' | 'open' | 'half-open'
  };

  constructor(
    private maxRequestsPerMinute: number = 8,
    private burstLimit: number = 3,
    private adaptiveThrottling: boolean = true
  ) {}

  async waitForSlot(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.circuitBreaker.state === 'open') {
        const timeSinceFailure = Date.now() - this.circuitBreaker.lastFailureTime;
        if (timeSinceFailure < this.circuitBreaker.resetTime) {
          reject(new Error('Circuit breaker is open. Service temporarily unavailable.'));
          return;
        }
        this.circuitBreaker.state = 'half-open';
      }

      this.requestQueue.push({ timestamp: Date.now(), resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.requestQueue.length > 0) {
      const now = Date.now();
      const oneMinuteAgo = now - 60000;
      
      // Clean old requests
      this.requestQueue = this.requestQueue.filter(req => req.timestamp > oneMinuteAgo);
      
      const recentRequests = this.requestQueue.length;
      
      if (recentRequests >= this.maxRequestsPerMinute) {
        const oldestRequest = Math.min(...this.requestQueue.map(r => r.timestamp));
        const waitTime = oldestRequest + 60000 - now + 1000;
        
        if (waitTime > 0) {
          await this.delay(waitTime);
          continue;
        }
      }
      
      const request = this.requestQueue.shift();
      if (request) {
        request.resolve();
        
        // Adaptive throttling - add delay between requests based on load
        if (this.adaptiveThrottling && recentRequests > this.burstLimit) {
          await this.delay(Math.min(2000, recentRequests * 200));
        }
      }
    }
    
    this.isProcessing = false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  recordSuccess(): void {
    if (this.circuitBreaker.state === 'half-open') {
      this.circuitBreaker.state = 'closed';
      this.circuitBreaker.failures = 0;
    }
  }

  recordFailure(): void {
    this.circuitBreaker.failures++;
    this.circuitBreaker.lastFailureTime = Date.now();
    
    if (this.circuitBreaker.failures >= this.circuitBreaker.threshold) {
      this.circuitBreaker.state = 'open';
    }
  }
}

const rateLimiter = new AdvancedRateLimiter();

// Enhanced retry mechanism with exponential backoff and jitter
const advancedRetryWithBackoff = async <T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    jitter?: boolean;
    retryCondition?: (error: any) => boolean;
  } = {}
): Promise<T> => {
  const {
    maxRetries = 5,
    baseDelay = 1000,
    maxDelay = 30000,
    jitter = true,
    retryCondition = (error) => {
      const errorString = error?.message?.toLowerCase() || '';
      return errorString.includes('429') || 
             errorString.includes('resource_exhausted') ||
             errorString.includes('quota') ||
             errorString.includes('timeout') ||
             errorString.includes('network');
    }
  } = options;

  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await fn();
      rateLimiter.recordSuccess();
      return result;
    } catch (error: any) {
      lastError = error;
      rateLimiter.recordFailure();
      
      if (!retryCondition(error) || attempt === maxRetries - 1) {
        throw error;
      }
      
      let waitTime = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      
      // Add jitter to prevent thundering herd
      if (jitter) {
        waitTime += Math.random() * 1000;
      }
      
      console.warn(`Attempt ${attempt + 1}/${maxRetries} failed. Retrying in ${Math.ceil(waitTime / 1000)}s...`, error.message);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError;
};

// Enhanced presentation generation with context awareness
export const generatePresentation = async (
  projectIdea: string, 
  template?: TemplateData,
  options: {
    audience?: string;
    duration?: number;
    style?: 'professional' | 'casual' | 'technical' | 'creative';
    includeDemo?: boolean;
    customRequirements?: string;
  } = {}
): Promise<{ slides: SlideData[]; metadata: any }> => {
  const {
    audience = 'technical professionals',
    duration = 10,
    style = 'professional',
    includeDemo = true,
    customRequirements = ''
  } = options;

  try {
    await rateLimiter.waitForSlot();
    
    const generateContent = async () => {
      let basePrompt = `
        You are an elite presentation strategist and storytelling expert with deep expertise in creating compelling technical presentations.
        
        CONTEXT ANALYSIS:
        - Project Idea: "${projectIdea}"
        - Target Audience: ${audience}
        - Presentation Duration: ${duration} minutes
        - Style: ${style}
        - Include Demo: ${includeDemo}
        - Custom Requirements: ${customRequirements}
      `;

      let structurePrompt = '';
      let slideCount = 5;

      if (template) {
        slideCount = template.slides.length;
        structurePrompt = `
          TEMPLATE-BASED GENERATION:
          Template: "${template.name}"
          Description: ${template.description}
          Category: ${template.category}
          
          Required Structure:
          ${template.slides.map((slide: any, index: number) => `
          ${index + 1}. ${slide.title}
             - Purpose: ${slide.content?.join(', ') || 'Create contextually relevant content'}
             - Expected Impact: High engagement and clear understanding
          `).join('')}
        `;
      } else {
        structurePrompt = `
          DEFAULT STRUCTURE - Advanced Pitch Deck:
          1. Hook & Problem Statement (30-45 seconds)
             - Start with a compelling statistic, question, or scenario
             - Clearly articulate the pain point your project addresses
          
          2. Solution Overview (60-90 seconds)
             - Present your project as the elegant solution
             - Highlight the key innovation or unique approach
          
          3. Core Features & Technical Excellence (90-120 seconds)
             - Showcase 3-4 most impactful features with technical depth
             - Demonstrate understanding of implementation challenges
          
          4. Architecture & Technology Stack (60-90 seconds)
             - High-level system design and technology choices
             - Scalability, performance, and reliability considerations
          
          5. Impact, Vision & Call to Action (45-60 seconds)
             - Quantifiable impact and future roadmap
             - Strong closing with clear next steps
        `;
      }

      const advancedPrompt = `${basePrompt}
        
        ${structurePrompt}
        
        ADVANCED REQUIREMENTS:
        
        1. STORYTELLING EXCELLENCE:
           - Create a narrative arc that builds tension and resolution
           - Use the "Problem-Agitation-Solution" framework
           - Include emotional hooks and relatable scenarios
           - Ensure smooth transitions between slides
        
        2. CONTENT SOPHISTICATION:
           - Each slide should have a clear purpose and measurable outcome
           - Use concrete examples, metrics, and specific details
           - Incorporate industry best practices and current trends
           - Balance technical depth with accessibility for ${audience}
        
        3. ENGAGEMENT STRATEGIES:
           - Include interactive elements or thought-provoking questions
           - Suggest visual metaphors and compelling graphics
           - Provide speaker notes with timing, emphasis, and audience interaction cues
           - Include recovery strategies for potential Q&A scenarios
        
        4. PROFESSIONAL POLISH:
           - Ensure consistent messaging and terminology
           - Create memorable taglines and key phrases
           - Include backup slides suggestions for deep-dive questions
           - Provide alternative explanations for complex concepts
        
        Generate exactly ${slideCount} slides with:
        - Compelling, action-oriented titles that create curiosity
        - 3-5 bullet points per slide with specific, impactful content
        - Detailed speaker notes (100-150 words each) with presentation tips
        - Visual suggestions for maximum impact
        - Key takeaways for audience retention
        - Smooth transition suggestions between slides
        
        Style Guidelines for "${style}":
        ${style === 'professional' ? '- Formal tone, data-driven, conservative visuals' :
          style === 'casual' ? '- Conversational tone, approachable language, friendly visuals' :
          style === 'technical' ? '- Deep technical detail, architecture diagrams, code examples' :
          '- Bold statements, creative analogies, innovative visual concepts'}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: advancedPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: presentationSchema,
          thinkingConfig: { thinkingBudget: 10000 }
        },
      });

      const jsonText = response.text;
      if (!jsonText) {
        throw new Error("Empty response from AI");
      }

      const result = JSON.parse(jsonText);
      return {
        slides: result.slides,
        metadata: result.metadata,
        transitions: result.transitions
      };
    };

    return await advancedRetryWithBackoff(generateContent);

  } catch (error: any) {
    console.error("Error generating presentation:", error);
    
    // Enhanced error handling with specific guidance
    if (error?.message?.includes('429')) {
      throw new Error("API rate limit exceeded. The service is experiencing high demand. Please try again in a few minutes.");
    } else if (error?.message?.includes('quota')) {
      throw new Error("API quota exceeded. Please check your billing settings or try again tomorrow.");
    } else if (error?.message?.includes('Circuit breaker')) {
      throw new Error("Service is temporarily unavailable due to repeated failures. Please try again later.");
    } else {
      throw new Error(`Presentation generation failed: ${error?.message || 'Unknown error occurred'}`);
    }
  }
};

// Enhanced repository structure generation
export const generateRepoStructure = async (
  projectIdea: string,
  options: {
    framework?: string;
    complexity?: 'simple' | 'moderate' | 'complex' | 'enterprise';
    includeTests?: boolean;
    includeDocker?: boolean;
    includeDocs?: boolean;
    includeCI?: boolean;
  } = {}
): Promise<RepoNode> => {
  const {
    framework = 'react-vite',
    complexity = 'moderate',
    includeTests = true,
    includeDocker = false,
    includeDocs = true,
    includeCI = false
  } = options;

  try {
    await rateLimiter.waitForSlot();
    
    const generateStructure = async () => {
      const prompt = `
        You are a senior software architect and DevOps expert with 15+ years of experience in designing scalable, maintainable software systems.
        
        PROJECT CONTEXT:
        - Project Idea: "${projectIdea}"
        - Framework: ${framework}
        - Complexity Level: ${complexity}
        - Include Tests: ${includeTests}
        - Include Docker: ${includeDocker}
        - Include Documentation: ${includeDocs}
        - Include CI/CD: ${includeCI}
        
        ARCHITECTURAL PRINCIPLES:
        1. Follow industry best practices for ${framework} applications
        2. Implement proper separation of concerns
        3. Ensure scalability and maintainability
        4. Include security considerations
        5. Follow modern development workflow patterns
        
        STRUCTURE REQUIREMENTS:
        
        For ${complexity} complexity level:
        ${complexity === 'simple' ? `
        - Basic project structure with essential files only
        - Minimal configuration and dependencies
        - Single-responsibility components
        - Basic error handling and validation
        ` : complexity === 'moderate' ? `
        - Well-organized feature-based structure
        - Proper configuration management
        - Comprehensive component library
        - Advanced state management
        - Performance optimization
        ` : complexity === 'complex' ? `
        - Microservices-ready architecture
        - Advanced configuration and environment management
        - Comprehensive testing strategy
        - Advanced security implementations
        - Performance monitoring and analytics
        ` : `
        - Enterprise-grade architecture patterns
        - Multi-environment deployment strategies
        - Comprehensive observability stack
        - Advanced security and compliance features
        - Scalable team collaboration structure
        `}
        
        SPECIFIC REQUIREMENTS:
        - Root folder named appropriately for the project
        - Modern ${framework} setup with TypeScript
        - Proper folder hierarchy with clear purposes
        - Include all necessary configuration files
        - Add appropriate README and documentation structure
        ${includeTests ? '- Comprehensive testing setup (unit, integration, e2e)' : ''}
        ${includeDocker ? '- Docker containerization setup' : ''}
        ${includeDocs ? '- Documentation structure with examples' : ''}
        ${includeCI ? '- CI/CD pipeline configuration' : ''}
        
        For each file and folder, provide:
        - Clear description of its purpose
        - Priority level (critical/important/optional)
        - How it fits into the overall architecture
        
        Generate a logical, production-ready repository structure that follows modern software engineering practices.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: repoStructureSchema,
          thinkingConfig: { thinkingBudget: 8000 }
        },
      });

      const jsonText = response.text;
      if (!jsonText) {
        throw new Error("Empty response from AI");
      }
      return JSON.parse(jsonText) as RepoNode;
    };

    return await advancedRetryWithBackoff(generateStructure);

  } catch (error: any) {
    console.error("Error generating repository structure:", error);
    throw new Error(`Repository structure generation failed: ${error?.message || 'Unknown error'}`);
  }
};

// Enhanced file content generation with context awareness
export const generateFileContent = async (
  projectIdea: string, 
  structure: RepoNode, 
  filePath: string,
  options: {
    quality?: 'prototype' | 'production' | 'enterprise';
    includeComments?: boolean;
    includeTests?: boolean;
    followBestPractices?: boolean;
    optimizePerformance?: boolean;
  } = {}
): Promise<{ content: string; quality: CodeQuality; suggestions: string[] }> => {
  const {
    quality = 'production',
    includeComments = true,
    followBestPractices = true,
    optimizePerformance = true
  } = options;

  try {
    await rateLimiter.waitForSlot();
    
    const generateContent = async () => {
      // Analyze file context
      const fileExtension = filePath.split('.').pop()?.toLowerCase() || '';
      const fileName = filePath.split('/').pop() || '';
      const directory = filePath.substring(0, filePath.lastIndexOf('/')) || '';
      
      const isComponent = filePath.includes('component') || filePath.includes('Component') || fileExtension === 'tsx';
      const isUtil = filePath.includes('util') || filePath.includes('helper');
      const isService = filePath.includes('service') || filePath.includes('api');
      const isHook = filePath.includes('hook') || filePath.includes('use');
      const isConfig = ['json', 'js', 'ts', 'yml', 'yaml', 'toml'].includes(fileExtension) && !isComponent;

      const prompt = `
        You are an expert software engineer with deep expertise in modern web development, particularly ${fileExtension} files.
        
        PROJECT CONTEXT:
        - Main Project: "${projectIdea}"
        - Target File: "${filePath}"
        - File Name: "${fileName}"
        - Directory: "${directory}"
        - File Type: ${fileExtension}
        - Quality Level: ${quality}
        - Repository Structure: ${JSON.stringify(structure, null, 2)}
        
        FILE ANALYSIS:
        - Is Component: ${isComponent}
        - Is Utility: ${isUtil}
        - Is Service: ${isService}
        - Is Hook: ${isHook}
        - Is Configuration: ${isConfig}
        
        QUALITY REQUIREMENTS FOR "${quality}" LEVEL:
        ${quality === 'prototype' ? `
        - Functional but basic implementation
        - Minimal error handling
        - Basic structure and organization
        - Focus on core functionality
        ` : quality === 'production' ? `
        - Robust error handling and validation
        - Comprehensive type safety
        - Performance optimizations
        - Security best practices
        - Maintainable and readable code
        - Proper documentation
        ` : `
        - Enterprise-grade error handling and logging
        - Advanced type safety with strict TypeScript
        - Comprehensive performance monitoring
        - Security hardening and vulnerability prevention
        - Extensive documentation and examples
        - Monitoring and observability hooks
        - Scalability considerations
        `}
        
        TECHNICAL SPECIFICATIONS:
        
        ${isComponent ? `
        COMPONENT REQUIREMENTS:
        - Functional React component with TypeScript
        - Proper prop types and interfaces
        - Error boundaries and fallback UI
        - Performance optimizations (memo, callback, effect)
        - Accessibility (ARIA labels, keyboard navigation)
        - Responsive design considerations
        - State management best practices
        - Event handling and lifecycle management
        ` : ''}
        
        ${isService ? `
        SERVICE REQUIREMENTS:
        - Proper API client architecture
        - Request/response type definitions
        - Error handling and retry logic
        - Authentication and authorization
        - Caching and performance optimization
        - Rate limiting and throttling
        - Request validation and sanitization
        ` : ''}
        
        ${isUtil ? `
        UTILITY REQUIREMENTS:
        - Pure functions with clear inputs/outputs
        - Comprehensive type definitions
        - Edge case handling
        - Performance optimizations
        - Extensive unit test coverage considerations
        - Clear documentation and examples
        ` : ''}
        
        ${isHook ? `
        CUSTOM HOOK REQUIREMENTS:
        - Proper React hooks rules compliance
        - Memoization and performance optimization
        - Cleanup and memory leak prevention
        - TypeScript generics for reusability
        - Error handling and loading states
        - Testing considerations
        ` : ''}
        
        CODE GENERATION INSTRUCTIONS:
        1. Generate complete, runnable, ${quality}-quality code
        2. Follow modern ES6+ and TypeScript best practices
        3. Include ${includeComments ? 'comprehensive JSDoc comments and inline documentation' : 'minimal but clear comments'}
        4. Implement proper error handling and validation
        5. Use consistent naming conventions and code organization
        6. Include import statements that align with the repository structure
        7. ${optimizePerformance ? 'Optimize for performance and memory usage' : 'Focus on readability and maintainability'}
        8. ${followBestPractices ? 'Strictly follow industry best practices and design patterns' : 'Use straightforward implementations'}
        
        CRITICAL CONSTRAINTS:
        - Return ONLY the raw source code
        - NO markdown code blocks or formatting
        - NO explanations or additional text
        - Ensure all imports reference files that exist in the repository structure
        - Make the code production-ready and fully functional
        - Include proper TypeScript types and interfaces
        
        Generate the complete source code for ${filePath}:
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 12000 }
        }
      });

      let content = response.text?.trim() || '';
      
      // Clean any potential markdown formatting
      content = content
        .replace(/^```[\w\-]*\n?/gm, '')
        .replace(/\n?```$/gm, '')
        .replace(/```/g, '')
        .trim();

      // Generate quality analysis
      const qualityAnalysis = await analyzeCodeQuality(content, filePath);
      
      return {
        content,
        quality: qualityAnalysis,
        suggestions: qualityAnalysis.suggestions.map(s => s.message)
      };
    };

    return await advancedRetryWithBackoff(generateContent);

  } catch (error: any) {
    console.error(`Error generating content for ${filePath}:`, error);
    
    if (error?.message?.includes('429')) {
      throw new Error(`Rate limit exceeded for ${filePath}. Please wait and try again.`);
    } else if (error?.message?.includes('quota')) {
      throw new Error(`API quota exceeded. Please check your billing or try again later.`);
    } else {
      throw new Error(`Failed to generate code for ${filePath}: ${error?.message || 'Unknown error'}`);
    }
  }
};

// Advanced code quality analysis
const analyzeCodeQuality = async (content: string, filePath: string): Promise<CodeQuality> => {
  try {
    const prompt = `
      You are a senior code reviewer and quality assurance expert. Analyze the following code for quality, best practices, and potential issues.
      
      File: ${filePath}
      Code:
      ${content}
      
      Provide a comprehensive quality analysis including:
      1. Overall quality score (0-100)
      2. Specific metrics for complexity, maintainability, testability, performance, and security
      3. Specific suggestions for improvement with line numbers
      4. Best practices recommendations
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: codeQualitySchema,
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    // Return default quality analysis if analysis fails
    return {
      score: 75,
      metrics: {
        complexity: 70,
        maintainability: 80,
        testability: 75,
        performance: 75,
        security: 80
      },
      suggestions: [],
      bestPractices: []
    };
  }
};

// Utility functions for project analysis
export const analyzeProjectRequirements = async (projectIdea: string) => {
  try {
    await rateLimiter.waitForSlot();
    
    const prompt = `
      Analyze the following project idea and provide detailed technical requirements, architecture recommendations, and implementation strategy.
      
      Project: "${projectIdea}"
      
      Provide analysis for:
      1. Technical complexity assessment
      2. Recommended technology stack
      3. Architecture patterns
      4. Potential challenges and solutions
      5. Timeline and resource estimates
      6. Scalability considerations
      7. Security requirements
      8. Performance optimization strategies
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    throw new Error(`Project analysis failed: ${error}`);
  }
};

// Export enhanced utilities
export {
  AdvancedRateLimiter,
  advancedRetryWithBackoff,
  analyzeCodeQuality
};