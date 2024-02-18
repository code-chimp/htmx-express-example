const fs = require('fs');
const path = require('path');

class ContactsService {
  #contacts = [];

  constructor() {
    let data = fs.readFileSync(path.join(__dirname, '..', 'data', 'contacts.json'));
    this.#contacts = JSON.parse(data);
  }

  #persist() {
    fs.writeFileSync(
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

  add(contact) {
    contact.id = Math.max(...this.#contacts.map(contact => contact.id)) + 1;

    this.#contacts.push(contact);

    this.#persist();
  }

  update(id, newContactData) {
    let contactIndex = this.#contacts.findIndex(contact => contact.id === id);
    if (contactIndex !== -1) {
      this.#contacts[contactIndex] = { ...this.#contacts[contactIndex], ...newContactData };
    }

    this.#persist();
  }

  delete(id) {
    this.#contacts = this.#contacts.filter(contact => contact.id !== +id);

    this.#persist();
  }
}

module.exports = new ContactsService();
