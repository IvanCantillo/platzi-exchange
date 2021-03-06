<template>
  <table class="mt-4">
    <thead>
      <tr class="bg-gray-100 border-b-2 border-gray-400">
        <th></th>
        <th :class="{ up: this.sortOrder === 1, down: this.sortOrder === -1 }">
          <span @click="changeSortOrder" class="underline cursor-pointer"
            >Ranking</span
          >
        </th>
        <th>Nombre</th>
        <th>Precio</th>
        <th>Cap. de Mercado</th>
        <th>Variación 24hs</th>
        <td class="hidden sm:block">
          <input
            class="
              bg-gray-100
              focus:outline-none
              border-b border-gray-400
              py-2
              px-4
              block
              w-full
              appearance-none
              leading-normal
            "
            id="filter"
            placeholder="Buscar..."
            type="text"
            v-model="filter"
          />
        </td>
      </tr>
    </thead>
    <tbody v-if="fillteredAssets.length > 0">
      <tr
        class="border-b border-gray-200 hover:bg-orange-100 cursor-pointer"
        v-for="a in fillteredAssets"
        :key="a.id"
      >
        <td>
          <img
            :src="`https://static.coincap.io/assets/icons/${a.symbol.toLowerCase()}@2x.png`"
            :alt="a.name"
          />
        </td>
        <td>
          <b>#{{ a.rank }}</b>
        </td>
        <td>
          <router-link
            class="hover:underline text-green-600"
            :to="{ name: 'coin-detail', params: { id: a.id } }"
          >
            {{ a.name }}
          </router-link>
          <small class="ml-1 text-gray-500"> {{ a.symbol }} </small>
        </td>
        <td>{{ a.priceUsd | dollar }}</td>
        <td>{{ a.marketCapUsd | dollar }}</td>
        <td
          :class="
            a.changePercent24Hr.includes('-')
              ? 'text-red-600'
              : 'text-green-600'
          "
        >
          {{ a.changePercent24Hr | percent }}
        </td>
        <td class="hidden sm:block">
          <px-button @custom-click="goToCoin(a)"> Detalle </px-button>
        </td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr v-show="!error">
        <td colspan="7" align="center">No hay datos. 🤯</td>
      </tr>
      <tr v-show="error">
        <td colspan="7" align="center">Error al traer los datos. 💔</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import PxButton from "@/components/PxButton.vue";

export default {
  components: { PxButton },
  name: "PxAssetsTable",
  props: {
    assets: {
      type: Array,
      default: () => [],
    },
    error: Boolean,
  },

  data() {
    return {
      filter: "",
      sortOrder: 1,
    };
  },

  methods: {
    goToCoin(asset) {
      this.$router.push({ name: "coin-detail", params: { id: asset.id } });
    },

    changeSortOrder() {
      this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    },
  },

  computed: {
    fillteredAssets() {
      const altOrder = this.sortOrder === 1 ? -1 : 1;

      return this.assets
        .filter(
          (a) =>
            a.name.toLowerCase().includes(this.filter.toLowerCase()) ||
            a.symbol.toLowerCase().includes(this.filter.toLowerCase())
        )
        .sort((a, b) =>
          parseInt(a.rank) > parseInt(b.rank) ? this.sortOrder : altOrder
        );
    },
  },
};
</script>

<style scoped>
.up::before {
  content: "👆";
}

.down::before {
  content: "👇";
}

td {
  padding: 20px 0px;
  font-size: 0.8rem;
  text-align: center;
}

th {
  padding: 5px;
  font-size: 0.8rem;
}

@media (min-width: 640px) {
  td,
  th {
    padding: 20px;
    font-size: 1rem;
  }

  th {
    padding: 12px;
  }
}
</style>
