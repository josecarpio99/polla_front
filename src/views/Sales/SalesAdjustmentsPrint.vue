<template>
  <div class="p-2" v-if="sales.ticketPrice">
    <p>{{ $dayjs().format("DD-MM-YYYY hh:mm a") }}</p>
    <p>POLLA HIPICA</p>
    <span class="block leading-3">{{ new String("-").repeat(34) }}</span>
    <div class="">
      <label class="w-3/6 mr-2" for="">Pollas vendidas:</label>
      <span class="w-3/6 text-right">{{ sales.ticketsCount }}</span>
    </div>
    <div class="">
      <label class="w-3/6 mr-2" for="">Precio de la polla:</label>
      <span class="w-3/6 text-right">${{ sales.ticketPrice }}</span>
    </div>
    <div class="">
      <label class="w-3/6 mr-2" for="">Monto total vendido:</label>
      <span class="w-3/6 text-right">${{ sales.totalSell }}</span>
    </div>
    <div class="">
      <label class="w-3/6 mr-2" for="">% Vendedor({{ sales.systemPercentage }}%):</label>
      <span class="w-3/6 text-right">${{ sales.sellerAmount }}</span>
    </div>
    <div class="">
      <label class="w-3/6 mr-2" for="">Entregar a banca:</label>
      <span class="w-3/6 text-right">${{ sales.deliverToBank }}</span>
    </div>
    <div class="hidden-print mt-5">
      <button @click="print" class="bg-gray-300 py-1 px-3 rounded">
        Imprimir
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch, ref } from "vue";
import { useRoute } from "vue-router";
import store from "../../store";

const route = useRoute();
const sales = ref({});
const selectedPlay = ref(null);
const selectedUser = ref(null);

onMounted(() => {
  getSales();
});

function getSales() {
  if (route.params.playId && route.params.userId) {
    store
      .dispatch("getSalesByUser", {
        playId: route.params.playId ,
        userId: route.params.userId,
      })
      .then((response) => {
        sales.value = response.data;
      });
  } else {
    if (route.params.playId) {
      store.dispatch("getSales", route.params.playId).then((response) => {
        sales.value = response.data;
      });
    }
  }
}

function print() {
  window.print();
}
</script>


<style scoped>
* {
  font-size: 12px;
  font-family: "Times New Roman";
}

@media print {
  .hidden-print,
  .hidden-print * {
    display: none !important;
  }
}
</style>