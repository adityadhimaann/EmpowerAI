import React from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import { GeneratedCode, RepoNode } from '../types';
import SandpackErrorBoundary from './SandpackErrorBoundary';

interface SandpackWrapperProps {
  code: GeneratedCode;
  structure: RepoNode;
}

type SandpackFiles = {
  [key: string]: string | { code: string; hidden?: boolean; active?: boolean };
};

const SandpackWrapper: React.FC<SandpackWrapperProps> = ({ code, structure }) => {
    
    const formCodeToSandpackFiles = (): SandpackFiles => {
        const files: SandpackFiles = {};
        const rootFolderName = structure.name;

        // Convert generated code to sandpack format
        code.forEach((content, path) => {
            const sandpackPath = `/${path.substring(rootFolderName.length + 1)}`;
            
            // Clean any remaining markdown formatting
            const cleanContent = content
                .replace(/^```[\w\-]*\n?/gm, '') // Remove opening code blocks
                .replace(/\n?```$/gm, '') // Remove closing code blocks
                .replace(/```/g, '') // Remove any remaining triple backticks
                .trim();
            
            files[sandpackPath] = { code: cleanContent };
        });

        // Ensure essential files exist for a working React app
        
        // 1. Package.json with correct dependencies (simplified for React template)
        const packageJsonPath = '/package.json';
        let pkg: any = {};
        if (files[packageJsonPath] && typeof files[packageJsonPath] === 'object' && 'code' in files[packageJsonPath]) {
            try {
                pkg = JSON.parse((files[packageJsonPath] as {code: string}).code);
            } catch(e) {
                console.error("Failed to parse existing package.json", e);
                pkg = {};
            }
        }
        
        // Use standard React template dependencies
        pkg = {
            name: rootFolderName || 'react-app',
            version: '1.0.0',
            ...pkg,
            dependencies: {
                react: '^18.0.0',
                'react-dom': '^18.0.0',
                'react-scripts': '^5.0.1',
                ...(pkg.dependencies || {})
            },
            devDependencies: {
                '@types/react': '^18.0.0',
                '@types/react-dom': '^18.0.0',
                typescript: '^4.9.0',
                ...(pkg.devDependencies || {})
            }
        };
        files[packageJsonPath] = { code: JSON.stringify(pkg, null, 2), hidden: true };

        // 2. Public index.html (React template structure)
        const publicIndexPath = '/public/index.html';
        if (!files[publicIndexPath]) {
            files[publicIndexPath] = {
                code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${rootFolderName || 'React App'}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`,
                hidden: true
            };
        }

        // 3. Main entry point (React template structure)
        const srcIndexPath = '/src/index.tsx';
        if (!files[srcIndexPath]) {
            files[srcIndexPath] = {
                code: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
                hidden: true
            };
        }

        // 4. Default App component if missing
        const appTsxPath = '/src/App.tsx';
        if (!files[appTsxPath]) {
            files[appTsxPath] = {
                code: `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to ${rootFolderName || 'Your App'}</h1>
        <p>This is a live preview of your generated application.</p>
        <p>Edit the code and see changes instantly!</p>
      </header>
    </div>
  );
}

export default App;`,
                active: true
            };
        }

        // 5. Basic CSS files
        const indexCssPath = '/src/index.css';
        if (!files[indexCssPath]) {
            files[indexCssPath] = {
                code: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}`,
                hidden: true
            };
        }

        const appCssPath = '/src/App.css';
        if (!files[appCssPath]) {
            files[appCssPath] = {
                code: `.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  margin: 20px;
}

.App-header h1 {
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
  color: #61dafb;
}

.App-header p {
  margin: 0.5rem 0;
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.5;
}`,
                hidden: true
            };
        }

        // Set the active file to the main App component
        if (files[appTsxPath] && typeof files[appTsxPath] === 'object') {
            (files[appTsxPath] as { active: boolean }).active = true;
        }

        // Validate essential files exist
        const essentialFiles = ['/package.json', '/public/index.html', '/src/index.tsx'];
        essentialFiles.forEach(filePath => {
            if (!files[filePath]) {
                console.warn(`Missing essential file: ${filePath}`);
            }
        });

        return files;
    };

    const sandpackFiles = formCodeToSandpackFiles();

    // Debug: Log the files being passed to Sandpack
    console.log('Sandpack files:', Object.keys(sandpackFiles));
    console.log('Files structure:', sandpackFiles);

    return (
        <div className="h-full">
            <SandpackErrorBoundary>
                <Sandpack
                    template="react-ts"
                    files={sandpackFiles}
                    options={{
                        showNavigator: false,
                        showTabs: true,
                        showLineNumbers: true,
                        showInlineErrors: true,
                        showConsole: true,
                        showConsoleButton: true,
                        editorHeight: '100%',
                        autorun: true,
                        recompileMode: 'immediate',
                        recompileDelay: 300,
                        externalResources: [
                            "https://cdn.tailwindcss.com/3.3.6"
                        ]
                    }}
                    theme="dark"
                    customSetup={{
                        dependencies: {
                            react: '^18.0.0',
                            'react-dom': '^18.0.0',
                            '@types/react': '^18.0.0',
                            '@types/react-dom': '^18.0.0'
                        }
                    }}
                />
            </SandpackErrorBoundary>
        </div>
    );
};

export default SandpackWrapper;
