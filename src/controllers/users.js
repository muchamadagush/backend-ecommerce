/* eslint-disable consistent-return */
const { v4: uuid } = require('uuid');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const userModels = require('../models/users');
const storeModels = require('../models/store');

moment.locale('id');

const uploadAvatarHandler = async (req) => {
  const { avatar: file } = req.files;
  const extension = path.extname(file.name);
  const fileName = `${uuid()}${extension}`;
  const outputPath = path.join(__dirname, `/../assets/images/${fileName}`);
  file.mv(outputPath);

  return {
    message: 'avatar successfully uploaded',
    fileName,
  };
};

const register = async (req, res, next) => {
  try {
    const userId = uuid().split('-').join('');
    const {
      name, email, phone, password, role, store,
    } = req.body;

    if (!name) return res.status(400).send({ message: 'name cannot be null' });
    if (!email) return res.status(400).send({ message: 'name cannot be null' });
    if (!password) return res.status(400).send({ message: 'password cannot be null' });
    if (!role) return res.status(400).send({ message: 'role cannot be null' });

    const user = await userModels.findUser(email);
    if (user.length > 0) return res.status(400).send({ message: 'email already exists!' });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (error, hash) => {
        const data = {
          id: userId,
          name,
          email,
          password: hash,
          phone,
          role,
        };

        // eslint-disable-next-line eqeqeq
        if (role == 1) {
          const dataUser = {
            ...data,
            store: 'true',
          };

          userModels.register(dataUser);

          const dataStore = {
            id: uuid().split('-').join(''),
            userId,
            name: store,
            description: store,
          };

          storeModels.addStore(dataStore);
        }

        // eslint-disable-next-line eqeqeq
        if (role == 2) {
          const dataUser = {
            ...data,
            store: 'false',
          };

          userModels.register(dataUser);
        }

        delete data.password;

        res.status(201).send({
          message: 'Register success!',
          data,
        });
      });
    });
  } catch (error) {
    next(new Error(error.message));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let { role } = req.body;
    const user = (await userModels.findUser(email))[0];
    if (!user) return res.status(404).send({ message: 'email not registered!' });
    // eslint-disable-next-line radix
    role = parseInt(role);

    if (user.role !== role) {
      return res
        .status(400)
        .send({ message: 'please login according to your role!' });
    }

    bcrypt.compare(password, user.password, (err, resCompare) => {
      if (resCompare === false) {
        return res
          .status(401)
          .send({ message: 'email and password do not match!' });
      }
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        store: user.store,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        gender: user.gender,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      };

      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
      user.token = accessToken;
      delete user.password;
      res.json({ user });
    });
  } catch (error) {
    next(new Error(error.message));
  }
};

const getUser = async (req, res, next) => {
  try {
    const { email } = req.user;

    let data = (await userModels.findUser(email))[0];

    if (data.dateOfBirth) {
      const dateOfBirth = moment(data.dateOfBirth).format('L');
      data.date = dateOfBirth.substring(0, 2);
      data.month = dateOfBirth.substring(3, 5);
      data.year = dateOfBirth.substring(6, 10);
    }

    if (!data.dateOfBirth) {
      data.date = '';
      data.month = '';
      data.year = '';
    }

    if (data.store === 'true') {
      const store = await storeModels.getStoreByUserId(data.id);

      data = {
        ...data,
        description: store[0].description,
      };
    }

    res.status(200);
    res.json({
      data,
    });
  } catch (error) {
    next(new Error(error.message));
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    const {
      name, email, phone, gender,
    } = req.body;

    if (!name) return res.status(400).send({ message: 'name cannot be null' });
    if (!email) return res.status(400).send({ message: 'name cannot be null' });
    if (!req.files) return res.status(400).send({ message: 'avatar cannot be null' });

    const avatar = await uploadAvatarHandler(req);
    let data;

    // eslint-disable-next-line eqeqeq
    if (role == 1) {
      if (!req.body.description) return res.status(400).send({ message: 'Description cannot be null' });

      data = {
        name,
        email,
        phone,
        avatar: avatar.fileName,
      };

      const { description } = req.body;

      await userModels.updateUser(id, data);
      await storeModels.updateStore(id, description);
    }

    // eslint-disable-next-line eqeqeq
    if (role == 2) {
      if (!req.body.dateOfBirth) return res.status(400).send({ message: 'dateOfBirth cannot be null' });
      data = {
        name,
        email,
        phone,
        role,
        store: 'false',
        avatar: avatar.fileName,
        gender,
        dateOfBirth: req.body.dateOfBirth,
      };

      await userModels.updateUser(id, data);
    }

    res.status(200).send({
      message: 'Successfully update data!',
      data,
    });
  } catch (error) {
    next(new Error(error.message));
  }
};

module.exports = {
  register,
  login,
  updateUser,
  getUser,
};
