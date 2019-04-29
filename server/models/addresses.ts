
import * as mongoose from 'mongoose';

export interface IAddr extends mongoose.Document {
    addr: string;
    finalBalance?: number;
    txs?: [any];
}

export const AddressSchema = new mongoose.Schema({
    addr: {type: String, required: true},
    finalBalance: Number,
    txs: [Object]
});

const Address = mongoose.model<IAddr>('Address', AddressSchema);
export default Address;
