
export function setUser(state, user) {
  state.user.data = user;
}

export function setToken(state, token) {
  state.user.token = token;
  if (token) {
    localStorage.setItem('TOKEN', token);
  } else {
    localStorage.removeItem('TOKEN')
  }
}

export function setUsers(state, [loading, data = null]) {

  if (data) {
    state.users = {
      ...state.users,
      data: data.data,
      links: data.meta?.links,
      page: data.meta.current_page,
      limit: data.meta.per_page,
      from: data.meta.from,
      to: data.meta.to,
      total: data.meta.total,
    }
  }
  state.users.loading = loading;
}

export function setPlays(state, [loading, data = null]) {

  if (data) {
    state.plays = {
      ...state.plays,
      data: data.data,
      links: data.meta?.links,
      page: data.meta.current_page,
      limit: data.meta.per_page,
      from: data.meta.from,
      to: data.meta.to,
      total: data.meta.total,
    }
  }
  state.plays.loading = loading;
}
export function setTickets(state, [loading, data = null]) {

  if (data) {
    state.tickets = {
      ...state.tickets,
      data: data.data,
      links: data.meta?.links,
      page: data.meta.current_page,
      limit: data.meta.per_page,
      from: data.meta.from,
      to: data.meta.to,
      total: data.meta.total,
    }    
  }
  state.tickets.loading = loading;
}

export function setSettings(state, data) {
  if (data) {
    state.settings = {
      ...state.settings,
      data: data.data
    }
  } 
}

export function showToast(state, message) {
  state.toast.show = true;
  state.toast.message = message;
}

export function hideToast(state) {
  state.toast.show = false;
  state.toast.message = '';
}