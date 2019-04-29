import { buildSchema } from 'graphql';

module.exports = buildSchema(`
  type Address {
    _id: String
    addr: String!
  }

  type Query {
      addresses: [Address]
  }

  type Mutation {
    addAddress(address: String!): Address!
    removeAddress(address: String!): Address!
  }
`);
