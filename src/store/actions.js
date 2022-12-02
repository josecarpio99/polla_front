import axiosClient from "../axios";

export function getCurrentUser({commit}, data) {
  return axiosClient.get('/profile', data)
    .then(({data}) => {
      commit('setUser', data.data);
      return data;
    })
}

export function login({commit}, data) {
  return axiosClient.post('/login', data)
    .then(({data}) => {
      commit('setUser', data.data);
      commit('setToken', data.token)
      return data;
    })
}

export function logout({commit}) {
  return axiosClient.post('/logout')
    .then((response) => {
      commit('setToken', null)

      return response;
    })
}

export function getUsers({commit, state}, {url = null, search = '', per_page, sort_field, sort_direction} = {}) {
  commit('setUsers', [true])
  url = url || '/users'
  const params = {
    per_page: state.users.limit,
  }
  return axiosClient.get(url, {
    params: {
      ...params,
      search, per_page, sort_field, sort_direction
    }
  })
    .then((response) => {
      commit('setUsers', [false, response.data])
    })
    .catch(() => {
      commit('setUsers', [false])
    })
}

export function getUser({commit}, id) {
  return axiosClient.get(`/users/${id}`)
}

export function listUsers({commit}) {
  return axiosClient.get(`/users/list`)
}

export function getPosUsers({commit}) {
  return axiosClient.get(`/users/pos`)
}

export function createUser({commit}, user) {
  return axiosClient.post('/users', user)
}

export function assignPosToUser({commit}, user) {
  return axiosClient.post('/users/add-pos', user)
}

export function updateUser({commit}, user) {
  return axiosClient.put(`/users/${user.id}`, user)
}

export function deleteUser({commit}, user) {
  return axiosClient.delete(`/users/${user.id}`, user)
}

export function getPlays({commit, state}, {url = null, search = '', per_page, sort_field, sort_direction, active} = {}) {
  commit('setPlays', [true])
  url = url || '/plays'
  const params = {
    per_page: state.plays.limit,
  }
  return axiosClient.get(url, {
    params: {
      ...params,
      search, per_page, sort_field, sort_direction, active
    }
  })
    .then((response) => {
      commit('setPlays', [false, response.data])
    })
    .catch(() => {
      commit('setPlays', [false])
    })
}

export function getPlay({commit}, id) {
  return axiosClient.get(`/plays/${id}`)
}

export function listPlays({commit}) {
  return axiosClient.get(`/plays/list`)
}

export function getSales({commit}, playId) {
  return axiosClient.get(`/plays/${playId}/sales`)
}

export function getSalesByUser({commit}, {playId, userId}) {
  return axiosClient.get(`/plays/${playId}/user/${userId}/sales`)
}

export function togglePlayStatus({commit}, id) {
  return axiosClient.post(`/plays/${id}/toggle`)
}

export function createPlay({commit}, play) {
  return axiosClient.post('/plays', play)
}

export function updatePlay({commit}, play) {
  return axiosClient.put(`/plays/${play.id}`, play)
}

export function deletePlay({commit}, play) {
  return axiosClient.delete(`/plays/${play.id}`, play)
}

export function updatePoints({commit}, {playId, races}) {
  return axiosClient.put(`/plays/${playId}/update-points`, races)
}

export function updateWinners({commit}, playId) {
  return axiosClient.put(`/plays/${playId}/tickets/update-winners`)
}

export function getTicketsRanking({commit, state}, {playId, url = null, search = '', per_page, sort_field, sort_direction} = {}) {
  commit('setTickets', [true]) 
  url = url || `/plays/${playId}/ranking`
  const params = {
    per_page: state.tickets.limit,
  }
  return axiosClient.get(url, {
    params: {
      ...params,
      search, per_page, sort_field, sort_direction
    }
  })
    .then((response) => {
      commit('setTickets', [false, response.data])
    })
    .catch(() => {
      commit('setTickets', [false])
    })
}

export function getTickets({commit, state}, {playId, url = null, search = '', per_page, sort_field, sort_direction} = {}) {
  commit('setTickets', [true]) 
  url = url || `/plays/${playId}/tickets`
  const params = {
    per_page: state.tickets.limit,
  }
  return axiosClient.get(url, {
    params: {
      ...params,
      search, per_page, sort_field, sort_direction
    }
  })
    .then((response) => {
      commit('setTickets', [false, response.data])
    })
    .catch(() => {
      commit('setTickets', [false])
    })
}

export function getTicket({commit}, {playId, id}) {
  return axiosClient.get(`/plays/${playId}/tickets/${id}`)
}

export function createTicket({commit}, {playId, ticket}) {
  return axiosClient.post(`/plays/${playId}/tickets`, ticket)
}

export function updateTicket({commit}, {playId, ticket}) {  
  return axiosClient.put(`/plays/${playId}/tickets/${ticket.id}`, ticket)
}

export function deleteTicket({commit}, {playId, ticket}) {
  return axiosClient.delete(`/plays/${playId}/tickets/${ticket.id}`, ticket)
}

export function getRaceTracks({commit, state}) {
  return axiosClient.get('racetracks')
    .then((response) => {
      return response
    })
}

export function getSettings({commit, state}) {
  return axiosClient.get(`/settings`)
    .then((response) => {
      commit('setSettings', response.data)
    })    
}

export function updateSettings({commit}, data) {
  return axiosClient.put(`/settings`, data)
}