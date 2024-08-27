import { auth, httpAdapter, validate } from '../../../middleware/index.js';
import { getOneFlightValidation } from '../validation.js';

export function oneFlightRoute(router) {
  /**
   * @openapi
   * /flights/{id}/details:
   *  get:
   *    description: Returns one flight by id
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: string
   *    responses:
   *      200:
   *        description: Returns the flight object
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
  router.get('/:id/details', auth(), validate(getOneFlightValidation), httpAdapter((req) => {
    return req.api.getOneFlight(req.params.id);
  }));
}
