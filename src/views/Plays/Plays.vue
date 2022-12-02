<template>
  <div class="flex items-center justify-between mb-3">
    <h1 class="text-3xl font-semibold">Jugadas</h1>
    <button
      v-if="store.state.user.data.role == 'superadmin'"
      @click="showAddNewModal()"
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
      Agregar nueva jugada
    </button>
  </div>
  <PlaysTable @clickEdit="editPlay" />
  <PlayModal v-model="showplayModal" :play="playModel" :raceTracks="raceTracks" @close="onModalClose"/>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import store from "../../store";
import PlayModal from "./PlayModal.vue";
import PlaysTable from "./PlaysTable.vue";

const DEFAULT_PLAY = {
  id: null,
  race_track_id: null,
  start_at: new Date(),
  close_at: dayjs().set('hour', 15).set('minute', 0).format('YYYY-MM-DD HH:mm'),
  status: 1,
  prize: [
    {
      position: 1,
      percentage: 50,
    },
    {
      position: 2,
      percentage: 25,
    },
  ],
  races: [
    {
      number: null,
      participants_number: null,
      removed: null,
    },   
    {
      number: null,
      participants_number: null,
      removed: null,
    },   
    {
      number: null,
      participants_number: null,
      removed: null,
    },   
    {
      number: null,
      participants_number: null,
      removed: null,
    },   
    {
      number: null,
      participants_number: null,
      removed: null,
    },   
    {
      number: null,
      participants_number: null,
      removed: null,
    },   
  ],
};

const plays = computed(() => store.state.plays);
const raceTracks = ref({});

const playModel = ref({ ...DEFAULT_PLAY });
const showplayModal = ref(false);

onMounted(() => {
  getRaceTracks();
})

function getRaceTracks() {
  store.dispatch('getRaceTracks')
    .then(response => {
      raceTracks.value = response.data.data
    })
}

function showAddNewModal() {
  showplayModal.value = true;
}

function editPlay(u) {
  playModel.value = u;
  showAddNewModal();
}

function onModalClose() {
  playModel.value = { ...DEFAULT_PLAY };
}
</script>

<style scoped>
</style>
