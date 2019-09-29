const ContentDefinition = require("../../../model/contentDefinition");

export default async (req, res) => {
  if (req.method === "POST") {
    const type = await ContentDefinition.post(req.body);
    res.status(201).json({ type });
  } else {
    const list = await ContentDefinition.list();
    res.status(200).json(list.Items);
  }
};
