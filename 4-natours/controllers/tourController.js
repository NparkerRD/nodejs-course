// const fs = require("fs");
const { query } = require("express");
const Tour = require("./../models/tourModel");

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);
    // BUILD QUERY
    // 1A) Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]); //loops over excludedFields and deletes field from new queryObj

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // \b is for the exact word; 'g' is for global

    // { difficulty: 'easy', duration: {$gte: 5} }
    // { difficulty: 'easy', duration: { gte: '5' } }
    // gte, gt, lte, lt

    // See mongoose documentation - https://mongoosejs.com/docs/queries.html
    let query = Tour.find(JSON.parse(queryStr));

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy); // uses mongoose sort method
      // sort('price ratingsAverage')
    } else {
      query = query.sort("-createdAt");
    }

    // 3) Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v"); // Display everything except this field
    }

    // 4) Pagination
    const page = req.query.page * 1 || 1; // * 1 converts to a number
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    // ?page=2&limit=10, 1-10, page 1, 11-20, page 2, 21-30 page 3
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error("This page does not exist"); // goes into catch block and gives 404 error
    }

    // EXECUTE QUERY
    const tours = await query;

    // const query = Tour.find()
    //   .where("duration")
    //   .equals(5)
    //   .where("difficulty")
    //   .equals("easy");

    // SEND RESPONSE
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
      message: err,
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
