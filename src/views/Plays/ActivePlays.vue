<template>
  <div class="flex items-center justify-between mb-3">
    <h1 class="text-3xl font-semibold">Jugadas activas</h1>    
  </div>
  <div class="bg-white p-4 rounded-lg shadow animate-fade-in-down">
    <Spinner
      v-if="plays.loading"
      class="
        absolute
        left-0
        top-0
        bg-white
        right-0
        bottom-0
        flex
        items-center
        justify-center
      "
    />   
    <ul class="flex flex-col" v-if="plays.data.length > 0">
      <router-link :to="{name: 'app.tickets.create', params: {id: play.id}}" v-for="play of plays.data" :key="play.id" 
      class="border-2 border-red-500 p-3 my-2 font-semibold cursor-pointer rounded-md hover:text-lg hover:bg-gray-100">
        {{ play.raceTrack.name }} {{ $dayjs(play.start_at).format('DD-MM-YYYY') }}
      </router-link>
    </ul>
    <h3 v-else class="font-semibol text-xl">No hay jugadas disponibles</h3>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import store from "../../store";
import Spinner from "../../components/core/Spinner.vue";

const loading = ref(false)
const plays = computed(() => store.state.plays);

onMounted(() => {
  getActivePlays();
})

function getActivePlays() {
  store.dispatch('getPlays', {
    active: true
  })
}

</script>