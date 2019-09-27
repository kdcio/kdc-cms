export default async (req, res) => {
  res.status(200).json({ name: "pages info", id: req.query.id });
};
