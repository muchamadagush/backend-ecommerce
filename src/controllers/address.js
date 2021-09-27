/* eslint-disable consistent-return */
const { v4: uuid } = require('uuid');
const addressModels = require('../models/address');

// Create data to address table
const createAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      name, address, phone, type, zipCode, city, setPrimary,
    } = req.body;

    if (!type) return res.status(400).send({ message: 'address type cannot be null' });
    if (!name) return res.status(400).send({ message: 'name cannot be null' });
    if (!address) return res.status(400).send({ message: 'address cannot be null' });
    if (!phone) return res.status(400).send({ message: 'phone cannot be null' });
    if (!zipCode) return res.status(400).send({ message: 'zipCode cannot be null' });
    if (!city) return res.status(400).send({ message: 'city cannot be null' });

    if (setPrimary === 'true') {
      const dataAddress = (await addressModels.findAddressByUserId(userId))[0];

      if (dataAddress) {
        dataAddress.status = 'false';
        await addressModels.updateAddress(dataAddress.id, dataAddress);
      }
    }

    const data = {
      id: uuid().split('-').join(''),
      userId,
      name,
      address,
      phone,
      type,
      zipCode,
      city,
      status: setPrimary,
    };

    await addressModels.createAddress(data);

    res.status(200);
    res.json({
      message: 'successfully create new address',
    });
  } catch (error) {
    next(new Error(error.message));
  }
};

const getPrimaryAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const address = await addressModels.getPrimaryAddress(userId);

    res.status(200);
    res.json({
      data: address,
    });
  } catch (error) {
    next(new Error(error.message));
  }
};

module.exports = {
  createAddress,
  getPrimaryAddress,
};
