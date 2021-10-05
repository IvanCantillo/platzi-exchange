<template>
  <div>
    <bounce-loader class="mt-4" :loading="isLoading" :color="'#69d391'" />
    <px-assets-table v-if="!isLoading" :assets="assets" :error="error" />
  </div>
</template>

<script>
import PxAssetsTable from "@/components/PxAssetsTable";
import api from "@/services/api.js";

export default {
  name: "Home",
  components: { PxAssetsTable },

  data() {
    return {
      assets: [],
      isLoading: false,
      error: false,
    };
  },

  async created() {
    this.isLoading = true;

    const res = await api.getAssets();

    if (!res.error) {
      this.assets = res.data;
    } else {
      this.error = true;
    }

    this.isLoading = false;
  },
};
</script>
