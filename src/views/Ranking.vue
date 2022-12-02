<template>
  <div  class="min-h-full bg-gray-200 flex">
    <div class="flex-1">      
      <div class="bg-red-600">
        <img class="object-cover h-48 w-72 mx-auto" src="/assets/img/logo.png" alt="Logo polla tubanca.net">
      </div>
      <main class="p-6">

        <div class="flex flex-wrap gap-3 items-center justify-between my-5">
          <h1 v-if="play.id" class="text-3xl font-semibold">
            Puntuación: {{ play?.raceTrack?.name }} {{ $dayjs(play?.start_at).format("DD-MM-YYYY") }}
          </h1>   
          <div class="flex items-center">
            <label class="mr-2">Jugada:</label>
            <select    
                @change="getPlay(playSelected.id)" 
                v-if="plays.data.length > 0"                 
                v-model="playSelected"                
                class="block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
            >
              <option v-for="play of plays.data" :value="play" :key="play.id">
                {{ play?.raceTrack?.name }} {{ $dayjs(play?.start_at).format("DD-MM-YYYY") }}
              </option>
            </select>
          </div>       
        </div>

        <div class="bg-white my-3 p-4 rounded-lg shadow animate-fade-in-down">
          <h3 class="text-xl my-5 font-semibold">Pollas jugadas: <span class="p-1 px-2 rounded-xl text-white bg-green-700">{{ play.ticketsCount }}</span></h3>
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

      </main>
      <!--      Content-->
    </div>
  </div> 
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import store from "../store";
import Spinner from "../components/core/Spinner.vue";
import TicketsRankingTable from "./Tickets/TicketsRankingTable.vue";

const play = ref({})
const playSelected = ref({})
const plays = computed(() => store.state.plays);
const route = useRoute()
const loading = ref(false)

onMounted(() => {
  getPlays();
});

function getPlay(id) {
  store.dispatch("getPlay", id).then((response) => {
    play.value = response.data;    
  });
}

function getPlays(url = null) {  
  store.dispatch("getPlays", {
    url,    
    per_page: 10,
    sort_field: 'close_at',
    sort_direction: 'desc'
  })
    .then(response => {
      if (plays.value.data.length > 0) {
        playSelected.value = plays.value.data[0]
        getPlay(plays.value.data[0].id)        
      }
    });
}

</script>