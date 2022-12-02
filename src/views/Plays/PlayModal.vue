<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-10" @close="closeModal">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                       leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black bg-opacity-70 transition-opacity"/>
      </TransitionChild>

      <div class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300"
                           enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                           enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                           leave-from="opacity-100 translate-y-0 sm:scale-100"
                           leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel
              class="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-[700px] sm:w-full">
              <Spinner v-if="loading"
                       class="absolute left-0 top-0 bg-white right-0 bottom-0 flex items-center justify-center"/>
              <header class="py-3 px-4 flex justify-between items-center">
                <DialogTitle as="h3" class="text-lg leading-6 font-medium text-gray-900">
                  {{ play.id ? `Actualizar jugada` : 'Crear nueva jugada' }}
                </DialogTitle>
                <button
                  @click="closeModal()"
                  class="w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer hover:bg-[rgba(0,0,0,0.2)]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </header>
              <form @submit.prevent="onSubmit">
                <div class="bg-white px-4 pt-5 pb-4">
                  <label class="mr-2">Hipódromo</label>
                  <select                      
                      v-model="play.race_track_id"
                      required
                      class="block w-full mb-3 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                  >
                    <option v-for="raceTrack of raceTracks" :value="raceTrack.id" :key="raceTrack.id">{{raceTrack.name}}</option>
                  </select>
                  <div class="flex justify-between gap-1 mb-3">
                    <div class="grow">
                      <label class="mr-2">Fecha inicio</label>
                      <Datepicker 
                        v-model="play.start_at" 
                        locale="es-Es" 
                        :enableTimePicker="false"
                        :format="dateFormat"
                        selectText="Seleccionar"
                        cancelText="Cancelar"                        
                        required
                      ></Datepicker>
                    </div>
                    <div class="grow">
                      <label class="mr-2">Fecha cierre</label>
                      <Datepicker 
                        v-model="play.close_at" 
                        locale="es-Es" 
                        :format="dateTimeFormat"
                        selectText="Seleccionar"
                        cancelText="Cancelar"
                        required
                      ></Datepicker>
                    </div>                   
                  </div>
                  <label class="mr-2">Estado</label>
                  <select                      
                      v-model="play.status"
                      required
                      class="block w-full mb-3 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                  >
                    <option value="1">Abierto</option>
                    <option value="0">Cerrado</option>
                  </select>
                  <hr class="mt-3 mb-1">
                  <div class="flex gap-5 font-semibold">
                    <h4>Premios</h4>
                    <div class="flex gap-3 items-center">
                      <MinusIcon v-if="play.prize.length > 1" @click="removePrize" class="w-6 h-6 border-2 text-gray-700 cursor-pointer" />                      
                      <span class="text-xl">{{ play.prize.length }}</span>
                      <PlusIcon @click="addPrize" class="w64 h-6 border-2 text-gray-700 cursor-pointer" />
                    </div>
                  </div>
                  <hr class="my-1">
                  <div class="flex items-center mt-2 gap-2" v-for="(prize, index) of play.prize" :key="index">
                    <div class="flex items-center">
                      <label class="mr-2" for="">Posición</label>
                      <CustomInput style="max-width: 5rem" v-model="play.prize[index].position"  type="number" required />
                    </div>
                    <div class="flex items-center">
                      <label class="mr-2" for="">Porcentaje</label>
                      <CustomInput style="max-width: 5rem" v-model="play.prize[index].percentage" type="number" required />
                    </div>
                  </div>
                  <hr class="mt-3 mb-1">
                  <div class="flex gap-5 font-semibold">
                    <h4>Carreras</h4>
                    <div v-if="!play.id" class="flex gap-3 items-center">
                      <MinusIcon v-if="play.races.length > 2" @click="removeRace" class="w-6 h-6 border-2 text-gray-700 cursor-pointer" />                      
                      <span class="text-xl">{{ play.races.length }}</span>
                      <PlusIcon @click="addRace" class="w64 h-6 border-2 text-gray-700 cursor-pointer" />
                    </div>
                  </div>
                  <hr class="my-1">
                  <div class="flex items-center mt-2 gap-2" v-for="(races, index) of play.races" :key="index">
                    <div class="flex items-center">
                      <label class="mr-2" for="">Número</label>
                      <CustomInput style="max-width: 5rem" v-model="play.races[index].number"  type="number" required />
                    </div>
                    <div class="flex items-center">
                      <label class="mr-2" for="">Participantes</label>
                      <CustomInput style="max-width: 5rem" v-model="play.races[index].participants_number" type="number" required />
                    </div>
                    <div class="flex items-center">
                      <label class="mr-2" for="">Retirados</label>
                      <CustomInput style="max-width: 7rem" v-model="play.races[index].removed" />
                    </div>
                  </div>
                  <!-- <label class="mr-2">Nombre</label>
                  <CustomInput class="mb-2" v-model="play.name" label="Nombre"/>
                  <label class="mr-2">Email</label>
                  <CustomInput class="mb-2" v-model="play.email" label="Email"/>                  -->
                </div>
                <footer class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit"
                          class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm
                          text-white bg-red-600 hover:bg-red-600 focus:ring-red-500">
                    Enviar
                  </button>
                  <button type="button"
                          class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                          @click="closeModal" ref="cancelButtonRef">
                    Cancelar
                  </button>
                </footer>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import {computed, onUpdated, ref} from 'vue'
import {Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from '@headlessui/vue'
import {PlusIcon, MinusIcon} from '@heroicons/vue/outline'
import {ExclamationIcon} from '@heroicons/vue/outline'
import CustomInput from "../../components/core/CustomInput.vue";
import store from "../../store/index.js";
import Spinner from "../../components/core/Spinner.vue";

const play = ref({
  id: props.play.id,
  status: props.play.status,
  race_track_id: props.play.race_track_id,    
  start_at: props.play.start_at,    
  close_at: props.play.close_at,    
  prize: props.play.prize,    
  races: props.play.races   
})

const loading = ref(false)

const props = defineProps({
  modelValue: Boolean,
  play: {
    required: true,
    type: Object,
  },
  raceTracks: {
    required: true,
    type: Object,
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const dateFormat = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

const dateTimeFormat = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  const hoursMinutesFormatted = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`
  return `${day}/${month}/${year} ${hoursMinutesFormatted}`;
}

onUpdated(() => {
  play.value = {
    id: props.play.id,
    status: props.play.status,
    race_track_id: props.play.race_track_id,    
    start_at: props.play.start_at,    
    close_at: props.play.close_at,    
    prize: props.play.prize,    
    races: props.play.races
  }
})

function closeModal() {
  show.value = false
  emit('close')
}

function onSubmit() {
  loading.value = true
  play.value.start_at = dayjs(play.value.start_at).format('YYYY-MM-DD HH:mm')
  play.value.close_at = dayjs(play.value.close_at).format('YYYY-MM-DD HH:mm')  
  
  if (play.value.id) {
    store.dispatch('updatePlay', play.value)
      .then(response => {
        loading.value = false;
        if (response.status === 200) {
          alert('Jugada actualizada')
          store.dispatch('getPlays')
          closeModal()
        }
      }).catch(err => {
        loading.value = false;
        if (err.status >= 400 < 500) {
          alert(err.response.data.message)
        }
      })
  } else {
    store.dispatch('createPlay', play.value)
      .then(response => {
        loading.value = false;
        if (response.status === 201) {
          alert('Jugada agregada')
          store.dispatch('getPlays')
          closeModal()
        }
      })
      .catch(err => {
        loading.value = false;
        if (err.status >= 400 < 500) {
          alert(err.response.data.message)
        }
      })
  }
}

function addPrize() {
  play.value.prize.push({
    position: play.value.prize.length + 1,
    percentage: null
  })
}

function removePrize() {
  play.value.prize.pop()
}

function addRace() {
  play.value.races.push({
    number: null,
    participants_number: null,
    removed: null,
  })
}

function removeRace() {
  play.value.races.pop()
}
</script>
