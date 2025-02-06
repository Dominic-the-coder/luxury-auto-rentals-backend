const express = require("express");
// set up the order router
const router = express.Router();

const { verifyPayment } = require("../controllers/payment");

router.post("/", async (req, res) => {
  try {
    const { billplz_id, billplz_paid, billplz_paid_at, billplz_x_signature } =
      req.body;

    const updatedRent = await verifyPayment(
      billplz_id,
      billplz_paid,
      billplz_paid_at,
      billplz_x_signature
    );
    res.status(200).send(updatedRent);
  } catch (error) {
    res.status(400).send({
      error: error._message,
    });
  }
});

module.exports = router;
