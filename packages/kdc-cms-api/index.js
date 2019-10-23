/**
 * Use this to access API programmatically
 */

import * as contents from './services/contents/lib';
import * as pages from './services/pages/lib';
import * as defContents from './services/define/contents/lib';
import * as defPages from './services/define/pages/lib';

export default {
  contents,
  pages,
  define: {
    contents: defContents,
    pages: defPages
  }
};
