import React from 'react';
import { Router, Route } from 'react-router-dom';
import { Home } from './components/Home';
import { Address } from './components/Address';
import { Transaction } from './components/Transaction';
import { history } from './history';


class App extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <div >
                <Router history={history}>
                    <div>
                        <Route exact path="/" component={Home} />
                        <Route path="/address/:addrId" component={Address} />
                        <Route path="/transaction/:txId" component={Transaction} />
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;
