import cors from 'cors';
import { assertProjectRoot } from './clientApp';
import { createSimpleApp, listen } from './simpleApp';

assertProjectRoot();

const app = createSimpleApp();
app.use(cors());
listen(app);
