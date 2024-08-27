import { isNull, isUndefined, mapValues } from 'lodash-es';

import { knownErrors, sendGraphQlError, performValidation } from '#utils';

export async function adapter(promise) {
  try {
    const result = await promise;
    if (isNull(result) || isUndefined(result)) {
      return '';
    }
    return result;
  } catch (e) {
    sendGraphQlError(e);
  }
}

export function graphqlAdapter(settings) {
  return mapValues(settings, value => {
    let [auth, validation, handler] = value;
    if (handler === undefined) {
      handler = validation;
      validation = null;
    }
    if (auth === 'auth') {
      return (parent, args, context) => {
        const { useAuth, user } = context;
        if (!useAuth || user) {
          if (validation && !performValidation(validation, args).valid) {
            return sendGraphQlError(knownErrors.badRequest());
          }
          return adapter(handler(parent, args, context));
        } else {
          return sendGraphQlError(knownErrors.unauthenticated());
        }
      };
    }
    if (auth === 'anonymous') {
      return (parent, args, context) => {
        if (validation && !performValidation(validation, args).valid) {
          return sendGraphQlError(knownErrors.badRequest());
        }
        return adapter(handler(parent, args, context));
      };
    }
    throw new Error('Invalid auth setting');
  });
}

