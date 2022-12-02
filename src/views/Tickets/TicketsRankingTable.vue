<template>
   <div class="bg-white p-4 rounded-lg shadow animate-fade-in-down">
    <div class="flex justify-between border-b-2 pb-3">
      <!-- <div class="flex items-center">
        <span class="whitespace-nowrap mr-3">Por página</span>
        <select @change="getTickets(null)" v-model="perPage"
                class="appearance-none relative block w-24 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div> -->
      <div>
        <input v-model="search" @change="getTicketsRanking(null)"
               class="appearance-none relative block w-48 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
               placeholder="Buscar tickets">
      </div>
    </div>

    <table class="table-auto w-full">
      <thead>
      <tr>        
        <TableHeaderCell field="rank" :sort-field="sortField" :sort-direction="sortDirection" :justify="'center'"
                         >
          Posición
        </TableHeaderCell>        
        <TableHeaderCell field="code" :sort-field="sortField" :sort-direction="sortDirection" :justify="'center'"
                         >
          Ticket
        </TableHeaderCell>
        <template v-for="(race, i) of play.races" field="race">
          <TableHeaderCell  :sort-field="sortField" :sort-direction="sortDirection" :justify="'center'">
            {{ 'C' + race.number }}
          </TableHeaderCell>           
          <TableHeaderCell :sort-field="sortField" :sort-direction="sortDirection" :justify="'center'">
            Pts
          </TableHeaderCell>           
        </template>           
        <TableHeaderCell field="points" :sort-field="sortField" :sort-direction="sortDirection" :justify="'center'"
                         >
          Total
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
      <tbody class="text-center" v-else>
      <tr v-for="(ticket, index) of tickets.data" :key="ticket.id">
        <td class="border-b p-2 max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis"
          :class="{
            'bg-yellow-300': ticket.position == 1,
            'bg-yellow-100': ticket.position == 2
            }"
        >
          {{  ticket.position ?? ((index + 1) + ((tickets.page - 1) * tickets.limit)) }}
        </td>        
        <td class="border-b p-2 ">
         {{ ticket.code }}
        </td>     
        <template v-for="(pick, y) of ticket.picks">
          <td class="border-b p-2 " >
          {{ pick.picked }} <span v-if="pick.next_pick">({{ pick.next_pick }})</span>
          </td>                  
          <td class="border-b p-2 ">
          {{ pick.points ?? 0 }}
          </td>                  
        </template>             
        <td class="border-b p-2 max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis bg-gray-200">
          {{ ticket.points ?? 0 }}
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
import {computed, onMounted, watch, ref} from "vue";
import store from "../../store";
import Spinner from "../../components/core/Spinner.vue";
import {RANKING_PER_PAGE} from "../../constants";
import TableHeaderCell from "../../components/core/Table/TableHeaderCell.vue";
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/vue";

const props = defineProps({  
  play: {
    required: true,
    type: Object
  }
})

const perPage = ref(RANKING_PER_PAGE);
const search = ref('');
const tickets = computed(() => store.state.tickets);
const sortField = ref('position');
const sortDirection = ref('asc')

const ticket = ref({})

onMounted(() => {    
  getTicketsRanking();
})

watch(() => props.play, (play, prevPlay) => {
  getTicketsRanking();
});

function getForPage(ev, link) {
  ev.preventDefault();
  if (!link.url || link.active) {
    return;
  }

  getTicketsRanking(link.url)
}

function getTicketsRanking(url = null) {  
  store.dispatch("getTicketsRanking",     
  {
    playId: props.play.id,
    url,
    search: search.value,
    per_page: perPage.value
  });
}
</script>