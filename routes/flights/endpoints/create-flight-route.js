import { auth, httpAdapter, validate } from '../../../middleware/index.js';
import { createFlightValidation } from '../validation.js';
import { statusCodes } from '#utils';

export function createFlightRoute(router) {
  /**
   * @openapi
   * /flights:
   *  post:
   *    description: Creates one flight without photo
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/FlightData'
   *    responses:
   *      201:
   *        description: Returns the newly created flight
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Flight'
   *      400:
   *        $ref: '#/components/responses/BadRequest'
   *      401:
   *        $ref: '#/components/responses/Unauthorized'
   */
  router.post('/', auth(), validate(createFlightValidation), httpAdapter((req) => {
    return req.api.createOneFlight(req.body);
  }, statusCodes.created));
}
