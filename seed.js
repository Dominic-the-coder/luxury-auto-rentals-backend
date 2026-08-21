require("dotenv").config();
const mongoose = require("mongoose");

const Car = require("./models/car");
const Category = require("./models/category");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URL + "/car_rental");
    console.log("MongoDB is connected");

    await Car.deleteMany({});
    await Category.deleteMany({});

    const categories = await Category.insertMany([
      { name: "SUV" },
      { name: "Sedan" },
      { name: "Sports" },
      { name: "Luxury" },
    ]);

    console.log("Categories created:", categories.map((c) => c.name));

    const findCatId = (name) =>
      categories.find((c) => c.name === name)._id;

    const cars = await Car.insertMany([
      {
        name: "Toyota RAV4",
        description: "Reliable and spacious SUV, great for families.",
        price: 120,
        category: findCatId("SUV"),
        image: "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=600",
      },
      {
        name: "Honda Civic",
        description: "Fuel-efficient and comfortable sedan.",
        price: 80,
        category: findCatId("Sedan"),
        image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600",
      },
      {
        name: "Porsche 911",
        description: "High-performance sports car for a thrilling ride.",
        price: 450,
        category: findCatId("Sports"),
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600",
      },
      {
        name: "Mercedes-Benz S-Class",
        description: "Top-tier luxury sedan with premium comfort.",
        price: 350,
        category: findCatId("Luxury"),
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600",
      },
      {
        name: "BMW X5",
        description: "Powerful luxury SUV with advanced features.",
        price: 200,
        category: findCatId("SUV"),
        image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600",
      },
    ]);

    console.log("Cars created:", cars.map((c) => c.name));
    console.log("Seeding complete!");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();