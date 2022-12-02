<template>
  <div class="flex items-center justify-between mb-3">
    <h1 class="text-3xl font-semibold">Configuración</h1>
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
      <div v-for="setting in settings.data" :key="setting.id">
        <div class="flex items-center my-1">
          <label class="w-60">{{ setting.name }}</label>
          <CustomInput class="max-w-xs" v-model="setting.value" />
        </div>
      </div>
      <div class="max-w-xs text-center mt-5">
        <button type="submit"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm
              text-white bg-red-600 hover:bg-red-600 focus:ring-red-500">
        Guardar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, onUpdated, onMounted, ref } from "vue";
import CustomInput from "../../components/core/CustomInput.vue";
import store from "../../store/index.js";
import Spinner from "../../components/core/Spinner.vue";

const settings = computed(() => store.state.settings);
const loading = ref(false);

onMounted(() => {
  getSettings();
});

function getSettings() {
  loading.value = true;
  store.dispatch("getSettings").then((data) => {
    loading.value = false;
  });
}

function onSubmit() {  
  loading.value = true;
  const data = {}
  settings.value.data.forEach(setting => {
    data[setting.key] = setting.value
  });

  store.dispatch('updateSettings', data)
    .then(response => {
      loading.value = false;
      if (response.status === 200) {
        alert('Datos actualizados')
        store.dispatch('getSettings')        
      }
    }).catch(err => {
      loading.value = false;
      if (err.status >= 400 < 500) {
        alert(err.response.data.message)
      }
    })
}
</script>