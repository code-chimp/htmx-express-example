import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import IContact from '../@interfaces/IContact';
import { createContactErrors } from '../utilities';

const router = express.Router();
const contactValidationChain = () => [
  body('first_name').exists().isString().notEmpty().withMessage('Please supply a first name'),
  body('last_name').exists().isString().notEmpty().withMessage('Please supply a last name'),
  body('phone').exists().trim().notEmpty().withMessage('Please supply a phone number'),
  body('email').exists().trim().isEmail().withMessage('Please supply a valid email address'),
];

/* GET contacts listing. */
router.get('/', function (req: Request, res: Response) {
  const contacts = req.contactsService.getAll(req.query.q);

  res.render('contacts/show-all', { title: 'Contacts', contacts, query: req.query.q });
});

/* GET new contact form. */
router.get('/new', function (req: Request, res: Response) {
  const contact: Omit<IContact, 'id'> = {
    first: '',
    last: '',
    phone: '',
    email: '',
    errors: {},
  };

  res.render('contacts/new', { title: 'New Contact', contact });
});

/* POST new contact. */
router.post('/new', contactValidationChain(), async function (req: Request, res: Response) {
  const contact: Omit<IContact, 'id'> = {
    first: req.body.first_name,
    last: req.body.last_name,
    phone: req.body.phone,
    email: req.body.email,
    errors: {},
  };
  const result = validationResult(req);

  if (result.isEmpty()) {
    const existingContact = req.contactsService
      .getAll()
      .find((c: IContact) => c.email === contact.email);

    if (existingContact) {
      contact.errors!.email = ['Please supply a unique email address'];
      res.render('contacts/new', { title: 'New Contact', contact });
      return;
    }

    await req.contactsService.add(contact);

    res.redirect('/contacts');
    return;
  }

  contact.errors = createContactErrors(result.array(), contact.errors);

  res.render('contacts/new', { title: 'New Contact', contact });
});

/* GET contact by id. */
router.get('/:id', function (req: Request, res: Response) {
  const contact = req.contactsService.getById(+req.params.id);

  res.render('contacts/show', { title: 'View Contact', contact });
});

/* GET edit contact form. */
router.get('/:id/edit', function (req: Request, res: Response) {
  const contact = req.contactsService.getById(+req.params.id);

  res.render('contacts/edit', { title: 'Edit Contact', contact });
});

/* POST edit contact. */
router.post(
  '/:id/edit',
  contactValidationChain(),
  async function (req: Request, res: Response) {
    const contact: IContact = {
      id: +req.params.id,
      first: req.body.first_name,
      last: req.body.last_name,
      phone: req.body.phone,
      email: req.body.email,
      errors: {},
    };
    const result = validationResult(req);
    console.info(result);

    if (result.isEmpty()) {
      const existingContact = req.contactsService
        .getAll()
        .find((c: IContact) => c.email === contact.email && c.id !== contact.id);

      if (existingContact) {
        contact.errors!.email = ['Email address must be unique'];
        res.render('contacts/edit', { title: 'Edit Contact', contact });
        return;
      }

      await req.contactsService.update(+req.params.id, contact);

      res.redirect('/contacts');
      return;
    }

    contact.errors = createContactErrors(result.array(), contact.errors);
    console.info(contact);

    res.render('contacts/edit', { title: 'Edit Contact', contact });
  },
);

/* DELETE contact. */
router.post('/:id/delete', async function (req: Request, res: Response) {
  await req.contactsService.delete(+req.params.id);

  res.redirect('/contacts');
});

export default router;
