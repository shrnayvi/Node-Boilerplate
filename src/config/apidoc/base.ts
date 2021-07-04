/**
 * @api {get} /v1/Insomnia_2021-06-20.json Insomnia file
 * @apiName GetInsomnia
 * @apiDescription Endpoint for the insomnia
 * <br/>
 * <a href="../Insomnia_2021-06-27.json"> Insomnia Export</a>
 * @apiGroup Insomnia
 */

/**
 * @api {get} /v1/status Status
 * @apiName GetStatus
 * @apiDescription Endpoint for the app status
 * @apiGroup App Status
 *
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200
 *  {
 *       "message": "OK",
 *   }
 */

/**
 * @api {get} /v1/error/500 Error 500
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
