<template>
  <div class="bg-white p-4 rounded-lg shadow animate-fade-in-down">
    <div class="flex justify-between border-b-2 pb-3">
      <div class="flex items-center">
        <span class="whitespace-nowrap mr-3">Por página</span>
        <select @change="getPlays(null)" v-model="perPage"
                class="appearance-none relative block w-24 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <div>
        <input v-model="search" @change="getPlays(null)"
               class="appearance-none relative block w-48 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
               placeholder="Buscar jugadas">
      </div>
    </div>

    <table class="table-auto w-full">
      <thead>
      <tr>        
        <TableHeaderCell field="start_at" :sort-field="sortField" :sort-direction="sortDirection"
                         @click="sortPlays('start_at')">
          Fecha inicio
        </TableHeaderCell>
        <TableHeaderCell field="close_at" :sort-field="sortField" :sort-direction="sortDirection"
                         @click="sortPlays('close_at')">
          Fecha cierre
        </TableHeaderCell>      
        <TableHeaderCell field="raceTrack" :sort-field="sortField" :sort-direction="sortDirection"
                        >
          Hipódromo
        </TableHeaderCell>      
        <TableHeaderCell field="status" :sort-field="sortField" :sort-direction="sortDirection"
                         >
          Tickets
        </TableHeaderCell>      
        <TableHeaderCell field="status" :sort-field="sortField" :sort-direction="sortDirection"
                         @click="sortPlays('status')">
          Estado
        </TableHeaderCell>      
        <TableHeaderCell field="actions">
          Acción
        </TableHeaderCell>
      </tr>
      </thead>
      <tbody v-if="plays.loading || !plays.data.length">
      <tr>
        <td colspan="6">
          <Spinner v-if="plays.loading"/>
          <p v-else class="text-center py-8 text-gray-700">
            No se encontraron resultados
          </p>
        </td>
      </tr>
      </tbody>
      <tbody v-else>
      <tr v-for="play of plays.data" :key="play.id">
        <td class="border-b p-2 ">
         {{ $dayjs(play.start_at).format('DD-MM-YYYY') }}
        </td>
        <td class="border-b p-2 max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
          {{ $dayjs(play.close_at).format('DD-MM-YYYY HH:mm') }}
        </td>       
        <td class="border-b p-2 max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
          {{ play.raceTrack.name }}
        </td>  
         <td class="border-b p-2 max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
          {{ play.ticketsCount }}
        </td>       
        <td class="border-b p-2 max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
          <Switch  
            v-if="store.state.user.data.role == 'superadmin'"  
            @click="togglePlayStatus(play)"        
            :class="play.status == 1 ? 'bg-blue-600' : 'bg-gray-200'"
            class="relative inline-flex h-6 w-11 items-center rounded-full"
          >
            <span class="sr-only">Enable notifications</span>
            <span
              :class="play.status == 1 ? 'translate-x-6' : 'translate-x-1'"
              class="inline-block h-4 w-4 transform rounded-full bg-white transition"
            />
          </Switch>
          <span v-else>{{ play.status == 1 ? 'Abierto' : 'Cerrado' }}</span>
        </td>           
        <td class="border-b p-2 ">
          <Menu as="div" class="relative inline-block text-left">
            <div>
              <MenuButton
                class="inline-flex items-center justify-center w-full justify-center rounded-full w-10 h-10 bg-black bg-opacity-0 text-sm font-medium text-white hover:bg-opacity-5 focus:bg-opacity-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              >
                <DotsVerticalIcon
                  class="h-5 w-5 text-red-500"
                  aria-hidden="true"/>
              </MenuButton>
            </div>

            <transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <MenuItems
                class="absolute z-10 right-0 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div class="px-1 py-1">  
                  <MenuItem v-slot="{ active }">
                    <router-link :to="{name: 'app.tickets', params: {id: play.id}}"
                        :class="[
                        active ? 'bg-red-600 text-white' : 'text-gray-900',
                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                      ]">
                      <TicketIcon
                        :active="active"
                        class="mr-2 h-5 w-5 text-red-400"
                        aria-hidden="true"
                      />
                      Tickets
                    </router-link>
                  </MenuItem>                                   
                  <MenuItem v-slot="{ active }" v-if="store.state.user.data.role == 'superadmin'" >
                    <router-link :to="{name: 'app.plays.update_points', params: {id: play.id}}"
                        :class="[
                        active ? 'bg-red-600 text-white' : 'text-gray-900',
                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                      ]">
                      <TableIcon
                        :active="active"
                        class="mr-2 h-5 w-5 text-red-400"
                        aria-hidden="true"
                      />
                      Resultados
                    </router-link>
                  </MenuItem>
                  <MenuItem v-slot="{ active }" >
                    <router-link :to="{name: 'app.plays.ranking', params: {id: play.id}}"
                        :class="[
                        active ? 'bg-red-600 text-white' : 'text-gray-900',
                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                      ]">
                      <ViewListIcon
                        :active="active"
                        class="mr-2 h-5 w-5 text-red-400"
                        aria-hidden="true"
                      />
                      Puntuación
                    </router-link>
                  </MenuItem>
                  <MenuItem v-slot="{ active }" v-if="store.state.user.data.role == 'superadmin'" >
                    <button
                      :class="[
                        active ? 'bg-red-600 text-white' : 'text-gray-900',
                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                      ]"
                      @click="editPlay(play)"
                    >
                      <PencilIcon
                        :active="active"
                        class="mr-2 h-5 w-5 text-red-400"
                        aria-hidden="true"
                      />
                      Editar
                    </button>
                  </MenuItem>
                  <MenuItem v-slot="{ active }" v-if="store.state.user.data.role == 'superadmin'" >
                    <button
                      :class="[
                        active ? 'bg-red-600 text-white' : 'text-gray-900',
                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                      ]"
                      @click="deletePlay(play)"
                    >
                      <TrashIcon
                        :active="active"
                        class="mr-2 h-5 w-5 text-red-400"
                        aria-hidden="true"
                      />
                      Eliminar
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </td>
      </tr>
      </tbody>
    </table>

    <div v-if="!plays.loading" class="flex justify-between items-center mt-5">
      <div v-if="plays.data.length">
        Mostrando desde el {{ plays.from }} hasta el {{ plays.to }}
      </div>
      <nav
        v-if="plays.total > plays.limit"
        class="relative z-0 inline-flex justify-center rounded-md shadow-sm -space-x-px"
        aria-label="Pagination"
      >
        <!-- Current: "z-10 bg-red-50 border-red-500 text-red-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" -->
        <a
          v-for="(link, i) of plays.links"
          :key="i"
          :disabled="!link.url"
          href="#"
          @click="getForPage($event, link)"
          aria-current="page"
          class="relative inline-flex items-center px-4 py-2 border text-sm font-medium whitespace-nowrap"
          :class="[
              link.active
                ? 'z-10 bg-red-50 border-red-500 text-red-600'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
              i === 0 ? 'rounded-l-md' : '',
              i === plays.links.length - 1 ? 'rounded-r-md' : '',
              !link.url ? ' bg-gray-100 text-gray-700': ''
            ]"
          v-html="link.label"
        >
        </a>
      </nav>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import store from "../../store";
import Spinner from "../../components/core/Spinner.vue";
import {PER_PAGE} from "../../constants";
import TableHeaderCell from "../../components/core/Table/TableHeaderCell.vue";
import {Menu, MenuButton, MenuItem, MenuItems, Switch} from "@headlessui/vue";
import {DotsVerticalIcon, PencilIcon, TrashIcon, EyeIcon, TicketIcon, TableIcon, ViewListIcon} from '@heroicons/vue/outline'
// import UserModal from "./UserModal.vue";

const perPage = ref(PER_PAGE);
const search = ref('');
const plays = computed(() => store.state.plays);
const sortField = ref('close_at');
const sortDirection = ref('desc')

const play = ref({})
const showPlayModal = ref(false);

const emit = defineEmits(['clickEdit'])

onMounted(() => {
  getPlays();
})

function getForPage(ev, link) {
  ev.preventDefault();
  if (!link.url || link.active) {
    return;
  }

  getPlays(link.url)
}

function getPlays(url = null) {  
  store.dispatch("getPlays", {
    url,
    search: search.value,
    per_page: perPage.value,
    sort_field: sortField.value,
    sort_direction: sortDirection.value
  });
}

function sortPlays(field) {
  if (field === sortField.value) {
    if (sortDirection.value === 'desc') {
      sortDirection.value = 'asc'
    } else {
      sortDirection.value = 'desc'
    }
  } else {
    sortField.value = field;
    sortDirection.value = 'asc'
  }

  getPlays()
}

function showAddNewModal() {
  showPlayModal.value = true
}

function deletePlay(play) { 
  if (!confirm(`Seguro que quieres eliminar la jugada? Todos los tickets de la jugada serán eliminados`)) {
    return
  }
  store.dispatch('deletePlay', play)
    .then(res => {
      alert('Registro eliminado')
      getPlays()
    })
}

function editPlay(p) {
  emit('clickEdit', p)
}

function togglePlayStatus(play) {
  play.status = !play.status
  store.dispatch('togglePlayStatus', play.id)
    .catch(err => {
      loading.value = false;
      alert('Oops! Algo salio mal')
    })
}

</script>

<style scoped>

</style>
