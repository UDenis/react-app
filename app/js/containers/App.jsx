import React from 'react'
import { connect } from 'react-redux';

import Header from '../components/Header.jsx'

class App extends React.Component {
    render() {
        const initing = this.props.clientIniting;
        let children;
        if (initing) {
            children = <span>Инициализация</span>
        } else {
            children = this.props.children
        }

        return (<div className="calldialer_wrap">
            <Header connectionStatus={this.props.connectionStatus}></Header>
            {children}
        </div>)
    }
}

function mapStateToProps(state) {
    return {
        clientIniting: !state.client.ready,
        clientInited: state.client.ready,
        connectionStatus: state.client.connectionStatus
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);