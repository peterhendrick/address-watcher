const config = {
    collectionName: 'address',
    dbName: 'address-watcher',
    dbURL: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
};

export default config;
