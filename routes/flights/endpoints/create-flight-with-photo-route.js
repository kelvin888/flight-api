import { auth, httpAdapter, validate } from '../../../middleware/index.js';
import { createFlightWithPhotoValidation } from '../validation.js';
import { statusCodes } from '#utils';
import multer from 'multer';
import { homePath } from '../../../home-path.js';

const upload = multer({ dest: `${homePath}/uploads/` });

export function createFlightWithPhotoRoute(router) {
  /**
   * @openapi
   * /flights/withPhoto:
   *  post:
   *    description: Creates one flight with photo
   *    requestBody:
   *      required: true
   *      content:
   *        multipart/form-data:
   *          schema:
   *            $ref: '#/components/schemas/MultipartFlightData'
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
  router.post('/withPhoto', auth(), upload.single('photo'), validate(createFlightWithPhotoValidation), httpAdapter((req) => {
    const payload = { ...req.body, capacity: parseInt(req.body.capacity, 10) };
    return req.api.createOneFlight(payload, req.file.filename);
  }, statusCodes.created));
}
