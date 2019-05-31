import fs from 'fs'
import multer from 'multer'
import path from 'path'
import rimraf from 'rimraf'

const uploadsBase = path.join(__dirname, '../../uploads/images')

const uploadMiddleware = (req, res, next) => {
  let imageName
  let fileExt
  const storage = multer.diskStorage({
    destination: uploadsBase,

    filename: (req, file, cb) => {
      if (file.originalname) {
        fileExt = path.extname(file.originalname)
      }
      cb(null, (imageName = file.fieldname + '-' + Date.now() + fileExt))
    }
  })
  const upload = multer({ storage, limits: { fieldSize: 30 } })
  const uploadFile = upload.single('image')

  uploadFile(req, res, err => {
    if (req.file) {
      if (req.file.size > 50000) {
        return next({ status: 400, message: 'file size is too large.' })
      } else {
        req.imageData = new Buffer(fs.readFileSync(req.file.path)).toString(
          'base64'
        )
      }
    } else {
      return next()
    }
    req.imageType = `image/${fileExt.split('.')[1]}`

    rimraf('./uploads/images/*', err => {
      if (err) {
        console.error(err)
      } else {
        console.log('files removed after writing base64 image to db.')
      }
    })
    next()
  })
}

export default uploadMiddleware
