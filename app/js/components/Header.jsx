import React from 'react'
import * as connectionStatus from '../constants/clientConnectionStatus'

export default class Header extends React.Component {
    render() {
        return (<div>
            <div className="calldialer_header">Звонок</div>
            {this.renderConnectionStatus()}
        </div>);
    }

    renderConnectionStatus(){
        let status = false;
        switch (this.props.connectionStatus) {
            case connectionStatus.CONNECTED:
                status = 'Соединен';
                break;
            case connectionStatus.DISCONNECTED:
                status = 'Соединение потеряно'
                break;

            case connectionStatus.CONNECTING:
                status = 'Соединение...';
                break;
        }

        if (status){
            return (<div>{status}</div>)
        }

        return false;
    }
}