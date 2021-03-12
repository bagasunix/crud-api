const Tour = require('../models/tourM');
// Lib Validator
const validator = require('fastest-validator');
const v = new validator();

module.exports = {
  getAllTours: async (req, res, next) => {
    try {
      const tours = await Tour.find();

      // SEND RESPONSE
      res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
          tours,
        },
      });
    } catch (err) {
      return res.status(err.status).json({
        status: err.status,
        message: err.message,
      });
    }
  },
  createTour: async (req, res, next) => {
    try {
      const {
        name,
        duration,
        ratingsAverage,
        ratingsQuantity,
        price,
        summary,
        description,
        createdAt,
        startDates,
      } = req.body;

      const schema = {
        name: 'string|empty:false',
        duration: 'number|empty:false',
        ratingsAverage: 'number|min:1|max:5|default:4.5',
        ratingsQuantity: 'number|default:0',
        price: 'number|empty:false',
        summary: 'string|empty:false',
        description: 'string|empty:false',
        createdAt: { type: 'boolean', default: Date.now() },
        // startDates: 'date|empty:false',
      };
      console.log(startDates);

      const validate = v.validate(req.body, schema);

      if (validate.length) {
        return res.status(400).json({
          status: 'error',
          message: validate,
        });
      }

      const CheckDup = await Tour.findOne({
        name: name,
      });

      if (CheckDup) {
        return res.status(409).json({
          status: 'error',
          message: 'Name is already exist',
        });
      }

      const newTour = await Tour.create(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    } catch (err) {
      res.status(err).json({
        status: err.status,
        message: err.message,
      });
    }
  },

  updateTour: async (req, res, next) => {
    try {
      const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!tour) {
        res.status(404).json({
          status: 'Error',
          message: 'No tour found with that ID',
        });
      }

      res.status(200).json({
        status: 'success',
        data: {
          tour,
        },
      });
    } catch (err) {
      res.status(err).json({
        status: err,
      });
    }
  },

  deleteTour: async (req, res, next) => {
    try {
      const tour = await Tour.findByIdAndDelete(req.params.id);

      if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
      }

      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (err) {
      res.status(err.status).json({
        status: err.status,
        data: err.message,
      });
    }
  },
};
