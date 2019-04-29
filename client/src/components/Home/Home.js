import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

class Home extends React.Component {
    constructor() {
        super();
        this.state = { addresses: [], addressEntered: '', btcDisplayPrice: 'Waiting For Coincap.io', validAddress: true };
        this.wss = { clients: [] };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBitcoinPrice = this.handleBitcoinPrice.bind(this);
        this.handleAddressMsg = this.handleAddressMsg.bind(this);
        this.clearAddresses = this.clearAddresses.bind(this);
        this.clearTransactions = this.clearTransactions.bind(this);
        this.subscribeMany = this.subscribeMany.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.saveAddress = this.saveAddress.bind(this);
    }

    async componentDidMount() {
        const bitcoinPriceWs = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin');
        bitcoinPriceWs.onmessage = this.handleBitcoinPrice;
        this.bitcoinPriceWs = bitcoinPriceWs;

        const query = `{addresses{_id,addr}}`;
        const response = await fetch(`/graphql?query=${query}`).then(res => res.json());
        const addresses = response.data && response.data.addresses ? response.data.addresses.map(address => {
            return {
                address: address.addr,
                txs: address.txs ? address.txs : []
            };
        }) : [];
        if (addresses) {
            localStorage.setItem('addresses', JSON.stringify(addresses));
            this.setState(state => {
                state.addresses = addresses;
                return state;
            });
            this.subscribeMany(addresses);
        }
    }

    componentWillUnmount() {
        for(const client of this.wss.clients) {
            client.close();
        }
    }

    subscribeMany(addresses) {
        if (addresses.length) {
            addresses.forEach(address => {
                this.subscribe(address.address);
            });
        }
    }

    subscribe(address) {
        const addressWs = new WebSocket(`wss://testnet-ws.smartbit.com.au/v1/blockchain`);
        this.wss.clients.push(addressWs);
        addressWs.onopen = () => {
            console.log('Address Websocket connected');
            console.log(address)
            addressWs.send(JSON.stringify({ type: 'address', address }))
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
            if (data.payload.message && data.payload.message.includes('Successfully subscribed to address')) {
                const address = data.payload.message.split(' ').pop();
                this.setState(state => {
                    const addressObj = state.addresses.find(addr => addr.address === address);
                    addressObj.websocket = addressWs;
                    return state;
                })
                return;
            }
            const address = this.state.addresses.find(add => add.address === data.payload.address);
            const tx = data.payload.transaction;
            const addrOutput = tx.outputs.find(output => output.addresses.includes(data.payload.address));
            const paymentAmount = addrOutput.value_int;
            address.txs.push({ id: tx.txid, amount: paymentAmount });
            _updatedLocalStorage(address);
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
        function _updatedLocalStorage(addr) {
            let addresses = JSON.parse(localStorage.getItem('addresses'));
            addresses = addresses.map(add => {
                if (add.address === addr.address) return addr;
                return add;
            });
            localStorage.setItem('addresses', JSON.stringify(addresses));
        }
        return addressWs;
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
            this.subscribe(this.state.addressEntered);
            let addresses = JSON.parse(localStorage.getItem('addresses'));
            if (!addresses) addresses = [];
            addresses.push({ address: this.state.addressEntered, txs: [] });
            localStorage.setItem('addresses', JSON.stringify(addresses));
            this.setState(state => {
                state.addresses.push({ address: state.addressEntered, txs: [] });
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
        localStorage.removeItem('addresses');
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

    async saveAddress(address, event) {
        event.preventDefault();
        // console.log(address);
        try {
            const data = await fetch(`/address/${address}`, {
                method: 'POST',
                body: JSON.stringify({ address })
            }).then(res => res.json())
            console.log(data);
        } catch (err) {
            console.log (err)
        }
    }

    render() {
        return (
            <div className="Home">
                <header className="Home-header">
                    An Address Watching App by Peter Hendrick for the Bitcoin Testnet 3
                </header>
                <div className="Home-body">
                    <label>
                        Bitcoin Price: {this.state.btcDisplayPrice}
                    </label>
                    <form>
                        <label>
                            Enter Your Address
                            <input type="text" value={this.state.addressEntered} name="addeess" onChange={this.handleChange} />
                        </label>
                        <input type="submit" value="Submit" onClick={this.handleSubmit} />
                    </form>
                    <label>
                        Addresses Entered
                    </label>
                    <div>
                        {this.state.addresses.map((addr, index) => {
                            return (
                                <div key={index}>
                                    <ul> Address {index + 1}: <Link to={{ pathname: '/address/' + addr.address }}>{addr.address}</Link>
                                    <input type="submit" value="Save Address" onClick={this.saveAddress.bind(this, addr.address)} />
                                    </ul>
                                    {addr.txs.map((tx, ind) => {
                                        return (
                                            <ul key={tx.id}>{ind + 1} txid: <Link to={{ pathname: '/transaction/' + tx.id }}>{tx.id.substring(0, 5)}...</Link> - amount: {tx.amount} sat - Value: ${parseFloat(Number(tx.amount / 100000000).toFixed(6)) * this.state.btcPrice}</ul>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>
                    <input type="submit" value="Clear Addresses" onClick={this.clearAddresses} />
                    <input type="submit" value="Clear Transactions" onClick={this.clearTransactions} />
                </div>
            </div>
        );
    }
}

export { Home };
