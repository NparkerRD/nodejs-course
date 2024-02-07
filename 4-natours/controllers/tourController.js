// const fs = require("fs");
const Tour = require("./../models/tourModel");

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.getAllTours = async (req, res) => {
  try {
    // See mongoose documentation - https://mongoosejs.com/docs/queries.html
    const tours = await Tour.find();

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours, // ES6 syntax allows for only writing 'tours' once since property name and value name match (tours: tours)
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    // See mongoose documentation - https://mongoosejs.com/docs/queries.html
    const tour = await Tour.findById(req.params.id);
    // helper function to Tour.findOne({ _id: req.params.id })

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // See mongoose documentation - https://mongoosejs.com/docs/queries.html
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    }); // 201 - for 'created'
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent",
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    // See mongoose documentation - https://mongoosejs.com/docs/queries.html
    // NOTE about patch v put: PATCH only updates specified values, PUT completely replaces original object with the new one
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
