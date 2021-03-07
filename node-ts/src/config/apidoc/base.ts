/**
 * @api {get} /Insomnia_2021-03-07.json Insomnia file
 * @apiName GetInsomnia
 * @apiDescription Endpoint for Insomnia file
 * <br />
 * <a href="/v1/Insomnia_2021-03-07.json">Insomnia File</a>
 * @apiGroup Insomnia
 *
 *
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200
 */

/**
 * @api {get} /status Status
 * @apiName GetStatus
 * @apiDescription Endpoint for the app status
 * @apiGroup App Status
 *
 *
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200
 *  {
 *       "message": "OK",
 *   }
 */

/**
 * @api {get} /error/500 Error 500
 * @apiName GetInternalError
 * @apiDescription Endpoint internal server error
 * @apiGroup App Status
 *
 * @apiSuccess {String} message Status message
 *
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 500
 *  {
 *       "message": "Internal server error",
 *       "data": {}
 *   }
 */
