An address watching application using React, Node, Mongo and GraphQL
=======

address-watcher is a website where you can enter a bitcoin (testnet) address and monitor transactions paid to that address.

For a live example of this full stack app running visit https://address-watcher.herokuapp.com/

**Author:** Peter Hendrick

## Requirements and Downloading

To use address-watcher, you need:

* Node.js

* tsc - a typescript compiler (npm install -g tsc)

* mongod - you need a mongo server running locally. For mac users, you can run:

```bash
brew install mongodb
```

To download locally, run:
```bash
git clone https://github.com/peterhendrick/address-watcher && cd address-watcher
```

To install run:
```bash
npm install && npm run build
```

You can now run the app locally as long as your mongo server is running.


The app will run on port 5000. To use the app visit localhost:5000.

Once running you can add multiple addresses and the app will start watching those addresses for new transactions in real time. You may also click on an address after entering and visit a page that will show you all transactions found for that address. In addition, You can click into a transaction to view it's inputs and outputs.
