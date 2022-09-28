import React, {Component} from "react";
import Page from "../../components/Page";
import Header from "../../layouts/Header";
import Specials from "./Specials";
import {bindActionCreators} from "redux";
import {getPaginatedSpecialList, getSpecialList} from "../../store/actions/specials";
import {connect} from "react-redux";
import {Container} from "@material-ui/core";
import Footer from "../../layouts/Footer";

class Search extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {
        return (
            <Page
                title={'Foodoli | Find Specials'}
            >
                <Header/>
                <Container component="main" maxWidth="lg" style={{paddingTop: 90}}>
                    <Specials/>
                </Container>
                {/*<Footer/>*/}
            </Page>
        )
    }
}

function mapStateToProps(state) {
    return {
        specialList: state.specials.specialList || [],
        isLoading: state.specials.isLoading,
        previous: state.specials.previous,
        next: state.specials.next,
        listErrorStatus: state.specials.listErrorStatus,
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        getSpecialList: getSpecialList,
        getPaginatedList: getPaginatedSpecialList,
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Search);

