var express = require('express');
var router = express.Router();
const SharedController = require('../server/controllers').SharedController;
const multer = require('multer');
const passport = require('passport');

const imageFilter = (req, file, cb) => {
  if (file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "image/jpg")
    cb(null, true);
  else
    cb(new Error("Image format required"), false);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets/userImages");
  },
  filename: function (req, file, cb) {
    let suffix = '';
    let fileExtension = file.mimetype.split('/')[1];
    switch (req.query.FileType) {
      case '1':
        suffix = '_front';
        break;
      case '2':
        suffix = '_back';
        break;
      case '3':
        suffix = '_proof';
        break;
    }
    const fileName = SharedController.generateUuidV4();
    //cb(null, file.originalname);
    cb(null, `${file.originalname}${suffix}.${fileExtension}`);
  }
});

const userImageUploader = multer({ storage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilter: imageFilter });
//------------------UserImageUploader-------------------------

router.post('/uploadUserImage/:Oid', [userImageUploader.single("userImage"), passport.authenticate('jwt', { session: false })], SharedController.uploadUserImage);

module.exports = router;