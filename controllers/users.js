const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  const body = request.body;

  const saltRounds = 10;
  if (!body.email || !body.password) {
    return response
      .status(400)
      .json({ error: "body and password are required" })
      .end();
  }
  if (body.email.length < 3 || body.password.length < 3) {
    return response
      .status(400)
      .json({ error: "email and password length must be greater than 3" })
      .end();
  }

  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    email: body.email,
    name: body.name,
    age: body.age,
    phone: body.phone,
    passwordHash,
  });

  try {
    const savedUser = await user.save();
    response.json(savedUser);
  } catch (err) {
    response.status(400).json(err).end();
  }
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

module.exports = usersRouter;
