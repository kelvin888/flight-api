import multer from 'multer';

import { auth, httpAdapter, validate } from '../../../middleware/index.js';
import { updateFlightWithPhotoValidation } from '../validation.js';
import { homePath } from '../../../home-path.js';

const upload = multer({ dest: `${homePath}/uploads/` });

export function updateFlightWithPhotoRoute(router) {
  /**
   * @openapi
   * /flights/{id}/withPhoto:
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
   *        multipart/form-data:
   *          schema:
   *            $ref: '#/components/schemas/MultipartFlightData'
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
  router.put('/:id/withPhoto', auth(), upload.single('photo'), validate(updateFlightWithPhotoValidation), httpAdapter((req) => {
    const payload = { ...req.body, capacity: parseInt(req.body.capacity, 10) };
    return req.api.updateOneFlight(req.params.id, payload, req.file.filename);
  }));
}
