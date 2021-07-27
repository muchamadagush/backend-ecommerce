const userModels = require("../models/users");
const { v4: uuid } = require("uuid");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const uploadAvatarHandler = async (req) => {
  const { avatar: file } = req.files;
  const extension = file.name.split(".").slice(-1);
  const fileName = `${uuid()}.${extension}`;
  const outputPath = path.join(
    __dirname,
    `/../assets/images/users/${fileName}`
  );
  file.mv(outputPath);

  return {
    message: "avatar successfully uploaded",
    fileName,
  };
};

const register = async (req, res, next) => {
  try {
    const id = uuid().split("-").join("");
    const { name, email, phone, password, role } = req.body;

    if (!name) return res.status(400).send({ message: 'name cannot be null' })
    if (!email) return res.status(400).send({ message: 'name cannot be null' })
    if (!phone) return res.status(400).send({ message: 'phone cannot be null' })
    if (!password) return res.status(400).send({ message: 'password cannot be null' })
    if (!role) return res.status(400).send({ message: 'role cannot be null' })

    const user = await userModels.findUser(email);
    if (user.length > 0) return res.status(400).send({ message: 'email already exists!' })

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        const data = {
          id,
          name,
          email,
          password: hash,
          phone,
          role,
        };

        userModels.register(data);
        delete data.password;

        res.status(201).send({
          message: "Register success!",
          data,
        });
      });
    });
  } catch (error) {
    next(new Error(error.message));
  }
};

const login = async (req, res, next) => {
  const { email, password, role } = req.body;
  const user = (await userModels.findUser(email))[0];

  if (user.role != role)
    return res
      .status(400)
      .send({ message: "please login according to your role!" });

  bcrypt.compare(password, user.password, (err, resCompare) => {
    if (resCompare === false) return res.sendStatus(401);
    const payload = {
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    user.token = accessToken;
    delete user.password;
    res.json({ user });
  });
};

module.exports = {
  register,
  login,
};
