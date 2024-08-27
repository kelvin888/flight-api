import { capacityPattern, dateFormatPattern, flightCodePattern, positiveIntegerPattern } from '#utils';

const flight = {
  code: { type: 'string', pattern: flightCodePattern },
  capacity: { type: 'number', minimum: 1, maximum: 200 },
  departureDate: { type: 'string', pattern: dateFormatPattern },
};

const multipartFlight = {
  code: { type: 'string', pattern: flightCodePattern },
  capacity: { type: 'string', pattern: capacityPattern },
  departureDate: { type: 'string', pattern: dateFormatPattern },
};

const flightRequiredProps = ['code', 'capacity', 'departureDate'];

const oneFlightParams = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
    required: ['id'],
    additionalProperties: false,
  },
};

export const getAllFlightsValidation = {
  query: {
    type: 'object',
    properties: {
      code: { type: 'string', pattern: '^[A-Za-z]{1,6}$' },
      page: { type: 'string', pattern: positiveIntegerPattern },
      size: { type: 'string', pattern: positiveIntegerPattern },
    },
    additionalProperties: false,
  },
};

export const getOneFlightValidation = {
  ...oneFlightParams,
};

export const availableValidation = {
  query: {
    type: 'object',
    properties: {
      code: { type: 'string', pattern: flightCodePattern },
    },
    required: ['code'],
    additionalProperties: false,
  },
};

export const createFlightValidation = {
  body: {
    type: 'object',
    properties: {
      ...flight,
    },
    required: flightRequiredProps,
    additionalProperties: false,
  },
};

export const createFlightWithPhotoValidation = {
  body: {
    type: 'object',
    properties: {
      ...multipartFlight,
    },
    required: flightRequiredProps,
    additionalProperties: false,
  },
};

export const updateFlightValidation = {
  ...oneFlightParams,
  body: {
    type: 'object',
    anyOf: [{
      properties: {
        ...flight,
        photo: { type: 'null', nullable: true },
      },
      required: [...flightRequiredProps, 'photo'],
      additionalProperties: false,
    }, {
      properties: {
        ...flight,
      },
      required: flightRequiredProps,
      additionalProperties: false,
    }],
  },
};

export const updateFlightWithPhotoValidation = {
  ...oneFlightParams,
  body: {
    type: 'object',
    properties: {
      ...multipartFlight,
    },
    required: flightRequiredProps,
    additionalProperties: false,
  },
};

export const deleteFlightValidation = {
  ...oneFlightParams,
};
