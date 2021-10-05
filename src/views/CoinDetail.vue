<template>
  <div class="flex-col">
    <bounce-loader
      class="mt-4 mx-auto"
      :loading="isLoading"
      :color="'#69d391'"
    />

    <template v-if="!errors.asset">
      <template v-if="!isLoading">
        <div class="flex flex-col sm:flex-row justify-around items-center">
          <div class="flex flex-col items-center">
            <img
              :src="`https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`"
              :alt="asset.name"
              class="w-20 h-20 mr-5"
            />
            <h1 class="text-5xl">
              {{ asset.name }}
              <small class="sm:mr-2 text-gray-500">{{ asset.symbol }}</small>
            </h1>
          </div>

          <div class="my-10 flex flex-col">
            <ul>
              <li class="flex justify-between">
                <b class="text-gray-600 mr-10 uppercase">Ranking</b>
                <span>#{{ asset.rank }}</span>
              </li>
              <li class="flex justify-between">
                <b class="text-gray-600 mr-10 uppercase">Precio actual</b>
                <span> {{ asset.priceUsd | dollar }} </span>
              </li>
              <li class="flex justify-between">
                <b class="text-gray-600 mr-10 uppercase">Precio más bajo</b>
                <span> {{ min | dollar }} </span>
              </li>
              <li class="flex justify-between">
                <b class="text-gray-600 mr-10 uppercase">Precio más alto</b>
                <span> {{ max | dollar }} </span>
              </li>
              <li class="flex justify-between">
                <b class="text-gray-600 mr-10 uppercase">Precio Promedio</b>
                <span> {{ avg | dollar }} </span>
              </li>
              <li class="flex justify-between">
                <b class="text-gray-600 mr-10 uppercase">Variación 24hs</b>
                <span>{{ asset.changePercent24Hr | percent }}</span>
              </li>
            </ul>
          </div>

          <div
            class="my-10 ml-10 sm:mt-0 flex flex-col justify-center text-center"
          >
            <button
              class="
                bg-green-500
                hover:bg-green-700
                text-white
                font-bold
                py-2
                px-4
                rounded
              "
              @click="changeConvert"
            >
              {{ fromUsd ? `USD a ${asset.symbol}` : `${asset.symbol} a USD` }}
            </button>

            <div class="flex flex-row my-5">
              <label class="w-full" for="convertValue">
                <input
                  id="convertValue"
                  type="number"
                  class="
                    text-center
                    bg-white
                    focus:outline-none focus:shadow-outline
                    border border-gray-300
                    rounded-lg
                    py-2
                    px-4
                    block
                    w-full
                    appearance-none
                    leading-normal
                  "
                  v-model="convertValue"
                />
              </label>
            </div>

            <span class="text-xl">
              {{ convertResult }} {{ fromUsd ? asset.symbol : "USD" }}
            </span>
          </div>
        </div>

        <line-chart
          v-if="!errors.history"
          class="my-4"
          :colors="['orange']"
          :min="min"
          :max="max"
          :data="
            history.map((h) => [h.date, parseFloat(h.priceUsd).toFixed(2)])
          "
        />
        <small v-else> Error al cargar la grafica. 📉 </small>

        <h3 class="text-xl my-10 font-semibold">Mejores Ofertas de Cambio</h3>
        <table class="mb-4" v-if="!errors.markets">
          <tr
            v-for="m in markets"
            :key="`${m.exchangeId}-${m.priceUsd}`"
            class="border-b"
          >
            <td>
              <b>{{ m.exchangeId }}</b>
            </td>
            <td>{{ m.priceUsd | dollar }}</td>
            <td>{{ m.baseSymbol }} / {{ m.quoteSymbol }}</td>
            <td>
              <px-button
                :isLoading="m.isLoading || false"
                v-if="!m.url"
                @custom-click="getWebSite(m)"
              >
                Obtner Link
              </px-button>
              <a
                v-else
                class="hover:underline text-green-600 cursor-pointer"
                target="_blanck"
                :href="m.url"
              >
                {{ m.url }}
              </a>
            </td>
          </tr>
        </table>
        <small v-else> Error al cargar las ofertas. ༼ つ ◕_◕ ༽つ </small>
      </template>
    </template>
    <template v-else>
      <h1 class="text-gray-700 text-6xl text-center">Error 404</h1>
      <p class="text-gray-600 text-xl text-center">
        Error al realizar la petición, inténtelo nuevamente. Gracias.
      </p>
      <img
        src="https://i.pinimg.com/564x/26/b8/84/26b8840bf90d9f66ebe9f48c458ff9d1.jpg"
        alt="error al realizar la peticion"
        class="w-1/2 mx-auto"
      />
    </template>
  </div>
</template>

<script>
import api from "@/services/api.js";
import PxButton from "@/components/PxButton";

export default {
  name: "CoinDetail",

  components: { PxButton },

  data() {
    return {
      isLoading: false,
      asset: {},
      history: [],
      markets: [],
      errors: {
        history: false,
        markets: false,
      },
      fromUsd: true,
      convertValue: 0,
    };
  },

  methods: {
    async getCoin() {
      this.isLoading = true;
      this.errors.asset = false;
      this.errors.history = false;
      this.errors.markets = false;

      const id = this.$route.params.id;
      const resAsset = await api.getAssetByCoin(id);
      const resHistory = await api.getAssetHistory(id);
      const resMarkets = await api.getMarkets(id);

      if (!resAsset.error) {
        this.asset = resAsset.data;
      } else {
        this.errors.asset = true;
        this.asset = {};
      }
      if (!resHistory.error) {
        this.history = resHistory.data;
      } else {
        this.errors.history = true;
        this.history = [];
      }
      if (!resMarkets.error) {
        this.markets = resMarkets.data;
      } else {
        this.errors.markets = true;
        this.markets = [];
      }

      this.isLoading = false;
    },

    async getWebSite(exchage) {
      this.$set(exchage, "isLoading", true);

      const res = await api.getExchange(exchage.exchangeId);
      if (!res.error) {
        this.$set(exchage, "url", res.data.exchangeUrl);
      } else {
        this.$set(exchage, "url", "Error al consultar la URL");
        setTimeout(() => {
          this.$set(exchage, "url", false);
        }, 5000);
      }

      this.$set(exchage, "isLoading", false);
    },

    changeConvert() {
      this.fromUsd = !this.fromUsd;
    },
  },

  computed: {
    min() {
      return this.history.length > 0
        ? Math.min(
            ...this.history.map((a) => parseFloat(a.priceUsd).toFixed(2))
          )
        : 0;
    },
    max() {
      return this.history.length > 0
        ? Math.max(
            ...this.history.map((a) => parseFloat(a.priceUsd).toFixed(2))
          )
        : 0;
    },
    avg() {
      return this.history.length > 0
        ? Math.abs(
            ...this.history.map((a) => parseFloat(a.priceUsd).toFixed(2))
          )
        : 0;
    },
    convertResult() {
      if (!this.convertValue) {
        return 0;
      }

      const result = this.fromUsd
        ? this.convertValue / this.asset.priceUsd
        : this.convertValue * this.asset.priceUsd;

      return result.toFixed(4);
    },
  },

  watch: {
    async $route() {
      await this.getCoin();
    },
  },

  async created() {
    await this.getCoin();
  },
};
</script>

<style scoped>
td {
  padding: 10px;
  text-align: center;
}
</style>
