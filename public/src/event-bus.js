import Vue from 'vue';
export const EventBus = new Vue({
  data: {
    scrollInterval: null,
    sidebarName: 'side-bar',      // nome da barra lateral
    currentComponent: 'side-bar', // elemeto ativo por defeito é a barra lateral
    correntRightComponent: '',    // elemento ativo do lado direito
    currentActiveRightComp: 0,    // posição do array para o elemento ativo
    currentActiveRightCompModal: 0,    // posição do array para o elemento ativo
    firstRightEvent: true,        // validação se é a primeira vez que foi precionado a tecla para a direita para entrar na view
    firstRightEventModal: true,        // validação se é a primeira vez que foi precionado a tecla para a direita para entrar na modal
    elementControl: [],           // Array com os elemento pertencentes a uma class especifica
    elementControlModal: [],           // Array com os elemento perencentes a uma class especifica
    currentLanguage: 'pt',
    flgStartRotation: false,
    flg_sound: true,
    currentSelectedComp: '',
    next: null,
    className: '',
    collapseSidebar: 4.3,
    backupSidebarWidth: 0,
    backupMainPanelWidth: 0,
    backupMovingArrowLeft: 0,
    examEmExec: false             // flag para validação da execução dos exames
  },
  methods: {
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
    audioBasicMode: function(path) {
      if (this.flg_sound) {
        let self = this
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
      }
    },
    removeAudio: function(type) {
      if (type === 'off') {
        console.log(type)
        this.flg_sound = false
        let audio = document.getElementById('audioElem')
        if (audio) {
          audio.pause()
          audio.currentTime = 0
          audio.remove()
          this.$socket.emit('ttsDelete')
        }
      } else {
        this.flg_sound = true
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
    moveLeftRightInView: function(cmd) {
      // primeira vez que se entra nesta view
      if (this.firstRightEvent) {
        cmd = 0
        this.firstRightEvent = false
      }
      // remove a class que sinboliza o elemento ativo
      this.elementControl[this.currentActiveRightComp].classList.remove('btn-fill')
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
      elem.classList.add('btn-fill')
      this.scrollScreen(elem)
    },
    moveLeftRightInModal: function(cmd) {
      // primeira vez que se entra nesta view
      if (this.firstRightEventModal) {
        cmd = 0
        this.firstRightEventModal = false
      }
      // remove a class que sinboliza o elemento ativo
      this.elementControlModal[this.currentActiveRightCompModal].classList.remove('btn-fill')
      this.elementControlModal[this.currentActiveRightCompModal].blur()
      // Actualiza a variavel de controlo do elemento activo
      this.currentActiveRightCompModal += cmd
      // verifica se chegou ao fim do array se sim volta ao principio
      if (this.currentActiveRightCompModal >= this.elementControlModal.length) {
        this.currentActiveRightCompModal = 0
      }
      // verifica se estou na posição '0' e se foi carregado para a esquerda
      // se sim é ir para o fim da lista dos componentes ativos.
      if (this.currentActiveRightCompModal <= -1) {
        this.currentActiveRightCompModal = this.elementControlModal.length - 1
      }
      // ativa o novo elemento adiconando a class que simboliza o elemento activo
      let elem = this.elementControlModal[this.currentActiveRightCompModal]
      elem.focus()
      elem.classList.add('btn-fill')
      this.scrollScreen(elem)
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
    }
  },
  watch: {
    currentComponent: function (value) {
      console.log('chartline', value)
      if (this.sidebarName === value) {
        document.getElementsByClassName('sidebar')[0].style.width = this.backupSidebarWidth
        document.getElementsByClassName('main-panel')[0].style.width = this.backupMainPanelWidth
        document.getElementsByClassName('moving-arrow')[0].style.left = this.backupMovingArrowLeft
      } else {
        this.backupSidebarWidth = document.getElementsByClassName('sidebar')[0].style.width
        this.backupMainPanelWidth = document.getElementsByClassName('main-panel')[0].style.width
        this.backupMovingArrowLeft = document.getElementsByClassName('moving-arrow')[0].style.left
        document.getElementsByClassName('sidebar')[0].style.width = this.collapseSidebar + "%"
        document.getElementsByClassName('main-panel')[0].style.width = (100 - this.collapseSidebar) + "%"
        document.getElementsByClassName('moving-arrow')[0].style.left = (3 * this.collapseSidebar) + "%"
      }
    }
  }
});
