import { auth, httpAdapter } from '../../../middleware/index.js';

export function statusRoute(router) {
  /**
   * @openapi
   * /flights/status:
   *  get:
   *    description: Returns the status of flights based on id
   *    parameters:
   *      - in: query
   *        name: ids
   *        required: true
   *        schema:
   *          type: array
   *          items:
   *            type: string
   *    responses:
   *      200:
   *        description: Returns the file processing status of each of the requested ids
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/FlightStatusResponse'
   *      401:
   *        $ref: '#/components/responses/Unauthorized'
   */
  router.get('/status', auth(), httpAdapter((req) => {
    const ids = Array.isArray(req.query.ids) ? req.query.ids : [req.query.ids];
    return req.api.getFlightsStatus(ids);
  }));
}
