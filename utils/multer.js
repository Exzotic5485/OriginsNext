const multer = require('multer')
const fs = require('fs')

const Datapacks = require('../models/Datapacks')

const { isValidObjectId } = require('mongoose')

const datapackImageUpload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, `./public/uploads/datapack/`)
      },
      filename: (req, file, cb) => {
        cb(null, req.generatedId + ".png")
      }
    }),
    fileFilter: (req, file, cb) => {
      const allowedFiles = ["png", "jpg", "jpeg"]
      const fileExtensionArr = file.originalname.split(".")

      const fileExtension = fileExtensionArr[fileExtensionArr.length - 1];

      if(allowedFiles.includes(fileExtension)) {
        cb(null, true)
      } else {
        cb(null, false)
      }
    }
})

const datapackFileUpload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      const idOrSlug = req.params.id;
      
      const datapack = await Datapacks.findOne(isValidObjectId(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug }).lean();

      if(!datapack) return cb(new Error("Invalid datapack"), null)

      fs.mkdirSync(`./public/uploads/files/${datapack._id}/`, { recursive: true })

      cb(null, `./public/uploads/files/${datapack._id}/`)
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname.replace(" ", "_"))
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedFiles = ["zip"]
    const fileExtensionArr = file.originalname.split(".")

    const fileExtension = fileExtensionArr[fileExtensionArr.length - 1];

    if(allowedFiles.includes(fileExtension)) {
      cb(null, true)
    } else {
      cb(null, false)
    }
  }
})

const userImageUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `./public/uploads/datapack/user`)
    },
    filename: (req, file, cb) => {
      cb(null, req.user._id + ".png")
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedFiles = ["png", "jpg", "jpeg"]
    const fileExtensionArr = file.originalname.split(".")

    const fileExtension = fileExtensionArr[fileExtensionArr.length - 1];

    if(allowedFiles.includes(fileExtension)) {
      cb(null, true)
    } else {
      cb(null, false)
    }
  }
})


module.exports = { datapackImageUpload, datapackFileUpload, userImageUpload }