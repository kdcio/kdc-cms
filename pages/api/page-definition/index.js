const PageDefinition = require("../../../model/pageDefinition");

export default async (req, res) => {
  if (req.method === "POST") {
    const id = await PageDefinition.post(req.body);
    res.status(201).json({ id });
  } else {
    const list = await PageDefinition.list();
    res.status(200).json(list.Items);
  }
};
