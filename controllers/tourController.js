const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
//  ALIAS EXAMPLE
exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime,
    results: tours.length,
    data: {
      tours: tours
    }
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  //or  Tour.findOne({ _id: req.params.id });

  if (!tour) {
    return next(new AppError('No tour Found with that ID', 404));
    // my try below , it works
    // throw new AppError('No tour Found with that ID', 404);
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour
    }
  });
});
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  //or  Tour.findOne({ _id: req.params.id });

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour
    }
  });
});
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  //or  Tour.findOne({ _id: req.params.id });

  if (!tour) {
    return next(new AppError('No tour Found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        // _id: null, // gets stats for the whole group of tours
        _id: '$difficulty', // gets stats fot tours grouped by difficulty
        // _id: { $toUpper: '$difficulty' }, // gets above stats and uses mongo operator to convert difficulty labels to upperCase
        numberOfTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    // { $match: { _id: { $ne: 'easy' } } },
    { $sort: { avgPrice: 1 } } // sort by one of the labels used in $group, 1 for ascending , -1 for descending
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year / 1;
  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' }, // gets stats fot tours grouped by difficulty
        numberOfToursStart: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    { $addFields: { month: { $add: '$_id' } } },
    { $project: { _id: 0 } }, // with 0 it hides the field (_id)
    { $sort: { numberOfToursStart: -1 } }, // sort by one of the labels used in $group, 1 for ascending , -1 for descending
    { $limit: 6 }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});

// Get All tours Old

// BUILD QUERY
// 1) FILTERING
// const queryObj = { ...req.query };
// const excludedFields = ['page', 'sort', 'limit', 'fields'];
// excludedFields.forEach(el => delete queryObj[el]);
// console.log(req.query);

// //{ difficulty: 'easy', duration: { '$gte': '5' } }   // $gte mongodb operator  --> duration >=5
// let queryStr = JSON.stringify(queryObj);
// queryStr = queryStr.replace(
//   /\b(gte)|(gt)|(lte)|(lt)\b/g,
//   match => `$${match}`
// );
// console.log(JSON.parse(queryStr));

// let query = Tour.find(JSON.parse(queryStr));

// 2) SORTING
// if (req.query.sort) {
//   // asc    on query        ?sort=price
//   // desc   on query        ?sort=-price
//   // for 2nd criteria on query ?sort=price,ratingsAverage  and on BE replace , with space
//   const sortBy = req.query.sort.split(',').join(' ');
//   query = query.sort(sortBy);
//   // sort('price ratingsAverage')
// } else {
//   query = query.sort('-created_at');
// }

// 3) FIELD LIMITING
// if (req.query.fields) {
//   const fields = req.query.fields.split(',').join(' ');
//   query = query.select(fields);
// } else {
//   query = query.select('-__v');
//   // select('price ratingsAverage') includes them , with - excludes them e.g select('-__v')
// }

// 4) PAGINATION
// const page = req.query.page / 1 || 1;
// const limit = req.query.limit / 1 || 10;
// const skip = (page - 1) * limit;

// query = query.skip(skip).limit(limit);

// if (req.query.page) {
//   const numTours = await Tour.countDocuments();
//   if (skip >= numTours) throw new Error('This page does not exist!');
// }

// const query = Tour.find()
//   .where('duration')
//   .equals(5)
//   .where('difficulty')
//   .equals('easy');

// EXECUTE QUERY
// const tours = await query;

// SEND RESPONSE
// res.status(200).json({
//   status: 'success',
//   requestTime: req.requestTime,
//   results: tours.length,
//   data: {
//     tours: tours
//   }
// });
