const { Schema, model } = require("mongoose");

/*
    name (String)
*/

const categorySchema = new Schema ({
    name: {
        type: String,
        require: true,
    },
});

const Category = model("Category", categorySchema);
module.exports = Category;
