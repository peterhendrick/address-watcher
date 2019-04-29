import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Address from './components/Address/Address';
import Transaction from './components/Transaction/Transaction';


class App extends React.Component {
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
