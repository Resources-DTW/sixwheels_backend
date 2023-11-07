const router = require("express").Router();
const Promotions = require("../models/Promotions");

//CREATE
router.post("/", async (req, res) => {
  const newBanner = await Promotions(req.body);

  try {
    const savedBanner = await newBanner.save();
    res.status(200).json(savedBanner);
  } catch (error) {
    res.status(500).json(error);
  }
});

// //UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updatedBanner = await Promotions.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedBanner);
  } catch (error) {
    res.status(500).json(error);
  }
});

// //DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Promotions.findByIdAndDelete(req.params.id);
    res.status(200).json("Banner has been deleted...");
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET PROMOTION
router.get("/find/:id", async (req, res) => {
  try {
    const banner = await Promotions.findById(req.params.id);
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET ALL PROMOTIONS
router.get("/", async (req, res) => {
  const query = req.query.new;
  try {
    const banners = query
      ? await Promotions.find().sort({ _id: -1 }).limit(5)
      : await Promotions.find();
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
