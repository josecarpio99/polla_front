<template>
  <div class="flex justify-center items-center min-h-full w-full min-w-full">
    <div class="flex">
      <div class="text-red-600 self-start text-5xl px-8 font-bold border-r pb-8 leading-10">404</div>
      <div class="px-8">
        <h1 class="text-5xl font-bold mb-2">Página no encontrada</h1>
        <p class="text-gray-400  mb-10">Por favor revisar la dirección url e intenta otra vez</p>
        <div>
          <router-link :to="{name: 'app.users'}"
            class="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            Volver al inicio
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>

</style>
