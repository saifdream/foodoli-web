import React, { Component } from 'react';
import {Box} from "@material-ui/core";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error, errorInfo) {
        // Catch errors in any components below and re-render with error message
        this.setState({
            error: error,
            errorInfo: errorInfo
        })
        // You can also log error messages to an error reporting service here
        // window.location.reload();
    }

    render() {
        if (this.state.errorInfo) {
            // Error path
            return (
                <Box m={4}>
                    <h2>Something went wrong.</h2>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo.componentStack}
                    </details>
                </Box>
            );
        }
        // Normally, just render children
        return this.props.children;
    }
}

export default ErrorBoundary;
