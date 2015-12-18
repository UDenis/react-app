import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {bindToInput} from '../utils/componentHelpers'
import * as PhoneActions from '../actions/phone';

import * as callingStatus from '../constants/clientCallingStatus'

class CallDialer extends Component {

    static defaultState = {
        phone : '+79174973045'
    }

    constructor() {
        super();
        this.state = CallDialer.defaultState;
        this.bindToInput = bindToInput
    }

    onCall(ev){
        ev.preventDefault();
        this.props.actions.call(this.state.phone)
    }

    onCancel(ev){
        this.props.actions.call(rejectCall(this.props.lastCall))
    }

    render() {
        return (
            <form onSubmit={this.onCall.bind(this)}>
                <div className="form_group">
                    <input type="text" onChange={this.bindToInput('phone')} className="w100 big phone_number" value={this.state.phone} placeholder="Номер телефона"/>
                </div>

                <div className="form_group ">
                    {this.renderButton()}
                </div>
                {this.renderStatus()}
            </form>);
    }

    renderButton(){
        if (this.props.callingState !== callingStatus.CALL_CONNECTED) {
            return <input type='submit' className="button second w100 " value="Вызов"/>
        } else {
            return <input type='button' onclick={this.onCancel} className="button cancel w100" value="Сброс"/>
        }
    }

    renderStatus(){
        let status;

        switch (this.props.callingState){
            case callingStatus.CALLING:
                status = 'Вызов...'
                break;
            case callingStatus.CALL_CONNECTED:
                status = <span>Время вызова <b>0:03</b></span>
                break;
        }

        if (status){
            return (<div className="light_text">{status}</div>)
        }

        return false
    }
}

function mapStateToProps(state) {
    return {
        callingState: state.phone.callingState,
        lastCall: state.phone.lastCall
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
)(CallDialer);