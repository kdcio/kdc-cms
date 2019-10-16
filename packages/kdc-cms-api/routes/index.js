import express from 'express';
import users from './users';
import pageDefinition from './pageDefinition';
import pages from './pages';
import contentDefinition from './contentDefinition';
import contents from './contents';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200);
  res.send({ message: 'Welcome to KDC CMS API' });
});
router.use('/users', users);
router.use('/page-definition', pageDefinition);
router.use('/pages', pages);
router.use('/content-definition', contentDefinition);
router.use('/contents', contents);

export default router;
