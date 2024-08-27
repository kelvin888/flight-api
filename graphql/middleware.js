import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import { typeDefinition } from './type-definition.js';
import { context } from './context.js';
import { graphqlAdapter } from './graphql-adapter.js';
import { graphAuthValidation, graphCodeValidation, graphFlightsValidation, graphOneFlightValidation } from './validation.js';
import { knownErrors } from '#utils';

const server = new ApolloServer({
  typeDefs: typeDefinition,
  resolvers: {
    Query: graphqlAdapter({
      flights: ['auth', graphFlightsValidation, (parent, { page, size, code }, { api }) => api.getAllFlights(page, size, code)],
      available: ['auth', graphCodeValidation, (parent, { code }, { api }) => api.getCodeAvailability(code)],
      status: ['auth', (parent, { ids }, { api }) => api.getFlightsStatus(ids)],
      find: ['auth', (parent, { id }, { api }) => api.getOneFlight(id)],
      me: ['auth', (parent, args, { user }) => user],
    }),
    Mutation: graphqlAdapter({
      create: ['auth', graphOneFlightValidation, (parent, { flight }, { api }) => api.createOneFlight(flight)],
      update: ['auth', graphOneFlightValidation, (parent, { id, flight }, { api }) =>api.updateOneFlight(id, flight)],
      delete: ['auth', (parent, { id }, { api }) => api.deleteOneFlight(id)],
      register: ['anonymous', graphAuthValidation, (parent, { name, email, password }, { api }) => api.register(name, email, password)],
      login: ['anonymous', graphAuthValidation, (parent, { email, password }, { api }) => api.login(email, password)],
      refresh: ['anonymous', (parent, args, { token, api }) => token
        ? api.refreshToken(token, args.refreshToken)
        : knownErrors.missingCredentials(),
      ],
    }),
  },
});

await server.start();

export const graphql = expressMiddleware(server, {
  context,
});
