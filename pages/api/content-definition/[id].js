export default async (req, res) => {
  res.status(200).json({ name: "content definition info", id: req.query.id });
};
