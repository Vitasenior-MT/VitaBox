'use strict'
require('colors');
var cp = require('child_process');

module.exports = {
  getLastGitUpdate: function (req, res) {
    cp.exec("git log -1 --format=%cd", function (error, stdout, stderr) {
      if (error || stderr) {
        console.log("getLastGitUpdate Error", error, stderr)
        return res.json({
          status: false,
          data: ''
        })
      }
      console.log("getLastGitUpdate", stdout)
      return res.json({
        status: true,
        data: stdout
      })
    })
  }
}