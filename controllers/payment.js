const { createHmac } = require("crypto");

const Rent = require("../models/rent");

const verifyPayment = async (
  billplz_id,
  billplz_paid,
  billplz_paid_at,
  billplz_x_signature
) => {
  // verify the x-signature
  const billplz_string = `billplzid${billplz_id}|billplzpaid_at${billplz_paid_at}|billplzpaid${billplz_paid}`;
  const x_signature = createHmac("sha256", process.env.BILLPLZ_XSIGNATURE_KEY)
    .update(billplz_string)
    .digest("hex");

  // compare the x-signature we created with billplz x-signature
  if (x_signature !== billplz_x_signature) {
    throw new Error("Signature not valid");
  } else {
    // if x-signature is match, then we update the order

    // find the rent using the billplz_id
    const selectedRent = await Rent.findOne({ billplz_id: billplz_id });

    // check if rent exists
    if (!selectedRent) {
      throw new Error("Order not found");
    } else {
      // if order is found, update the order
      // if billplz_paid is equal to true, then payment is successful
      if (billplz_paid === "true") {
        selectedRent.status = "paid";
        selectedRent.paid_at = billplz_paid_at;
      } else {
        selectedRent.status = "failed";
      }

      // save the order to update
      await selectedRent.save();
      return selectedRent;
    }
  }
};

module.exports = {
  verifyPayment,
};
