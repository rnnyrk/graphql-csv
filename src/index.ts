const { ApolloServer } = require('apollo-server');
const csv = require('csvtojson')

const csvPath = './src/annual-enterprise-2019.csv';

const initializeApp = async () => {
  const jsonArray: Item[] = await csv().fromFile(csvPath);

  const typeDefs = `
    type Query {
      info: String!
      data(filter: String!): [Row!]!
      year(Year: String!): [Row!]!
      level(Industry_aggregation_NZSIOC: String!): [Row!]!
      larger_as(Value: Int!): [Row!]!
    }

    type Row {
      Year: String
      Industry_aggregation_NZSIOC: String
      Industry_code_NZSIOC: String
      Industry_name_NZSIOC: String
      Units: String
      Variable_code: String
      Variable_name: String
      Variable_category: String
      Value: String
      Industry_code_ANZSIC06: String
    }
  `;

  const resolvers = {
    Query: {
      info: () => `Van Oord CSV to GraphQL tryout`,
      data: () => jsonArray,
      year: (parent, args, context, info) => {
        const { Year } = args;
        return jsonArray.filter((item) => item.Year === Year);
      },
      level: (parent, args, context, info) => {
        const { Level } = args;
        return jsonArray.filter((item) => item.Industry_aggregation_NZSIOC === Level);
      },
      larger_as: (parent, args, context, info) => {
        const { Value } = args;
        return jsonArray.filter((item) => {
          const toNumber = Number(item.Value);
          return toNumber >= Value;
        });
      },
    },
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  server
    .listen()
    .then(({ url }) =>
      console.log(`Server is running on ${url}`)
    );
};

type Item = {
  Year: string;
  Industry_aggregation_NZSIOC: string;
  Industry_code_NZSIOC: string;
  Industry_name_NZSIOC: string;
  Units: string;
  Variable_code: string;
  Variable_name: string;
  Variable_category: string;
  Value: string;
  Industry_code_ANZSIC06: string;
};

const mainApp = initializeApp();
module.exports = mainApp;