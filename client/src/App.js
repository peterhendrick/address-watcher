import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import { Home } from './components/Home';
import { Address } from './components/Address';
import { Transaction } from './components/Transaction';


class App extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <div >
                <HashRouter>
                    <div>
                        <Route exact path="/" component={Home} />
                        <Route path="/address/:addrId" component={Address} />
                        <Route path="/transaction/:txId" component={Transaction} />
                    </div>
                </HashRouter>
            </div>
        );
    }
}

export default App;
