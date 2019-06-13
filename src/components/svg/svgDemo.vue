<template>
  <div>
    <!-- 说明:1、svg-icon组件已经全局注册,直接使用即可,父子传参通过iconClass,将要使用的svg文件名传给父组件即可;2、svg的处理需要使用svg-sprite-loader,但webpack默认的loader也有对svg的处理,所以需要额外配置webpack对img/icons/svg中的.svg文件的特别处理; -->
    <svg-icon icon-class="time"></svg-icon>
  </div>
</template>
