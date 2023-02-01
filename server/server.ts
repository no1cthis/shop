import * as path from "path";
import app from "./src/app";
import { mongoConnect } from "./src/services/mongo";
import { ApolloServer } from "apollo-server-express";
import { loadFilesSync } from "@graphql-tools/load-files";
import { makeExecutableSchema } from "@graphql-tools/schema";
require("dotenv").config();

const PORT = process.env.PORT || 8000;

const typesArray = loadFilesSync("**/*", {
  extensions: ["graphql"],
});
const resolversArray = loadFilesSync(path.join(__dirname, "**/*.resolvers.js"));

async function startApolloServer() {
  await mongoConnect();

  const schema = makeExecutableSchema({
    typeDefs: typesArray,
    resolvers: resolversArray,
  });

  const server = new ApolloServer({
    schema,
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  app.listen(PORT, () => {
    console.log(`GraphQL server listening on port ${PORT}...`);
  });
}

startApolloServer();
