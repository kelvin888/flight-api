import { httpAdapter, validate } from '../../../middleware/index.js';
import { getOneFlightValidation } from '../validation.js';
import { createReadStream } from 'node:fs';
import { knownErrors } from '#utils';
import { resolve } from 'node:path';
import { homePath } from '../../../home-path.js';

export function flightPhotoRoute(router) {
  /**
   * @openapi
   * /flights/{id}/photo:
   *  get:
   *    description: Download the photo of a flight
   *    security: []   # No security
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: string
   *    responses:
   *      200:
   *        description: Returns the raw image if one is stored in the flight
   *        content:
   *          image/*:
   *            schema:
   *              type: string
   *              format: binary
   *      400:
   *        $ref: '#/components/responses/BadRequest'
   *      401:
   *        $ref: '#/components/responses/Unauthorized'
   *      404:
   *        $ref: '#/components/responses/NotFound'
   */
  router.get('/:id/photo', validate(getOneFlightValidation), httpAdapter(async function (req) {
    const flight = await req.api.getOneFlight(req.params.id);
    if (!flight || !flight.img || flight.status === 'processing') {
      return knownErrors.notFound();
    }
    return createReadStream(resolve(homePath, `uploads/${flight.img}`));
  }));
}
