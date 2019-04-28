import React from 'react';
import './Address.css';
import { Link } from 'react-router-dom';

class Address extends React.Component {
    constructor(props) {
        super(props);
        this.state = { addr: props.match.params.addrId, addressObject: {hash: '', txs: []} };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.fetchAddress = this.fetchAddress.bind(this);
    }

    async componentDidMount() {
        await this.fetchAddress();
    }

    async fetchAddress() {
        try {
            const data = await fetch('/address/' + this.state.addr).then(response => response.json())
            this.setState(state => {
                state.addressObject = data.address;
                state.dollarBalance = Number(state.addressObject.final_balance / 100000000 * data.ticker.USD.last ).toFixed(6);
                return state;
            });
            this.amountToAddress();
            console.log(this.state);
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        return (
            <div className="Address">
                <header className="Address-header">
                    Address Page
                </header>
                <div class="Address-body">
                    <div class="row">Address: {this.state.addr}</div>
                    <div class="row 2">Balance: {this.state.addressObject.final_balance} satoshis</div>
                    <div class="row 3">${this.state.dollarBalance}</div>
                </div>
                <label>Transactions:
                </label>
                    <div>{this.state.addressObject.txs.map(tx => {
                        return <ul>
                            Txid: <Link to={{ pathname: '/transaction/' + tx.hash }}>{tx.hash.substring(0, 10)}...</Link>
                        </ul>;
                    })}</div>
            </div>
        );
    }
}

export { Address };
