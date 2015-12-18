import React from 'react'
import { connect } from 'react-redux';
import {defaultRoute} from '../routes/routes'

const defaultState = '/notFount';

export default class Home extends React.Component {
    contextTypes: {
        history: React.PropTypes.isRequired
    }

    componentWillMount() {
        this.props.history.replaceState(null, defaultRoute.path || defaultState);
    }

    render() {
        return false
    }
}

function mapStateToProps(state) {
    return state
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: dispatch
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);