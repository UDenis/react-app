import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as PhoneActions from '../actions/phone';
import * as loginStatus from '../constants/clientLoginStatus'
import {bindToInput} from '../utils/componentHelpers'

export default class Login extends React.Component {

    static defaultState = {
        login: 'GerasimovNG',
        password: '123456'
    }

    contextTypes: {
        history: React.PropTypes.isRequired
    }

    constructor() {
        super();
        this.state = Login.defaultState;
        this.bindToInput = bindToInput;
    }

    login(ev) {
        ev.preventDefault();
        this.props.actions.login(this.state.login, this.state.password, (ev)=>{
            if (ev.result){
                this.props.history.replaceState(null, '/');
            }
        });
    }

    render() {
        const loginDisabled = !this.state.login || !this.state.password || this.props.clientLogining;

        return (<form onSubmit={this.login.bind(this)}>
            <div className="form_group">
                <input type="text" className="w100" name="" id="" placeholder="Логин оператора"
                       onChange={this.bindToInput('login')} value={this.state.login}/>
            </div>
            <div className="form_group">
                <input type="password" className="w100" name="" id="" placeholder="Пароль"
                       onChange={this.bindToInput('password')} value={this.state.password}/>
            </div>
            <div className="form_buttons">
                <button className="button w100" disabled={loginDisabled}>Войти</button>
            </div>
            {this.renderStatus()}
        </form>);
    }

    renderStatus() {
        let statusString = false;

        switch (this.props.clientLoginStatus) {
            case loginStatus.LOGINING:
                statusString = 'Авторизация';
                break;

            case loginStatus.LOGIN_FAILED:
                statusString = 'Ошибка авторизации';
                break;
        }

        if (statusString) {
            return <div className="light_text">{statusString}</div>
        }

        return false;
    }
}


function mapStateToProps(state) {
    return {
        clientLoginStatus: state.client.loginStatus
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(PhoneActions, dispatch),
        dispatch: dispatch
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);