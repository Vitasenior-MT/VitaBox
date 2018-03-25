import Vue from 'vue';
export const EventBus = new Vue({
  data: {
    sidebarName: 'side-bar',
    currentComponent: 'side-bar',
    correntRightComponent: '',
    currentActiveRightComp: 0
  }
});
