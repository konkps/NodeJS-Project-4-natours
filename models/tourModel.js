const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a Name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name  must have less or equal  40 characters'],
      minlength: [8, 'A tour name  must have more or equal than 8 characters']
      // validate: [validator.isAlpha, 'Tour name must only contain characters'] // uses external library for validation
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a Price']
    },
    // Custom Validator in priceDiscount
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(value) {
          // this only points to current doc on NEW document creation
          return value < this.price; // if true passes, if false validation error
        },
        message: `Discount price ({VALUE}) should be lower than price`
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    created_at: {
      type: Date,
      default: Date.now(),
      select: false // in select query it never returns this field
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

//  DOCUMENT MIDDLEWARE :   runs before .save() and .create()
//  Options: save, validate, remove, init
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  // console.log(this);
  next();
});

// tourSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log('th:', this);
//   console.log('doc:', doc);
//   next();
// });

//  QUERY MIDDLEWARE
//  Options: count, deleteMany, deleteOne, find, findOne, remove, update, updateOne, updateMany
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} ms!`);
  // console.log(docs);
  next();
});

//  AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  // console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
