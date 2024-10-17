const express = require("express");
const router = express.Router();

//write this first
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function createToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
  ß;
}

const prisma = require("../prisma");

//token check
router.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.slice(7); // 7 = length("Bearer "), shave off to grab token only
  if (!token) return next();

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
    });
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
});

//register
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.register(username, password);
    const token = createToken(user.id);
    res.status(201).json({ token });
  } catch (e) {
    next(e);
  }
});

//login
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.login(username, password);
    const token = createToken(user.id);
    res.json({ token });
  } catch (e) {
    next(e);
  }
});

//authenticate fn
function authenticate(req, res, next) {
  if (req.user) {
    next();
  } else {
    next({ status: 401, message: "You must be loggied in to do this" });
  }
}
//export router, authenticate
module.exports = {
  router,
  authenticate,
};
