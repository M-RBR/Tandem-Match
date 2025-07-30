import multer from "multer";
import path from "path";

// export const upload = multer({ dest: "uploads/" });

/*

export const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: function (req, file, cb) {
      const fileExt = path.extname(file.originalname);
      let filename = req.user._id + "-" + Date.now() + fileExt;
      return cb(null, filename);
    },
  }),
});

*/
