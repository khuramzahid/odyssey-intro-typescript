import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import path from "path";
import { gql } from "graphql-tag";
import { resolvers } from "./resolvers";
import { ListingAPI } from "./datasources/listing-api";

const typeDefs = gql(
  readFileSync(path.resolve(__dirname, "./schema.graphql"), {
    encoding: "utf-8",
  })
);

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, {
    context: async () => {
      const { cache } = server;
      return {
        // Our resolver functions expect to find dataSources.listingAPI on their contextValue,
        // which is why we've defined a property called dataSources here, with another property 
        // called listingAPI.
        dataSources: {
          listingAPI: new ListingAPI({ cache }),
        },
      };
    },
  });
  
  console.log(`
    🚀  Server is running!
    📭  Query at ${url}
  `);
}

startApolloServer();