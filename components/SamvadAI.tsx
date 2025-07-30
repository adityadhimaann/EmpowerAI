import React, { useState, useRef, useEffect } from 'react';
import { XIcon, SendIcon, BotIcon, UserIcon, CopyIcon } from './Icons';
import { RepoNode, GeneratedCode } from '../types';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface SamvadAIProps {
  isOpen: boolean;
  onClose: () => void;
  repoStructure?: RepoNode;
  generatedCode?: GeneratedCode;
  projectIdea?: string;
}

const SamvadAI: React.FC<SamvadAIProps> = ({ 
  isOpen, 
  onClose, 
  repoStructure, 
  generatedCode: _generatedCode, 
  projectIdea: _projectIdea 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: `# 🤖 Welcome to Samvad AI!

## **Your Intelligent Repository Assistant**

### 🎯 **How I Can Help You**

#### **🔧 Installation & Setup**
- Package installation commands
- Environment configuration  
- Dependency management
- Prerequisites verification

#### **🚀 Application Management**
- Local development setup
- Build and deployment
- Server configuration
- Performance optimization

#### **📁 Code Analysis** 
- Repository structure explanation
- File relationships mapping
- Technology stack overview
- Best practices guidance

#### **🛠️ Development Support**
- Troubleshooting assistance
- Error resolution
- Code optimization tips
- Feature implementation advice

---

### 💡 **Quick Start Tips**
- Ask specific questions for detailed help
- Use keywords like "install", "run", "structure" 
- I understand your project context automatically

**Ready to help! What would you like to know?** 🚀`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Installation related
    if (lowerMessage.includes('install') || lowerMessage.includes('npm') || lowerMessage.includes('dependency')) {
      return `# 🔧 Installation Guide

## **Complete Setup Process**

### **📋 Prerequisites**
| Requirement | Version | Status |
|-------------|---------|--------|
| Node.js | v16+ | ✅ Required |
| npm/yarn | Latest | ✅ Required |
| Git | Any | 🔄 Optional |

### **🚀 Step-by-Step Installation**

#### **Step 1: Navigate to Project**
\`\`\`bash
cd ${repoStructure?.name || 'your-project'}
\`\`\`

#### **Step 2: Install Dependencies**
\`\`\`bash
# Using npm (recommended)
npm install

# Alternative: Using yarn
yarn install

# Clean install (if issues)
rm -rf node_modules package-lock.json
npm install
\`\`\`

#### **Step 3: Environment Setup**
\`\`\`bash
# Create environment file
touch .env

# Add your variables
echo "VITE_API_KEY=your_key_here" >> .env
\`\`\`

#### **Step 4: Verify Installation**
\`\`\`bash
# Check if packages installed
ls node_modules

# Test development server
npm run dev
\`\`\`

### **📦 Core Dependencies**
| Package | Purpose | Version |
|---------|---------|---------|
| \`react\` | UI Framework | ^18.0.0 |
| \`react-dom\` | DOM Renderer | ^18.0.0 |
| \`vite\` | Build Tool | ^4.0.0 |
| \`typescript\` | Type Safety | ^4.9.0 |

### **⚡ Quick Commands Reference**
\`\`\`bash
npm install          # Install dependencies
npm run dev          # Start development
npm run build        # Build for production
npm run preview      # Preview build
npm run lint         # Check code quality
\`\`\`

### **🔍 Troubleshooting**
- **Permission errors**: Use \`sudo npm install\` (macOS/Linux)
- **Network issues**: Try \`npm install --registry https://registry.npmjs.org/\`
- **Cache problems**: Run \`npm cache clean --force\``;
    }

    // Running the app
    if (lowerMessage.includes('run') || lowerMessage.includes('start') || lowerMessage.includes('dev')) {
      return `# 🚀 Running Your Application

## **Development Workflow**

### **🏃‍♂️ Quick Start**
\`\`\`bash
# Start development server
npm run dev

# With custom port
npm run dev -- --port 3001

# With network access
npm run dev -- --host
\`\`\`

### **📊 Available Scripts Breakdown**
| Command | Function | Output | Use Case |
|---------|----------|--------|----------|
| \`npm run dev\` | Development server | Hot reload | Local development |
| \`npm run build\` | Production build | \`dist/\` folder | Deployment prep |
| \`npm run preview\` | Preview build | Production test | Pre-deployment |
| \`npm run lint\` | Code analysis | Error report | Code quality |

### **🌐 Server Information**
- **📍 Local URL**: \`http://localhost:3000\`
- **🌍 Network URL**: \`http://192.168.x.x:3000\`
- **🔥 Hot Reload**: ✅ Enabled
- **⚡ Fast Refresh**: ✅ React support
- **📱 Mobile Testing**: ✅ Network accessible

### **⚙️ Advanced Configuration**

#### **Custom Vite Config**
\`\`\`javascript
// vite.config.ts
export default defineConfig({
  server: {
    port: 3001,
    host: true,
    open: true,
    cors: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
\`\`\`

### **🔧 Environment Variables**
\`\`\`bash
# .env file
VITE_NODE_ENV=development
VITE_API_URL=http://localhost:3000/api
VITE_APP_TITLE=${repoStructure?.name || 'Your App'}
\`\`\`

### **⚠️ Troubleshooting Guide**
| Problem | Solution | Prevention |
|---------|----------|------------|
| Port in use | \`--port 3001\` | Check running processes |
| Module errors | \`npm install\` | Keep dependencies updated |
| Build fails | Clear cache | Regular \`npm audit\` |
| Slow startup | \`--force\` flag | Optimize imports |`;
    }

    // Package.json related
    if (lowerMessage.includes('package.json') || lowerMessage.includes('scripts')) {
      return `# 📦 Package.json Deep Dive

## **Project Configuration Overview**

### **🎯 Essential Scripts**
\`\`\`json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build", 
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx",
    "type-check": "tsc --noEmit"
  }
}
\`\`\`

### **📊 Script Breakdown**
| Script | Command | Purpose | When to Use |
|--------|---------|---------|-------------|
| \`dev\` | \`vite\` | Development server | Daily development |
| \`build\` | \`vite build\` | Production bundle | Before deployment |
| \`preview\` | \`vite preview\` | Test production | Pre-deployment testing |
| \`lint\` | \`eslint\` | Code quality check | Before commits |

### **📚 Dependencies Structure**
\`\`\`json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^4.0.0",
    "typescript": "^4.9.0",
    "@types/react": "^18.0.0"
  }
}
\`\`\`

### **🔍 Dependency Categories**
#### **Production Dependencies** (\`dependencies\`)
- Runtime requirements
- Included in final bundle
- Critical for app functionality

#### **Development Dependencies** (\`devDependencies\`)
- Build-time tools only
- Not included in production
- Development and testing tools

### **⚡ Custom Script Examples**
\`\`\`json
{
  "scripts": {
    "start": "npm run dev",
    "dev:host": "vite --host",
    "build:analyze": "vite build --analyze",
    "clean": "rm -rf dist node_modules",
    "fresh": "npm run clean && npm install"
  }
}
\`\`\``;
    }

    // Technology stack
    if (lowerMessage.includes('tech') || lowerMessage.includes('stack') || lowerMessage.includes('technology')) {
      return `# 💻 Technology Stack Analysis

## **Frontend Architecture**

### **🎯 Core Technologies**
| Technology | Role | Benefits |
|------------|------|----------|
| ⚛️ **React** | UI Library | Component-based, Virtual DOM |
| 🎨 **TypeScript** | Language | Type safety, Better IDE support |
| ⚡ **Vite** | Build Tool | Fast HMR, Optimized builds |
| 🌊 **Tailwind** | CSS Framework | Utility-first, Responsive |

### **🛠️ Development Stack**
#### **Build & Bundling**
- **Vite**: Next-gen build tool
- **ESBuild**: Ultra-fast bundler
- **Rollup**: Production bundler

#### **Code Quality**
- **ESLint**: Code linting
- **Prettier**: Code formatting  
- **TypeScript**: Static typing
- **Husky**: Git hooks

#### **Styling Approach**
- **Tailwind CSS**: Utility classes
- **CSS Modules**: Scoped styles
- **PostCSS**: CSS processing

### **🚀 Deployment Options**
| Platform | Type | Best For |
|----------|------|----------|
| 🌐 **Vercel** | Static/SSR | React apps |
| 🔥 **Netlify** | Static | JAMstack |
| ☁️ **AWS S3** | Static | Enterprise |
| 🐳 **Docker** | Container | Any environment |

### **📈 Performance Features**
- **Code Splitting**: Lazy loading
- **Tree Shaking**: Dead code elimination
- **Hot Module Replacement**: Fast development
- **Production Optimization**: Minification

### **🔒 Security Considerations**
- Environment variable protection
- XSS prevention with React
- HTTPS enforcement
- Content Security Policy

### **📱 Modern Features**
- Progressive Web App ready
- Mobile-first responsive design
- Modern JavaScript (ES2020+)
- TypeScript for reliability`;
    }

    // File structure
    if (lowerMessage.includes('structure') || lowerMessage.includes('file') || lowerMessage.includes('folder')) {
      let structureDisplay = '';
      if (repoStructure) {
        structureDisplay = `\n### **📁 Your Project Structure**
\`\`\`
${repoStructure.name}/
`;
        if (repoStructure.children) {
          repoStructure.children.forEach((child, index) => {
            const isLast = index === repoStructure.children!.length - 1;
            const prefix = isLast ? '└── ' : '├── ';
            structureDisplay += `${prefix}${child.name}${child.type === 'folder' ? '/' : ''}\n`;
            
            if (child.children && child.children.length > 0 && child.type === 'folder') {
              child.children.forEach((subChild, subIndex) => {
                const isSubLast = subIndex === child.children!.length - 1;
                const connector = isLast ? '    ' : '│   ';
                const subPrefix = isSubLast ? '└── ' : '├── ';
                structureDisplay += `${connector}${subPrefix}${subChild.name}${subChild.type === 'folder' ? '/' : ''}\n`;
              });
            }
          });
        }
        structureDisplay += '```\n';
      }
      
      return `# 📁 Project Structure Guide

## **Repository Architecture**
${structureDisplay}
### **📂 Folder Purposes**
| Folder | Purpose | Contents |
|--------|---------|----------|
| \`src/\` | Source code | Components, hooks, utilities |
| \`public/\` | Static assets | Images, icons, manifest |
| \`components/\` | React components | Reusable UI elements |
| \`hooks/\` | Custom hooks | Shared logic |
| \`utils/\` | Helper functions | Pure functions |
| \`types/\` | TypeScript types | Interface definitions |
| \`styles/\` | Stylesheets | CSS, SCSS files |

### **📄 Key Files Explained**
| File | Purpose | Importance |
|------|---------|-------------|
| \`package.json\` | Project metadata | Dependencies, scripts |
| \`index.html\` | Entry point | HTML template |
| \`vite.config.ts\` | Build config | Vite settings |
| \`tsconfig.json\` | TypeScript config | Compiler options |
| \`.env\` | Environment vars | API keys, settings |
| \`README.md\` | Documentation | Project info |

### **🎯 Best Practices**
#### **Folder Organization**
- Group by feature, not file type
- Keep components close to usage
- Separate concerns clearly

#### **File Naming**
- PascalCase for components (\`MyComponent.tsx\`)
- camelCase for utilities (\`formatDate.ts\`)
- kebab-case for assets (\`hero-image.png\`)

#### **Import Structure**
\`\`\`typescript
// External libraries first
import React from 'react'
import { useState } from 'react'

// Internal modules
import { MyComponent } from './components'
import { formatDate } from './utils'

// Relative imports last  
import './styles.css'
\`\`\`

### **🔍 Navigation Tips**
- Use VS Code's "Go to Definition" (Ctrl+Click)
- File explorer shows project tree
- Search files with Ctrl+P`;
    }

    // Error troubleshooting
    if (lowerMessage.includes('error') || lowerMessage.includes('problem') || lowerMessage.includes('issue')) {
      return `# 🔧 Troubleshooting Center

## **Common Issues & Solutions**

### **🚨 Build Errors**
| Error Type | Symptoms | Solution |
|------------|----------|----------|
| **Module not found** | Import errors | \`npm install\` missing package |
| **TypeScript errors** | Type mismatches | Check \`types.ts\` definitions |
| **Syntax errors** | Parse failures | Check brackets, semicolons |
| **Import path errors** | File not found | Verify relative paths |

### **🔥 Runtime Errors**
| Problem | Cause | Fix |
|---------|-------|-----|
| **White screen** | JavaScript crash | Check browser console |
| **API failures** | Network/config | Verify endpoints, CORS |
| **Component errors** | React issues | Check props, state |
| **Performance lag** | Memory leaks | Check useEffect cleanup |

### **⚡ Development Issues**
| Issue | Quick Fix | Permanent Solution |
|-------|-----------|-------------------|
| **Slow loading** | Hard refresh | Optimize imports |
| **Hot reload broken** | Restart server | Check file watchers |
| **Port conflicts** | Use different port | Kill conflicting process |
| **Cache problems** | Clear browser cache | Update cache headers |

### **🛠️ Debug Workflow**
#### **Step 1: Identify Error**
\`\`\`bash
# Check build errors
npm run build

# Check linting issues  
npm run lint

# Check TypeScript
npm run type-check
\`\`\`

#### **Step 2: Common Fixes**
\`\`\`bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev

# Reset everything
git clean -fdx
npm install
\`\`\`

#### **Step 3: Advanced Debugging**
\`\`\`bash
# Verbose logging
npm run dev --verbose

# Debug mode
NODE_ENV=development npm run dev

# Check process conflicts
lsof -ti:3000
kill -9 [PID]
\`\`\`

### **📊 Error Categories**
#### **🔴 Critical (App Won't Start)**
- Missing dependencies
- Syntax errors  
- Configuration issues

#### **🟡 Warning (App Works But Issues)**
- TypeScript warnings
- Linting errors
- Performance issues

#### **🟢 Info (Optimization Suggestions)**
- Bundle size warnings
- Unused imports
- Code style suggestions

### **💡 Prevention Tips**
- Regular \`npm audit\` checks
- Keep dependencies updated
- Use TypeScript strictly
- Set up pre-commit hooks`;
    }

    // Environment setup
    if (lowerMessage.includes('env') || lowerMessage.includes('environment') || lowerMessage.includes('config')) {
      return `# ⚙️ Environment Configuration

## **Complete Setup Guide**

### **📋 Environment Files Structure**
\`\`\`
project-root/
├── .env                 # Default values
├── .env.local          # Local overrides (gitignored)
├── .env.development    # Development specific
├── .env.production     # Production specific
└── .env.example        # Template for team
\`\`\`

### **🔐 Environment Variables**
#### **Required Variables**
\`\`\`bash
# API Configuration
VITE_API_KEY=your_api_key_here
VITE_API_URL=https://api.yourservice.com

# App Configuration  
VITE_APP_NAME=${repoStructure?.name || 'Your App'}
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=development

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_DEBUG_MODE=false
\`\`\`

### **⚡ Variable Naming Rules**
| Prefix | Access | Example |
|--------|--------|---------|
| \`VITE_\` | Client-side | \`VITE_API_KEY\` |
| No prefix | Server-only | \`DATABASE_URL\` |

### **🎯 Usage in Code**
\`\`\`typescript
// Accessing environment variables
const apiKey = import.meta.env.VITE_API_KEY;
const apiUrl = import.meta.env.VITE_API_URL;

// With fallback values
const debugMode = import.meta.env.VITE_DEBUG_MODE === 'true';
const appName = import.meta.env.VITE_APP_NAME || 'Default App';

// Type-safe environment
interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
}
\`\`\`

### **🔒 Security Best Practices**
#### **✅ Safe to Expose (VITE_ prefix)**
- API endpoints
- Feature flags
- Public configuration

#### **❌ Never Expose**
- Database passwords
- Secret keys
- Internal URLs

### **📁 Git Configuration**
#### **.gitignore Setup**
\`\`\`gitignore
# Environment files
.env.local
.env.*.local
.env.production

# Keep these
!.env.example
\`\`\`

#### **.env.example Template**
\`\`\`bash
# Copy this file to .env and fill in your values

# API Configuration
VITE_API_KEY=your_api_key_here
VITE_API_URL=https://api.example.com

# App Settings
VITE_APP_NAME=My Awesome App
VITE_DEBUG_MODE=false
\`\`\`

### **🚀 Deployment Environments**
| Environment | File | Use Case |
|-------------|------|----------|
| **Development** | \`.env.development\` | Local coding |
| **Testing** | \`.env.test\` | Unit/integration tests |
| **Staging** | \`.env.staging\` | Pre-production |
| **Production** | \`.env.production\` | Live application |

### **🔧 Platform-Specific Setup**
#### **Vercel**
\`\`\`bash
# In Vercel dashboard
VITE_API_KEY=production_key
VITE_API_URL=https://api.production.com
\`\`\`

#### **Netlify**
\`\`\`bash
# In netlify.toml
[build.environment]
VITE_API_KEY="production_key"
\`\`\``;
    }

    // Default response
    return `# 🤖 How Can I Help You?

## **🎯 Popular Questions**

### **🔧 Getting Started**
- *"How do I install dependencies?"*
- *"What's the technology stack?"*
- *"How do I run the development server?"*

### **📁 Project Understanding**
- *"Explain the file structure"*
- *"What does each folder do?"*
- *"How are components organized?"*

### **� Development Workflow**
- *"How do I build for production?"*
- *"How do I set up environment variables?"*
- *"What are the available scripts?"*

### **🛠️ Problem Solving**
- *"I'm getting an error when starting"*
- *"The app won't build"*
- *"How do I debug issues?"*

---

## **💡 Pro Tips**
- Be specific with your questions
- Include error messages if you have them
- I can see your project structure automatically

## **🚀 Try asking:**
- *"Install guide for this project"*
- *"Show me the folder structure"*  
- *"How to run in development mode"*
- *"Troubleshoot build errors"*

**What would you like to know about your project?**`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate thinking time
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateBotResponse(inputValue.trim()),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatMessage = (content: string) => {
    // Enhanced markdown-like formatting for structured content
    return content
      // Headers
      .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold text-white mb-3 mt-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold text-indigo-300 mb-2 mt-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-base font-medium text-gray-200 mb-2 mt-2">$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4 class="text-sm font-medium text-gray-300 mb-1 mt-2">$1</h4>')
      
      // Bold and inline code
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-800 text-green-400 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
      
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-900 border border-gray-700 p-3 rounded-lg text-xs font-mono overflow-x-auto mt-2 mb-2 text-green-400"><code>$1</code></pre>')
      
      // Tables (basic support)
      .replace(/\|(.+)\|/g, (_, content) => {
        const cells = content.split('|').map((cell: string) => cell.trim());
        return '<div class="flex gap-2 text-xs mb-1">' + 
               cells.map((cell: string) => `<div class="flex-1 px-2 py-1 bg-gray-800 rounded">${cell}</div>`).join('') + 
               '</div>';
      })
      
      // Lists
      .replace(/^- (.+)$/gm, '<li class="ml-4 mb-1 text-sm">• $1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 mb-1 text-sm">$1</li>')
      
      // Horizontal rules
      .replace(/^---$/gm, '<hr class="border-gray-600 my-3">');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-6 w-96 h-[32rem] bg-[#0a0d2a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <BotIcon className="w-8 h-8 text-indigo-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0d2a]"></div>
          </div>
          <div>
            <h3 className="font-bold text-white">Samvad AI</h3>
            <p className="text-xs text-gray-400">Repository Assistant</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <BotIcon className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div
              className={`max-w-[80%] rounded-xl p-3 ${
                message.type === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/5 text-gray-200'
              }`}
            >
              <div
                className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: formatMessage(message.content)
                }}
              />
              {message.type === 'bot' && (
                <button
                  onClick={() => copyToClipboard(message.content)}
                  className="mt-2 text-xs text-gray-400 hover:text-white flex items-center gap-1"
                >
                  <CopyIcon className="w-3 h-3" />
                  Copy
                </button>
              )}
            </div>

            {message.type === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <BotIcon className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your repository..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-400 transition-colors"
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SamvadAI;
