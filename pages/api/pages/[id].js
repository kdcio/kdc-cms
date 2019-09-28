const Pages = require("../../../model/pages");

export default async (req, res) => {
  const { id } = req.query;
  if (req.method === "PUT") {
    await Pages.put({ id, attr: req.body });
    res.status(204).json({});
  } else if (req.method === "DELETE") {
    await Pages.delete({ id });
    res.status(204).json({});
  } else {
    const page = await Pages.get({ id });
    res.status(200).json(page);
  }
};
