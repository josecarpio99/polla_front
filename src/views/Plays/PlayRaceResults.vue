<template>
  <div class="flex items-center justify-between mb-3">
    <h1 v-if="play.id" class="text-3xl font-semibold">Actualizar resultados: {{ play?.raceTrack?.name }}
      {{ $dayjs(play?.start_at).format("DD-MM-YYYY") }}</h1>  
    <router-link  :to="{name: 'app.plays'}"         
            class="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >     
      Volver
    </router-link>  
  </div>
  <div class="bg-white p-4 rounded-lg shadow animate-fade-in-down">
    <Spinner
      v-if="loading"
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
    <form @submit.prevent="onSubmit">
      <div class="my-2" v-for="(race, index) of play.races" :key="race.id">
        <div class="flex justify-between max-w-xs">
          <label class="font-semibold text-red-500" for="">Carrera {{ race.number }}</label>
          <div class="flex gap-3 items-center">
            <MinusIcon v-if="play.races[index].result.length > 3" @click="removePlace(index)" class="w-6 h-6 border-2 text-gray-700 cursor-pointer" />            
            <PlusIcon @click="addPlace(index)" class="w64 h-6 border-2 text-gray-700 cursor-pointer" />
          </div>
        </div>

        <div class="flex gap-2 mt-2  items-center" v-for="(result, y) of race.result" :key="y + 50">    
          <span class="font-semibold">{{ result.position }} lugar:</span>   
          <span>Número:</span>   
          <select                      
              v-model="play.races[index].result[y].number"              
              class="block w-16 mb-3 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
          >
            <option v-for="(item, j) of numberToArray(race.participants_number)" :value="item" :key="j + 100" :disabled="checkIsRemoved(race.removed, item)">{{item}}</option>
          </select>
          <span>Puntos:</span>
          <select                      
              v-model="play.races[index].result[y].points"              
              class="block w-16 mb-3 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
          >
            <option v-for="(item) of POINTS_OPTIONS">{{item}}</option>
          </select>
        </div>
        <hr>
      </div>
       <div class="mt-5 max-w-sm text-center">
         <button type="submit"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm
                text-white bg-red-600 hover:bg-red-600 focus:ring-red-500">
          Actualizar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import store from "../../store";
import Spinner from "../../components/core/Spinner.vue";
import {PlusIcon, MinusIcon} from '@heroicons/vue/outline'

const play = ref({})
const route = useRoute()
const POINTS_OPTIONS = [0, 5, 3, 1]
const raceResults = ref([])
const loading = ref(false)

onMounted(() => {
  getPlay();
});

function getPlay() {
  store.dispatch("getPlay", route.params.id).then((response) => {
    play.value = response.data;    
    play.value.races.forEach((race, i) => {  
      play.value.races[i].result = (race.result) ? race.result : 
        [
          {
            position: 1,
            number : null,
            points: null
          },       
          {
            position: 2,
            number : null,
            points: null
          },       
          {
            position: 3,
            number : null,
            points: null
          }     
        ]      
    });
  });
}

function onSubmit() {
  loading.value = true
  const raceResults = [];
  play.value.races.forEach((race, i) => { 
    raceResults.push({
      id: race.id,
      result: race.result
    });
  })  
  store.dispatch('updatePoints', {
    playId: play.value.id,
    races: {races: raceResults}
  })
    .then(response => {
      loading.value = false;      
      alert('Resultados actualizados')       
    })
    .catch(err => {
      loading.value = false;
      if (err.status >= 400 < 500) {
        alert(err.response.data.message)
      }
    })
}

function addPlace(index) {  
  play.value.races[index].result.push({
    position: play.value.races[index].result.length + 1,   
    number : null,
    points: null          
  })
}

function removePlace(index) {
  play.value.races[index].result.pop();
}

function numberToArray(number) {
  const arrNumbers = [];
  for (let i = 1; i <= number; i++) {
    arrNumbers.push(i);
    
  }  
  return arrNumbers;
}

function checkIsRemoved(removed, number) {
  if (!removed) {
    return false
  }
  return (removed.split(',')).includes(number.toString())
}
</script>

<style scoped>
option:disabled,
option[disabled]{
  background-color: #a4b0be;
}
</style>
