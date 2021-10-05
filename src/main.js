import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
import "@/assets/css/tailwind.css";
import { dollarFilter, percentFilter } from "@/helpers/filters.js";

import Chartkick from "vue-chartkick";
import Chart from "chart.js";

Vue.use(Chartkick.use(Chart));
import { VueSpinners } from "@saeris/vue-spinners";

Vue.use(VueSpinners);

Vue.filter("dollar", dollarFilter);
Vue.filter("percent", percentFilter);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  router,
}).$mount("#app");
