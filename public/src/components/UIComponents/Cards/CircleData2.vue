<template>
  <div :class="'circle-avg2 img-properties ' + warning">
    <img src="static/img/vitabox/temp.svg">
  </div>
</template>
<script>
export default {
  props: ["warning"],
  name: "circle-data",
  data() {
    return {
      data: "circle-avg2 img-properties warning-card-2",
      properties1: "circle-avg2 img-properties warning-card-2",
      properties2: "circle-avg2 img-properties warning-card-21"
    };
  },
  mounted() {
    this.updateTransition();
  },
  methods: {
    //TODO: adicionar uma opção de cartões ja vistos, onde cada cartão critico ja visto fica sem animação poupando cpu, sendo que os recentes(não vistos) ficam com a animação
    updateTransition() {
      var self = this;
      setInterval(() => {
        Array.prototype.forEach.call(
          document.getElementsByClassName(self.data),
          function(element) {
            element.className === self.properties2
              ? (element.className = self.data = self.properties1)
              : (element.className = self.data = self.properties2);
          }
        );
      }, 5000);
    }
  }
};
</script>
<style>
.img-properties img {
  width: 70%;
  height: 70%;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -35%;
  margin-top: -35%;
}

.circle-avg2 {
  position: relative;
  width: 70% !important;
  height: 0 !important;
  padding-bottom: 50%;
  border-radius: 50%;
}

.warning-card-2 {
  transition-property: border box-shadow;
  transition-timing-function: linear;
  transition-duration: 3s;
  border: 15px solid #cc0000;
  box-shadow: 0 0 10px 5px white;
}

.warning-card-21 {
  transition-property: border box-shadow;
  transition-duration: 3s;
  transition-timing-function: linear;
  border: 15px solid #ff1a1a;
  box-shadow: 0 0 10px 5px #ff1a1a;
}

.warning-card-1 {
  border: 15px solid orangered;
}

.warning-card-0 {
  border: 15px solid green;
}

@keyframes color-me-in {
  0% {
    border: 15px solid #cc0000;
    box-shadow: 0 0 10px 5px white;
  }
  /* Adding a step in the middle */
  50% {
    border: 15px solid #ff1a1a;
    box-shadow: 0 0 10px 5px #ff1a1a;
  }
  100% {
    border: 15px solid #cc0000;
    box-shadow: 0 0 10px 5px white;
  }
}
</style>
