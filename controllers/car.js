const Car = require("../models/car");

/*
CRUD:
 1. Add a new car: `POST /cars`
 2. List all cars: `GET /cars`
 3. Get specific car details by its ID: `GET /cars/:id`
 4. Update a car by its ID: `PUT /cars/:id`
 5. Delete a car by its ID: `DELETE /cars/:id`
*/

const getCars = async (category, page = 1, per_page = 6) => {
  // create a container for filter
  let filter = {};
  // if name exists, pass it to the filter container
  if (category && category !== "all") {
    filter.category = category;
  }

  // apply filter in .find()
  const cars = await Car.find(filter)
    .populate("category")
    .limit(per_page)
    .skip((page - 1) * per_page)
    .sort({ _id: -1 });
  return cars;
};

// get one car
const getCar = async (id) => {
  const car = await Car.findById(id);
  return car;
};

// add new car
const addNewCar = async (name, description, price, category, image) => {
  // create new car
  const newCar = new Car({
    name,
    description,
    price,
    category,
    image,
  });
  // save the new car into mongodb
  await newCar.save();
  return newCar;
};

// update car
const updateCar = async (id, name, description, price, category, image) => {
  const updatedCar = await Car.findByIdAndUpdate(
    id,
    { name, description, price, category, image },
    // return back the new data
    { new: true }
  );
  return updatedCar;
};

// delete car
const deleteCar = async (id) => {
  // find by id to retrieve the image path
  // fs.unlink(path)
  // delete the car
  return await Car.findByIdAndDelete(id);
};

module.exports = {
  getCars,
  getCar,
  addNewCar,
  updateCar,
  deleteCar,
};
