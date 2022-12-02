<template>
  <div class="flex items-center justify-between mb-3">
    <h1 class="text-3xl font-semibold">Aignar taquilla/s</h1>
  </div>
  <div class="bg-white p-4 rounded-lg shadow animate-fade-in-down">
    <div>
      <label>Usuario: {{ user.name }}</label>
    </div>
    <label class="mr-2">Taquillas</label>
    <CustomInput 
      type="select" 
      class="mb-2" 
      v-model="user.pos" 
      :select-options="ROLES"
    />
  </div> 
</template>  

<script setup>
import {computed, onMounted, ref} from "vue";
import store from "../../store";

const {user} = defineProps({
  user: Object
})

</script>