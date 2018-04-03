import Vue from 'vue';
export const EventBus = new Vue({
  data: {
    scrollInterval: null,
    sidebarName: 'side-bar',      // nome dabarra lateral
    currentComponent: 'side-bar', // elemeto ativo por defeito é a barra lateral
    correntRightComponent: '',    // elemento ativo do lado direito
    currentActiveRightComp: 0,    // posição do array para o elemento ativo
    firstRightEvent: true,        // validação se é a primeira vez que foi precionado a tecla para a direita para entrar na view
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
    }
  }
});
