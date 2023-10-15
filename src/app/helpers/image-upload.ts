import { Request } from "express";
import multer from "multer";
import path from "path";

const imageStorage = multer.diskStorage({
    destination: (req: Request, file, cb) => {

        let folder = ''

        if (req.baseUrl.includes("store")) { folder = "stores" }
        else if (req.baseUrl.includes("motorcycle")) { folder = "motorcycles" }
        else if (req.baseUrl.includes("user")) { folder = "users" }

        cb(null, `src/app/public/images/${folder}`)
    },

    filename: (req: Request, file, cb) => {
        cb(null, Date.now() + String(Math.floor(Math.random() * 1000)) + path.extname(file.originalname))
    }
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req: Request, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error("Por favor, envie apenas jpg ou png!"));
        }
        cb(null, true);
    }
})

export { imageUpload }
