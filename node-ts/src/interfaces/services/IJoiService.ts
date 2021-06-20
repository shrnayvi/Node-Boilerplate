export interface IValidationInput {
  /**
   * Joi Schema
   */
  schema: any;

  /**
   * Input arguments to be validated against the schema
   */
  input: any;
}

export interface IJoiService {
  validate(args: IValidationInput): any;
}
