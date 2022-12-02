<template>
  <div class="flex items-center justify-between mb-3">
    <h1 class="text-3xl font-semibold">Detalles de usuario: {{ user.username}}</h1>
    <router-link  :to="{name: 'app.users'}"         
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
    
    <div class="flex justify-between max-w-3xl">
      <div class="flex justify-between items-center w-full m-2">
        <label class="w-1/4">Nombre</label>
        <span class="bg-gray-100 rounded-md p-2 text-gray-500 grow h-10">{{ user.name }}</span>
      </div>

      <div class="flex justify-between items-center w-full m-2">
        <label class="w-1/4">Correo</label>
        <span class="bg-gray-100 rounded-md p-2 text-gray-500 grow h-10">{{ user.email }}</span>
      </div>      
    </div>
    <div class="flex justify-between max-w-3xl">
      <div class="flex justify-between items-center w-full m-2">
        <label class="w-1/4">Rol</label>
        <p class="bg-gray-100 rounded-md p-2 text-gray-500 grow h-10">{{ user.role }}</p>
      </div>

      <div class="flex justify-between items-center w-full m-2">
        <label class="w-1/4">Teléfono</label>
        <span class="bg-gray-100 rounded-md p-2 text-gray-500 grow h-10">{{ user.phone }}</span>
      </div>      
    </div>
    <div class="flex justify-between max-w-3xl">
      <div class="flex justify-between items-center w-full m-2">
        <label class="w-1/4">Dirección</label>
        <p class="bg-gray-100 rounded-md p-2 text-gray-500 grow h-10">{{ user.address }}</p>
      </div>        
    </div>

    <hr class="my-3">
    <div class="max-w-3xl" v-if="user.role === 'admin'">    
      <div class="flex justify-between mt-3">
        <h3>Taquillas asignadas</h3>       
      </div>

      <div v-if="user.pos.length > 0">
        <ul>
          <li class="ml-3 bg-gray-200 px-1 my-1" v-for="item in selectedPos" :key="item.id">* {{ item.name }}</li>
        </ul>        
      </div>
      <div v-else>
        <small class="text-gray-700 font-semibold">No tiene taquilla/s asignadas</small>
      </div>
      <form @submit.prevent="onSubmit">   

        <div class="mt-3">
          <label class="text-gray-700 font-semibold">Asignar taquilla/s</label>
          <select multiple required v-model="selectedPos"
          class="block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm">
            <option v-for="pos in posUsers" :value="pos" :key="pos.id">{{pos.name}}</option>
          </select>
        </div>

        <div class="mt-4 text-center">
          <button type="submit"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm
              text-white bg-red-600 hover:bg-red-600 focus:ring-red-500">
            Guardar
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import store from "../../store";
import {useRoute} from "vue-router";

import Spinner from "../../components/core/Spinner.vue";

const loading = ref(false)
const route = useRoute()
const user = ref({})
const posUsers = ref({})
const selectedPos = ref([])

onMounted( () => {
  getUser()
  getPosUsers()  
}) 

function getUser() {
  store.dispatch('getUser', route.params.id)
    .then(data => {
      user.value = data.data    
      selectedPos.value = data.data.pos
    })
}

function getPosUsers() {
  store.dispatch('getPosUsers')
    .then(data => {      
      posUsers.value = data.data.data
    })
}

function onSubmit() { 
  loading.value = true;
  const data = {
    user_id: user.value.id,
    pos_id: []
  }

  selectedPos.value.forEach(pos => {
    data['pos_id'].push(pos.id)
  });

  store.dispatch('assignPosToUser', data)
    .then(data => {
      loading.value = false;
      alert('Datos actualizados')
    }).catch(err => {
      loading.value = false;
      if (err.status >= 400 < 500) {
        alert(err.response.data.message)
      }
    })
}

</script>