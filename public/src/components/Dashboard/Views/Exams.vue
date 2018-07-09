<template>
  <div class="row">
    <div class="row btnUsers">
      <div class="col-md-3" v-for="patient in patientsList"  :key='patient.id'>
        <div class="card clear-padding">
          <div class="content">
            <button v-tooltip.bottom="$t('tooltips.diagnosis.user.title')" class="btn btn-block btn-info control-remote-patient" type="button" :data-id="patient.id" v-on:click="bleGetListExam(this)">
                <h5 class="text-div-wrap"><b class="ti-user"> {{ patient.name }}</b></h5>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row btnsExams">
      <div class="col-md-2" v-for="btn in btnExams"  :key='btn.id'>
        <div class="card clear-padding">
          <div class="content">
            <button
              v-tooltip.bottom="$t('tooltips.diagnosis.exam.title')"
              class="btn btn-block btn-success control-remote"
              type="button"
              :data-type="btn.type"
              v-on:click="bleExecExam">
              <h2><b :class="btn.icon"></b></h2>
              <h5 class="text-div-wrap">{{ btn.nome }}</h5>
            </button>
          </div>
        </div>
      </div>
    </div>
    <default-form ref="DefaultView"></default-form>
    <div class="row bloodpressure clear-margin" v-show="examEvent == 'bloodpressure'">
      <div class="col-md-12 btn btn-round btn-fill">
        <div class="row" v-show="dataPressArt.panelPrincipal">
          <div class="col-md-12">
            <div class="card">
              <div class="content">
                <h4 class="title">{{ $t('diagnosis.user.title') }}</h4>
                <hr>
                <ol>
                  <h4>
                    <div class="row">
                      <div class="col-md-10 text-justify text-div-wrap">
                        <li>Coloque a bracelete no braço.</li>
                        <li>Ajuste a bracelete conforme mostrado na imagem (Fig.1).</li>
                        <li>No comando pressione em <i class="ti-new-window"></i> para iniciar.</li>
                        <li>Pressione no botão <b class="ti-power-off"></b> do equipamento para ligar e iniciar o processo (Fig.2).</li>
                        <li>A luz indicadora de equipamento ligado pisca.</li>
                        <li>Após o equpamento ser detectado a luz deixa de piscar ficando sempre ligada.</li>
                        <li>Aguarde até o processo terminar.</li>
                        <li>Após todos os dados aparecerem na televisão o equipamento desliga-se automaticamente.</li>
                      </div>
                      <div class="col-md-2">
                        <figure>
                          <img src='static/img/bloodpressure.png' alt="" class="img-fit">
                          <figcaption>Fig.1</figcaption>
                        </figure>
                        <div class="row"><div class="col-md-12">&nbsp;</div></div>
                        <figure>
                          <img src='static/img/bloodpressure.gif' alt="" class="img-fit">
                          <figcaption>Fig.2</figcaption>
                        </figure>
                      </div>
                    </div>
                  </h4>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div class="row" v-show="dataPressArt.panelResults">
          <div class="col-md-12">
            <h5>Resultados</h5>
          </div>
          <div class="col-md-12 blink-results">
            <div class="col-md-6 results-val" v-show="dataPressArt.pressmaxShow">
              <stats-card>
                <div class="icon-big text-center" slot="header">
                  <i class="ti-stats-up"></i>
                  <!-- <hr> -->
                </div>
                <div class="numbers" slot="content">
                  <p>{{dataPressArt.pressmaxName}} </p>
                  {{dataPressArt.pressmax}}
                </div>
              </stats-card>
            </div>
            <div class="col-md-6 results-val" v-show="dataPressArt.pressminShow">
              <stats-card>
                <div class="icon-big text-center" slot="header">
                  <i class="ti-stats-down"></i>
                  <!-- <hr> -->
                </div>
                <div class="numbers" slot="content">
                  <p>{{dataPressArt.pressminName}} </p>
                  {{dataPressArt.pressmin}}
                </div>
              </stats-card>
            </div>
            <div class="col-md-6 results-val" v-show="dataPressArt.pulsoShow">
              <stats-card>
                <div class="icon-big text-center" slot="header">
                  <i class="ti-pulse"></i>
                  <!-- <hr> -->
                </div>
                <div class="numbers" slot="content">
                  <p>{{dataPressArt.pulsoName}} </p>
                  {{dataPressArt.pulso}}
                </div>
              </stats-card>
            </div>
          </div>
          <div class="col-md-12">
            <h5>Pressione em [OK] para executar novamente.</h5>
          </div>
        </div>
      </div>
    </div>
    <div class="row bodyscale clear-margin" v-show="examEvent == 'bodyscale'">
      <div class="col-md-12 btn btn-round btn-fill">
        <div class="row" v-show="dataBodyScale.panelPrincipal">
          <div class="col-md-12">
            <div class="card">
              <div class="content">
                <h4 class="title">{{ $t('diagnosis.user.title') }}</h4>
                <hr>
                <ol>
                  <h4>
                    <div class="row">
                      <div class="col-md-10 text-justify text-div-wrap">
                        <li>Coloque o equipamento numa superficie sólida, plana, de fácil acesso e livre de tapetes para que seja possivel efetuar uma correta medição.</li>
                        <li>No comando pressione em <i class="ti-new-window"></i> para iniciar.</li>
                        <li>Descalce-se e suba para a balança.</li>
                        <li>O equipamento liga-se automaticamente.</li>
                        <li>Quando o valor obtido estabilizar o mesmo irá piscar.</li>
                        <li>Após a correta recolha dos dados o equipamento desliga-se automaticamente.</li>
                      </div>
                      <div class="col-md-2">
                        <div class="row"><div class="col-md-12">&nbsp;</div></div>
                        <img src='static/img/bodyscale.png' alt="" class="img-fit">
                      </div>
                    </div>
                  </h4>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div class="row" v-show="dataBodyScale.panelResults">
          <div class="col-md-12">
            <h5>Resultados</h5>
          </div>
          <div class="col-md-12 blink-results">
            <div class="col-md-6 results-val" v-show="dataBodyScale.weightShow">
              <stats-card>
                <div class="icon-big text-center" slot="header">
                  <i class="fas fa-tachometer-alt"></i>
                  <!-- <hr> -->
                </div>
                <div class="numbers" slot="content">
                <p>{{dataBodyScale.weightName}} </p>
                {{dataBodyScale.weight}} Kg
                </div>
              </stats-card>
            </div>
            <div class="col-md-6 results-val" v-show="dataBodyScale.caloriesShow">
              <stats-card>
                <div class="icon-big text-center" slot="header">
                  <i class="fas fa-diagnoses"></i>
                  <!-- <hr> -->
                </div>
                <div class="numbers" slot="content">
                <p>{{dataBodyScale.caloriesName}}</p>
                {{dataBodyScale.calories}} Kcal
                </div>
              </stats-card>
            </div>
            <div class="col-md-6 results-val" v-show="dataBodyScale.waterShow">
              <stats-card>
                <div class="icon-big text-center" slot="header">
                  <i class="fas fa-tint"></i>
                  <!-- <hr> -->
                </div>
                <div class="numbers" slot="content">
                <p>{{dataBodyScale.waterName}}</p>
                {{dataBodyScale.water}} %
                </div>
              </stats-card>
            </div>
            <div class="col-md-6 results-val" v-show="dataBodyScale.musclemassShow">
              <stats-card>
                <div class="icon-big text-center" slot="header">
                  <i class="fas fa-child"></i>
                  <!-- <hr> -->
                </div>
                <div class="numbers" slot="content">
                <p>{{dataBodyScale.musclemassName}}</p>
                {{dataBodyScale.musclemass}} %
                </div>
              </stats-card>
            </div>
            <div class="col-md-6 results-val" v-show="dataBodyScale.bodyfatShow">
              <stats-card>
                <div class="icon-big text-center" slot="header">
                  <i class="fas fa-street-view"></i>
                  <!-- <hr> -->
                </div>
                <div class="numbers" slot="content">
                  <p>{{dataBodyScale.bodyfatName}}</p>
                  {{dataBodyScale.bodyfat}} %
                </div>
              </stats-card>
            </div>
            <div class="col-md-6 results-val" v-show="dataBodyScale.bonemassShow">
              <stats-card>
                <div class="icon-big text-center" slot="header">
                  <i class="fas fa-street-view"></i>
                  <!-- <hr> -->
                </div>
                <div class="numbers" slot="content">
                  <p>{{dataBodyScale.bonemassName}}</p>
                  {{dataBodyScale.bonemass}} %
                </div>
              </stats-card>
            </div>
            <div class="col-md-6 results-val" v-show="dataBodyScale.visceralfatShow">
              <stats-card>
                <div class="icon-big text-center" slot="header">
                  <i class="fas fa-street-view"></i>
                  <!-- <hr> -->
                </div>
                <div class="numbers" slot="content">
                  <p>{{dataBodyScale.visceralfatName}}</p>
                  {{dataBodyScale.visceralfat}} %
                </div>
              </stats-card>
            </div>
          </div>
          <div class="col-md-12">
            <h5>Pressione em [OK] para executar novamente.</h5>
          </div>
        </div>
      </div>
    </div>
    <div class="row bodytemperature clear-margin" v-show="examEvent == 'bodytemperature'">
      <div class="col-md-12 btn btn-round btn-fill">
        <div class="row" v-show="databodytemperature.panelPrincipal">
          <div class="col-md-12">
            <div class="card">
              <div class="content">
                <h4 class="title">Modo de Utilização</h4>
                <hr>
                <ol>
                  <h4>
                    <div class="row">
                      <div class="col-md-10 text-justify text-div-wrap">
                        <li>No comando pressione em <i class="ti-new-window"></i> para iniciar.</li>
                        <li>Coloque o equipamento de acordo com a imagem ao lado (Fig.1).</li>
                        <li>Pressione no botão até que o equipamento ligue (Fig.2).</li>
                        <li>Quando o equipamento estiver ligado uma luz indicadora pisca.</li>
                        <li>Após a deteção do equipamento a luz indicadora apaga-se.</li>
                        <li>Aguarde até que todos os valores apareçam na televisão.</li>
                        <li>Após a conclusão do processo a luz indicadora volta a piscar.</li>
                        <li>Pode retirar o equipamento e desligá-lo.</li>
                        <li>Pressione novamente no botão <b class="ti-power-off"></b> até que o equipamento se deslique (Fig.2).</li>
                        <li>É importante que o equipamento seja desligado de forma a economizar a bateria.</li>
                      </div>
                      <div class="col-md-2">
                        <figure>
                          <img src='static/img/bodytemp.png' alt="" class="img-fit">
                          <figcaption>Fig.1</figcaption>
                        </figure>
                        <div class="row"><div class="col-md-12">&nbsp;</div></div>
                        <figure>
                          <img src='static/img/bodytemp.gif' alt="" class="img-fit">
                          <figcaption>Fig.2</figcaption>
                        </figure>
                      </div>
                    </div>
                  </h4>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div class="row" v-show="databodytemperature.panelResults">
          <div class="col-md-12">
            <h5>Resultados</h5>
          </div>
          <div class="col-md-12 blink-results">
            <div class="col-md-6 results-val" v-show="databodytemperature.batteryShow">
              <stats-card>
                <div class="icon-big text-center" slot="header">
                  <span v-show="databodytemperature.battery < 15"><i class="fas fa-battery-empty"></i></span>
                  <span v-show="databodytemperature.battery >= 15 && databodytemperature.battery < 40"><i class="fas fa-battery-quarter"></i></span>
                  <span v-show="databodytemperature.battery >= 40 && databodytemperature.battery < 65"><i class="fas fa-battery-half"></i></span>
                  <span v-show="databodytemperature.battery >= 65 && databodytemperature.battery < 90"><i class="fas fa-battery-three-quarters"></i></span>
                  <span v-show="databodytemperature.battery >= 90"><i class="fas fa-battery-full"></i></span>
                  <!-- <hr> -->
                </div>
                <div class="numbers" slot="content">
                <p>{{databodytemperature.batteryName}}</p>
                {{databodytemperature.battery}} %
                </div>
              </stats-card>
            </div>
            <div class="col-md-6 results-val" v-show="databodytemperature.tempCorpShow">
              <stats-card>
                <div class="icon-big text-center" slot="header">
                  <i class="fas fa-thermometer"></i>
                  <!-- <hr> -->
                </div>
                <div class="numbers" slot="content">
                  <p>{{databodytemperature.tempCorpName}} </p>
                  {{databodytemperature.tempCorp}} ºC
                </div>
              </stats-card>
            </div>
          </div>
          <div class="col-md-12">
            <h5>Pressione em [OK] para executar novamente.</h5>
          </div>
        </div>
      </div>
    </div>
    <div class="row bodypulse clear-margin" v-show="examEvent == 'bodypulse'">
      <div class="col-md-12 btn btn-round btn-fill">
        <div class="row" v-show="databodypulse.panelPrincipal">
          <div class="col-md-12">
            <div class="card">
              <div class="content">
                <h4 class="title">Modo de Utilização</h4>
                <hr>
                <ol>
                  <h4>
                    <div class="row">
                      <div class="col-md-10 text-justify text-div-wrap">
                        <li>No comando pressione em <i class="ti-new-window"></i> para iniciar.</li>
                        <li>Coloque o equipamento no dedo conforme apresentado na imagem (Fig.1).</li>
                        <li>Pressione no botão <b class="ti-power-off"></b> do equipamento para ligar (Fig.2).</li>
                        <li>Aguarde até que todos os valores apareçam na televisão.</li>
                        <li>Quando todos os valores aparecerem, o processo encontra-se concluido.</li>
                        <li>Pode retirar o equipamento do dedo e o mesmo desliga-se automaticamente.</li>
                      </div>
                      <div class="col-md-2">
                        <figure>
                          <img src='static/img/pulse.png' alt="" class="img-fit">
                          <figcaption>Fig.1</figcaption>
                        </figure>
                        <div class="row"><div class="col-md-12">&nbsp;</div></div>
                        <figure>
                          <img src='static/img/pulse.gif' alt="" class="img-fit">
                          <figcaption>Fig.2</figcaption>
                        </figure>
                      </div>
                    </div>
                  </h4>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div class="row" v-show="databodypulse.panelResults">
          <div class="col-md-12">
            <h5>Resultados</h5>
          </div>
          <div class="col-md-12 blink-results">
            <div class="col-md-6 results-val" v-show="databodypulse.spoValShow">
              <stats-card>
                <div class="icon-big text-center" slot="header">
                  <i class="fas fa-fire"></i>
                  <!-- <hr> -->
                </div>
                <div class="numbers" slot="content">
                  <p>{{databodypulse.spoValName}} </p>
                  {{databodypulse.spoVal}} %
                </div>
              </stats-card>
            </div>
            <div class="col-md-6 results-val" v-show="databodypulse.pulseValShow">
              <stats-card>
                <div class="icon-big text-center" slot="header">
                  <i class="fas fa-heartbeat"></i>
                  <!-- <hr> -->
                </div>
                <div class="numbers" slot="content">
                <p>{{databodypulse.pulseValName}} </p>
                {{databodypulse.pulseVal}} PPM
                </div>
              </stats-card>
            </div>
          </div>
          <div class="col-md-12">
            <h5>Pressione em [OK] para executar novamente.</h5>
          </div>
        </div>
      </div>
    </div>
    <div class="row bandfitness clear-margin" v-show="examEvent == 'bandfitness'">
      <div class="col-md-12 btn btn-round btn-fill">
        <div class="row" v-show="dataBandFitness.panelPrincipal">
          <div class="col-md-12">
            <div class="card">
              <div class="content">
                <h4 class="title">Modo de Utilização</h4><hr>
                <ul>
                  <h4>
                    <li class="text-justify text-div-wrap">Assegure-se de que possui a banda corretamente colocada no pulso.</li>
                  </h4>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="row" v-show="dataBandFitness.panelResults">
          <div class="col-md-12">
            <h5>Resultados</h5>
          </div>
          <din class="col-md-12 blink-results">
            <div class="col-md-4 results-val" v-show="dataBandFitness.batterystatus.battery_levelShow">
              <stats-card>
                <div class="icon-big text-center" slot="header">
                  <span v-show="this.dataBandFitness.batterystatus.battery_level < 15">
                  <i class="fas fa-battery-empty"></i>
                  </span>
                  <span v-show="this.dataBandFitness.batterystatus.battery_level >= 15 && this.dataBandFitness.batterystatus.battery_level < 40">
                    <i class="fas fa-battery-quarter"></i>
                  </span>
                  <span v-show="this.dataBandFitness.batterystatus.battery_level >= 40 && this.dataBandFitness.batterystatus.battery_level < 65">
                    <i class="fas fa-battery-half"></i>
                  </span>
                  <span v-show="this.dataBandFitness.batterystatus.battery_level >= 65 && this.dataBandFitness.batterystatus.battery_level < 90">
                    <i class="fas fa-battery-three-quarters"></i>
                  </span>
                  <span v-show="this.dataBandFitness.batterystatus.battery_level >= 90">
                    <i class="fas fa-battery-full"></i>
                  </span>
                  <!-- <hr> -->
                </div>
                <div class="numbers" slot="content">
                <p>{{dataBandFitness.batterystatus.battery_levelName}} </p>
                {{dataBandFitness.batterystatus.battery_level}} %
                </div>
              </stats-card>
            </div>
            <div class="col-md-4 results-val" v-show="dataBandFitness.steps.stepsShow">
              <stats-card>
                <div class="icon-big text-center" slot="header">
                  <i class="fas fa-capsules"></i>
                  <!-- <hr> -->
                </div>
                <div class="numbers" slot="content">
                  <p>{{dataBandFitness.steps.stepsName}} </p>
                  {{dataBandFitness.steps.steps}}
                </div>
              </stats-card>
            </div>
            <div class="col-md-4 results-val" v-show="dataBandFitness.steps.metersShow">
              <stats-card>
                <div class="icon-big text-center" slot="header">
                  <i class="fas fa-flag-checkered"></i>
                  <!-- <hr> -->
                </div>
                <div class="numbers" slot="content">
                  <p>{{dataBandFitness.steps.metersName}}</p>
                  {{dataBandFitness.steps.meters}}
                </div>
              </stats-card>
            </div>
            <div class="col-md-4 results-val" v-show="dataBandFitness.steps.calloriesShow">
              <stats-card>
                <div class="icon-big text-center" slot="header">
                  <i class="fas fa-diagnoses"></i>
                  <!-- <hr> -->
                </div>
                <div class="numbers" slot="content">
                  <p>{{dataBandFitness.steps.calloriesName}}</p>
                  {{dataBandFitness.steps.callories}}
                </div>
              </stats-card>
            </div>
            <div class="col-md-4 results-val" v-show="dataBandFitness.heartrate.heartrateavgShow">
              <stats-card>
                <div class="icon-big text-center" slot="header">
                  <i class="fas fa-hand-holding-heart"></i>
                  <!-- <hr> -->
                </div>
                <div class="numbers" slot="content">
                  <p>{{dataBandFitness.heartrate.heartrateavgName}}</p>
                  {{dataBandFitness.heartrate.heartrateavg}}
                </div>
              </stats-card>
            </div>
          </din>
          <div class="col-md-12">
            <h5>Pressione em [OK] para executar novamente.</h5>
          </div>
        </div>
        <div class="row" v-show="dataBandFitness.panelGraph">
          <div class="col-md-12">
            <div class="card">
              <div class="content">
                <h4 class="title"><b>Pulsação</b></h4>
                <chart-line
                  :id="'chartLine-1'"
                  :lineChartId="'chartLine-1'"
                  :dataChart="this.dataBandFitness.heartrate.heartrateArr"
                  :dataChartAvg="this.dataBandFitness.heartrate.heartrateavg" >
                </chart-line>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row bloodglucose clear-margin" v-show="examEvent == 'bloodglucose'">
      <div class="col-md-12 btn btn-round btn-fill">
        <div class="row" v-show="databloodglucose.panelPrincipal">
          <div class="col-md-12">
            <div class="card">
              <div class="content">
                <h4 class="title">Modo de Utilização</h4>
                <hr>
                <ol>
                  <h4>
                    ----------------
                  </h4>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div class="row" v-show="databloodglucose.panelResults">
          <div class="col-md-12">
            <h5>Resultados</h5>
          </div>
          <div class="col-md-12 blink-results">
            <div class="col-md-6 results-val" v-show="databloodglucose.batteryShow">
              <stats-card>
                <div class="icon-big text-center" slot="header">
                  <span v-show="databloodglucose.battery < 15"><i class="fas fa-battery-empty"></i></span>
                  <span v-show="databloodglucose.battery >= 15 && databloodglucose.battery < 40"><i class="fas fa-battery-quarter"></i></span>
                  <span v-show="databloodglucose.battery >= 40 && databloodglucose.battery < 65"><i class="fas fa-battery-half"></i></span>
                  <span v-show="databloodglucose.battery >= 65 && databloodglucose.battery < 90"><i class="fas fa-battery-three-quarters"></i></span>
                  <span v-show="databloodglucose.battery >= 90"><i class="fas fa-battery-full"></i></span>
                  <!-- <hr> -->
                </div>
                <div class="numbers" slot="content">
                <p>{{databloodglucose.batteryName}}</p>
                {{databloodglucose.battery}} %
                </div>
              </stats-card>
            </div>
            <div class="col-md-6 results-val" v-show="databloodglucose.glucoseShow">
              <stats-card>
                <div class="icon-big text-center" slot="header">
                  <i class="fas fa-thermometer"></i>
                  <!-- <hr> -->
                </div>
                <div class="numbers" slot="content">
                  <p>{{databloodglucose.glucoseName}} </p>
                  {{databloodglucose.glucose}} (mg/dl)
                </div>
              </stats-card>
            </div>
          </div>
          <div class="col-md-12">
            <h5>Pressione em [OK] para executar novamente.</h5>
          </div>
        </div>
      </div>
    </div>
    <div id="loader-wrapper" v-show="execProcess">
      <div v-show="examEvent == 'bloodpressure'" id="loader-chart">
        <ChartGauge :id="dataPressArt.id"
          :typechartdonut="false"
          :chartid="dataPressArt.id"
          :valueChart="dataPressArt.val"
          :labelChart="''"
          :chartmax="dataPressArt.max"
          :symbol="''">
        </ChartGauge>
        <h4 class="text-center">
          <img src='static/img/load4_B.gif' alt=''>
        </h4>
        <h1 class="text-center">Aguarde</h1>
      </div>
      <div v-show="examEvent != 'bloodpressure'" id="loader">
        <h4 class="text-center">
          <img src='static/img/load3_B.gif' alt=''>
        </h4>
        <h1 class="text-center">Aguarde</h1>
      </div>
    </div>
  </div>
</template>
<script>
import { EventBus } from '../../../event-bus.js'
import StatsCard from 'components/UIComponents/Cards/StatsCard.vue'
import ChartGauge from 'components/UIComponents/Charts/chartGaugeItem1.vue'
import ChartLine from 'components/UIComponents/Charts/chartLineHeartRate.vue'
import DefaultForm from 'components/UIComponents/Forms/defaultform.vue'
export default {
  components: {
    ChartGauge,
    StatsCard,
    ChartLine,
    DefaultForm
  },
  data() {
    return {
      msgUser: 'diagnosis.msgUser',
      msgExit: 'diagnosis.msgExit',
      classEvent: 'control-remote-patient',
      posPatientSelected: -1,
      patientsList: [],
      patientId: '',
      btnExams: [],
      // definição do ojecto para medir a pressão arterial
      dataPressArt: {
        id: 'pressArterial-Chart',
        panelPrincipal: true,
        panelResults: false,
        val: 0,
        max: 100,
        pulso: 0,
        pulsoName: '',
        pulsoShow: false,
        pressmax: 0,
        pressmaxName: '',
        pressmaxShow: false,
        pressmin: 0,
        pressminName: '',
        pressminShow: false
      },
      // definição do objecto para os dados da balança
      dataBodyScale: {
        panelPrincipal: true,
        panelResults: false,
        weight: 0,
        weightName: '',
        weightShow: false,
        bodyfat: 0,
        bodyfatName: '',
        bodyfatShow: false,
        bonemass: 0,
        bonemassName: '',
        bonemassShow: false,
        musclemass: 0,
        musclemassName: '',
        musclemassShow: false,
        visceralfat: 0,
        visceralfatName: '',
        visceralfatShow: false,
        water: 0,
        waterName: '',
        waterShow: false,
        calories: 0,
        caloriesName: '',
        caloriesShow: false
      },
      // definição do objecto para os dados da temperatura corporal
      databodytemperature: {
        panelPrincipal: true,
        panelResults: false,
        battery: 0,
        batteryName: '',
        batteryShow: false,
        tempCorp: 0,
        tempCorpName: '',
        tempCorpShow: false
      },
      // definição do objecto para os dados da pulsiometro
      databodypulse: {
        panelPrincipal: true,
        panelResults: false,
        spoVal: 0,
        spoValName: '',
        spoValShow: false,
        pulseVal: 0,
        pulseValName: '',
        pulseValShow: false
      },
      // definição do objecto para os dados da banda / pulseira
      dataBandFitness: {
        panelPrincipal: true,
        panelResults: false,
        panelGraph: false,
        heartrate: {
          heartrateArr: [],
          heartrateavg: 0,
          heartrateavgName: '',
          heartrateavgShow: false
        },
        steps: {
          steps: 0,
          stepsName: '',
          stepsShow: false,
          meters: 0,
          metersName: '',
          metersShow: false,
          callories: 0,
          calloriesName: '',
          calloriesShow: false
        },
        batterystatus: {
          battery_level: 0,
          battery_levelName: '',
          battery_levelShow: false,
          last_time_full: 0,
          last_time_charged: 0,
          charge_cycles: 0,
          status: 0
        },
        time: {
          day: 0,
          month: 0,
          year: 0,
          hour: 0,
          minute: 0,
          second: 0
        },
        softwarerevision: '',
        hardwarerevision: '',
        serialnumber: '',
        devicename: ''
      },
      databloodglucose: {
        panelPrincipal: true,
        panelResults: false,
        battery: 0,
        batteryName: '',
        batteryShow: false,
        glucose: 0,
        glucoseName: '',
        glucoseShow: false
      },
      examEvent: '', // frag para mostrar o elemento selecionado
      examMac: '',
      canBeShown: true,
      execProcess: false,
      // definição da estrutura dos botões a serem utilizadoss na interface
      btns: [
        {
          nome: 'Pressão Arterial',
          type: 'bloodpressure',
          icon: 'ti-heart-broken',
          id: 'bloodpressure-0'
        },
        {
          nome: 'Temperatura',
          type: 'bodytemperature',
          icon: 'fas fa-thermometer-half',
          id: 'bodytemperature-1'
        },
        {
          nome: 'Batimento Cardíaco',
          type: 'bodypulse',
          icon: 'ti-heart-broken',
          id: 'bodypulse-2'
        },
        {
          nome: 'Peso',
          type: 'bodyscale',
          icon: 'ti-dashboard',
          id: 'bodyscale-3'
        },
        {
          nome: 'Glicemia',
          type: 'bloodglucose',
          icon: 'fas fa-chart-bar',
          id: 'bloodglucose-4'
        },
        {
          nome: 'Banda Fitness',
          type: 'bandfitness',
          icon: 'far fa-compass',
          id: 'bandfitness-5'
        }
      ]
    }
  },
  sockets: {
    bloodglucoseFim: function(data) {
      let resData = data
      if (resData.status === true) {
        for (let dataVal in resData.data) {
          switch (resData.data[dataVal].tag) {
            case 'batteryInfo':
              this.databloodglucose.panelPrincipal = false
              this.databloodglucose.panelResults = true
              this.databloodglucose.battery = resData.data[dataVal].data
              this.databloodglucose.batteryName = resData.data[dataVal].measure
              this.databloodglucose.batteryShow = true
              break;
            case 'bloodglucose':
              console.log("AAA")
              this.databloodglucose.panelPrincipal = false
              this.databloodglucose.panelResults = true
              this.databloodglucose.glucose = resData.data[dataVal].value
              this.databloodglucose.glucoseName = resData.data[dataVal].measure
              this.databloodglucose.glucoseShow = true
              break;
            default:
              break;
          }
        }
      } else {
        this.$notifications.notify({
          message: '<h4>' + data.data + '</h4>',
          icon: 'ti-bell',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'warning'
        })
        this.databloodglucose = {
          panelPrincipal: true,
          panelResults: false,
          battery: 0,
          batteryName: '',
          batteryShow: false,
          glucose: 0,
          glucoseName: '',
          glucoseShow: false
        }
      }
    },
    /**
     * TODO: Recebe do socket toda a informação refente a bracelete
     */
    bleExecFimBandFitness: function(data) {
      let resData = data
      if (resData.status === true) {
        for (let dataVal in resData.data) {
          console.log("band", resData.data[dataVal].tag, resData.data[dataVal])
          switch (resData.data[dataVal].tag) {
            case "steps":
              this.dataBandFitness.panelPrincipal = false
              this.dataBandFitness.panelResults = true
              this.dataBandFitness.steps.steps = resData.data[dataVal].value
              this.dataBandFitness.steps.stepsName = resData.data[dataVal].measure
              this.dataBandFitness.steps.stepsShow = true
              break;
            case "meters":
              this.dataBandFitness.panelPrincipal = false
              this.dataBandFitness.panelResults = true
              this.dataBandFitness.steps.meters = resData.data[dataVal].value
              this.dataBandFitness.steps.metersName = resData.data[dataVal].measure
              this.dataBandFitness.steps.metersShow = true
              break;
            case "calories":
              this.dataBandFitness.panelPrincipal = false
              this.dataBandFitness.panelResults = true
              this.dataBandFitness.steps.callories = resData.data[dataVal].value
              this.dataBandFitness.steps.calloriesName = resData.data[dataVal].measure
              this.dataBandFitness.steps.calloriesShow = true
              break;
            case 'heartrateChart':
              this.dataBandFitness.panelPrincipal = false
              this.dataBandFitness.panelResults = true
              this.dataBandFitness.panelGraph = true
              this.dataBandFitness.heartrate.heartrateArr.push(resData.data[dataVal].data.heartrate)
              break;
            case "devicename":
              //  this.dataBandFitness.panelPrincipal = false
              // this.dataBandFitness.panelResults = true
              this.dataBandFitness.devicename = resData.data[dataVal].data
              break;
            case 'batterystatus':
              this.dataBandFitness.panelPrincipal = false
              this.dataBandFitness.panelResults = true
              this.dataBandFitness.batterystatus.battery_level = resData.data[dataVal].data.battery_level
              this.dataBandFitness.batterystatus.battery_levelName = resData.data[dataVal].data.battery_levelName
              this.dataBandFitness.batterystatus.battery_levelShow = true
              this.dataBandFitness.batterystatus.last_time_full = resData.data[dataVal].data.last_time_full
              this.dataBandFitness.batterystatus.last_time_charged = resData.data[dataVal].data.last_time_charged
              this.dataBandFitness.batterystatus.charge_cycles = resData.data[dataVal].data.charge_cycles
              this.dataBandFitness.batterystatus.status = resData.data[dataVal].data.status
              break;
            case "heartrate":
              this.dataBandFitness.panelPrincipal = false
              this.dataBandFitness.panelResults = true
              this.dataBandFitness.heartrate.heartrateavg = Math.round(resData.data[dataVal].value)
              this.dataBandFitness.heartrate.heartrateavgName = resData.data[dataVal].measure
              this.dataBandFitness.heartrate.heartrateavgShow = true
              this.execProcess = false
              EventBus.examEmExec = false
              break
            default:
              break;
          }
        }
      } else {
        this.$notifications.notify({
          message: '<h4>' + data.data + '</h4>',
          icon: 'ti-bell',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'warning'
        })
        this.dataBandFitness = {
          panelPrincipal: true,
          panelResults: false,
          panelGraph: false,
          heartrate: {
            heartrateArr: [],
            heartrateavg: 0,
            heartrateavgName: '',
            heartrateavgShow: false
          },
          steps: {
            steps: 0,
            stepsName: '',
            stepsShow: false,
            meters: 0,
            metersName: '',
            metersShow: false,
            callories: 0,
            calloriesName: '',
            calloriesShow: false
          },
          batterystatus: {
            battery_level: 0,
            battery_levelName: '',
            battery_levelShow: false,
            last_time_full: 0,
            last_time_charged: 0,
            charge_cycles: 0,
            status: 0
          },
          time: {
            day: 0,
            month: 0,
            year: 0,
            hour: 0,
            minute: 0,
            second: 0
          },
          softwarerevision: '',
          hardwarerevision: '',
          serialnumber: '',
          devicename: ''
        }
      }
    },
    /**
     * TODO: Recebe do socket toda a informação referente a balança
     */
    bleExecFimScale: function(data) {
      let resData = data
      if (resData.status === true) {
        if (resData.data.length > 0) {
          this.dataBodyScale.panelPrincipal = false
          this.dataBodyScale.panelResults = true
        }
        for (let dataVal in resData.data) {
          this.dataBodyScale[resData.data[dataVal].tag] = resData.data[dataVal].value
          this.dataBodyScale[resData.data[dataVal].tag + 'Name'] = resData.data[dataVal].measure
          this.dataBodyScale[resData.data[dataVal].tag + 'Show'] = true
        }
      } else {
        this.$notifications.notify({
          message: '<h4>' + data.data + '</h4>',
          icon: 'ti-bell',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'warning'
        })
        this.dataBodyScale = {
          panelPrincipal: true,
          panelResults: false,
          weight: 0,
          weightName: '',
          weightShow: false,
          bodyfat: 0,
          bodyfatName: '',
          bodyfatShow: false,
          bonemass: 0,
          bonemassName: '',
          bonemassShow: false,
          musclemass: 0,
          musclemassName: '',
          musclemassShow: false,
          visceralfat: 0,
          visceralfatName: '',
          visceralfatShow: false,
          water: 0,
          waterName: '',
          waterShow: false,
          calories: 0,
          caloriesName: '',
          caloriesShow: false
        }
      }
      this.execProcess = false
      EventBus.examEmExec = false
    },
    /**
     * TODO: Recebe do socket toda a informação referente ao pulsiometro
     */
    bleExecFimPulse: function(data) {
      let resData = data
      if (resData.status === true) {
        for (let dataVal in resData.data) {
          switch (resData.data[dataVal].tag) {
            case "spo2":
              this.databodypulse.panelPrincipal = false
              this.databodypulse.panelResults = true
              this.databodypulse.spoVal = resData.data[dataVal].value
              this.databodypulse.spoValName = resData.data[dataVal].measure
              this.databodypulse.spoValShow = true
              break;
            case "pulse":
              this.databodypulse.panelPrincipal = false
              this.databodypulse.panelResults = true
              this.databodypulse.pulseVal = resData.data[dataVal].value
              this.databodypulse.pulseValName = resData.data[dataVal].measure
              this.databodypulse.pulseValShow = true
              break;
            default:
              break;
          }
        }
      } else {
        console.log('Receive error', data)
        this.$notifications.notify({
          message: '<h4>' + data.data + '</h4>',
          icon: 'ti-bell',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'warning'
        })
        this.databodypulse = {
          panelPrincipal: true,
          panelResults: false,
          spoVal: 0,
          spoValName: '',
          spoValShow: false,
          pulseVal: 0,
          pulseValName: '',
          pulseValShow: false
        }
      }
      this.execProcess = false
      EventBus.examEmExec = false
    },
    /**
     * TODO: Recebe do socket a informação da temperatura corporal
     */
    bleExecFimTemp: function(data) {
      let resData = data
      if (resData.status === true) {
        for (let dataVal in resData.data) {
          switch (resData.data[dataVal].tag) {
            case "batteryInfo":
              this.databodytemperature.panelPrincipal = false
              this.databodytemperature.panelResults = true
              this.databodytemperature.battery = resData.data[dataVal].data
              this.databodytemperature.batteryName = resData.data[dataVal].measure
              this.databodytemperature.batteryShow = true
              break;
            case "bodytemp":
              this.databodytemperature.panelPrincipal = false
              this.databodytemperature.panelResults = true
              this.databodytemperature.tempCorp = resData.data[dataVal].value
              this.databodytemperature.tempCorpName = resData.data[dataVal].measure
              this.databodytemperature.tempCorpShow = true
              this.execProcess = false
              EventBus.examEmExec = false
              break;
            default:
              break;
          }
        }
      } else {
        // console.log('Receive error', data)
        this.$notifications.notify({
          message: '<h4>' + data.data + '</h4>',
          icon: 'ti-bell',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'warning'
        })
        this.databodytemperature = {
          panelPrincipal: true,
          panelResults: false,
          battery: 0,
          batteryName: '',
          batteryShow: false,
          tempCorp: 0,
          tempCorpName: '',
          tempCorpShow: false
        }
        this.databodytemperature.battery = 0
        this.tempCorp = 0
        this.execProcess = false
        EventBus.examEmExec = false
      }
    },
    /**
     * TODO: Recebe do socket os dados finais da medição
     */
    bleExecFimPress: function(data) {
      let resData = data
      if (resData.status === true) {
        for (let dataVal in resData.data) {
          switch (resData.data[dataVal].tag) {
            case "systolic":
              this.dataPressArt.panelPrincipal = false
              this.dataPressArt.panelResults = true
              this.dataPressArt.val = 0
              this.dataPressArt.pressmax = resData.data[dataVal].value
              this.dataPressArt.pressmaxName = resData.data[dataVal].measure
              this.dataPressArt.pressmaxShow = true
              break;
            case "diastolic":
              this.dataPressArt.panelPrincipal = false
              this.dataPressArt.panelResults = true
              this.dataPressArt.val = 0
              this.dataPressArt.pressmin = resData.data[dataVal].value
              this.dataPressArt.pressminName = resData.data[dataVal].measure
              this.dataPressArt.pressminShow = true
              break;
            case "pulse":
              this.dataPressArt.panelPrincipal = false
              this.dataPressArt.panelResults = true
              this.dataPressArt.val = 0
              this.dataPressArt.pulso = resData.data[dataVal].value
              this.dataPressArt.pulsoName = resData.data[dataVal].measure
              this.dataPressArt.pulsoShow = true
              break;
            default:
              break;
          }
        }
      } else {
        // console.log('Receive error', data)
        this.$notifications.notify({
          message: '<h4>' + data.data + '</h4>',
          icon: 'ti-bell',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'warning'
        })
        this.dataPressArt = {
          panelPrincipal: true,
          panelResults: false,
          val: 0,
          max: 100,
          pulso: 0,
          pulsoName: '',
          pulsoShow: false,
          pressmax: 0,
          pressmaxName: '',
          pressmaxShow: false,
          pressmin: 0,
          pressminName: '',
          pressminShow: false
        }
      }
      this.execProcess = false
      EventBus.examEmExec = false
    },
    /**
     * TODO: Recebe do socket as mensagens
     */
    bleMsg: function(data) {
      // console.log('BleMsg', data)
      if (data.status === true) {
        this.$notifications.notify({
          message: '<h4>' + data.data + '</h4>',
          icon: 'ti-info',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'success'
        })
      } else {
        // console.log('Receive error', data)
        this.$notifications.notify({
          message: '<h4>' + data.data + '</h4>',
          icon: 'ti-bell',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'warning'
        })
        this.execProcess = false
        EventBus.examEmExec = false
      }
    },
    /**
     * TODO: Recebe do socket os dasos da execução do processode medição da pressão arterial
     */
    bleExec: function(data) {
      // console.log('bleExec', data)
      if (data.status === true) {
        var val = data.data
        // console.log('bleExec', data, val.replace(/\D/g, ''))
        if (val.length < 5) {
          this.dataPressArt.val = val.replace(/\D/g, '')
        }
      } else {
        // console.log('Receive error', data)
        this.$notifications.notify({
          message: '<h4>' + data.data + '</h4>',
          icon: 'ti-bell',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'warning'
        })
        this.execProcess = false
        EventBus.examEmExec = false
      }
    },
    /**
     * TODO: Recebe do socket os erros na execução do processo de medição da pressão arterial
     */
    bleError: function(data) {
      // console.log('error', data)
      this.$notifications.notify({
        message: '<h4>' + data.data + '</h4>',
        icon: 'ti-close',
        horizontalAlign: 'right',
        verticalAlign: 'top',
        type: 'danger'
      })
      this.execProcess = false
      EventBus.examEmExec = false
    }
  },
  methods: {
    bleGetListExam(btnPatient) {
      this.patientId = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.id
      this.posPatientSelected = EventBus.currentActiveRightComp
      let self = this
      // console.log('Teste ok list', this.patientId)
      this.$http
        .get('/api/patient/exames/' + this.patientId)
        .then(response => {
          if (response.data.status === true) {
            let devacesArray = response.data.data
            if (devacesArray.length > 0) {
              for (let index = 0; index < devacesArray.length; index++) {
                let btnopt = ''
                switch (devacesArray[index].device) {
                  case 'bloodpressure':
                    this.btns[0].nome = devacesArray[index].name
                    btnopt = this.btns[0]
                    break
                  case 'bodytemperature':
                    this.btns[1].nome = devacesArray[index].name
                    btnopt = this.btns[1]
                    break
                  case 'bodypulse':
                    this.btns[2].nome = devacesArray[index].name
                    btnopt = this.btns[2]
                    break
                  case 'bodyscale':
                    this.btns[3].nome = devacesArray[index].name
                    btnopt = this.btns[3]
                    break
                  case 'bloodglucose':
                    this.btns[4].nome = devacesArray[index].name
                    btnopt = this.btns[4]
                    break
                  case 'bandfitness':
                    this.btns[5].nome = devacesArray[index].name
                    btnopt = this.btns[5]
                    break
                  default:
                    break
                }
                if (btnopt !== '') {
                  this.btnExams.push(btnopt)
                }
              }
              this.classEvent = 'control-remote'
              setTimeout(() => {
                EventBus.elementControl = document.getElementsByClassName(this.classEvent)
                EventBus.currentActiveRightComp = 0
                // ativa o novo elemento adiconando a class que simboliza o elemento activo
                let elem = EventBus.elementControl[EventBus.currentActiveRightComp]
                elem.focus()
                elem.classList.add('btn-fill')
                elem.scrollIntoView(false)
                self.examEvent = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.type
                self.examMac = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.addrmac
              }, 10)
            } else {
              this.$refs.DefaultView.setMsg(self.msgUser)
              this.$refs.DefaultView.show()
              this.$notifications.notify({
                message: '<h4>Sem Exames atribuidos.</h4>',
                icon: 'ti-bell',
                horizontalAlign: 'right',
                verticalAlign: 'top',
                type: 'info'
              })
            }
          } else {
            console.log('erro', response.data)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    bleExecExam() {
      this.execProcess = true
      EventBus.examEmExec = true
      this.resetValues()
      this.$http
        .get('/api/ble/' + this.examEvent.toLowerCase() + '/' + this.patientId)
        .then(response => {
          if (response.data.status === true) {
            document.getElementsByClassName(this.examEvent)[0].scrollIntoView(false)
            this.$notifications.notify({
              message: '<h4>' + response.data.data + '</h4>',
              icon: 'ti-check',
              horizontalAlign: 'right',
              verticalAlign: 'top',
              type: 'success'
            })
          } else {
            this.$notifications.notify({
              message: '<h4>' + response.data.data + '</h4>',
              icon: 'ti-bell',
              horizontalAlign: 'right',
              verticalAlign: 'top',
              type: 'warning'
            })
            this.execProcess = false
            EventBus.examEmExec = false
          }
        })
        .catch(error => {
          console.log('----> ', error)
          this.data = error
        })
    },
    getAge(dateString) {
      var today = new Date()
      var birthDate = new Date(dateString)
      var age = today.getFullYear() - birthDate.getFullYear()
      var m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      return age
    },
    /**
     * TODO: Limpa todas as variaveis que contenham valores que são apresentados na pagina
     */
    resetValues() {
      this.dataBodyScale = {
        panelPrincipal: true,
        panelResults: false,
        weight: 0,
        weightName: '',
        weightShow: false,
        bodyfat: 0,
        bodyfatName: '',
        bodyfatShow: false,
        bonemass: 0,
        bonemassName: '',
        bonemassShow: false,
        musclemass: 0,
        musclemassName: '',
        musclemassShow: false,
        visceralfat: 0,
        visceralfatName: '',
        visceralfatShow: false,
        water: 0,
        waterName: '',
        waterShow: false,
        calories: 0,
        caloriesName: '',
        caloriesShow: false
      }
      this.dataPressArt = {
        panelPrincipal: true,
        panelResults: false,
        val: 0,
        max: 100,
        pulso: 0,
        pulsoName: '',
        pulsoShow: false,
        pressmax: 0,
        pressmaxName: '',
        pressmaxShow: false,
        pressmin: 0,
        pressminName: '',
        pressminShow: false
      }
      this.dataBandFitness = {
        panelPrincipal: true,
        panelResults: false,
        heartrate: {
          heartrateArr: [],
          heartrateavg: 0,
          heartrateavgName: '',
          heartrateavgShow: false
        },
        steps: {
          steps: 0,
          stepsName: '',
          stepsShow: false,
          meters: 0,
          metersName: '',
          metersShow: false,
          callories: 0,
          calloriesName: '',
          calloriesShow: false
        },
        batterystatus: {
          battery_level: 0,
          battery_levelName: '',
          battery_levelShow: false,
          last_time_full: 0,
          last_time_charged: 0,
          charge_cycles: 0,
          status: 0
        },
        time: {
          day: 0,
          month: 0,
          year: 0,
          hour: 0,
          minute: 0,
          second: 0
        },
        softwarerevision: '',
        hardwarerevision: '',
        serialnumber: '',
        devicename: ''
      }
      this.databodytemperature = {
        panelPrincipal: true,
        panelResults: false,
        battery: 0,
        batteryName: '',
        batteryShow: false,
        tempCorp: 0,
        tempCorpName: '',
        tempCorpShow: false
      }
      this.databodypulse = {
        panelPrincipal: true,
        panelResults: false,
        spoVal: 0,
        spoValName: '',
        spoValShow: false,
        pulseVal: 0,
        pulseValName: '',
        pulseValShow: false
      }
      this.databloodglucose = {
        panelPrincipal: true,
        panelResults: false,
        battery: 0,
        batteryName: '',
        batteryShow: false,
        glucose: 0,
        glucoseName: '',
        glucoseShow: false
      }
    },
    /**
     * TODO: Metodo para controlar os eventos do comando remoto quando esta é a view ativa no momento
     */
    controlEventsBus() {
      var self = this
      /**
       * TODO: Monitorização dos eventos do controlo remoto
       */
      EventBus.$on('move-components', function(cmd) {
        if (!self.execProcess) {
          EventBus.elementControl = document.getElementsByClassName(self.classEvent)
          if (EventBus.elementControl.length === 0) {
            EventBus.setSidebar()
          }
          switch (cmd) {
            // evento do 'OK'
            case 'ok_btn':
              EventBus.elementControl[EventBus.currentActiveRightComp].classList.add('on-shadow')
              EventBus.elementControl[EventBus.currentActiveRightComp].click()
              self.$refs.DefaultView.hide()
              if (!self.posPatientSelected >= 0) {
                document.getElementsByClassName('btnsExams')[0].scrollIntoView(false)
              }
              break
            // evento para sair para a sidebar ou para a lista anterior
            case 'exit':
              // iniicializa a variavel para selecionar a lsta do user
              self.classEvent = 'control-remote-patient'
              // se existir um user selecionado é porque se está na lista dos equipamentos
              if (self.posPatientSelected >= 0) {
                // Constroi a lista com os elementos da class dos users
                EventBus.elementControl = document.getElementsByClassName(self.classEvent)
                // Atualiza para elemento anteriormente ativo
                EventBus.currentActiveRightComp = self.posPatientSelected
                // limpa a variavel para saber que se voltar a carregar para sair e voltar para a barra lateral.
                self.posPatientSelected = -1
                let elem = EventBus.elementControl[EventBus.currentActiveRightComp]
                elem.focus()
                elem.classList.add('btn-fill')
              } else {
                // remove o preenchimento
                EventBus.elementControl[EventBus.currentActiveRightComp].classList.remove('btn-fill')
                EventBus.elementControl[EventBus.currentActiveRightComp].classList.remove('on-shadow')
                EventBus.elementControl[EventBus.currentActiveRightComp].blur()
                self.$refs.DefaultView.setMsg(self.msgExit)
                self.$refs.DefaultView.show()
                EventBus.setSidebar()
              }
              // apaga a opção de exame selecionada
              self.examEvent = ''
              self.examMac = ''
              // desloca a div para o inicio
              document.getElementsByClassName('btnUsers')[0].scrollIntoView(false)
              // limpa a lisa dos botões disponiveis para o user
              self.btnExams = []
              self.resetValues()
              self.$refs.DefaultView.setMsg(self.msgUser)
              self.$refs.DefaultView.show()
              console.log('if exit', cmd, EventBus.currentActiveRightComp)
              break
            case 'right': // tecla para a direita
            case 'left': // tecla para a esquerda
              EventBus.elementControl[EventBus.currentActiveRightComp].classList.remove('on-shadow')
              if (self.posPatientSelected >= 0) {
                document.getElementsByClassName('btnsExams')[0].scrollIntoView(false)
              } else {
                document.getElementsByClassName('btnUsers')[0].scrollIntoView(false)
              }
              EventBus.moveLeftRightInView(cmd === 'left' ? -1 : 1)
              if (self.posPatientSelected >= 0) {
                self.examEvent = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.type
                self.examMac = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.addrmac
              } else {
                self.$refs.DefaultView.setMsg(self.msgUser)
                self.$refs.DefaultView.show()
              }
              break
            default:
              break
          }
        }
      })
    }
  },
  created() {
    // Consulta o DOM HTML por todos os elemento pertencentes à class 'control-remote'
    this.controlEventsBus()
  },
  mounted() {
    this.$refs.DefaultView.setMsg(this.msgExit)
    this.$refs.DefaultView.show()
  },
  beforeCreate() {
    this.$http
      .get('/api/patient/getAll')
      .then(response => {
        let data = response.data.data
        for (var index in data) {
          this.patientsList.push({
            name: data[index].name,
            id: data[index].id
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  /**
   * TODO: Destroi o evento das teclas do comando para esta view
   */
  beforeDestroy() {
    EventBus.$off('move-components')
  }
}
</script>
<style>
.blink-results .results-val .card {
  border-radius: 20px;
  border-width: 4px;
  border-style: solid;
  border-color: #f7931d;
  background-color: white;
  animation: blinker 3s linear infinite;
}

.results-val div, .results-val div p, .results-val p {
  background-color: transparent;
}

.results-val .numbers p {
  font-size: 0.7em;
  white-space: pre-line;
}

.results-val .numbers {
  padding-right: 10px;
}

@keyframes blinker {
  0% {
    background-color: white;
  }
  50% {
    background-color: #f05a28;
  }
}
#loader-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background-color: #000000;
  opacity: 0.5;
  filter: alpha(opacity=50); /* For IE8 and earlier */
}
#loader {
  display: block;
  position: relative;
  left: 50%;
  top: 50%;
  width: 30px;
  height: 30px;
  margin: -150px 0 0 -150px;
  z-index: 1500;
}
#loader-chart {
  display: block;
  position: relative;
  left: 50%;
  top: 50%;
  width: 600px;
  height: 600px;
  margin: -300px 0 0 -300px;
  z-index: 1500;
}
.clear-margin {
  margin: 0 !important;
}
.clear-padding > div {
  padding: 0 !important;
}
.clear-padding {
  border-radius: 20px !important;
}
.btnUsers .btn-fill, .btnsExams .btn-fill {
  box-shadow: 3px 3px 10px black;
}
.on-shadow {
  box-shadow: 3px 3px 10px black inset;
}
body {
  overflow-x: hidden;
}
.img-fit {
  width: 100%;
  height: auto;
}
.text-div-wrap {
  white-space: pre-line;
}
</style>
