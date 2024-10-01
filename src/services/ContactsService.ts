import * as fs from 'node:fs/promises';
import { join } from 'node:path';
import IContact from '../@interfaces/IContact';

class ContactsService {
  #contacts: IContact[] = [];

  constructor() {
    this.init();
  }

  async init() {
    const data = await fs.readFile(join(__dirname, '..', 'data', 'contacts.json'), 'utf-8');
    this.#contacts = JSON.parse(data);
  }

  async #persist() {
    await fs.writeFile(
      join(__dirname, '..', 'data', 'contacts.json'),
      JSON.stringify(this.#contacts, null, 2),
    );
  }

  getAll(query: string): IContact[] {
    if (query) {
      return this.#contacts.filter((contact: IContact) => {
        return (
          contact.email.toLowerCase().includes(query.toLowerCase()) ||
          contact.first.toLowerCase().includes(query.toLowerCase()) ||
          contact.last.toLowerCase().includes(query.toLowerCase()) ||
          contact.phone.toLowerCase().includes(query.toLowerCase())
        );
      });
    }

    return this.#contacts;
  }

  getById(id: number) {
    return this.#contacts.find(contact => contact.id === id);
  }

  async add(contact: Omit<IContact, 'id'>) {
    const id = Math.max(...this.#contacts.map(contact => contact.id)) + 1;

    this.#contacts.push({ id, ...contact });

    await this.#persist();
  }

  async update(id: number, newContactData: IContact) {
    const contactIndex = this.#contacts.findIndex(contact => contact.id === id);

    if (contactIndex !== -1) {
      this.#contacts[contactIndex] = { ...this.#contacts[contactIndex], ...newContactData };

      await this.#persist();
    }
  }

  async delete(id: number) {
    this.#contacts = this.#contacts.filter(contact => contact.id !== id);

    await this.#persist();
  }
}

export default new ContactsService();
