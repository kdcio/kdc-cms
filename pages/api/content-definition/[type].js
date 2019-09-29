const ContentDefinition = require("../../../model/contentDefinition");

export default async (req, res) => {
  const { type } = req.query;
  if (req.method === "PUT") {
    await ContentDefinition.put({ type, attr: req.body });
    res.status(204).json({});
  } else if (req.method === "DELETE") {
    await ContentDefinition.delete({ type });
    res.status(204).json({});
  } else {
    const content = await ContentDefinition.get({ type });
    res.status(200).json(content);
  }
};
