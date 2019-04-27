
import * as mongoose from 'mongoose';

export interface IAddr extends mongoose.Document {
    addr: string;
    finalBalance?: number;
    txs?: [any];
}

export const AddressSchema = new mongoose.Schema({
    addr: String,
    finalBalance: Number,
    txs: [Object]
});

// Export Mongoose "Book" model
const Address = mongoose.model<IAddr>('Address', AddressSchema);
export default Address;
// module.exports = mongoose.model('Transaction', TxSchema);
