<template>
  <div class="min-w-[160px] w-[160px]  transition-all bg-red-600 text-white py-4 px-2">
    <div>
      <img class="object-cover h-24 w-32 mx-auto" src="/assets/img/logo.png" alt="Logo polla tubanca.net">
    </div>      
    <router-link :to="{name: 'app.sell'}"
                 class="flex items-center p-2 rounded transition-colors hover:bg-black/30">
      <span class="mr-2 text-gray-300">
        <DesktopComputerIcon class="w-5"/>
      </span>
      <span class="text-xs">
        Vender
      </span>
    </router-link>    
    <router-link :to="{name: 'app.sales'}"
                 class="flex items-center p-2 rounded transition-colors hover:bg-black/30">
      <span class="mr-2 text-gray-300">
        <CurrencyDollarIcon class="w-5"/>
      </span>
      <span class="text-xs">
        Ventas
      </span>
    </router-link>    
    <router-link :to="{name: 'app.plays'}"
                 class="flex items-center p-2 rounded transition-colors hover:bg-black/30">
      <span class="mr-2 text-gray-300">
        <ClipboardCheckIcon class="w-5"/>
      </span>
      <span class="text-xs">
        Jugadas
      </span>
    </router-link>    
    <router-link :to="{name: 'app.users'}" v-if="store.state.user.data.role == 'superadmin'"
                 class="flex items-center p-2 rounded transition-colors hover:bg-black/30">
      <span class="mr-2 text-gray-300">
        <UsersIcon class="w-5"/>
      </span>
      <span class="text-xs">
        Usuarios
      </span>
    </router-link>    
    <router-link :to="{name: 'app.settings'}" v-if="store.state.user.data.role == 'superadmin'"
                 class="flex items-center p-2 rounded transition-colors hover:bg-black/30">
      <span class="mr-2 text-gray-300">
        <CogIcon class="w-5"/>
      </span>
      <span class="text-xs">
        Configuración
      </span>
    </router-link>    
  </div>
</template>

<script setup>
  import {HomeIcon, UserGroupIcon, UsersIcon, ViewListIcon, ChartBarIcon, CogIcon, ClipboardCheckIcon, DesktopComputerIcon, CurrencyDollarIcon} from '@heroicons/vue/outline'
  import store from "../store/index.js"; 

</script>

<style scoped>

</style>
