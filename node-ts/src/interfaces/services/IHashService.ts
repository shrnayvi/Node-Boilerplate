export interface IHashService {
  hash(password: string, salt?: any): Promise<string>;
  compare(plainText: string, hash: string): Promise<boolean>;
}
