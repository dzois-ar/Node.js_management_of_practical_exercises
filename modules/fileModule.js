
const fs = require('fs').promises
const { v4: uuidv4 } = require('uuid')
const multer = require('multer')
const path = require('path')

const fileFields = [
  { name: 'execution_certificate', maxCount: 1 },
  { name: 'completion_report', maxCount: 1 },
  { name: 'progress_report', maxCount: 1 }
]

const imgFields = [
  {name: 'photo', maxCount: 1}
]

const storageSettings = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/pdf')
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + '.' + file.fieldname + '.pdf')
  }
})

const storageSettingsImg = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './static/img')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})



module.exports = {
  fileFields: fileFields,
  storageSettings: storageSettings,
  storageSettingsImg: storageSettingsImg,
  imgFields:  imgFields
}

