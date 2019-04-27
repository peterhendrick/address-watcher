import * as mongoose from 'mongoose';
import './models/addresses';
const Address = mongoose.model('Address');

const resolvers = {
    addAddress: async (args, context) => {
        const address = new Address({
            addr: args.addr,
            tsx: args.txs
        });

        const err = await address.save();

        if (err) return err;
        return address;
    },
    address: async (args, context) => {
        // See "greeting: 'Hello world!'" in Terminal
        console.log(context);

        try {
            // console.log(Address);
            // return await mongodb.
            const addresses = await Address.find({});
            console.log(addresses);
            return addresses;
        } catch (err) {
            console.log(err);
        }
    },

    removeBook: async (args, context) => {
        const address = await Address.findOneAndRemove({
            addr: args.addr
        });

        return address;
    }
};

module.exports = resolvers;
