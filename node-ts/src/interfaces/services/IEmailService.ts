export interface IEmailService {
  sendMail(data: any): Promise<any>;
}
