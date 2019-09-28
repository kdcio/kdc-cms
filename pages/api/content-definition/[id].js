const ContentDefinition = require("../../../model/contentDefinition");

export default async (req, res) => {
  const { id } = req.query;
  if (req.method === "PUT") {
    await ContentDefinition.put({ id, attr: req.body });
    res.status(204).json({});
  } else if (req.method === "DELETE") {
    await ContentDefinition.delete({ id });
    res.status(204).json({});
  } else {
    const content = await ContentDefinition.get({ id });
    res.status(200).json(content);
  }
};
