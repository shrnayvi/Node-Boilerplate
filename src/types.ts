const TYPES = {
  UserService: Symbol('UserService'),
  UserRepository: Symbol('UserRespository'),
  UserController: Symbol('UserController'),
  AuthController: Symbol('AuthController'),
  AppService: Symbol('AppService'),
  AppController: Symbol('AppController'),
  Logger: Symbol('Logger'),
  LoggerFactory: Symbol('LoggerFactory'),
  GraphqlService: Symbol('GrahqlService'),
  TokenService: Symbol('TokenService'),
  AuthValidation: Symbol('AuthValidation'),
  HashService: Symbol('HashService'),
  AuthService: Symbol('AuthService'),
  EmailService: Symbol('EmailService'),
  UserTokenService: Symbol('UserTokenService'),
  UserTokenRepository: Symbol('UserTokenRepository'),
  UserTokenController: Symbol('UserTokenController'),
  AuthenticateMiddleware: Symbol('AuthenticateMiddleware'),
  ErrorService: Symbol('ErrorService'),
  JoiService: Symbol('JoiService'),
};

export { TYPES };
