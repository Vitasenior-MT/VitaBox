<template>
  <div class="row">
    <div class="row btnUsers">
      <div class="col-md-3" v-for="patient in patientsList"  :key='patient.id'>
        <div class="card clear-padding">
          <div class="content">
            <button class="btn btn-block btn-info control-remote-patient" type="button" :data-id="patient.id" v-on:click="bleGetListExam(this)">
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
              class="btn btn-block btn-success control-remote min-height"
              type="button"
              :data-type="btn.type"
              v-on:click="bleExecExam">
              <h1><b :class="btn.icon"></b></h1>
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
                <h4 class="title">{{ $t('diagnosis.user.bloodpressure.title') }}</h4>
                <hr>
                <ol>
                  <h4>
                    <div class="row">
                      <div class="col-md-4 img1_bloodpressure img-border">
                        <figure>
                          <img src='static/img/bloodpressure.png' alt="" class="img-fit2">
                          <h6>{{ $t('diagnosis.user.bloodpressure.fig.0') }}</h6>
                        </figure>
                      </div>
                      <div class="col-md-4 img2_bloodpressure img-border">
                        <figure>
                          <img src='static/img/bloodpressure.gif' alt="" class="img-fit2">
                          <h6 class="text-div-wrap">{{ $t('diagnosis.user.bloodpressure.fig.1') }}</h6>
                        </figure>
                      </div>
                      <div class="col-md-4 img3_bloodpressure img-border">
                        <figure>
                          <img src='static/img/tvremoteok.png' alt="" class="img-fit2">
                          <h6>{{ $t('tooltips.diagnosis.exam.title') }}</h6>
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
            <h5>{{ $t('dictionary.results') }}</h5>
          </div>
          <div class="col-md-12 blink-results">
            <div class="col-md-6 results-val" v-show="dataPressArt.systolicShow">
              <stats-card>
                <div class="icon-big text-center" slot="header">
                  <i class="ti-stats-up"></i>
                  <!-- <hr> -->
                </div>
                <div class="numbers" slot="content">
                  <p>{{dataPressArt.systolicName}} </p>
                  {{dataPressArt.systolic}}
                </div>
                <div class="stats" slot="footer">
                  <h5 class="ajust-last-records">{{ $t('dictionary.lastExecution') }} <i class='ti-calendar'></i> {{dataPressArt.lastsystolictime}}
                   {{ $t('dictionary.result') }} &nbsp;{{dataPressArt.lastsystolic}}</h5>
                </div>
              </stats-card>
            </div>
            <div class="col-md-6 results-val" v-show="dataPressArt.diastolicShow">
              <stats-card>
                <div class="icon-big text-center" slot="header">
                  <i class="ti-stats-down"></i>
                  <!-- <hr> -->
                </div>
                <div class="numbers" slot="content">
                  <p>{{dataPressArt.diastolicName}} </p>
                  {{dataPressArt.diastolic}}
                </div>
                <div class="stats" slot="footer">
                  <h5 class="ajust-last-records">{{ $t('dictionary.lastExecution') }} <i class='ti-calendar'></i> {{dataPressArt.lastdiastolictime}} {{ $t('dictionary.result') }} &nbsp;{{dataPressArt.lastdiastolic}}</h5>
                </div>
              </stats-card>
            </div>
            <div class="col-md-6 results-val" v-show="dataPressArt.pulseShow">
              <stats-card>
                <div class="icon-big text-center" slot="header">
                  <i class="ti-pulse"></i>
                  <!-- <hr> -->
                </div>
                <div class="numbers" slot="content">
                  <p>{{dataPressArt.pulseName}} </p>
                  {{dataPressArt.pulse}}
                </div>
                <div class="stats" slot="footer">
                  <h5 class="ajust-last-records">{{ $t('dictionary.lastExecution') }} <i class='ti-calendar'></i> {{dataPressArt.lastpulsetime}}
                   {{ $t('dictionary.result') }} &nbsp;{{dataPressArt.lastpulse}}</h5>
                </div>
              </stats-card>
            </div>
          </div>
          <div class="col-md-12">
            <h5>{{ $t('dictionary.press_ok') }}</h5>
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
                <h4 class="title">{{ $t('diagnosis.user.bodyscale.title') }}</h4>
                <hr>
                <ol>
                  <h4>
                    <div class="row">
                      <div class="col-md-4 img1_bodyscale img-border">
                        <figure>
                          <img src='static/img/tvremoteok.png' alt="" class="img-fit2">
                          <h6>{{ $t('tooltips.diagnosis.exam.title') }}</h6>
                        </figure>
                      </div>
                      <div class="col-md-4 img2_bodyscale img-border">
                        <img src='static/img/bodyscale.png' alt="" class="img-fit2">
                        <h6>{{ $t('diagnosis.user.bodyscale.fig.0') }}</h6>
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
            <h5>{{ $t('dictionary.results') }}</h5>
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
                <div class="stats" slot="footer">
                  <h5 class="ajust-last-records">{{ $t('dictionary.lastExecution') }} <i class='ti-calendar'></i> {{dataBodyScale.lastweighttime}}
                   {{ $t('dictionary.result') }} &nbsp;{{dataBodyScale.lastweight}}</h5>
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
                <div class="stats" slot="footer">
                  <h5 class="ajust-last-records">{{ $t('dictionary.lastExecution') }} <i class='ti-calendar'></i> {{dataBodyScale.lastcaloriestime}}
                   {{ $t('dictionary.result') }} &nbsp;{{dataBodyScale.lastcalories}}</h5>
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
                <div class="stats" slot="footer">
                  <h5 class="ajust-last-records">{{ $t('dictionary.lastExecution') }} <i class='ti-calendar'></i> {{dataBodyScale.lastwatertime}}
                   {{ $t('dictionary.result') }} &nbsp;{{dataBodyScale.lastwater}}</h5>
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
                <div class="stats" slot="footer">
                  <h5 class="ajust-last-records">{{ $t('dictionary.lastExecution') }} <i class='ti-calendar'></i> {{dataBodyScale.lastmusclemasstime}}
                   {{ $t('dictionary.result') }} &nbsp;{{dataBodyScale.lastmusclemass}}</h5>
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
                <div class="stats" slot="footer">
                  <h5 class="ajust-last-records">{{ $t('dictionary.lastExecution') }} <i class='ti-calendar'></i> {{dataBodyScale.lastbodyfattime}}
                   {{ $t('dictionary.result') }} &nbsp;{{dataBodyScale.lastbodyfat}}</h5>
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
                <div class="stats" slot="footer">
                  <h5 class="ajust-last-records">{{ $t('dictionary.lastExecution') }} <i class='ti-calendar'></i> {{dataBodyScale.lastbonemasstime}}
                   {{ $t('dictionary.result') }} &nbsp;{{dataBodyScale.lastbonemass}}</h5>
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
                <div class="stats" slot="footer">
                  <h5 class="ajust-last-records">{{ $t('dictionary.lastExecution') }} <i class='ti-calendar'></i> {{dataBodyScale.lastvisceralfattime}}
                   {{ $t('dictionary.result') }} &nbsp;{{dataBodyScale.lastvisceralfat}}</h5>
                </div>
              </stats-card>
            </div>
          </div>
          <div class="col-md-12">
            <h5>{{ $t('dictionary.press_ok') }}</h5>
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
                <h4 class="title">{{ $t('diagnosis.user.bodytemperature.title') }}</h4>
                <hr>
                <ol>
                  <h4>
                    <div class="row">
                      <div class="col-md-3">
                        <figure>
                          <img src='static/img/bodytemp.png' alt="" class="img-fit">
                          <figcaption>{{ $t('diagnosis.user.bodytemperature.fig.0') }}</figcaption>
                        </figure>
                      </div>
                      <div class="col-md-4">&nbsp;</div>
                      <div class="col-md-3">
                        <figure>
                          <img src='static/img/bodytemp.gif' alt="" class="img-fit">
                          <figcaption>{{ $t('diagnosis.user.bodytemperature.fig.1') }}</figcaption>
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
            <h5>{{ $t('dictionary.results') }}</h5>
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
                <div class="stats" slot="footer">
                  <h5 class="ajust-last-records">{{ $t('dictionary.lastExecution') }} <i class='ti-calendar'></i> {{databodytemperature.lastbodytemptime}}
                   {{ $t('dictionary.result') }} &nbsp;{{databodytemperature.lastbodytemp}}</h5>
                </div>
              </stats-card>
            </div>
          </div>
          <div class="col-md-12">
            <h5>{{ $t('dictionary.press_ok') }}</h5>
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
                <h4 class="title">{{ $t('diagnosis.user.bodypulse.title') }}</h4>
                <hr>
                <ol>
                  <h4>
                    <div class="row">
                      <div class="col-md-4 img1_bodypulse img-border">
                        <figure>
                          <img src='static/img/tvremoteok.png' alt="" class="img-fit2">
                          <h6>{{ $t('tooltips.diagnosis.exam.title') }}</h6>
                        </figure>
                      </div>
                      <div class="col-md-4 img2_bodypulse img-border">
                        <figure>
                          <img src='static/img/pulse.png' alt="" class="img-fit2">
                          <h6>{{ $t('diagnosis.user.bodypulse.fig.0') }}</h6>
                        </figure>
                      </div>
                      <div class="col-md-4 img3_bodypulse img-border">
                        <figure>
                          <img src='static/img/pulse.gif' alt="" class="img-fit2">
                          <h6>{{ $t('diagnosis.user.bodypulse.fig.1') }}</h6>
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
            <h5>{{ $t('dictionary.results') }}</h5>
          </div>
          <div class="col-md-12 blink-results">
            <div class="col-md-6 results-val" v-show="databodypulse.spo2Show">
              <stats-card>
                <div class="icon-big text-center" slot="header">
                  <i class="fas fa-fire"></i>
                  <!-- <hr> -->
                </div>
                <div class="numbers" slot="content">
                  <p>{{databodypulse.spo2Name}} </p>
                  {{databodypulse.spo2}} %
                </div>
                <div class="stats" slot="footer">
                  <h5 class="ajust-last-records">{{ $t('dictionary.lastExecution') }} <i class='ti-calendar'></i> {{databodypulse.lastspo2time}}
                   {{ $t('dictionary.result') }} &nbsp;{{databodypulse.lastspo2}}</h5>
                </div>
              </stats-card>
            </div>
            <div class="col-md-6 results-val" v-show="databodypulse.pulseShow">
              <stats-card>
                <div class="icon-big text-center" slot="header">
                  <i class="fas fa-heartbeat"></i>
                  <!-- <hr> -->
                </div>
                <div class="numbers" slot="content">
                <p>{{databodypulse.pulseName}} </p>
                {{databodypulse.pulse}} PPM
                </div>
                <div class="stats" slot="footer">
                  <h5 class="ajust-last-records">{{ $t('dictionary.lastExecution') }} <i class='ti-calendar'></i> {{databodypulse.lastpulsetime}}
                   {{ $t('dictionary.result') }} &nbsp;{{databodypulse.lastpulse}}</h5>
                </div>
              </stats-card>
            </div>
          </div>
          <div class="col-md-12">
            <h5>{{ $t('dictionary.press_ok') }}</h5>
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
                <h4 class="title">{{ $t('diagnosis.user.bandfitness.title') }}</h4><hr>
                <ul>
                  <h4>
                    <li class="text-justify text-div-wrap">{{ $t('diagnosis.user.bandfitness.0') }}</li>
                  </h4>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="row" v-show="dataBandFitness.panelResults">
          <div class="col-md-12">
            <h5>{{ $t('dictionary.results') }}</h5>
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
                <div class="stats" slot="footer">
                  <h5 class="ajust-last-records">{{ $t('dictionary.lastExecution') }} <i class='ti-calendar'></i> {{dataBandFitness.steps.laststepstime}}
                   {{ $t('dictionary.result') }} &nbsp;{{dataBandFitness.steps.laststeps}}</h5>
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
                <div class="stats" slot="footer">
                  <h5 class="ajust-last-records">{{ $t('dictionary.lastExecution') }} <i class='ti-calendar'></i> {{dataBandFitness.steps.lastmeterstime}}
                   {{ $t('dictionary.result') }} &nbsp;{{dataBandFitness.steps.lastmeters}}</h5>
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
                <div class="stats" slot="footer">
                  <h5 class="ajust-last-records">{{ $t('dictionary.lastExecution') }} <i class='ti-calendar'></i> {{dataBandFitness.steps.lastcalloriestime}}
                   {{ $t('dictionary.result') }} &nbsp;{{dataBandFitness.steps.lastcallories}}</h5>
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
                <div class="stats" slot="footer">
                  <h5 class="ajust-last-records">{{ $t('dictionary.lastExecution') }} <i class='ti-calendar'></i> {{dataBandFitness.heartrate.lastheartratetime}}
                   {{ $t('dictionary.result') }} &nbsp;{{dataBandFitness.heartrate.lastheartrate}}</h5>
                </div>
              </stats-card>
            </div>
          </din>
          <div class="col-md-12">
            <h5>{{ $t('dictionary.press_ok') }}</h5>
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
                <h4 class="title">{{ $t('diagnosis.user.bloodglucose.title') }}</h4>
                <!-- <h4 class="title">{{ $t('diagnosis.user.databloodglucose.title') }}</h4> -->
                <hr>
                <ol>
                  <h4>
                    <div class="row">
                      <div class="col-md-4 img1_bloodglucose img-border">
                        <figure>
                          <img src='static/img/tvremoteok.png' alt="" class="img-fit2">
                          <h6>{{ $t('tooltips.diagnosis.exam.title') }}</h6>
                        </figure>
                      </div>
                      <div class="col-md-4 img2_bloodglucose img-border">
                        <figure>
                          <img src='static/img/glucometer3.png' alt="" class="img-fit2">
                          <h6 class="text-div-wrap">{{ $t('diagnosis.user.bloodglucose.fig.1') }}</h6>
                        </figure>
                      </div>
                      <div class="col-md-4 img3_bloodglucose img-border">
                        <figure>
                          <img src='static/img/glucometer2.jpg' alt="" class="img-fit2">
                          <h6 class="text-div-wrap">{{ $t('diagnosis.user.bloodglucose.fig.2') }}</h6>
                        </figure>
                      </div>
                    </div>
                  </h4>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div class="row" v-show="databloodglucose.panelResults">
          <div class="col-md-12">
            <h5>{{ $t('dictionary.results') }}</h5>
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
                  <i class="fas fa-tint"></i>
                </div>
                <div class="numbers" slot="content">
                  <p>{{databloodglucose.glucoseName}} </p>
                  {{databloodglucose.glucose}} mg/dl
                </div>
                <div class="stats" slot="footer">
                  <h5 class="ajust-last-records">{{ $t('dictionary.lastExecution') }} <i class='ti-calendar'></i> {{databloodglucose.lastbloodglucosetime}}
                   {{ $t('dictionary.result') }} &nbsp;{{databloodglucose.lastbloodglucose}}</h5>
                </div>
              </stats-card>
            </div>
          </div>
          <div class="col-md-12">
            <h5>{{ $t('dictionary.press_ok') }}</h5>
          </div>
        </div>
      </div>
    </div>
    <div id="loader-wrapper" v-show="execProcess">
      <!-- <div v-show="examEvent == 'bloodpressure'" id="loader-chart">
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
        <h1 class="text-center">{{ $t('dictionary.waiting') }}</h1>
      </div>
      <div v-show="examEvent != 'bloodpressure'" id="loader">-->
      <div v-show="examEvent != 'allExams'" id="loader">
        <h4 class="text-center">
          <img src='static/img/load3_B.gif' alt=''>
        </h4>
        <h1 class="text-center">{{ $t('dictionary.waiting') }}</h1>
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
      flg_once: false,
      msgUser: 'diagnosis.msgUser',
      msgExit: 'diagnosis.msgExit',
      classEvent: 'control-remote-patient',
      posPatientSelected: -1,
      patientsList: [],
      patientId: '',
      index: 0,
      cancel: false,
      btnExams: [],
      // definição do ojecto para medir a pressão arterial
      dataPressArt: {
        id: 'pressArterial-Chart',
        panelPrincipal: true,
        panelResults: false,
        val: 0,
        max: 100,
        pulse: 0,
        pulseName: '',
        pulseShow: false,
        systolic: 0,
        systolicName: '',
        systolicShow: false,
        diastolic: 0,
        diastolicName: '',
        diastolicShow: false,
        lastpulse: '-',
        lastpulsetime: '---',
        lastsystolic: '-',
        lastsystolictime: '---',
        lastdiastolic: '-',
        lastdiastolictime: '---'
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
        caloriesShow: false,
        lastweight: '-',
        lastweighttims: '---',
        lastbodyfat: '-',
        lastbodyfattime: '---',
        lastbonemass: '-',
        lastbonemasstime: '---',
        lastmusclemass: '-',
        lastmusclemasstime: '---',
        lastvisceralfat: '-',
        lastvisceralfattime: '---',
        lastwater: '-',
        lastwatertime: '---',
        lastcalories: '-',
        lastcaloriestime: '---'
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
        tempCorpShow: false,
        lastbodytemp: '-',
        lastbodytemptime: '---'
      },
      // definição do objecto para os dados da pulsiometro
      databodypulse: {
        panelPrincipal: true,
        panelResults: false,
        spo2: 0,
        spo2Name: '',
        spo2Show: false,
        pulse: 0,
        pulseName: '',
        pulseShow: false,
        lastspo2: '-',
        lastspo2time: '---',
        lastpulse: '-',
        lastpulsetime: '---'
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
          heartrateavgShow: false,
          lastheartrate: '-',
          lastheartratetime: '---'
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
          calloriesShow: false,
          lastmeters: '-',
          lastmeterstime: '---',
          lastcalories: '-',
          lastcaloriestime: '---',
          laststeps: '-',
          laststepstime: '---'
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
        glucoseShow: false,
        lastbloodglucose: '-',
        lastbloodglucosetime: '---'
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
    responceBleBlock(data) {
      console.log( 'responceBleBlock: ' + data)
      if (data) {
        this.$http
        .get('/api/settings/updateFlgScreen/' + true)
        .then(response => {})
        .catch(error => {
          console.log('----> ', error)
        })
        this.$modal.show('bleblocked', 'Existe um dispositivo em uso')
        EventBus.bleblocked = true
        EventBus.enterNewElementDefinitions('bleblocked')
        this.execProcess = false
        EventBus.examEmExec = false
      }
    },
    audioPlayer(data) {
      EventBus.soundTTS(data)
    },
    ttsPathSteps: function(path) {
      var self = this
      if (document.getElementById('audioElem')) {
        document.getElementById('audioElem').remove()
      }
      if (document.getElementsByClassName('control-remote btn-fill')[0]) {
        var data = document.getElementsByClassName('img' + (self.index - 1) + '_' + document.getElementsByClassName('control-remote btn-fill')[0].dataset.type)[0]
        console.log('img' + (self.index - 1))
        console.log(document.getElementsByClassName('control-remote btn-fill')[0].dataset.type)
      }
      if (data) {
        data.classList.add('img-border-selected')
        data.classList.remove('img-border')
        EventBus.audioBasicMode('./static/.temp/' + path, () => {
          console.log('audio end next')
          if (!self.cancel) {
            data.classList.remove('img-border-selected')
            data.classList.add('img-border')
            self.audioPlayer2(document.getElementsByClassName('control-remote btn-fill')[0].dataset, self.index)
          } else {
            self.cancel = false
          }
        })
      } else {
        EventBus.audioBasicMode('./static/.temp/' + path, () => {
          if (document.getElementsByClassName('control-remote btn-fill')[0]) {
            if (self.cancel) {
              self.cancel = false
              return
            }
            self.audioPlayer2(document.getElementsByClassName('control-remote btn-fill')[0].dataset, self.index)
          }
        })
      }
    },
    bloodglucoseFim: function(data) {
      let resData = data
      console.log("Glucose val", resData)
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
          glucoseShow: false,
          lastbloodglucose: '-',
          lastbloodglucosetime: '---'
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
          // console.log("band", resData.data[dataVal].tag, resData.data[dataVal])
          switch (resData.data[dataVal].tag) {
            case "steps":
            case "meters":
            case "calories":
              this.dataBandFitness.panelPrincipal = false
              this.dataBandFitness.panelResults = true
              this.dataBandFitness.steps[resData.data[dataVal].tag] = resData.data[dataVal].value
              this.dataBandFitness.steps[resData.data[dataVal].tag + 'Name'] = resData.data[dataVal].measure
              this.dataBandFitness.steps[resData.data[dataVal].tag + 'Show'] = true
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
              this.dataBandFitness.heartrate.heartrateavg = Math.round(resData.data[dataVal].value * 100) / 100
              this.dataBandFitness.heartrate.heartrateavgName = resData.data[dataVal].measure
              this.dataBandFitness.heartrate.heartrateavgShow = true
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
            heartrateavgShow: false,
            lastheartrate: '-',
            lastheartratetime: '---'
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
            calloriesShow: false,
            lastmeters: '-',
            lastmeterstime: '---',
            lastcalories: '-',
            lastcaloriestime: '---',
            laststeps: '-',
            laststepstime: '---'
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
      let read = ''
      if (resData.status === true) {
        if (resData.data.length > 0) {
          this.dataBodyScale.panelPrincipal = false
          this.dataBodyScale.panelResults = true
        }
        for (let dataVal in resData.data) {
          // console.log(resData.data[dataVal])
          this.dataBodyScale[resData.data[dataVal].tag] = Math.round(resData.data[dataVal].value * 100) / 100
          this.dataBodyScale[resData.data[dataVal].tag + 'Name'] = resData.data[dataVal].measure
          this.dataBodyScale[resData.data[dataVal].tag + 'Show'] = true
          read += resData.data[dataVal].to_read + ', ' + resData.data[dataVal].value + ' . '
        }
        EventBus.soundTTS(read)
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
          caloriesShow: false,
          lastweight: '-',
          lastweighttims: '---',
          lastbodyfat: '-',
          lastbodyfattime: '---',
          lastbonemass: '-',
          lastbonemasstime: '---',
          lastmusclemass: '-',
          lastmusclemasstime: '---',
          lastvisceralfat: '-',
          lastvisceralfattime: '---',
          lastwater: '-',
          lastwatertime: '---',
          lastcalories: '-',
          lastcaloriestime: '---'
        }
        this.execProcess = false
        EventBus.examEmExec = false
      }
    },
    /**
     * TODO: Recebe do socket toda a informação referente ao pulsiometro
     */
    bleExecFimPulse: function(data) {
      let resData = data
      let read = ''
      if (resData.status === true) {
        for (let dataVal in resData.data) {
          switch (resData.data[dataVal].tag) {
            case "spo2":
            case "pulse":
              this.databodypulse.panelPrincipal = false
              this.databodypulse.panelResults = true
              this.databodypulse[resData.data[dataVal].tag] = resData.data[dataVal].value * 1
              this.databodypulse[resData.data[dataVal].tag + 'Name'] = resData.data[dataVal].measure
              this.databodypulse[resData.data[dataVal].tag + 'Show'] = true
              read += resData.data[dataVal].to_read + ', ' + resData.data[dataVal].value + ' . '
              break;
            default:
              break;
          }
        }
        // console.log('*****************************')
        // console.log(read)
        EventBus.soundTTS(read)
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
          spo2: 0,
          spo2Name: '',
          spo2Show: false,
          pulse: 0,
          pulseName: '',
          pulseShow: false,
          lastspo2: '-',
          lastspo2time: '---',
          lastpulse: '-',
          lastpulsetime: '---'
        }
        this.execProcess = false
        EventBus.examEmExec = false
      }
    },
    /**
     * TODO: Recebe do socket a informação da temperatura corporal
     */
    bleExecFimTemp: function(data) {
      let resData = data
      let read = ''
      if (resData.status === true) {
        for (let dataVal in resData.data) {
          switch (resData.data[dataVal].tag) {
            case "batteryInfo":
              this.databodytemperature.panelPrincipal = false
              this.databodytemperature.panelResults = true
              this.databodytemperature.battery = resData.data[dataVal].data
              this.databodytemperature.batteryName = resData.data[dataVal].measure
              this.databodytemperature.batteryShow = true
              read += resData.data[dataVal].to_read + ', ' + resData.data[dataVal].value + ' . '
              break;
            case "bodytemp":
              this.databodytemperature.panelPrincipal = false
              this.databodytemperature.panelResults = true
              this.databodytemperature.tempCorp = resData.data[dataVal].value * 1
              this.databodytemperature.tempCorpName = resData.data[dataVal].measure
              this.databodytemperature.tempCorpShow = true
              read += resData.data[dataVal].to_read + ', ' + resData.data[dataVal].value + ' . '
              break;
            default:
              break;
          }
        }
        EventBus.soundTTS(read)
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
      let read = ''
      let systolic = ''
      let diastolic = ''
      let pulse = ''
      if (resData.status === true) {
        for (let dataVal in resData.data) {
          switch (resData.data[dataVal].tag) {
            case "systolic":
            case "diastolic":
            case "pulse":
              this.dataPressArt.panelPrincipal = false
              this.dataPressArt.panelResults = true
              this.dataPressArt.val = 0
              this.dataPressArt[resData.data[dataVal].tag] = resData.data[dataVal].value * 1
              this.dataPressArt[resData.data[dataVal].tag + 'Name'] = resData.data[dataVal].measure
              this.dataPressArt[resData.data[dataVal].tag + 'Show'] = true
              if(resData.data[dataVal].tag === 'systolic'){
                systolic = resData.data[dataVal].to_read + ', ' + resData.data[dataVal].value + ' . '
              }
              if(resData.data[dataVal].tag === 'diastolic'){
                diastolic = resData.data[dataVal].to_read + ', ' + resData.data[dataVal].value + ' . '
              }
              if(resData.data[dataVal].tag === 'pulse'){
                pulse = resData.data[dataVal].to_read + ', ' + resData.data[dataVal].value + ' . '
              }
              // read += resData.data[dataVal].to_read + ', ' + resData.data[dataVal].value + ' . '
              // console.log(read);
              break;
            default:
              break;
          }
        }
        EventBus.soundTTS(systolic + diastolic + pulse)
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
          pulse: 0,
          pulseName: '',
          pulseShow: false,
          systolic: 0,
          systolicName: '',
          systolicShow: false,
          diastolic: 0,
          diastolicName: '',
          diastolicShow: false,
          lastpulse: 0,
          lastpulsetime: 0,
          lastsystolic: 0,
          lastsystolictime: 0,
          lastdiastolic: 0,
          lastdiastolictime: 0
        }
        this.execProcess = false
        EventBus.examEmExec = false
      }
    },
    /**
     * TODO: Recebe do socket as mensagens
     */
    bleMsg: function(data) {
      // console.log('BleMsg', data)
      if (data.status === true) {
        if (typeof data.data === 'object') {
          if (data.data.enableApp === true) {
            this.execProcess = false
            EventBus.examEmExec = false
          }
          data.data = data.data.msg
        }
        this.$notifications.notify({
          message: '<h4>' + data.data + '</h4>',
          icon: 'ti-info',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'success'
        })
      } else {
        console.log('Receive error', data)
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
      console.log('error', data)
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
    audioPlayer(dataset) {
      let i = 0
      let text = ''
      if (dataset.type) {
        while (true) {
          if (this.$t('diagnosis.user.' + dataset.type + '.audioDescription.' + i) === 'diagnosis.user.' + dataset.type + '.audioDescription.' + i) {
            text.substring(0, text.length - 1);
            break;
          } else {
            text += this.$t('diagnosis.user.' + dataset.type + '.audioDescription.' + i) + ' '
          }
          i++
        }
      } else {
        text = this.$t('dictionary.press_user')
      }
      EventBus.soundTTS(text)
    },
    audioPlayer2(dataset, index) {
      let text = ''
      if (dataset.type) {
        console.log('debug text: ')
        console.log(this.$t('diagnosis.user.' + dataset.type + '.audioDescription.' + index) === 'diagnosis.user.' + dataset.type + '.audioDescription.' + index)
        if (this.$t('diagnosis.user.' + dataset.type + '.audioDescription.' + index) === 'diagnosis.user.' + dataset.type + '.audioDescription.' + index) {
          text.substring(0, text.length - 1);
        } else {
          text += this.$t('diagnosis.user.' + dataset.type + '.audioDescription.' + index) + ' '
        }
        this.index++
      } else {
        text = this.$t('dictionary.press_user')
      }
      EventBus.soundTTSteps(text)
    },
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
                  /* case 'bandfitness':
                    this.btns[5].nome = devacesArray[index].name
                    btnopt = this.btns[5]
                    break */
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
      this.$http
        .get('/api/settings/updateFlgScreen/' + false)
        .then(response => {})
        .catch(error => {
          console.log('----> ', error)
        })
      EventBus.examEmExec = true
      this.resetValues()
      this.$socket.emit('checkBleBlock')
      this.$http
        .get('/api/ble/' + this.examEvent.toLowerCase() + '/' + this.patientId)
        .then(response => {
          if (response.data.status === true) {
            document.getElementsByClassName(this.examEvent)[0].scrollIntoView(false)
            console.log(response)

            for (let lastsnr in response.data.lastExec.dataSensor) {
              switch (response.data.lastExec.action) {
                case 'bloodpressure':
                  this.dataPressArt['last' + response.data.lastExec.dataSensor[lastsnr].tag] = Math.round(response.data.lastExec.dataSensor[lastsnr].value * 100) / 100
                  this.dataPressArt['last' + response.data.lastExec.dataSensor[lastsnr].tag + 'time'] = EventBus.dateFormat(response.data.lastExec.dataSensor[lastsnr].time)
                  break
                case 'bodytemperature':
                  this.databodytemperature['last' + response.data.lastExec.dataSensor[lastsnr].tag] = Math.round(response.data.lastExec.dataSensor[lastsnr].value * 100) / 100
                  this.databodytemperature['last' + response.data.lastExec.dataSensor[lastsnr].tag + 'time'] = EventBus.dateFormat(response.data.lastExec.dataSensor[lastsnr].time)
                  break;
                case 'bodypulse':
                  this.databodypulse['last' + response.data.lastExec.dataSensor[lastsnr].tag] = Math.round(response.data.lastExec.dataSensor[lastsnr].value * 100) / 100
                  this.databodypulse['last' + response.data.lastExec.dataSensor[lastsnr].tag + 'time'] = EventBus.dateFormat(response.data.lastExec.dataSensor[lastsnr].time)
                  break;
                case 'bodyscale':
                  this.dataBodyScale['last' + response.data.lastExec.dataSensor[lastsnr].tag] = Math.round(response.data.lastExec.dataSensor[lastsnr].value * 100) / 100
                  this.dataBodyScale['last' + response.data.lastExec.dataSensor[lastsnr].tag + 'time'] = EventBus.dateFormat(response.data.lastExec.dataSensor[lastsnr].time)
                  break;
                case 'bloodglucose':
                  this.databloodglucose['last' + response.data.lastExec.dataSensor[lastsnr].tag] = Math.round(response.data.lastExec.dataSensor[lastsnr].value * 100) / 100
                  this.databloodglucose['last' + response.data.lastExec.dataSensor[lastsnr].tag + 'time'] = EventBus.dateFormat(response.data.lastExec.dataSensor[lastsnr].time)
                  break;
                case 'bandfitness':

                  break;
                default:
                  break;
              }
            }
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
        caloriesShow: false,
        lastweight: '-',
        lastweighttims: '---',
        lastbodyfat: '-',
        lastbodyfattime: '---',
        lastbonemass: '-',
        lastbonemasstime: '---',
        lastmusclemass: '-',
        lastmusclemasstime: '---',
        lastvisceralfat: '-',
        lastvisceralfattime: '---',
        lastwater: '-',
        lastwatertime: '---',
        lastcalories: '-',
        lastcaloriestime: '---'
      }
      this.dataPressArt = {
        panelPrincipal: true,
        panelResults: false,
        val: 0,
        max: 100,
        pulse: 0,
        pulseName: '',
        pulseShow: false,
        systolic: 0,
        systolicName: '',
        systolicShow: false,
        diastolic: 0,
        diastolicName: '',
        diastolicShow: false,
        lastpulse: '-',
        lastpulsetime: '---',
        lastsystolic: '-',
        lastsystolictime: '---',
        lastdiastolic: '-',
        lastdiastolictime: '---'
      }
      this.dataBandFitness = {
        panelPrincipal: true,
        panelResults: false,
        heartrate: {
          heartrateArr: [],
          heartrateavg: 0,
          heartrateavgName: '',
          heartrateavgShow: false,
          lastheartrate: '-',
          lastheartratetime: '---'
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
          calloriesShow: false,
          lastmeters: '-',
          lastmeterstime: '---',
          lastcalories: '-',
          lastcaloriestime: '---',
          laststeps: '-',
          laststepstime: '---'
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
        spo2: 0,
        spo2Name: '',
        spo2Show: false,
        pulse: 0,
        pulseName: '',
        pulseShow: false,
        lastspo2: '-',
        lastspo2time: '---',
        lastpulse: '-',
        lastpulsetime: '---'
      }
      this.databloodglucose = {
        panelPrincipal: true,
        panelResults: false,
        battery: 0,
        batteryName: '',
        batteryShow: false,
        glucose: 0,
        glucoseName: '',
        glucoseShow: false,
        lastbloodglucose: '-',
        lastbloodglucosetime: '---'
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
              self.index = 0
              self.cancel = false
              if (document.getElementsByClassName('img-border-selected')[0]) {
                document.getElementsByClassName('img-border-selected')[0].classList.add('img-border')
                document.getElementsByClassName('img-border-selected')[0].classList.remove('img-border-selected')
              }
              // EventBus.elementControl[EventBus.currentActiveRightComp].classList.add('on-shadow')
              EventBus.elementControl[EventBus.currentActiveRightComp].click()
              self.$refs.DefaultView.hide()
              if (!self.flg_once) {
                self.flg_once = true
                // console.log(document.getElementsByClassName('control-remote btn-fill')[0].dataset)
                if (document.getElementsByClassName('control-remote btn-fill')[0]) {
                  self.audioPlayer2(EventBus.elementControl[EventBus.currentActiveRightComp].dataset, 0)
                } else {
                  self.audioPlayer(EventBus.elementControl[EventBus.currentActiveRightComp].dataset)
                }
              }
              if (!self.posPatientSelected >= 0) {
                document.getElementsByClassName('btnsExams')[0].scrollIntoView(false)
              }
              break
            // evento para sair para a sidebar ou para a lista anterior
            case 'exit':
              self.index = 0
              self.cancel = true
              if (document.getElementsByClassName('img-border-selected')[0]) {
                document.getElementsByClassName('img-border-selected')[0].classList.add('img-border')
                document.getElementsByClassName('img-border-selected')[0].classList.remove('img-border-selected')
              }
              EventBus.removeAudio()
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
                // apaga a opção de exame selecionada
                self.examEvent = ''
                self.examMac = ''
                // desloca a div para o inicio
                document.getElementsByClassName('btnUsers')[0].scrollIntoView(false)
                // limpa a lista dos botões dos exames disponiveis do user
                self.btnExams = []
                self.resetValues()
                self.$refs.DefaultView.setMsg(self.msgUser)
                self.$refs.DefaultView.show()
                self.flg_once = false
              } else {
                // remove o preenchimento
                EventBus.elementControl[EventBus.currentActiveRightComp].classList.remove('btn-fill')
                // EventBus.elementControl[EventBus.currentActiveRightComp].classList.remove('on-shadow')
                EventBus.elementControl[EventBus.currentActiveRightComp].blur()
                self.$refs.DefaultView.setMsg(self.msgExit)
                self.$refs.DefaultView.show()
                EventBus.setSidebar()
                // console.log('if exit', cmd, EventBus.currentActiveRightComp)
              }
              break
            case 'right': // tecla para a direita
            case 'left': // tecla para a esquerda
              // EventBus.elementControl[EventBus.currentActiveRightComp].classList.remove('on-shadow')
              self.index = 0
              self.cancel = false
              let moveFirstTime = EventBus.firstRightEvent
              if (cmd === 'left' && EventBus.currentActiveRightComp - 1 < 0) {
                return EventBus.$emit('move-components', 'exit')
              }
              if (document.getElementsByClassName('img-border-selected')[0]) {
                document.getElementsByClassName('img-border-selected')[0].classList.add('img-border')
                document.getElementsByClassName('img-border-selected')[0].classList.remove('img-border-selected')
              }
              EventBus.moveLeftRightInElemts(cmd === 'left' ? -1 : 1, 'btn-fill')
              if (self.posPatientSelected >= 0) {
                document.getElementsByClassName('btnsExams')[0].scrollIntoView(false)
                self.examEvent = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.type
                self.examMac = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.addrmac
              } else {
                document.getElementsByClassName('btnUsers')[0].scrollIntoView(false)
                self.$refs.DefaultView.setMsg(self.msgUser)
                self.$refs.DefaultView.show()
              }
              //if (moveFirstTime) {
              if (document.getElementsByClassName('control-remote btn-fill')[0]) {
                self.audioPlayer2(EventBus.elementControl[EventBus.currentActiveRightComp].dataset, 0)
              } else {
                self.audioPlayer(EventBus.elementControl[EventBus.currentActiveRightComp].dataset)
              }
              //}
              break
            default:
              break
          }
        } else {
          if (cmd === 'exit') {
            self.$http
              .get('/api/ble/cancelExam')
              .then(response => {
                let data = response.data.data
                // console.log("Cancel", data)
                self.$notifications.notify({
                  message: '<h4>' + data + '</h4>',
                  icon: 'ti-bell',
                  horizontalAlign: 'right',
                  verticalAlign: 'top',
                  type: 'warning'
                })
                self.execProcess = false
                EventBus.examEmExec = false
                self.resetValues()
              })
              .catch(error => {
                console.log(error)
              })
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
  background-color: #f05a28;
  color: white;
}

.results-val div,
.results-val div p,
.results-val p {
  background-color: transparent;
}

.results-val .numbers p {
  font-size: 0.7em;
  white-space: pre-line;
}

.results-val .numbers {
  padding-right: 10px;
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
.btnUsers .btn-fill,
.btnsExams .btn-fill {
  box-shadow: 3px 3px 10px black;
}
/* .on-shadow {
  box-shadow: 3px 3px 10px black inset;
} */
body {
  overflow-x: hidden;
}
.img-fit2 {
  width: auto;
  height: 250px; 
  max-width: 100%;
  max-height: 100%;
  margin: auto;
  display: block;
}
.img-border-selected {
  border-style: solid;
  border-color: black;
}
.img-border {
  border-style: solid;
  border-color: rgba(0,0,0,0);
}
.text-div-wrap {
  white-space: pre-line;
}
.ajust-last-records {
  color: white;
  margin: 0 !important;
}
.min-height {
  min-height: 180px;
}
</style>
