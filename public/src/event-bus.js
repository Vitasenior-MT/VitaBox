import Vue from 'vue';
export const EventBus = new Vue({
  data: {
    scrollInterval: null,
    sidebarName: 'side-bar',
    currentComponent: 'side-bar',
    correntRightComponent: '',
    currentActiveRightComp: 0,
    firstRightEvent: true,
    scrollScreen: function(el) {
      let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      let elemPos = el.getBoundingClientRect()
      let step = 15

      if ((elemPos.top + elemPos.height) > height) {
        // this.scrollAnimate(step, window.scrollY + elemPos.height)
        this.scrollAnimate(step, window.scrollY + elemPos.top - 50)
      }
      if (elemPos.top < 0) {
        this.scrollAnimate(step * -1, window.scrollY + elemPos.top - 20)
      }
    },
    scrollAnimate: function(scrollStep, limit) {
      console.log("Receive", scrollStep, limit)
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
