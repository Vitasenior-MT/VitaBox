import Vue from 'vue';
export const EventBus = new Vue({
  data: {
    scrollInterval: null,
    sidebarName: 'side-bar',      // nome dabarra lateral
    currentComponent: 'side-bar', // elemeto ativo por defeito é a barra lateral
    correntRightComponent: '',    // elemento ativo do lado direito
    currentActiveRightComp: 0,    // posição do array para o elemento ativo
    firstRightEvent: true,        // validação se é a primeira vez que foi precionado a tecla para a direita para entrar na view
    elementControl: [], // Array com os elemento perencentes à class 'remote-control'
    /**
     * TODO: Função destinada a colocar o elemento activo no momento visivel no ecrã
     * @param {elemento activo} el
     */
    scrollScreen: function(el) {
      // determina a altura do ecrâ disponivel
      let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      // dimensão e posição do elemento passado por parametre
      let elemPos = el.getBoundingClientRect()
      // numero de pixels que o scroll vai deslocar
      let step = 15

      // faz a deslocação do elemento ativo para aparecer no ecrã faz scroll para cima
      if ((elemPos.top + elemPos.height) > height) {
        this.scrollAnimate(step, window.scrollY + elemPos.top - 50)
      }
      // faz a deslocação do elemento ativo para aparecer no ecrã faz scroll para baixo
      if (elemPos.top < 0) {
        this.scrollAnimate(step * -1, window.scrollY + elemPos.top - 20)
      }
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
      // se sim é para sair desta view e ativar a sidebar
      if (this.currentActiveRightComp <= -1 && cmd === -1) {
        this.firstRightEvent = true
        this.currentActiveRightComp = 0
        console.log('if', cmd, this.currentActiveRightComp)
        return
      }
      // ativa o novo elemento adiconando a class que simboliza o elemento activo
      let elem = this.elementControl[this.currentActiveRightComp]
      elem.focus()
      elem.classList.add('btn-fill')
      this.scrollScreen(elem)
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
    }
  }
});
