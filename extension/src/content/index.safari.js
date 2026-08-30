import { run } from './run.js';
// Safari entry: bundled statically. Safari cannot dynamically import an
// extension resource (the safari-web-extension:// URL fails to load), so the
// popover ships inside the content script instead of being fetched on demand.
import * as mount from './mount.js';
import * as store from '../ui/store.js';

run(async () => ({ mount, store }));
