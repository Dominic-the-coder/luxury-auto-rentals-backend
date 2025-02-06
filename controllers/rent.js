const axios = require("axios");
// import the Rent model
const Rent = require("../models/rent");

// get all the rents
const getRents = async (email, role) => {
  let filter = {};
  // if is not admin, filter by customerEmail
  if (role !== "admin") {
    filter.customerEmail = email;
  }
  return await Rent.find(filter).sort({ _id: -1 });
};

// get rents
const getRentsFilter = async (id) => {
  return await Rent.find({ cars: { $elemMatch: { _id: id } } });
};

// get one rent
const getRent = async (_id) => {
  const rent = await Rent.findById(_id);
  return rent;
};

// add new rent
const addNewRent = async (
  customerName,
  customerEmail,
  cars,
  totalPrice,
  rent,
  rentD
) => {
  // 1. create a bill in billplz
  const billplzResponse = await axios.post(
    "https://www.billplz-sandbox.com/api/v3/bills",
    {
      collection_id: process.env.BILLPLZ_COLLECTION_ID,
      description: "Payment for My Store",
      name: customerName,
      email: customerEmail,
      amount: parseFloat(totalPrice) * 100, // parseFloat will convert string to float number
      callback_url: "http://localhost:3000/verify-payment",
      redirect_url: "http://localhost:3000/verify-payment",
    },
    {
      auth: {
        username: process.env.BILLPLZ_SECRET_KEY,
        password: "",
      },
    }
  );
  // 2. retrieve the billplz_url and billplz_id
  const billplz_id = billplzResponse.data.id;
  const billplz_url = billplzResponse.data.url;

  console.log(billplz_url);

  // 3. create a new rent (put in the billplz_id into the rent)
  const newRent = new Rent({
    customerName,
    customerEmail,
    cars,
    totalPrice,
    start_date: rent,
    end_date: rentD,
    billplz_id,
  });
  await newRent.save();

  // 4. return the new rent with the billplz_url
  return {
    ...newRent,
    billplz_url,
  };
};

// update rent
const updateRent = async (_id, status) => {
  const updatedRent = await Rent.findByIdAndUpdate(
    _id,
    { status },
    // return back the new data
    { new: true }
  );
  return updatedRent;
};

// delete rent
const deleteRent = async (_id) => {
  return await Rent.findByIdAndDelete(_id);
};

module.exports = {
  getRents,
  getRent,
  addNewRent,
  updateRent,
  deleteRent,
  getRentsFilter,
};
