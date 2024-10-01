import app from './app';
import { DEFAULT_PORT } from './constants';

const port = process.env.PORT ?? DEFAULT_PORT;

app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
