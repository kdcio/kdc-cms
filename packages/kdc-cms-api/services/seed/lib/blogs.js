import faker from 'faker';
import contents from '../../define/contents/lib';
import blogs from '../../contents/lib';

export default async count => {
  // create definition
  await contents.create({
    name: 'Blogs',
    id: 'blogs',
    description: 'Seeding CMS with blogs',
    sortKey: 'publishDate',
    fieldCount: 9,
    fields: [
      {
        label: 'Name',
        name: 'name',
        type: 'text'
      },
      {
        label: 'Slug',
        name: 'slug',
        type: 'text'
      },
      {
        label: 'Image',
        name: 'image',
        type: 'image'
      },
      {
        label: 'Publish Date',
        name: 'publishDate',
        type: 'date'
      },
      {
        label: 'Author',
        name: 'author',
        type: 'text'
      },
      {
        label: 'Category',
        name: 'category',
        type: 'text'
      },
      {
        label: 'Tags',
        name: 'tags',
        type: 'text'
      },
      {
        label: 'Body',
        name: 'body',
        type: 'long-text'
      },
      {
        label: 'Enabled',
        name: 'enabled',
        type: 'bool'
      }
    ]
  });

  const promises = [];
  const max = count || 5;
  for (let ctr = 0; ctr < max; ctr += 1) {
    const name = faker.company.catchPhrase();
    const pub = faker.date.past(5, new Date());
    const yr = pub.getFullYear();
    const mn = String(pub.getMonth() + 1).padStart(2, 0);
    const dy = String(pub.getDate()).padStart(2, 0);

    const maxParagraph = faker.random.number({ min: 3, max: 8 });
    let body = '';
    for (let y = 0; y < maxParagraph; y += 1) {
      body += `<p>${faker.lorem.paragraph()}</p>`;
    }
    const data = {
      typeId: 'blogs',
      name,
      slug: faker.helpers.slugify(name),
      image: {
        src: faker.image.business(),
        type: 'image',
        updatedAt: new Date().getTime()
      },
      publishDate: `${yr}-${mn}-${dy}`,
      author: faker.name.findName(),
      category: faker.hacker.noun(),
      tags: faker.hacker.verb(),
      body,
      enabled: true
    };

    promises.push(blogs.create(data));
  }

  return Promise.all(promises)
    .then(() => max)
    .catch(e => console.log(e));
};
