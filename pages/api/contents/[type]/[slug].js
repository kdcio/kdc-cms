export default async (req, res) => {
  res.status(200).json({ message: "content info", slug: req.query.slug });
};
