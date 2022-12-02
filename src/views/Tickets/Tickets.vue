<template>
  <div class="flex items-center justify-between mb-3">
    <h1 class="text-3xl font-semibold">Tickets: {{ play?.raceTrack?.name }} {{ $dayjs(play?.start_at).format('DD-MM-YYYY') }}</h1>
    <div class="flex gap-2">
      <button v-if="store.state.user.data.role == 'superadmin' && play.id" 
        @click="updateWinners"
        class="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
        Actualizar estatus
      </button>
      <a  @click="$router.go(-1)"         
              class="py-2 px-4 border cursor-pointer border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >     
        Volver
      </a> 
    </div>   
  </div>
  <TicketsTable v-if="play.id" @clickEdit="editTicket" :play="play" :key="ticketsTableKey" />
  <TicketModal v-model="showTicketModal" :ticket="ticketModel" :play="play" @close="onModalClose"/>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import store from "../../store";
import TicketModal from "./TicketModal.vue";
import TicketsTable from "./TicketsTable.vue";
import {useRoute} from "vue-router";

const DEFAULT_TICKET = {
  id: '',
  client: {
    id_card: '',
    name: ''
  },
  picks: []
}

const route = useRoute()
const tickets = computed(() => store.state.tickets);
const play = ref({})
const showTicketModal = ref(false);
const ticketModel = ref({...DEFAULT_TICKET})
const ticketsTableKey = ref(100);

onMounted(() => {
  getPlay();
})

function updateWinners() {
  const confirmed = confirm('Se actualizará el estatus de los tickets y el monto ganado');
  if (!confirmed) return;
  store.dispatch('updateWinners', play.value.id)
    .then(response => {
      ticketsTableKey.value += 1;
      alert('Tickets actualizados');
    })

}

function getPlay() {
  store.dispatch('getPlay', route.params.id)
    .then(response => {
      play.value = response.data
    })
}

function editTicket(u) {
    ticketModel.value = u;
    showAddNewModal();
}

function showAddNewModal() {
  showTicketModal.value = true
}

function onModalClose() {
  ticketModel.value = {...DEFAULT_TICKET}
}
</script>

<style scoped>

</style>
