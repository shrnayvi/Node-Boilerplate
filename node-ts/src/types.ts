const TYPES = {
  UserService: Symbol('UserService'),
  UserRepository: Symbol('UserRespository'),
  UserController: Symbol('UserController'),
  AppService: Symbol('AppService'),
  AppController: Symbol('AppController'),
  AuthController: Symbol('AuthController'),
  Logger: Symbol('Logger'),
  LoggerFactory: Symbol('LoggerFactory'),
  TokenService: Symbol('TokenService'),
  AuthValidation: Symbol('AuthValidation'),
  HashService: Symbol('HashService'),
  AuthService: Symbol('AuthService'),
  EmailService: Symbol('EmailService'),
  UserTokenService: Symbol('UserTokenService'),
  UserTokenRepository: Symbol('UserTokenRepository'),
  UserTokenController: Symbol('UserTokenController'),
  AuthenticateMiddleware: Symbol('AuthenticateMiddleware'),
};

export { TYPES };
