import testFile from './testFile'
import Issue from '../../utils/issues'
import fs from 'fs'
import isNode from '../isNode'
import checkIfUtf8 from 'is-utf8'

const JSONFilePattern = /.json$/
const isJSONFile = file =>
  JSONFilePattern.test(isNode ? file.name : file.relativePath)

/**
 * checkEncoding
 * @param {object | File} file - nodeJS fs file or browser File
 * @param {buffer | Uint8Array} data - file content buffer
 * @param {function} cb - returns { isUtf8 }
 */
const checkEncoding = (file, data, cb) => {
  if (isJSONFile(file)) cb({ isUtf8: checkIfUtf8(data) })
}

/**
 * Read
 *
 * A helper method for reading file contents.
 * Takes a file object and a callback and calls
 * the callback with the binary contents of the
 * file as the only argument.
 *
 * In the browser the file should be a file object.
 * In node the file should be a path to a file.
 *
 */
function readFile(file, annexed, dir) {
  return new Promise((resolve, reject) => {
    if (isNode) {
      testFile(file, annexed, dir, function(issue, stats, remoteBuffer) {
        if (issue) {
          return reject(issue)
        }
        if (!remoteBuffer) {
          fs.readFile(file.path, function(err, data) {
            checkEncoding(file, data, ({ isUtf8 }) => {
              if (!isUtf8) reject(new Issue({ code: 123, file }))
            })
            return resolve(data.toString('utf8'))
          })
        }
        if (remoteBuffer) {
          return resolve(remoteBuffer.toString('utf8'))
        }
      })
    } else {
      const reader = new FileReader()
      reader.onloadend = function(e) {
        if (e.target.readyState == FileReader.DONE) {
          if (!e.target.result) {
            return reject(new Issue({ code: 44, file: file }))
          }
          const buffer = new Uint8Array(e.target.result)
          checkEncoding(file, buffer, ({ isUtf8 }) => {
            if (!isUtf8) reject(new Issue({ code: 123, file }))
          })
          const utf8Data = String.fromCharCode.apply(null, buffer)
          return resolve(utf8Data)
        }
      }
      reader.readAsArrayBuffer(file)
    }
  })
}

export default readFile
