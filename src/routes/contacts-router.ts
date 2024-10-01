import express, { Request, Response } from 'express';
import Contact from '../models/Contact';
import IContact from '../@interfaces/IContact';

const router = express.Router();

/* GET contacts listing. */
router.get('/', function (req: Request, res: Response) {
  const contacts = req.contactsService.getAll(req.query.q);

  res.render('contacts/show-all', { title: 'Contacts', contacts, query: req.query.q });
});

/* GET new contact form. */
router.get('/new', function (req: Request, res: Response) {
  const contact = new Contact();

  res.render('contacts/new', { title: 'New Contact', contact });
});

/* POST new contact. */
router.post('/new', async function (req: Request, res: Response) {
  const contact = new Contact(
    null,
    req.body.first_name,
    req.body.last_name,
    req.body.phone,
    req.body.email,
  );

  if (contact.isValid()) {
    const existingContact = req.contactsService
      .getAll()
      .find((c: IContact) => c.email === contact.email);

    if (existingContact) {
      contact.errors.email = 'Email address must be unique';
      res.render('contacts/new', { title: 'New Contact', contact });
      return;
    }

    await req.contactsService.add(contact);

    res.redirect('/contacts');
    return;
  }

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
router.post('/:id/edit', async function (req: Request, res: Response) {
  const contact = new Contact(
    +req.params.id,
    req.body.first_name,
    req.body.last_name,
    req.body.phone,
    req.body.email,
  );

  if (contact.isValid()) {
    const existingContact = req.contactsService
      .getAll()
      .find((c: IContact) => c.email === contact.email && c.id !== contact.id);

    if (existingContact) {
      contact.errors.email = 'Email address must be unique';
      res.render('contacts/edit', { title: 'Edit Contact', contact });
      return;
    }

    await req.contactsService.update(+req.params.id, contact);

    res.redirect('/contacts');
    return;
  }

  res.render('contacts/edit', { title: 'Edit Contact', contact });
});

/* DELETE contact. */
router.post('/:id/delete', async function (req: Request, res: Response) {
  await req.contactsService.delete(+req.params.id);

  res.redirect('/contacts');
});

export default router;
