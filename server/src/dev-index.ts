import { assertProjectRoot } from './clientApp';
import { createSimpleApp, listen } from './simpleApp';
import cors from 'cors';

assertProjectRoot();

const app = createSimpleApp();
app.use(cors());
listen(app);
