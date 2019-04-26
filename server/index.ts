import { blockexplorer } from 'blockchain.info';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as mongodb from 'mongodb';
import * as path from 'path';
const app = express();
const port = process.env.PORT || 5000;
const clientPath = process.env.ENVIRONMENT === 'Develop' ? '../client/public/' : '../client/build';

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

app.route('/transaction/:txId').get(async (req: express.Request, res: express.Response) => {
    const txId = req.params.txId;
    const testnetExplorer = blockexplorer.usingNetwork(3);
    try {
        const tx = await testnetExplorer.getTx(txId);
        if (!tx) res.render('index'); // TODO: 404

        res.json(tx);
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
            const address = await testnetExplorer.getAddress(addr);
            if (!address) res.render('index'); // TODO: 404

            res.json(address);
        } catch (err) {
            console.log(err);
            res.json(err);
        }

    })
    .post(async (req: express.Request, res: express.Response) => {
        if (req.params.addr) await mongodb.save(req.params.addr);
    });

// Handles any requests that don't match the ones above
app.get('*', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(port, () => {
    /* tslint:disable-next-line:no-console */
    console.log(`App running on port ${port}.`);
});
