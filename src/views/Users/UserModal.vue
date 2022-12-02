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
                  {{ user.id ? `Actualizar usuario: "${props.user.name}"` : 'Crear nuevo usuario' }}
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
                  <label class="mr-2">Rol</label>
                  <CustomInput 
                    type="select" 
                    class="mb-2" 
                    v-model="user.role" 
                    :select-options="ROLES"
                  />
                  <label class="mr-2">Nombre</label>
                  <CustomInput class="mb-2" v-model="user.name" label="Nombre"/>
                  <label class="mr-2">Usuario</label>
                  <CustomInput class="mb-2" v-model="user.username" label="Usuario"/>
                  <label class="mr-2">Email</label>
                  <CustomInput class="mb-2" v-model="user.email" label="Email"/>
                  <label class="mr-2">Télefono</label>
                  <CustomInput class="mb-2" v-model="user.phone" label="Télefono"/>
                  <label class="mr-2">Dirección</label>
                  <CustomInput class="mb-2" v-model="user.address" label="Dirección"/>
                  <label class="mr-2">Contraseña</label>
                  <CustomInput type="password" class="mb-2" v-model="user.password" label="Contraseña"/>
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
import {ExclamationIcon} from '@heroicons/vue/outline'
import CustomInput from "../../components/core/CustomInput.vue";
import store from "../../store/index.js";
import Spinner from "../../components/core/Spinner.vue";

const user = ref({
  id: props.user.id,
  name: props.user.name,
  username: props.user.username,
  email: props.user.email,
  role: props.user.role,
  phone: props.user.phone,
  address: props.user.address
})

const loading = ref(false)

const ROLES = ref([
  {
    key: 'superadmin',
    text: 'Superadmin',
  },
  {
    key: 'admin',
    text: 'Admin',
  },
  {
    key: 'pos',
    text: 'Taquilla',
  },
])

const props = defineProps({
  modelValue: Boolean,
  user: {
    required: true,
    type: Object,
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

onUpdated(() => {
  user.value = {
    id: props.user.id,
    name: props.user.name,
    username: props.user.username,
    email: props.user.email,
    role: props.user.role,
    phone: props.user.phone,
    address: props.user.address
  }
})

function closeModal() {
  show.value = false
  emit('close')
}

function onSubmit() {
  loading.value = true
  if (user.value.id) {
    store.dispatch('updateUser', user.value)
      .then(response => {
        loading.value = false;
        if (response.status === 200) {
          alert('Usuario actualizado')
          store.dispatch('getUsers')
          closeModal()
        }
      }).catch(err => {
        loading.value = false;
        if (err.status >= 400 < 500) {
          alert(err.response.data.message)
        }
      })
  } else {
    store.dispatch('createUser', user.value)
      .then(response => {
        loading.value = false;
        if (response.status === 201) {
          alert('Usuario agregado')
          store.dispatch('getUsers')
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
</script>
