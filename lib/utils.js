'use strict'

module.exports = {
  timeCalculator: function (h, m, s) {
    let time = 0;
    if (h > 0) {
      time = time + (h * 60 * 60 * 1000);
    }
    if (m > 0) {
      time = time + (m * 60 * 1000);
    }
    if (s > 0) {
      time = time + (s * 1000);
    }
    return time;
  },
  normalyzeStringLowercase: function(text){
    return text.toLowerCase()
    .replace(/[éèêÉÈÊ]/g, "e")
    .replace(/[úùûÚÙÛ]/g, "u")
    .replace(/[áàãâAÁÀÃÂ]/g, "a")
    .replace(/[çÇ]/g, "c")
    .replace(/[íìîÍÌÎ]/g, "i")
    .replace(/[ñÑ]/g, "n")
    .replace(/[úùûÚÙÛ]/g, "u")
    .replace(/[óòõôÓÒÔÕ]/g, "o")
    .replace(/[ ]/g, "_");
  }
}