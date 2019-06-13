import Vue from "vue";
import iView from "iview";

Vue.prototype.$Message = iView.Message;
Vue.prototype.$Message.config({
  duration: 2.5
});
Vue.use(iView);

import "iview/dist/styles/iview.css";
