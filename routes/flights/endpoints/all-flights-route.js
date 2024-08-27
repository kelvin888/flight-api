import { auth, httpAdapter, validate } from '../../../middleware/index.js';
import { getAllFlightsValidation } from '../validation.js';

export function allFlightsRoute(router) {
  /**
   * @openapi
   * /flights:
   *  get:
   *    description: Returns all flights in a paginated format
   *    parameters:
   *      - in: query
   *        name: page
   *        schema:
   *          type: number
   *          default: 1
   *          minimum: 1
   *          example: 1
   *        description: The desired page to get from the whole collection of flights
   *      - in: query
   *        name: size
   *        schema:
   *          type: number
   *          default: 10
   *          minimum: 1
   *          example: 10
   *        description: The number of flights to return in one page
   *      - in: query
   *        name: code
   *        schema:
   *          type: string
   *          default: ""
   *        description: The full code of the flight to search for or a partial match
   *        examples:
   *           partial:
   *             value: abc
   *             summary: Partial code search with less than 6 characters that can return multiple values
   *           complete:
   *             value: AbcDef
   *             summary: A full code that can return at most one result
   *    responses:
   *      200:
   *        description: Returns total flights, filtered results, and a collection of flight objects
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/FlightResponse'
   *      400:
   *        $ref: '#/components/responses/BadRequest'
   *      401:
   *        $ref: '#/components/responses/Unauthorized'
   */

  router.get('/', auth(), validate(getAllFlightsValidation), httpAdapter((req) => {
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const size = req.query.size ? parseInt(req.query.size, 10) : 10;
    return req.api.getAllFlights(page, size, req.query.code);
  }));
}
