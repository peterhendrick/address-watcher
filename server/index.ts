import { blockexplorer, exchange } from 'blockchain.info';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
// import { buildASTSchema } from 'graphql';
// import gql from 'graphql-tag';
// import * as mongodb from 'mongodb';
import * as mongoose from 'mongoose';
import * as path from 'path';

// Import configuration and connect to DB
import config from './config';
const connectionString = process.env.MONGODB_URI ? encodeURIComponent(process.env.MONGODB_URI) : encodeURIComponent(config.dbURL + '/' + config.dbName);
mongoose.connect(connectionString, {useNewUrlParser: true }, (err) => {
    if (err) throw err;
    console.log('connected to database');
});

// Import GraphQL components
import * as resolvers from './resolvers';
import * as schema from './schema';

const app = express();
const port = process.env.PORT || 5000;


// const clientPath = process.env.ENVIRONMENT === 'Develop' ? '../client/public/' : '../client/build';

app.use(cors());
app.use(express.static(path.join(__dirname, '../client/build')));

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.post('/', (req, res) => {
    res.render('index');
});

// Define "context" just for testing
const context = {
    greeting: 'Hello world!'
};

// Set up Express server
// app.use('/graphql', graphqlHTTP({
//     // context,
//     graphiql: process.env.NODE_ENV === 'development',
//     rootValue: resolvers,
//     schema
// } as any));

app.use('/graphql', graphqlHTTP(async (request, response, graphQLParams) => ({
    context: request,
    graphiql: process.env.NODE_ENV === 'development',
    rootValue: resolvers,
    schema
} as any)));

app.route('/transaction/:txId').get(async (req: express.Request, res: express.Response) => {
    const txId = req.params.txId;
    const testnetExplorer = blockexplorer.usingNetwork(3);
    try {
        const [tx, ticker] = await Promise.all([testnetExplorer.getTx(txId), exchange.getTicker()]);
        if (!tx) res.json({ address: '404 not found' }); // TODO: 404

        const response = { tx, ticker };
        res.json(response);
    } catch (err) {
        console.log(err);
        res.json(err);
    }

});

app.route('/address/:addr')
    .get(async (req: express.Request, res: express.Response) => {
        const addr = req.params.addr;
        const testnetExplorer = blockexplorer.usingNetwork(3);
        try {
            const [address, ticker] = await Promise.all([testnetExplorer.getAddress(addr), exchange.getTicker()]);
            // const address = await testnetExplorer.getAddress(addr);
            if (!address) res.render('index'); // TODO: 404
            const response = { address, ticker };

            res.json(response);
        } catch (err) {
            console.log(err);
            res.json(err);
        }

    })
    .post(async (req: express.Request, res: express.Response) => {
        // if (req.params.addr) await mongodb.save(req.params.addr);
    });

// Handles any requests that don't match the ones above
app.get('*', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(port, () => {
    /* tslint:disable-next-line:no-console */
    console.log(`App running on port ${port}.`);
});
