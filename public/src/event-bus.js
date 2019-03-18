import Vue from 'vue';
export const EventBus = new Vue({
  data: {
    scrollInterval: null,
    sidebarName: 'side-bar',      // nome da barra lateral
    currentComponent: 'side-bar', // elemeto ativo por defeito é a barra lateral
    correntRightComponent: '',    // elemento ativo do lado direito
    currentActiveRightComp: 0,    // posição do array para o elemento ativo
    firstRightEvent: true,        // validação se é a primeira vez que foi precionado a tecla para a direita para entrar na view
    elementControl: [],           // Array com os elemento pertencentes a uma class especifica
    currentLanguage: 'pt',
    flgStartRotation: false,
    flg_sound: true,
    currentSelectedComp: '',
    next: null,
    className: '',
    collapseSidebar: 4.3,       // tamanho em precentagem que o main painel vai aumentar
    marginPaddingPanel: 9.5,    // Paddin a atribuir para não ficar debaixo do comando de ajuda
    backupMainPanelPadding: 0,  // baackup do padding inicial antes da alteração
    backupSidebarWidth: 0,      // backup do tamanho da sidebar
    backupMainPanelWidth: 0,    // backup da largura do mail panel
    backupMovingArrowLeft: 0,   // backup da posição da seta da sidebar
    settingsData: {},
    examEmExec: false,           // flag para validação da execução dos exames
    settings: false,
    notifications: false,
    warnings: false,
    wifi: false,
    bleblocked: false,
    notificationList: [],     // lista de todas as notificações
    listHistoryElements: [],
    warningList: [],          // lista de warnings
    warningCurrent: -1,
    wifiConnected: false,
    historyElements: ['views']
  },
  methods: {
    cmd(cmd) {
      this.$emit('key-help', cmd)
      if (this.cmdRestritions()) {
        if (this.notifications) {
          if ((cmd === 'ok_btn' || cmd === 'exit')) {
            this.$socket.emit('sendConfirmation', '')
            this.notifications = false
            this.$marqueemsg.hide()
          }
        }
        switch (this.historyElements[this.historyElements.length - 1]) {
          case 'settings':
            if (this.settings) {
              this.$emit('move-components-modal', cmd)
              if (((/* cmd === 'settings' || */ cmd === 'exit') && !this.examEmExec)) {
                // console.log('app settings')
                if (this.settings) {
                  this.settings = false
                  this.$modal.hide('settings')
                  this.enterLastElementDefinitions()
                } /* else {
                  this.settings = true
                  this.enterNewElementDefinitions('settings')
                  this.$modal.show('settings')
                } */
              }
            }
            break;
          case 'wifi-settings':
            if (this.wifi) {
              this.$emit('move-components-wifi-modal', cmd)
              if (cmd === 'exit' && !this.examEmExec) {
                this.wifi = false
                this.$modal.hide('wifi-settings')
                this.enterLastElementDefinitions()
              }
            }
            break;
          case 'bleblocked':
            if (this.bleblocked) {
              // this.$emit('move-components-wifi-modal', cmd)
              if (cmd === 'exit' && !this.examEmExec) {
                this.bleblocked = bleblocked
                this.$modal.hide('bleblocked')
                this.enterLastElementDefinitions()
              }
            }
            break;
          default:
            break;
        }
      } else {
        switch (cmd) {
          case 'up':
            if (this.currentComponent === this.sidebarName) {
              this.$emit('move-sidebar', -1)
            } else {
              if (this.currentComponent !== this.sidebarName) {
                this.$emit('move-components', cmd)
              }
            }
            break;
          case 'down':
            if (this.currentComponent === this.sidebarName) {
              this.$emit('move-sidebar', 1)
            } else {
              if (this.currentComponent !== this.sidebarName) {
                this.$emit('move-components', cmd)
              }
            }
            break;
          case 'right':
            this.currentComponent = this.correntRightComponent
            this.$emit('move-components', cmd)
            break;
          case 'left':
          case 'exit':
            if (this.currentComponent !== this.sidebarName) {
              this.$emit('move-components', cmd)
            }
            break;
          case 'ok_btn':
            if (this.currentComponent === this.sidebarName) {
              this.$emit('move-sidebar', cmd)
            } else {
              this.$emit('move-components', cmd)
            }
            break;
          case 'settings':
            if (!this.examEmExec) {
              if (!this.settings) {
                this.enterNewElementDefinitions('settings')
                this.settings = true
                this.$modal.show('settings')
                setTimeout(() => {
                  this.$emit('move-components-modal', 'down')
                }, 100);
              }
            }
            break;
          default:
            break;
        }
      }
    },
    cmdRestritions() {
      if (this.notifications) {
        return true
      }
      if (this.settings) {
        return true
      }
      if (this.wifi) {
        return true
      }
      if (this.bleblocked) {
        return true
      }
    },
    rotation() {
      if (this.flgStartRotation) {
        if (this.currentActiveRightComp + 1 >= this.elementControl.length) {
          this.next(true)
        } else {
          this.next(false)
        }
      }
    },
    startRotation(next, className) {
      console.log('Auto On ')
      this.elementControl = document.getElementsByClassName(className)
      this.flgStartRotation = true
      this.next = next
      this.className = className
    },
    endRotation() {
      console.log('Auto Off ')
      this.flgStartRotation = false
      this.next = null
      this.className = ''
    },
    soundTTS: function(text) {
      if (this.flg_sound) {
        this.$socket.emit('ttsText', text)
      }
    },
    audioBasicMode: function(path, callback) {
      EventBus.removeAudio()
      let self = this
      console.log(this.flg_sound && !callback)
      if (this.flg_sound && !callback) {
        let audio = document.createElement('audio')
        audio.id = 'audioElem'
        audio.style.display = 'none'
        audio.src = path
        audio.autoplay = true
        audio.onended = function() {
          audio.remove()
          self.$socket.emit('ttsDelete')
          if (self.flgStartRotation) {
            self.rotation()
          }
        };
        document.body.appendChild(audio)
      } else if (callback) {
        let audio = document.createElement('audio')
        audio.id = 'audioElem'
        audio.style.display = 'none'
        audio.src = path
        audio.autoplay = true
        audio.onended = function() {
          audio.remove()
          self.$socket.emit('ttsDelete')
          callback()
        };
        document.body.appendChild(audio)
      }
    },
    removeAudio: function() {
      let audio = document.getElementById('audioElem')
      if (audio) {
        audio.pause()
        audio.currentTime = 0
        audio.remove()
        this.$socket.emit('ttsDelete')
      }
    },
    findOne: function(arr, obj) {
      let i = arr.length
      while (i--) {
        if (arr[i].id === obj.id && arr[i].sensor === obj.sensortype) {
          return arr[i]
        }
      }
      return false
    },
    /**
     * TODO: Function to convert miliseconds into hours, minutes and seconds
     * @param {Hours} h
     * @param {Minutes} m
     * @param {Seconds} s
     */
    timeCalculator: function(h, m, s) {
      let time = 0;
      if (h > 0) {
        time = time + (h * 60 * 60 * 1000)
      }
      if (m > 0) {
        time = time + (m * 60 * 1000)
      }
      if (s > 0) {
        time = time + (s * 1000)
      }
      return time
    },
    /**
     * TODO: Função destinada a colocar o elemento activo no momento visivel no ecrã
     * @param {elemento activo} el
     */
    scrollScreen: function(el) {
      el.scrollIntoView(false)
    },
    /**
     * TODO: Faz o scroll do elemento
     */
    scrollAnimate: function(scrollStep, limit) {
      // console.log("Receive", scrollStep, limit)
      // se o interval ainda estiver ativo é terminado e destruido
      if (this.scrollInterval) {
        clearInterval(this.scrollInterval)
        this.scrollInterval = null
      }
      this.scrollInterval = setInterval(function() {
        if (scrollStep > 0 && window.scrollY <= limit) {
          window.scrollBy(0, scrollStep)
        } else if (scrollStep < 0 && window.scrollY >= limit) {
          window.scrollBy(0, scrollStep)
        } else {
          clearInterval(this.scrollInterval)
        }
      }, 1);
    },
    moveLeftRightInElemts: function(cmd, classInUse) {
      // primeira vez que se entra nesta view
      if (this.firstRightEvent) {
        cmd = 0
        this.firstRightEvent = false
      }
      // remove a class que sinboliza o elemento ativo
      this.elementControl[this.currentActiveRightComp].classList.remove(classInUse)
      this.elementControl[this.currentActiveRightComp].blur()
      // Actualiza a variavel de controlo do elemento activo
      this.currentActiveRightComp += cmd
      // verifica se chegou ao fim do array se sim volta ao principio
      if (this.currentActiveRightComp >= this.elementControl.length) {
        this.currentActiveRightComp = 0
      }
      // verifica se estou na posição '0' e se foi carregado para a esquerda
      // se sim é ir para o fim da lista dos componentes ativos.
      if (this.currentActiveRightComp <= -1) {
        this.currentActiveRightComp = this.elementControl.length - 1
      }
      // ativa o novo elemento adiconando a class que simboliza o elemento activo
      let elem = this.elementControl[this.currentActiveRightComp]
      elem.focus()
      elem.classList.add(classInUse)
      this.scrollScreen(elem)
    },
    enterNewElementDefinitions: function(element) {
      let oldElement = this.historyElements[this.historyElements.length - 1]
      this.historyElements.push(element)
      // console.log("ListHistory add", this.historyElements, element, this.historyElements[this.historyElements.length - 1])
      this.listHistoryElements[oldElement] = {
        firstRightEvent: this.firstRightEvent,
        elementControl: this.elementControl,
        currentActiveRightComp: this.currentActiveRightComp
      }

      this.firstRightEvent = true
      this.elementControl = []
      this.currentActiveRightComp = 0
    },
    enterLastElementDefinitions: function() {
      this.historyElements.pop()
      // console.log("ListHistory remove", this.historyElements)
      let lastElement = this.historyElements[this.historyElements.length - 1]
      this.firstRightEvent = this.listHistoryElements[lastElement].firstRightEvent
      this.elementControl = this.listHistoryElements[lastElement].elementControl
      this.currentActiveRightComp = this.listHistoryElements[lastElement].currentActiveRightComp
    },
    setSidebar() {
      // atribui para que passe a ser novamento a primenra vez que entra nesta view
      this.firstRightEvent = true
      // define como o elemento ativo seja o '0'
      this.currentActiveRightComp = 0
      // define o elemento ativo coomo sendo a barra lateral
      this.currentComponent = this.sidebarName
      // limpa lista dos elementos pertencentes à class
      this.elementControl = []
      // linpa as variaveis guardas devido à alteração da sidebar
      this.listHistoryElements['views'] = {
        firstRightEvent: this.firstRightEvent,
        elementControl: this.elementControl,
        currentActiveRightComp: this.currentActiveRightComp
      }
      return true
    },
    dateFormat(data) {
      let date = new Date(data)
      return (
        date.getFullYear() + '/' +
        (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/' +
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
        ' ' +
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
        ':' +
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':' +
        (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
      )
    },
    smallDateFormat(data) {
      // console.log(data)
      let date = new Date(data)
      return (
        date.getFullYear() /* .toString().substr(2, 2) */ + '/' +
        (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/' +
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
        ' ' +
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
        ':' +
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
      )
    },
    onlyTimeFormat(data) {
      let date = new Date(data)
      return (
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' +
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
      )
    },
    sameDay(dA, dB) {
      let d1 = new Date(dA)
      let d2 = new Date(dB)
      return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
    },
    getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    getTopPos: (el) => {
      for (var topPos = 0; el != null; topPos += el.offsetTop, el = el.offsetParent);
      return topPos;
    },
    getLeftPos: (el) => {
      for (var leftPos = 0; el != null; leftPos += el.offsetLeft, el = el.offsetParent);
      return leftPos;
    }
  },
  watch: {
    currentComponent: function(value) {
      // console.log('chartline', value)
      if (this.sidebarName === value) {
        document.getElementsByClassName('sidebar')[0].style.width = this.backupSidebarWidth
        document.getElementsByClassName('main-panel')[0].style.width = this.backupMainPanelWidth
        document.getElementsByClassName('moving-arrow')[0].style.left = this.backupMovingArrowLeft
        document.getElementsByClassName('main-panel')[0].style.paddingLeft = this.backupMainPanelPadding
        document.getElementsByClassName('main-panel')[0].style.boxShadow = ''
        document.getElementsByClassName('div-project-name')[0].style.visibility = "hidden";
      } else {
        this.backupSidebarWidth = document.getElementsByClassName('sidebar')[0].style.width
        this.backupMainPanelWidth = document.getElementsByClassName('main-panel')[0].style.width
        this.backupMovingArrowLeft = document.getElementsByClassName('moving-arrow')[0].style.left
        this.backupMainPanelPadding = document.getElementsByClassName('main-panel')[0].style.paddingLeft
        document.getElementsByClassName('sidebar')[0].style.width = this.collapseSidebar + "%"
        document.getElementsByClassName('main-panel')[0].style.width = (100 - this.collapseSidebar) + "%"
        document.getElementsByClassName('moving-arrow')[0].style.left = (3 * this.collapseSidebar) + "%"
        document.getElementsByClassName('main-panel')[0].style.paddingLeft = this.marginPaddingPanel + "%"
        document.getElementsByClassName('main-panel')[0].style.boxShadow = 'rgb(221, 221, 221) 1px 0px 0px 0px inset'
        document.getElementsByClassName('div-project-name')[0].style.visibility = "visible";

        document.getElementsByClassName('div-project-name')[0].style.left = this.getLeftPos(document.getElementsByClassName('main-panel')[0]) + "px"
        document.getElementsByClassName('div-project-name')[0].style.width = (0.95 * this.marginPaddingPanel) + "%"
        document.getElementsByClassName('div-project-name')[0].style.height = this.getTopPos(document.getElementsByClassName('img-help')[0]) + "px"
      }
    }
  }
});
