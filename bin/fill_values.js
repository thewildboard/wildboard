db.values.drop()
var inds = db.indicators.find().toArray()
var index = 0

function createValue(inds, date) {
  db.values.insert({
    indicator: inds[i]._id,
    value: Math.random() * 1000,
    date: date
  });
  if (index < 10) {
    index = index + 1
    createValue(inds, date + 60 * 60000)
  }
}
for (var i in inds) {
  index = 0
  createValue(inds, Date.now())
}