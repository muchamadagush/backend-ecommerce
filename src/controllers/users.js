const userModels = require('../models/users');
const { v4: uuid } = require('uuid');
const path = require('path');
const bcrypt = require('bcryptjs');

const uploadAvatarHandler = async (req) => {
  const { avatar: file } = req.files
  const extension = file.name.split('.').slice(-1)
  const fileName = `${uuid()}.${extension}`
  const outputPath = path.join(__dirname, `/../assets/images/users/${fileName}`)
  file.mv(outputPath)

  return {
    message: 'avatar successfully uploaded',
    fileName
  }
}

const register = async (req, res, next) => {
  try {
    const id = uuid().split('-').join('');
    const { name, email, phone, password } = req.body

    if (!name) {
      throw new Error('name cannot be null')
    }
    if (!email) {
      throw new Error('email cannot be null')
    }
    if (!phone) {
      throw new Error('phone cannot be null')
    }
    if (!password) {
      throw new Error('password cannot be null')
    }

    const user = await userModels.findUser(email)
    if (user.length > 0) {
      throw new Error('email already exists!')
    }
    
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {

        const data = {
          id,
          name,
          email,
          password: hash,
          phone,
        }

        userModels.register(data)
        delete data.password

        res.status(201)
          .send({
            message: 'Register success!',
            data
          })
      });
    });
  } catch (error) {
    next(new Error(error.message));
  }
}

module.exports = {
  register
}