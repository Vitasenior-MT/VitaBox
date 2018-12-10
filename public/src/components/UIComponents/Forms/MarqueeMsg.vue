
<template>
  <div class="marquee-element" v-if="this.marqueeactive">
    <div class="position-title">
      <p class="marquee-title">{{ titleMsg }}</p>
    </div>
    <div class="position-marquee">
      <marquee-tips @interface="marqueeMooveEnd" :speed="speed" :content="contentMsg" :font="font" class="marquee-text" ref="marquee" />
    </div>
  </div>
</template>
<script>
import MarqueeMsg from './index'
import MarqueeTips from 'components/UIComponents/Marquee/MarqueeTips.vue'
export default {
  name: 'MarqueeMsg',
  components: {
    MarqueeTips
  },
  data() {
    return {
      marqueeactive: false,
      speed: 20,
      font: '3vw',
      contentMsg: '',
      titleMsg: '',
      contents: [],
      contentPos: 0
    }
  },
  beforeMount() {
    MarqueeMsg.event.$on('displaymarqueemsg', (title, text, options) => {
      if (typeof options === 'object' && options !== null) {
        if (options.speed) {
          this.speed = options.speed
        }
        if (options.fontSize) {
          this.font = options.fontSize
        }
      }
      this.contents.push({
        title: title,
        text: text
      })
      if (!this.marqueeActive()) {
        this.marqueeactive = true
        this.titleMsg = this.contents[this.contentPos].title
        this.contentMsg = this.contents[this.contentPos].text
      }
    })
    MarqueeMsg.event.$on('stopdisplaymarqueemsg', _ => {
      this.marqueeactive = false
      this.contentMsg = ''
      this.titleMsg = ''
      this.contents = []
      this.contentPos = 0
    })
  },
  mounted() {
  },
  methods: {
    marqueeActive() {
      return this.marqueeactive
    },
    marqueeMooveEnd: function() {
      if (this.contentPos < (this.contents.length - 1)) {
        this.contentPos++
      } else {
        this.contentPos = 0
      }
      this.titleMsg = this.contents[this.contentPos].title
      this.contentMsg = this.contents[this.contentPos].text
      this.$refs.marquee.init()
    }
  },
  watch: {
  }
}
</script>
<style>
.marquee-element {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 8%;
  display: flex;
  background-color: black;
  opacity: 0.9;
  filter: alpha(opacity=90);
  z-index: 2000;
}
.position-marquee {
  position: relative;
  flex-direction: column;
  height: 100%;
}
.position-title {
  position: relative;
  display: flex;
  background-color: #f7931d;
  border-width: 4px;
  border-style: solid;
  border-color: #f05a28;
  opacity: 1;
  filter: alpha(opacity=100);
  z-index: 2100;
  height: 100%;
}
.marquee-title {
  display: inline;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 5vh;
  color: white;
}
.marquee-text {
  color: white;
  z-index: 2050;
  height: 100%;
}
</style>
