
module.exports = {
  postSensor : function(req, res){
    console.log("Teste Post", req.body);
    return res.json({
      status : true
    });
  }
}
