import { auth, httpAdapter, validate } from '../../../middleware/index.js';
import { updateFlightValidation } from '../validation.js';

export function updateFlightRoute(router) {
  /**
   * @openapi
   * /flights/{id}:
   *  put:
   *    description: Updates one flight without photo
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: string
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/FlightData'
   *    responses:
   *      200:
   *        description: Returns the newly created flight
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Flight'
   *      400:
   *        $ref: '#/components/responses/BadRequest'
   *      401:
   *        $ref: '#/components/responses/Unauthorized'
   *      404:
   *        $ref: '#/components/responses/NotFound'
   */
  router.put('/:id', auth(), validate(updateFlightValidation), httpAdapter((req) => {
    return req.api.updateOneFlight(req.params.id, req.body);
  }));
}
