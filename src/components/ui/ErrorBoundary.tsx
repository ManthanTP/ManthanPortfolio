import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-primary, #05050a)',
            color: 'var(--text-primary, #f1f1f5)',
            padding: 24,
            textAlign: 'center',
            fontFamily: 'var(--font-heading, system-ui, sans-serif)',
          }}
        >
          <div
            style={{
              maxWidth: 480,
              padding: 32,
              borderRadius: 16,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 12 }}>
              Something unexpected happened
            </h2>
            <p style={{ color: 'var(--text-secondary, #9494a8)', fontSize: '0.9rem', marginBottom: 24, lineHeight: 1.6 }}>
              An error occurred while loading this view. You can reload the page or return to safety.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={this.handleReload}
                style={{
                  padding: '10px 20px',
                  borderRadius: 10,
                  background: 'var(--accent-violet, #6c63ff)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                Reload Page
              </button>
              <a
                href="/"
                style={{
                  padding: '10px 20px',
                  borderRadius: 10,
                  background: 'transparent',
                  color: 'var(--text-secondary, #9494a8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
