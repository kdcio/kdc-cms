export default async (req, res) => {
  res.status(200).json({ name: "user info", id: req.query.email });
};
