import React from 'react';
import { blockexplorer } from 'blockchain.info';
import './Transaction.css';

class Transaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = { transaction: { txid: props.match.params.transaction }  };
        this.testnetExplorer = blockexplorer.usingNetwork(3);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    async componentDidMount() {

    }


    render() {
        return (
            <div>Transaction</div>
        );
    }
}

export { Transaction };
