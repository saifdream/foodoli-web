import 'react-perfect-scrollbar/dist/css/styles.css';
import 'fontsource-roboto';
import React, {Component} from 'react';
import {ThemeProvider} from '@material-ui/core';
import GlobalStyles from './components/GlobalStyles';
import theme from './theme';
import SimpleRoutes from './routes';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ErrorBoundary from "./ErrorBoundary";
import Typography from "@material-ui/core/Typography";

class App extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <React.Suspense fallback={<Typography>Loading ... </Typography>}>
                <ThemeProvider theme={theme}>
                    <GlobalStyles/>
                    <ErrorBoundary>
                        <SimpleRoutes isAuthenticated={this.props.isLoggedIn} type={this.props.type}/>
                    </ErrorBoundary>
                </ThemeProvider>
            </React.Suspense>
        );
    }
}

function mapStateToProps(state) {
    return {
        isLoggedIn: state.user.isLoggedIn,
        type: state.user?.user?.type
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(App);
