import { dateFormatPattern, flightCodePattern } from '#utils';

export const graphFlightsValidation = {
  type: 'object',
  properties: {
    code: { type: 'string', pattern: flightCodePattern },
  },
};

export const graphCodeValidation = {
  type: 'object',
  properties: {
    code: { type: 'string', pattern: flightCodePattern },
  },
};

export const graphAuthValidation = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 1, maxLength: 255 },
  },
};

export const graphOneFlightValidation = {
  type: 'object',
  properties: {
    flight: {
      type: 'object',
      properties: {
        code: { type: 'string', pattern: flightCodePattern },
        capacity: { type: 'number', minimum: 1, maximum: 200 },
        departureDate: { type: 'string', pattern: dateFormatPattern },
      },
    },
  },
};
