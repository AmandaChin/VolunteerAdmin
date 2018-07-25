<template>
  <div class="slide-show" @mousemove="clearInv" @mouseout="runInv">
      <div class="slide-img">
          <a :href="slides[nowIndex].href">
              <img :src="slides[nowIndex].src">
          </a>
      </div>
      <h2>{{slides[nowIndex].title}}</h2>
      <ul class ="slide-pages">
          <li @click="goto(prevIndex)">&lt;</li>
          <li v-for="(item,index) in slides" @click="goto(index)">
              <a :class="{on:index === nowIndex}">{{index+1}}</a>
          </li>
          <li @click="goto(nextIndex)">&gt;</li>
      </ul>
  </div>
</template>

<script>
export default {
  props: {
    slides: {
      type: Array,
      default: []
    },
    inv: {
      type: Number,
      default: 1500
    }
  },
  data() {
    return {
      nowIndex: 0
    }
  },
  computed: {
    preIndex() {
      if (this.nowIndex === 0) {
        return this.slides.length - 1
      } else {
        return this.nowIndex - 1
      }
    },
    nextIndex() {
      if (this.nowIndex === this.slides.length - 1) {
        return 0
      } else {
        return this.nowIndex + 1
      }
    }
  },
  methods: {
    goto(index) {
      this.nowIndex = index
    },
    runInv() {
      this.invId = setInterval(() => {
        this.goto(this.nextIndex)
      }, this.inv)
    },
    clearInv() {
      clearInterval(this.invId)
    }
  },
  mounted() {
    console.log(this.slides)
    this.runInv()
  }
}
</script>

<style scoped>
img {
    display: inline-block;
    width: 1000px;
    height: 400px;
  }
.slide-show {
    position: relative;
    width: 1000px;
    height: 400px;
    margin: 15px 15px 15px 15px;
    overflow: hidden;
  }
  .slide-img {
    width: 100%;
  }
  .slide-img img {
    width: 100%;
    position: absolute;
    top:0;
  }
  .slide-show h2 {
    position: absolute;
    bottom: 0;
    color: #fff;
    background-color: #000;
    opacity: 0.5;
    text-align: left;
    width: 100%;;
    height: 30px;
    line-height: 30px;
    padding-left: 15px;
  }
  .slide-pages {
    position: absolute;
    bottom: 10px;
    right: 15px;
  }
  .slide-pages li {
    display: inline-block;
    padding: 0 10px;
    cursor: pointer;
    color: #fff;
  }
  .slide-pages li .on {
    text-decoration: underline;
  }
</style>
