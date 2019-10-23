import faker from 'faker';
import contents from '../../define/contents/lib';
import blogs from '../../contents/lib';

export default async count => {
  // create definition
  await contents.create({
    name: 'Blogs',
    id: 'blogs',
    description: 'Seeding CMS with blogs',
    sortKey: 'Publish Date',
    fields: [
      {
        name: 'Name',
        type: 'text'
      },
      {
        name: 'Slug',
        type: 'text'
      },
      {
        name: 'Image',
        type: 'image'
      },
      {
        name: 'Publish Date',
        type: 'date'
      },
      {
        name: 'Author',
        type: 'text'
      },
      {
        name: 'Category',
        type: 'text'
      },
      {
        name: 'Tags',
        type: 'text'
      },
      {
        name: 'Body',
        type: 'long-text'
      }
    ]
  });

  const promises = [];
  const max = count || 5;
  for (let ctr = 0; ctr < max; ctr += 1) {
    const Name = faker.company.catchPhrase();
    const pub = faker.date.past(5, new Date());
    const yr = pub.getFullYear();
    const mn = String(pub.getMonth() + 1).padStart(2, 0);
    const dy = String(pub.getDate()).padStart(2, 0);

    const maxParagraph = faker.random.number({ min: 3, max: 8 });
    let Body = '';
    for (let y = 0; y < maxParagraph; y += 1) {
      Body += `<p>${faker.lorem.paragraph()}</p>`;
    }

    promises.push(
      blogs.create({
        id: 'blogs',
        Name,
        Slug: faker.helpers.slugify(Name),
        Image: faker.image.business(),
        'Publish Date': `${yr}-${mn}-${dy}`,
        Author: faker.name.findName(),
        Category: faker.hacker.noun(),
        Tags: faker.hacker.verb(),
        Body
      })
    );
  }

  return Promise.all(promises).then(() => max);
};
