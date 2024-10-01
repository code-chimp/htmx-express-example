import ContactsService from '../services/ContactsService';

export {};

declare global {
  namespace Express {
    interface Request {
      contactsService: ContactsService;
    }
  }
}
