import React from 'react';
import './Address.css';

class Address extends React.Component {
    constructor(props) {
        super(props);
        this.state = { address: props.match.params.addrId };
        // this.testnetExplorer = blockexplorer.usingNetwork(3);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    async componentDidMount() {
        try {
            // const address = await blockexplorer.getAddress(this.state.address);
            // if(address) {
            //     this.setState(state =>{
            //         state.addressObject = address;
            //     });
            //     console.log(this.state.addressObject);
            // }
        } catch (err) {
            console.log(err);
        }

        // const blockchainWS = new Socket({ network: 3 });
        // blockchainWS.onOpen(() => {
        //     console.log('Websocket open');
        // });
        // blockchainWS.onTransaction(processTransaction, {addresses: [this.state.address.addr] });
        // const address = await this.testnetExplorer.getAddress(this.state.address.addr);
        // console.log(address);

        function processTransaction(tx) {
            this.state.address.txs.push(tx);
        }
    }


    render() {
        return (
            <div>Address Page {this.state.address}</div>
        );
    }
}

export { Address };
