import React from 'react';
import { blockexplorer } from 'blockchain.info';
import './Transaction.css';

class Transaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = { transaction: { txId: props.match.params.txId }  };
        this.testnetExplorer = blockexplorer.usingNetwork(3);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.fetchTransaction = this.fetchTransaction.bind(this);
    }

    componentDidMount() {
        this.fetchTransaction()
    }

    fetchTransaction() {
        fetch('/transaction/' + this.state.transaction.txId)
            .then(response => response.json())
            .then(data => {
                this.setState(state => {
                    state.transaction = data.tx;
                    state.ticker = data.ticker;
                    return state;
                });
                console.log(this.state);
            })
    }


    render() {
        return (
            <div>Transaction</div>
        );
    }
}

export { Transaction };
