import React from 'react';
import './Transaction.css';
import { Link } from 'react-router-dom';


class Transaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = { tx: { hash: props.match.params.txId, inputs: [], out: [] }  };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.fetchTransaction = this.fetchTransaction.bind(this);
    }

    async componentDidMount() {
        await this.fetchTransaction()
    }

    async fetchTransaction() {
        const response = await fetch('/transaction/' + this.state.tx.hash).then(response => response.json())
        console.log(response);
        this.setState(state => {
            state.tx = response.tx;
            state.ticker = response.ticker.USD['15m'];
            return state;
        });
    }


    render() {
        return (
            <div className="Transaction">
                <header className="Transaction-header">
                    <Link to="/">Home</Link>Transaction Page
                </header>
                <div className="Transaction-body">
                    <div className="row">Transaction: {this.state.tx.hash}</div>
                </div>
                <label>Inputs:
                    <div>{this.state.tx.inputs.map(input => {
                        return <div key={input.prev_out.addr}>Address: <Link to={{ pathname: '/address/' + input.prev_out.addr }}>{input.prev_out.addr}</Link> Value: -{input.prev_out.value} Satoshis ${parseFloat(input.prev_out.value / 100000000 * this.state.ticker).toFixed(6)} </div>
                    })}</div>
                </label>
                <label>Outputs:
                <div>{this.state.tx.out.map(out => {
                        return <div key={out.addr}>Address <Link to={{ pathname: '/address/' + out.addr}}>{out.addr}</Link> Value: {out.value} Satoshis ${parseFloat(out.value / 100000000 * this.state.ticker).toFixed(6)}</div>
                    })}</div>
                </label>
            </div>
        );
    }
}

export { Transaction };
