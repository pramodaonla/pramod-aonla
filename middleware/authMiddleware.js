export default function authMiddleware(req, res, next) {
  req.user = {
    id: "123",
    name: "Pramod"
  };
  next();
}
