import * as mongoose from 'mongoose';
import './models/addresses';
const Address = mongoose.model('Address');

const resolvers = {
    addresses: async () => {
        return await Address.find();
    }
};

module.exports = resolvers;
