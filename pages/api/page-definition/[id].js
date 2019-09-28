const PageDefinition = require("../../../model/pageDefinition");

export default async (req, res) => {
  const { id } = req.query;
  if (req.method === "PUT") {
    await PageDefinition.put({ id, attr: req.body });
    res.status(204).json({});
  } else if (req.method === "DELETE") {
    await PageDefinition.delete({ id });
    res.status(204).json({});
  } else {
    const page = await PageDefinition.get({ id });
    res.status(200).json(page);
  }
};
