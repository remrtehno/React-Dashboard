import React, {Component} from 'react';

class ErrorBoundary extends Component {
  state = {
    isError: false
  };

  componentDidCatch(error, errorInfo) {
    this.setState({isError: true})
  }

  render() {
    if (this.state.isError) {
      return <h1>Произошла непредвиденная ошибка</h1>
    }

    return this.props.children
  }
}

export default ErrorBoundary;
