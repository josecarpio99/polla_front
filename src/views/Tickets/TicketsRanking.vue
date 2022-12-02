<template>
  <div class="flex items-center justify-between mb-3">
    <h1 v-if="play.id" class="text-3xl font-semibold">Puntuación: {{ play?.raceTrack?.name }}
      {{ $dayjs(play?.start_at).format("DD-MM-YYYY") }}</h1>  
    <router-link  :to="{name: 'app.plays'}"         
            class="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >     
      Volver
    </router-link>  
  </div>
  <div class="bg-white my-3 p-4 rounded-lg shadow animate-fade-in-down">
    <p class="font-semibold">Total a repartir ({{ play.totalPrizePayout }}$)</p>
    <ul>
      <li class="ml-2" v-for="prize of play.prize">
        {{ prize.position }} Lugar: {{ prize.total }}$
      </li>
    </ul>
    <p class="font-semibold">Premios para cada ganador</p>
    <ul>
      <li class="ml-2" v-for="prize of play.prize">
        {{ prize.position }} Lugar: {{ prize.earned }}$
      </li>
    </ul>
  </div>
  <TicketsRankingTable v-if="play.id" :play="play" />
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import store from "../../store";
import Spinner from "../../components/core/Spinner.vue";
import TicketsRankingTable from "./TicketsRankingTable.vue";

const play = ref({})
const route = useRoute()
const loading = ref(false)

onMounted(() => {
  getPlay();
});

function getPlay() {
  store.dispatch("getPlay", route.params.id).then((response) => {
    play.value = response.data;    
  });
}

</script>