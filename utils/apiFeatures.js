class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    console.log({ queryObj: this.queryString });
    //{ difficulty: 'easy', duration: { '$gte': '5' } }   // $gte mongodb operator  --> duration >=5
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte)|(gt)|(lte)|(lt)\b/g,
      match => `$${match}`
    );

    // console.log({ query: this.query, queryString: JSON.parse(queryStr) });
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      // asc    on query        ?sort=price
      // desc   on query        ?sort=-price
      // for 2nd criteria on query ?sort=price,ratingsAverage  and on BE replace , with space
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
      // sort('price ratingsAverage')
    } else {
      this.query = this.query.sort('-created_at');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
      // select('price ratingsAverage') includes them , with - excludes them e.g select('-__v')
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page / 1 || 1;
    const limit = this.queryString.limit / 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
