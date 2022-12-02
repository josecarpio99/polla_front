<template>
  <div class="flex items-center justify-between mb-3">
    <h1 class="text-3xl font-semibold">
      Crear ticket: {{ play?.raceTrack?.name }}
      {{ $dayjs(play?.start_at).format("DD-MM-YYYY") }}
    </h1>
    <div>      
      <a
        @click="$router.go(-1)"
        class="
          py-2
          px-4
          border
          cursor-pointer
          border-transparent
          text-sm
          font-medium
          rounded-md
          text-white
          bg-gray-500
          hover:bg-gray-600
          focus:outline-none
          focus:ring-2
          focus:ring-offset-2
          focus:ring-gray-500
        "
      >
        Volver
      </a>
    </div>
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
      <label class="mr-2">Cédula</label>
      <CustomInput type="number" class="mb-2 max-w-sm" v-model="ticket.client.id_card" required />
      <label class="mr-2">Nombre</label>
      <CustomInput class="mb-2 max-w-sm" v-model="ticket.client.name" required />
      <hr class="mt-4 mb-2">
      <div v-for="(race, index) of play.races" :key="race.id"
        class="flex flex-col my-2"
      >    
        <div class="flex">
          <div class="y-2 w-12">
            <span></span>
          </div>
          <div v-for="(item, y) of numberToArray(race.participants_number)" :key="item * 100"
            class="py-2 text-center font-semibold" style="width: 41px"
          >
            <span>{{ item }}</span>
          </div>
        </div>
        <div class="flex list-option-wrapper">
          <div class="border-2 py-2 bg-slate-600 text-white font-semibold w-12 text-center">
            <span>{{ race.number }}</span>
          </div>
          <div @click="selectOption($event, ticket.picks[index], item)" v-for="(item, j) of numberToArray(race.participants_number)" :key="item * 200"
            class="option-wrapper border-2 py-2 px-3"
            :class="checkIsRemoved(race.removed, item) ? ['bg-gray-100', 'cursor-not-allowed'] : 'cursor-pointer'"
          >
            <input type="radio" v-model="ticket.picks[index].picked" v-bind:value="item" 
            :name="race.number" class="pointer-events-none" 
            :disabled="checkIsRemoved(race.removed, item)"
            required>
          </div>
        </div>    
        
        
      </div>
      <div class="mt-5 max-w-sm text-center">
         <button type="submit"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm
                text-white bg-red-600 hover:bg-red-600 focus:ring-red-500">
          Enviar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, onMounted, onUpdated, ref } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { ExclamationIcon } from "@heroicons/vue/outline";
import CustomInput from "../../components/core/CustomInput.vue";
import store from "../../store/index.js";
import Spinner from "../../components/core/Spinner.vue";
import { useRoute } from "vue-router";

const DEFAULT_TICKET = {
  client: {
    id_card: "",
    name: "",
  },
  picks: [],
};

const loading = ref(false);
const play = ref({});
const ticket = ref({ ...DEFAULT_TICKET });
const route = useRoute();

onMounted(() => {
  getPlay();
});

function getPlay() {
  store.dispatch("getPlay", route.params.id).then((response) => {
    play.value = response.data;
    play.value.races.forEach((race, i) => {
      ticket.value.picks[i] = {
        race_id: race.id,
        picked: null
      }
    });
  });
}

function onSubmit() {  
  loading.value = true
  store.dispatch('createTicket', {
    playId: play.value.id,
    ticket: ticket.value
  })
    .then(response => {
      loading.value = false;
      if (response.status === 201) {
        alert('Ticket creado')
        resetTicket()        
        const newTicket = response.data.data 
        const printUrl = `${window.location.origin}/app/play/${newTicket.play_id}/ticket/${newTicket.id}/print`
        window.open(printUrl, '_blank');
      }
    })
    .catch(err => {
      loading.value = false;
      if (err.status >= 400 < 500) {
        alert(err.response.data.message)
      }
    })
}

function resetTicket() {
  const divsWrapper = document.querySelectorAll('.option-wrapper');
  [].forEach.call(divsWrapper, function(el) {
    el.classList.remove('selected');
  });

  ticket.value.client = {
    id_card: "",
    name: "",
  }
  play.value.races.forEach((race, i) => {
    ticket.value.picks[i] = {
      race_id: race.id,
      picked: null
    }
  });
}

function selectOption(e, pick, selected) {
  const divsWrapper = e.target.closest('.list-option-wrapper').querySelectorAll('.option-wrapper');
  [].forEach.call(divsWrapper, function(el) {
    el.classList.remove('selected');
  });
    
  e.target.querySelector('input').checked = true;
  e.target.classList.add('selected')

  pick.picked = selected
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
.option-wrapper.selected {
  background-color: #f7d794;
}
</style>