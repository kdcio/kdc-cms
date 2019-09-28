const Pages = require("../../../model/pages");

export default async (req, res) => {
  if (req.method === "POST") {
    const id = await Pages.post(req.body);
    res.status(201).json({ id });
  } else {
    const list = await Pages.list();
    res.status(200).json(list.Items);
  }
};
