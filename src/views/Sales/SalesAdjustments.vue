<template>
  <div class="flex items-center justify-between mb-3">
    <h1 class="text-3xl font-semibold">Cuadre de ventas</h1>  
    
  </div>
  <div class="bg-white p-4 rounded-lg shadow animate-fade-in-down">
    <div class="flex gap-3">

      <div v-if="plays.length > 0" class="flex items-center">
        <label class="mr-2">Jugada:</label>
        <select   
            @change="updateSales"                          
            v-model="selectedPlay"                
            class="block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
        >
          <option v-for="play of plays" :value="play.id" :key="play.id">
            {{ play.name }} {{ $dayjs(play.start_at).format("DD-MM-YYYY") }}
          </option>
        </select>
      </div> 

      <div v-if="users.length > 0 && store.state.user.data.role != 'pos'" class="flex items-center">
        <label class="mr-2">Usuario:</label>
        <select        
            @change="updateSales"                  
            v-model="selectedUser"                
            class="block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
        >
          <option value="">Todos</option>
          <option v-for="user of users" :value="user.id" :key="user.id">
            {{ user.username }}
          </option>
        </select>
      </div>        

    </div>

    <div v-if="sales.ticketPrice" class="mt-5 border-2 rounded-sm p-2 max-w-sm">
      <div class="flex w-full">
        <label class="w-3/6" for="">Pollas vendidas:</label>
        <span class="w-3/6 text-right">{{ sales.ticketsCount }}</span>
      </div>
      <div class="flex w-full">
        <label class="w-3/6" for="">Precio de la polla:</label>
        <span class="w-3/6 text-right">${{ sales.ticketPrice }}</span>
      </div>
      <div class="flex w-full">
        <label class="w-3/6" for="">Monto total vendido:</label>
        <span class="w-3/6 text-right">${{ sales.totalSell }}</span>
      </div>
      <div class="flex w-full">
        <label class="w-3/6" for="">% Vendedor({{ sales.systemPercentage }}%):</label>
        <span class="w-3/6 text-right">${{ sales.sellerAmount }}</span>
      </div>
      <div class="flex w-full">
        <label class="w-3/6" for="">Entregar a banca:</label>
        <span class="w-3/6 text-right">${{ sales.deliverToBank }}</span>
      </div>
    </div>

    <div v-if="sales.ticketPrice" class="mt-5">
      <router-link   
        :to="{name: 'app.sales.print', params: {playId: selectedPlay, userId: selectedUser}}"
        target="_blank"     
        type="button"
        class="
          py-2
          px-4
          border border-transparent
          text-sm
          font-medium
          rounded-md
          text-white
          bg-red-600
          hover:bg-red-600
          focus:outline-none
          focus:ring-2
          focus:ring-offset-2
          focus:ring-red-500
        "
      >
      Imprimir
    </router-link>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import store from "../../store";

const sales = ref({});
const plays = ref([]);
const users = ref([]);
const selectedPlay = ref(null);
const selectedUser = ref(null);

onMounted(() => {
  getPlaysList();
  getUsersList();  
  if (store.state.user.data.role == 'pos') {
    selectedUser.value = store.state.user.data.id;
  }
})

function updateSales() {
  if (selectedPlay.value && selectedUser.value) {
    store.dispatch('getSalesByUser', {
      playId: selectedPlay.value,
      userId: selectedUser.value
    })
      .then(response => {
        sales.value = response.data;
      })
  } else {
    if (selectedPlay.value) {
      store.dispatch('getSales', selectedPlay.value)
        .then(response => {
          sales.value = response.data;
        })
    }
  }
}

function getPlaysList() {
  store.dispatch('listPlays')
    .then(response => {
      plays.value = response.data;
    })
}

function getUsersList() {
  store.dispatch('listUsers')
    .then(response => {
      users.value = response.data;
    })
}
</script>
