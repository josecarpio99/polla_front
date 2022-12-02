<template>
  <div class="p-2" v-if="ticket.id">
    <p>CENTRO DE APUESTAS</p>
    <p class="text-center" style="max-width: 110px">{{ ticket.user.username }}</p>
    <p>{{ $dayjs().format('DD-MM-YYYY hh:mm a') }}</p>
    <p>CI: {{ ticket.client.id_card }}</p>
    <p>Nombre:</p>
    <p>{{ ticket.client.name }}</p>
    <p>SERIAL: {{ ticket.code }}</p>
    <span class="block leading-3">{{ (new String('-')).repeat(29) }}</span>
    <p>POLLA HIPICA</p>
    <span class="block leading-3">{{ (new String('-')).repeat(29) }}</span>
    <p>HIP: {{ play.raceTrack.name.toUpperCase() }}</p>
    <span class="block leading-3">{{ (new String('-')).repeat(29) }}</span>
    <p v-for="pick of ticket.picks" :key="pick.id">
      Carr.{{ pick.race.number }} - Caballo{{ pick.picked }}
    </p>
    <span class="block leading-3">{{ (new String('-')).repeat(29) }}</span>
    <p>Valor Polla: ${{ ticket.price }}</p>
    <span class="block leading-3">{{ (new String('-')).repeat(29) }}</span>
    <br>
    <p>Busca los resultados de tu polla en:</p>
    <p>{{ RANKING_URL }}</p>
    <div class="hidden-print mt-5">
      <button @click="printTicket" class="bg-gray-300 py-1 px-3 rounded">Imprimir</button>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, watch, ref} from "vue";
import {useRoute} from "vue-router";
import store from "../../store";
import {RANKING_URL} from "../../constants";

const route = useRoute();

const play = ref({});
const ticket = ref({});

onMounted(() => {
  getPlay();
  getTicket();
  window.addEventListener('afterprint', (event) => {
    window.close();
  });
})

function getPlay() {
  store.dispatch('getPlay', route.params.playId)
    .then(response => {
      play.value = response.data
    })
}

function getTicket() {
  store.dispatch('getTicket', {
    playId : route.params.playId,
    id : route.params.ticketId,
  })
    .then(response => {
      ticket.value = response.data
    })
}

function printTicket()
{
  window.print();
}

</script>

<style scoped>
* {
  font-size: 12px;
  font-family: 'Times New Roman';  
}

@media print {
    .hidden-print,
    .hidden-print * {
        display: none !important;
    }
}

</style>