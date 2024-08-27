import { auth, httpAdapter, validate } from '../../../middleware/index.js';
import { availableValidation } from '../validation.js';

export function availableRoute(router) {
  /**
   * @openapi
   * /flights/available:
   *  get:
   *    description: Returns if a code is available or not
   *    parameters:
   *      - in: query
   *        name: code
   *        required: true
   *        schema:
   *          type: string
   *          example: AbcDef
   *        description: The exact 6 characters code to verify
   *    responses:
   *      200:
   *        description: Returns available or unavailable status for the requested code
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/AvailableResponse'
   *      400:
   *        $ref: '#/components/responses/BadRequest'
   *      401:
   *        $ref: '#/components/responses/Unauthorized'
   */
  router.get('/available', auth(), validate(availableValidation), httpAdapter((req) => {
    return req.api.getCodeAvailability(req.query.code);
  }));
}
