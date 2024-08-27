import { auth, httpAdapter, validate } from '../../../middleware/index.js';
import { deleteFlightValidation } from '../validation.js';
import { statusCodes } from '#utils';

export function deleteFlightRoute(router) {
  /**
   * @openapi
   * /flights/{id}:
   *  delete:
   *    description: Delete a flight using id
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: string
   *    responses:
   *      204:
   *        description: Returns a successful response with empty body if the flight was deleted
   *      400:
   *        $ref: '#/components/responses/BadRequest'
   *      401:
   *        $ref: '#/components/responses/Unauthorized'
   */
  router.delete('/:id', auth(), validate(deleteFlightValidation), httpAdapter((req) => {
    return req.api.deleteOneFlight(req.params.id);
  }, statusCodes.noContent));
}
