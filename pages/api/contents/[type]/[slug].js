const Contents = require("../../../../model/contents");

export default async (req, res) => {
  const { type, slug } = req.query;
  if (req.method === "PUT") {
    await Contents.put({ type, slug, attr: req.body });
    res.status(204).json({});
  } else if (req.method === "DELETE") {
    await Contents.delete({ type, slug });
    res.status(204).json({});
  } else {
    const content = await Contents.get({ type, slug });
    res.status(200).json(content);
  }
};
