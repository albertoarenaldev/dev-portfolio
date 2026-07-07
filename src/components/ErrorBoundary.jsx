import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="error-fallback">
        <div className="error-fallback-card glass">
          <h2>Algo se rompió 💥</h2>
          <p>Ha ocurrido un error inesperado. Intenta recargar la página.</p>
          {this.state.error?.message && (
            <code className="mono">{String(this.state.error.message)}</code>
          )}
          <button className="btn btn-primary" onClick={this.reset}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }
}
