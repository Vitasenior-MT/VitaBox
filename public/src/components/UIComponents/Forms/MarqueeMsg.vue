
<template>
  <div class="row" v-if="this.marqueeactive">
    <div class="position-title">
      <p class="marquee-title">{{ titleMsg }}</p>
    </div>
    <div class="position-marquee">
      <marquee-tips @interface="marqueeMooveEnd" :speed="speed" :content="contentMsg" :font="'40px'" class="marquee-text" ref="marquee" />
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
      speed: 15,
      contentMsg: '',
      titleMsg: '',
      contents: [],
      contentPos: 0
    }
  },
  beforeMount() {
    MarqueeMsg.event.$on('displaymarqueemsg', (title, text, options) => {
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
  mounted() {
  },
  watch: {
  }
}
</script>
<style>
.position-marquee {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: black;
  opacity: 0.8;
  filter: alpha(opacity=80);
  z-index: 2000;
}
.position-title {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  background-color: #f7931d;
  border-width: 4px;
  border-style: solid;
  border-color: #f05a28;
  opacity: 1;
  filter: alpha(opacity=100);
  z-index: 3000;
}
.marquee-text {
  /* font-size: 4vh; */
  color: white;
}
.marquee-title {
  display: inline;
  padding-left: 5px;
  padding-right: 5px;
  font-size: 30px;
  color: white;
}
</style>
