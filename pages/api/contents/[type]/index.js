const Contents = require("../../../../model/contents");

export default async (req, res) => {
  const { type } = req.query;
  if (req.method === "POST") {
    const slug = await Contents.post({ type, ...req.body });
    res.status(201).json({ slug });
  } else {
    const list = await Contents.list(type);
    res.status(200).json(list.Items);
  }
};
