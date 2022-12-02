<template>
  <div class="bg-white p-4 rounded-lg shadow animate-fade-in-down">
    <div class="flex justify-between border-b-2 pb-3">
      <div class="flex items-center">
        <span class="whitespace-nowrap mr-3">Por página</span>
        <select @change="getTickets(null)" v-model="perPage"
                class="appearance-none relative block w-24 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <div>
        <input v-model="search" @change="getTickets(null)"
               class="appearance-none relative block w-48 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
               placeholder="Buscar tickets">
      </div>
    </div>

    <table class="table-auto w-full">
      <thead>
      <tr>        
        <TableHeaderCell field="code" :sort-field="sortField" :sort-direction="sortDirection"
                         @click="sortTickets('code')">
          Código
        </TableHeaderCell>
        <TableHeaderCell field="code" :sort-field="sortField" :sort-direction="sortDirection"
                         >
          Creado por
        </TableHeaderCell>
        <TableHeaderCell field="id_card" :sort-field="sortField" :sort-direction="sortDirection"
                         >
          Cédula
        </TableHeaderCell>        
        <TableHeaderCell field="name" :sort-field="sortField" :sort-direction="sortDirection"
                         >
          Nombre
        </TableHeaderCell>        
        <TableHeaderCell field="created_at" :sort-field="sortField" :sort-direction="sortDirection"
                         @click="sortTickets('created_at')">
          Fecha
        </TableHeaderCell>    
        <TableHeaderCell field="price" :sort-field="sortField" :sort-direction="sortDirection"
                         >
          Precio
        </TableHeaderCell>    
        <TableHeaderCell field="points" :sort-field="sortField" :sort-direction="sortDirection"
                         @click="sortTickets('points')">
          Puntos
        </TableHeaderCell>    
        <TableHeaderCell field="status" :sort-field="sortField" :sort-direction="sortDirection"
                         >
          Estatus
        </TableHeaderCell>    
        <TableHeaderCell field="earned" :sort-field="sortField" :sort-direction="sortDirection"
                         >
          Ganado
        </TableHeaderCell>    
        <TableHeaderCell field="actions" v-if="store.state.user.data.role == 'superadmin'" >
          Acción
        </TableHeaderCell>    
      </tr>
      </thead>
      <tbody v-if="tickets.loading || !tickets.data.length">
      <tr>
        <td colspan="6">
          <Spinner v-if="tickets.loading"/>
          <p v-else class="text-center py-8 text-gray-700">
            No se encontraron resultados
          </p>
        </td>
      </tr>
      </tbody>
      <tbody v-else>
      <tr v-for="ticket of tickets.data" :key="ticket.id">
        <td class="border-b p-2 ">
         {{ ticket.code }}
        </td>
        <td class="border-b p-2 ">
         {{ ticket.user.name }}
        </td>
        <td class="border-b p-2 max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
          {{ ticket.client.id_card }}
        </td>       
        <td class="border-b p-2 max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
          {{ ticket.client.name }}
        </td>       
        <td class="border-b p-2 max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
          {{ $dayjs(ticket.created_at).format('DD-MM-YYYY HH:mm') }}
        </td>       
        <td class="border-b p-2 max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
          {{ ticket.price }}$
        </td>       
        <td class="border-b p-2 max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
          {{ ticket.points ?? 0 }}
        </td>       
        <td class="border-b p-2 max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
          <span class="text-green-500" v-if="ticket.status == 1">Ganador</span>
          <span class="text-red-500" v-if="ticket.status == 2">Perdedor</span>
          <span v-if="ticket.status == 3">Pendiente</span>
        </td> 
        <td class="border-b p-2 max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
          {{ ticket.earned ?? 0 }}$
        </td>      
        <td class="border-b p-2 " v-if="store.state.user.data.role == 'superadmin'" >
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
                    <router-link :to="{name: 'app.ticket.print', params: {playId: play.id, ticketId: ticket.id}}" target="_blank"
                        :class="[
                        active ? 'bg-red-600 text-white' : 'text-gray-900',
                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                      ]">
                      <PrinterIcon
                        :active="active"
                        class="mr-2 h-5 w-5 text-red-400"
                        aria-hidden="true"
                      />
                      Imprimir
                    </router-link>
                  </MenuItem>                                              
                  <MenuItem v-slot="{ active }">
                    <button
                      :class="[
                        active ? 'bg-red-600 text-white' : 'text-gray-900',
                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                      ]"
                      @click="editTicket(ticket)"
                    >
                      <PencilIcon
                        :active="active"
                        class="mr-2 h-5 w-5 text-red-400"
                        aria-hidden="true"
                      />
                      Editar
                    </button>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button
                      :class="[
                        active ? 'bg-red-600 text-white' : 'text-gray-900',
                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                      ]"
                      @click="deleteTicket(ticket)"
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

    <div v-if="!tickets.loading" class="flex justify-between items-center mt-5">
      <div v-if="tickets.data.length">
        Mostrando desde el {{ tickets.from }} hasta el {{ tickets.to }}
      </div>
      <nav
        v-if="tickets.total > tickets.limit"
        class="relative z-0 inline-flex justify-center rounded-md shadow-sm -space-x-px"
        aria-label="Pagination"
      >
        <!-- Current: "z-10 bg-red-50 border-red-500 text-red-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" -->
        <a
          v-for="(link, i) of tickets.links"
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
              i === tickets.links.length - 1 ? 'rounded-r-md' : '',
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
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/vue";
import {DotsVerticalIcon, PencilIcon, TrashIcon, EyeIcon, PrinterIcon} from '@heroicons/vue/outline'
// import TicketModal from "./TicketModal.vue";
import {useRoute, useRouter} from "vue-router";

const props = defineProps({  
  play: {
    required: true,
    type: Object
  }
})

const perPage = ref(PER_PAGE);
const search = ref('');
const tickets = computed(() => store.state.tickets);
const sortField = ref('created_at');
const sortDirection = ref('desc')

const ticket = ref({})
const showTicketModal = ref(false);

const emit = defineEmits(['clickEdit'])

onMounted(() => {    
  getTickets();
})

function getForPage(ev, link) {
  ev.preventDefault();
  if (!link.url || link.active) {
    return;
  }

  getTickets(link.url)
}

function getTickets(url = null) {  
  store.dispatch("getTickets",     
  {
    playId: props.play.id,
    url,
    search: search.value,
    per_page: perPage.value,
    sort_field: sortField.value,
    sort_direction: sortDirection.value
  });
}

function sortTickets(field) {
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

  getTickets()
}

function showAddNewModal() {
  showTicketModal.value = true
}

function deleteTicket(ticket) { 
  if (!confirm(`Seguro que quieres eliminar este ticket?`)) {
    return
  }
  store.dispatch('deleteTicket', {
    playId: props.play.id,   
    ticket
  })
    .then(res => {
      alert('Ticket eliminado')
      getTickets()
    })
}

function editTicket(p) {
  emit('clickEdit', p)
}
</script>

<style scoped>

</style>
