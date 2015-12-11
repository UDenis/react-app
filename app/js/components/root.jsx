import React from 'react'
import App from './app.jsx'

export default class Root extends React.Component {
    render() {
        return (
            <div>
                <h1>This is root</h1>
                <App></App>
            </div>
        );
    }
}