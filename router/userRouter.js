const router = require("express").Router();
const User = require("../model/userModel");
const createError = require("http-errors");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  const allUser = await User.find({});
  res.json(allUser);
});

router.get("/:id", async (req, res, next) => {
  try {
    const showedUser = await User.find({ _id: req.params.id });
    if (showedUser) {
      res.json(showedUser);
    } else {
      throw createError(404, "User not found");
    }
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const addedUser = new User(req.body);
    addedUser.password = await bcrypt.hash(addedUser.password, 10);
    const { error, value } = addedUser.joiValidation(req.body);
    if (error) {
      throw createError(400, error);
    } else {
      const result = await addedUser.save();
      res.send(result);
    }
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next)=>{
    try{
        const user = await User.login(req.body.email, req.body.password);
        res.json(user);
    }catch(err){
        next(err)
    }
})

router.patch("/:id", async (req, res, next) => {
  delete req.body.createdAt;
  delete req.body.updatedAt;

  if(req.body.hasOwnProperty("password")){
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }

  const { error, value } = User.joiValidationForUpdate(req.body);
  if (error) {
    next(error);
  } else {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true, runValidators: true }
      );
      if (updatedUser) {
        return res.status(200).json({
          message: "User is succesfully updated",
          "user last version": updatedUser,
        });
      } else {
        throw createError(404, `User with id ${req.params.id} not found`);
      }
    } catch (err) {
      next(err);
    }
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete({ _id: req.params.id });
    const allUser = await User.find({});
    if (deletedUser) {
      return res.status(200).json({
        message: "User is succesfully deleted",
        "list of users last version": allUser,
      });
    } else {
      throw createError(404, `User with id ${req.params.id} not found`);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
