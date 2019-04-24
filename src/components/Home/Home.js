import React from 'react';
// import logo from './logo.svg';
import './Home.css';

class Home extends React.Component {
    constructor() {
        super();
        this.state = { addresses: [], testNet: true, addressEntered: '', btcDisplayPrice: 'Waiting For Coincap.io', validAddress: true };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBitcoinPrice = this.handleBitcoinPrice.bind(this);
        this.handleAddressMsg = this.handleAddressMsg.bind(this);
        this.clearAddresses = this.clearAddresses.bind(this);
        this.clearTransactions = this.clearTransactions.bind(this);
    }

    componentDidMount() {
        const bitcoinPriceWs = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin');
        bitcoinPriceWs.onmessage = this.handleBitcoinPrice;
        this.bitcoinPriceWs = bitcoinPriceWs;
    }

    componentWillUnmount() {
        this.bitcoinPriceWs.close();
        this.addressWs.close();
    }

    handleAddressMsg(response) {
        console.log('Getting address response');
        console.log(response);
    }

    handleBitcoinPrice(response) {
        this.setState(state => {
            if (response.data) {
                const bitcoinResponse = JSON.parse(response.data);
                const bitcoinPrice = parseFloat(bitcoinResponse.bitcoin).toFixed(2);
                state.btcPrice = bitcoinPrice;
                state.btcDisplayPrice = `$${bitcoinPrice}/BTC`;
            }
            return state;
        });
    }

    handleChange(event) {
        this.setState({ addressEntered: event.target.value })
    }

    handleSubmit(event) {
        event.preventDefault();
        if (!this.state.addressEntered) {
            alert('Please Enter and address');
        } else if (this.state.addresses.filter(obj => obj.address === this.state.addressEntered).length) {
            alert('Address already submitted');
            this.setState(state => {
                state.addressEntered = '';
                return state;
            });
        } else {
            const addressWs = this.state.testNet ? new WebSocket(`wss://testnet-ws.smartbit.com.au/v1/blockchain`) : new WebSocket('wss://ws.smartbit.com.au/v1/blockchain');
            addressWs.onopen = () => {
                console.log('Address Websocket connected');
                console.log(this.state.addressEntered)
                addressWs.send(JSON.stringify({ type: "address", address: this.state.addressEntered }))
                this.setState(state => {
                    state.addressEntered = '';
                    return state;
                });
            }
            addressWs.onmessage = (response) => {
                console.log('AddressWs Response');
                console.log(response);
                const data = JSON.parse(response.data);
                if (data.type === 'heartbeat') return;
                if (data.payload.message && data.payload.message.includes('invalid')) {
                    const address = data.payload.message.split(' ')[0];
                    this.setState(state => {
                        state.addresses = state.addresses.filter(addr => addr.address !== address);
                        return state;
                    })
                    alert('Address is invalid');
                    return;
                }
                if (data.payload.message && data.payload.message.includes('Successfully subscribed to address')) return;
                const address = this.state.addresses.find(add => add.address === data.payload.address);
                const tx = data.payload.transaction;
                const addrOutput = tx.outputs.find(output => output.addresses.includes(data.payload.address));
                const paymentAmount = addrOutput.value_int;
                address.txs.push({ id: tx.txid, amount: paymentAmount });
                console.log(address);
                console.log(tx);
                console.log(paymentAmount);
            }
            addressWs.onerror = (err) => {
                console.log(`Websocket error`);
                console.log(err);
            }
            addressWs.onclose = (event) => {
                console.log('Address Websocket closing');
                console.log(event);
            }
            this.setState(state => {
                state.addresses.push({ address: state.addressEntered, txs: [], balance: '' });
                return state;
            });
        }
    }

    clearAddresses(event) {
        event.preventDefault();
        this.setState(state => {
            state.addresses = [];
            return state;
        });
    }

    testNetChange() {
        this.setState(state => {
            state.testNet = !state.testNet;
            return state;
        })
    }


    clearTransactions(event) {
        event.preventDefault();
        this.setState(state => {
            state.addresses = state.addresses.map(addr => {
                addr.txs = [];
                return addr;
            });
            return state;
        });
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    An address watching app by Peter Hendrick
                </header>
                <body>
                <label>
                        Bitcoin Price: {this.state.btcDisplayPrice}
                    </label>
                    <form>
                        <label>
                            Enter Your Address
                            <input type="text" value={this.state.addressEntered} name="addeess" onChange={this.handleChange} />
                        </label>
                        <input type="submit" value="Submit" onClick={this.handleSubmit} />
                        <label>
                            Test Net
                            <input
                                type="checkbox"
                                value={this.state.testNet}
                                checked={this.state.testNet}
                                onChange={this.testNetChange.bind(this)}
                            />
                        </label>
                    </form>
                    <label>
                        Addresses Entered
                    </label>
                    <div>
                        {this.state.addresses.map((addr, index) => {
                            return (
                                <div key={index}>
                                    <ul> Address {index + 1}: {addr.address}</ul>
                                    {
                                        addr.txs.map((tx, ind) => {
                                            return (
                                                <ul key={tx.id}>{ind + 1} txid: {tx.id.substring(0, 5)}... amount: {tx.amount} sat currentUSDValue: {tx.amount / 100000000 * this.state.btcPrice}</ul>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })}
                    </div>
                    <input type="submit" value="Clear Addresses" onClick={this.clearAddresses} />
                    <input type="submit" value="Clear Transactions" onClick={this.clearTransactions} />
                </body>
            </div>
        );
    }
}

export { Home };
