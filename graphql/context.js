import { errorTypes, knownErrors, sendGraphQlError, ServerError, extractTokenFromHeader } from '#utils';

export async function context({ req }) {
  const { api } = req;
  const useAuth = req.container.resolve('useAuth');
  const useVerbose = req.container.resolve('useVerbose');
  const common = { useAuth, useVerbose, api };
  const anonymous = { ...common, user: null, token: null };
  if (!useAuth) {
    return anonymous;
  }
  const token = extractTokenFromHeader(req);
  if (token instanceof ServerError) {
    return sendGraphQlError(token);
  }
  if (!token) {
    return anonymous;
  }
  try {
    const user = await api.verifyToken(token);
    return {
      ...common,
      user: { id: user.id, name: user.name, email: user.email },
      token,
    };
  } catch (e) {
    let error = e;
    if (!(e instanceof ServerError)) {
      error = knownErrors.unknownCause();
    }
    // If an error is thrown in the context the graphql introspection stops working. It is better to report no user and defer to the individual resolvers for authorization
    if (e.code === errorTypes.unauthenticated) {
      return {
        ...common,
        ...anonymous,
        token,
      };
    }
    sendGraphQlError(error);
  }
}
