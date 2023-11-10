const router = require("express").Router();
const SubAdmin = require("../models/SubAdmin");

//UPDATE
router.put("/:id", async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET
    ).toString();
  }
  try {
    const updatedUser = await SubAdmin.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  try {
    await SubAdmin.findByIdAndDelete(req.params.id);
    res.status(200).json("Sub admin has been deleted...");
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET SUB ADMIN
router.get("/find/:id", async (req, res) => {
  try {
    const user = await SubAdmin.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET ALL SUB ADMIN
router.get("/", async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await SubAdmin.find().sort({ _id: -1 }).limit(5)
      : await SubAdmin.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET DRIVER STATS
// router.get("/stats", async (req, res) => {
//   const date = new Date();
//   const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

//   try {
//     const data = await Drivers.aggregate([
//       { $match: { createdAt: { $gte: lastYear } } },
//       {
//         $project: {
//           month: { $month: "$createdAt" },
//         },
//       },
//       {
//         $group: {
//           _id: "$month",
//           total: { $sum: 1 },
//         },
//       },
//     ]);
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

module.exports = router;
