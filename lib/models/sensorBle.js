'use strict'
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

/**
 * TODO: Definição da estrutura dos valores do trandutor
 */
var ValueSchema = new Schema({
  value: { type: Number},
  time: { type: Date},
}, { versionKey: false });

/**
 * TODO: Definição da estrutura do trandutor
 */
var ValuesSchema = new Schema({
  sensortype: { type: String},
  value: [ValueSchema]
}, { versionKey: false });

/**
 * TODO: Definição da estrutura do sensor
 */
var SensorBleSchema = new Schema({
  id: { type: String, required: true },
  user_id: { type: String, required: true },
  node_id: { type: String, required: true },
  name: { type: String, required: true },
  values: [ValuesSchema]
}, {versionKey: false });

/**
 * TODO: Criação do sensor
 */
var SensorBle = function () {
  this.sensorbledb = mongoose.model('SensorBle', SensorBleSchema);
}

/**
 * TODO: Insere um novo registo ou atualiza o existente este metodo é 
 * utlizado para atualizar os vários registos
 */
SensorBle.prototype.insertOrUpdate = function(datable, newQuery, newData){  
  var self = this;
  let query = {};  
  let dataInsertOrUpdadte = {};
  let options = { 
    upsert: true
  }; 
  /**
   * TODO: Se não receber esta variavel é criado a query para inserir ou atualizar o registo base
   */
  if (newQuery) {
    query = newQuery;
  } else {
    query = {
      id: datable.pacientId + "-" + datable.node_id
    };
  }
  /**
   * TODO: Se não receber esta variavel é criado o registo inicial
   */
  if (newData) {
    dataInsertOrUpdadte = newData;
  } else {
    dataInsertOrUpdadte = {
      user_id: datable.pacientId, 
      node_id: datable.node_id, 
      name: datable.name
    };    
  }
  /**
   * TODO: Executa o insert ou o update
   */
  this.sensorbledb.update(query, dataInsertOrUpdadte, options, function(err, result){
    if (err) {
      return console.log("error", err.toString());      
    }
    /**
     * TODO: Verifica se foi um registo novo
     */
    if (result.nModified === 0) {
      /**
       * TODO: Registo novo então pode adicionar os transdutores todos 
       * porque o sensor não tem trandutores inseridos
       */
      //console.log("Insere todos os sensorestype, sensor novo.");
      let dataN = {$set: {"values": datable.values}};
      self.insertOrUpdate(datable, null, dataN);
    } else {
      /**
       * TODO: O sensor já tem trandutores inseridos
       */
      if ((newQuery && newData)) {
        //console.log("Novo sensor type adicionado.");
      } else if (!(newData)) {
        /**
         * TODO: Como o sensor já existe e tem transdutores então vai 
         * iterar os trandutores e verifica se o tandfutor já pertence na lista.
         * 
         * Só entra aqui se o parametro de entrada da função seja nulo.
         */
        for (let index = 0; index < datable.values.length; index++) {
          let blesensor = {
            id: datable.pacientId + "-" + datable.node_id,
            value: datable.values[index]
          }
          /**
           * TODO: Envia o trandutor para ser validado.
           */
          self.chekSensorTypeExist(blesensor);          
        }  
      }
    }
  });
}

/**
 * TODO: Metodo para verificar o o trandutor pertence à lista de trandutores do sensor.
 */
SensorBle.prototype.chekSensorTypeExist = function(sensordata) {
  var self = this;
  let query = {
    id: sensordata.id, 
    "values.sensortype": sensordata.value.sensortype
  };
  var options = {id: 1, values: 1};
  this.sensorbledb.find(query, function(err, result){
    if (err) {
      return console.log("error", err.toString());      
    }
    /**
     * TODO: Se a resposta da query seja vazio ´+e porque o trandutor ainda não pertence à lista
     */
    if (result.length === 0) {
      /**
       * TODO: Chama o método para adicionar o novo trandutor à lista de trandutores.
       */
      let queryN = {id: sensordata.id};
      let newDataN = {$push: {"values": sensordata.value}};
      self.insertOrUpdate(null, queryN, newDataN);
    } else {
      /**
       * TODO: O resultado da query não é vazio então chama a função para adicionar o novo valor a lista de valores recolhidos pelo trandutor.
       */
      //console.log("Existe insere o novo value ao array do trandutor");
      let queryNdata = {
        id: sensordata.id,
        "values.sensortype": sensordata.value.sensortype
      };
      let newDataNdata = {$push: {"values.$.value": sensordata.value.value}};
      self.insertOrUpdate(null, queryNdata, newDataNdata);
    }
  });
}

SensorBle.prototype.getDataSensorsbleId = function(id, res){
  this.sensorbledb.find({ id: id }, { _id: 0, name: 1, values: 1 }, function(err, dataSensor){
    if (err) {
      return res.json({
        status: false,
        data: err
      });
    }
    if (dataSensor.length === 0) {
      return res.json({
        status: false,
        data: "Não existe dados de histórico para o exame."
      });      
    }
    res.json({
      status: true,
      data: dataSensor[0]
    });
  });
}

module.exports = SensorBle;