<template>
  <i :class="`ivu-icon i-icon iconfont icon-${type}`" :style="styles"></i>
  <!-- <i :class="`ivu-icon i-icon icon-${type}`" :style="styles" v-else></i> -->
</template>

<script>
export default {
  name: 'Icons',
  props: {
    type: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: '#5c6b77'
    },
    size: {
      type: Number,
      default: 16
    },
    custom: {
      type: Boolean,
      default: false
    },

  },
  computed: {
    styles() {
      return {
        fontSize: `${this.size}px`,
        color: this.color
      }
    }
  }
}
</script>

<style>
</style>
