import React from 'react';
import './Address.css';

class Address extends React.Component {
    constructor(props) {
        super(props);
        this.state = { addr: props.match.params.addrId, addressObject: {} };
        // this.testnetExplorer = blockexplorer.usingNetwork(3);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.fetchAddress = this.fetchAddress.bind(this);
    }

    componentDidMount() {
        this.fetchAddress();
    }

    fetchAddress() {
        fetch('/address/' + this.state.addr)
            .then(response => response.json())
            .then(data => {
                console.log('Response');
                console.log(data.address);
                console.log(data.ticker);
                this.setState(state => {
                    state.addressObject = data.address;
                    state.dollarBalance = Number(state.addressObject.final_balance / 100000000 * data.ticker.USD.last ).toFixed(6);
                    return state;
                });
                console.log(this.state);
            })
            .catch(err => console.log(err));
    }


    render() {
        return (
            <div>Address Page
                Address: {this.state.addr} Balance: {this.state.addressObject.final_balance} satoshis ${this.state.dollarBalance}
                {/* <ul>{this.addres.transactions}</ul> */}
            </div>
        );
    }
}

export { Address };
