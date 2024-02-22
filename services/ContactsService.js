const fs = require('node:fs/promises');
const path = require('path');

class ContactsService {
  #contacts = [];

  constructor() {
    this.init();
  }

  async init() {
    let data = await fs.readFile(path.join(__dirname, '..', 'data', 'contacts.json'));
    this.#contacts = JSON.parse(data);
  }

  async #persist() {
    await fs.writeFile(
      path.join(__dirname, '..', 'data', 'contacts.json'),
      JSON.stringify(this.#contacts, null, 2),
    );
  }

  getAll(query) {
    if (query) {
      return this.#contacts.filter(contact => {
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

  getById(id) {
    return this.#contacts.find(contact => contact.id === +id);
  }

  async add(contact) {
    contact.id = Math.max(...this.#contacts.map(contact => contact.id)) + 1;

    this.#contacts.push(contact);

    await this.#persist();
  }

  async update(id, newContactData) {
    let contactIndex = this.#contacts.findIndex(contact => contact.id === id);
    if (contactIndex !== -1) {
      this.#contacts[contactIndex] = { ...this.#contacts[contactIndex], ...newContactData };

      await this.#persist();
    }
  }

  async delete(id) {
    this.#contacts = this.#contacts.filter(contact => contact.id !== +id);

    await this.#persist();
  }
}

module.exports = new ContactsService();
