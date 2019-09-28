const ContentDefinition = require("../../../model/contentDefinition");

export default async (req, res) => {
  if (req.method === "POST") {
    const id = await ContentDefinition.post(req.body);
    res.status(201).json({ id });
  } else {
    const list = await ContentDefinition.list();
    res.status(200).json(list.Items);
  }
};
