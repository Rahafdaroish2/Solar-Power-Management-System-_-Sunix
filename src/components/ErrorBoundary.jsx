import React from 'react';
import { ErrorMessage } from './ErrorMessage';
export class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    return this.state.error ? (
      <ErrorMessage
        error={this.state.error}
        onRetry={() => this.setState({ error: null })}
      />
    ) : (
      this.props.children
    );
  }
}
