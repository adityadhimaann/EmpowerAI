import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class SandpackErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Sandpack Error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex items-center justify-center bg-red-900/20 border border-red-500/50 rounded-lg p-6">
          <div className="text-center max-w-md">
            <h2 className="text-red-400 text-xl font-bold mb-4">Live Preview Error</h2>
            <p className="text-red-300 mb-4">
              There was an error loading the live preview. This might be due to:
            </p>
            <ul className="text-red-200 text-sm text-left mb-4 space-y-1">
              <li>• Invalid or incomplete generated code</li>
              <li>• Missing dependencies or imports</li>
              <li>• Syntax errors in the generated files</li>
            </ul>
            <button
              onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              Try Again
            </button>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-red-300 cursor-pointer text-sm">Show Error Details</summary>
                <pre className="text-xs bg-black/30 p-2 rounded mt-2 overflow-auto max-h-32 text-red-200">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SandpackErrorBoundary;
