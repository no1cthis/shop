"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const app_1 = __importDefault(require("./src/app"));
const mongo_1 = require("./src/services/mongo");
const apollo_server_express_1 = require("apollo-server-express");
const load_files_1 = require("@graphql-tools/load-files");
const schema_1 = require("@graphql-tools/schema");
require("dotenv").config();
const PORT = process.env.PORT || 8000;
const typesArray = (0, load_files_1.loadFilesSync)("**/*", {
    extensions: ["graphql"],
});
const resolversArray = (0, load_files_1.loadFilesSync)(path_1.default.join(__dirname, "**/*.resolvers.js"));
async function startApolloServer() {
    await (0, mongo_1.mongoConnect)();
    const schema = (0, schema_1.makeExecutableSchema)({
        typeDefs: typesArray,
        resolvers: resolversArray,
    });
    const server = new apollo_server_express_1.ApolloServer({
        schema,
    });
    await server.start();
    server.applyMiddleware({ app: app_1.default, path: "/graphql" });
    app_1.default.listen(PORT, () => {
        console.log(`GraphQL server listening on port ${PORT}...`);
    });
}
startApolloServer();
//# sourceMappingURL=server.js.map