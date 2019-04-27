import { buildSchema } from 'graphql';

module.exports = buildSchema(`
  type Address {
    _id: String
    addr: String!
  }

  type Query {
    hello: String
    address: [Address]
  }

  type Mutation {
    addAddress(address: String!): Address!
    removeAddress(address: String!): Address!
  }
`);
