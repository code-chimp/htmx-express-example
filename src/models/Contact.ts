export default class Contact {
  id: number | null;
  first: string;
  last: string;
  phone: string;
  email: string;
  errors: Record<string, string>;

  constructor(
    id?: number | null,
    first?: string,
    last?: string,
    phone?: string,
    email?: string,
  ) {
    this.id = id ?? null;
    this.first = first ?? '';
    this.last = last ?? '';
    this.phone = phone ?? '';
    this.email = email ?? '';
    this.errors = {};
  }

  isValid(): boolean {
    // reset errors dictionary
    this.errors = {};

    if (!this.first) {
      this.errors.first = 'First name is required';
    }

    if (!this.last) {
      this.errors.last = 'Last name is required';
    }

    if (!this.phone) {
      this.errors.phone = 'Phone is required';
    } else {
      const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;

      if (!phoneRegex.test(this.phone)) {
        this.errors.phone = 'Phone number must be in the format 123-456-7890';
      }
    }

    if (!this.email) {
      this.errors.email = 'Email is required';
    } else {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

      if (!emailRegex.test(this.email)) {
        this.errors.email = 'Email address is invalid';
      }
    }

    return Object.keys(this.errors).length === 0;
  }
}
