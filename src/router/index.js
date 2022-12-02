import {createRouter, createWebHistory} from "vue-router";
import AppLayout from '../components/AppLayout.vue'
import Login from "../views/Login.vue";
import Users from "../views/Users/Users.vue";
import UserDetails from "../views/Users/UserDetails.vue";
import UserAssignPos from "../views/Users/UserAssignPos.vue";
import Plays from "../views/Plays/Plays.vue";
import ActivePlays from "../views/Plays/ActivePlays.vue";
import PlayRaceResults from "../views/Plays/PlayRaceResults.vue";
import TicketsRanking from "../views/Tickets/TicketsRanking.vue";
import Tickets from "../views/Tickets/Tickets.vue";
import TicketPrint from "../views/Tickets/TicketPrint.vue";
import CreateTicket from "../views/Tickets/CreateTicket.vue";
import Settings from "../views/Settings/Settings.vue";
import SalesAdjustments from "../views/Sales/SalesAdjustments.vue";
import SalesAdjustmentsPrint from "../views/Sales/SalesAdjustmentsPrint.vue";
import NotFound from "../views/NotFound.vue";
import Ranking from "../views/Ranking.vue";
import store from "../store";

const routes = [
  {
    path: '/',
    redirect: '/app'
  },  
  {
    path: '/puntuacion',
    name: 'puntuacion',
    component: Ranking
  },
  {
    path: '/app/play/:playId/ticket/:ticketId/print',
    name: 'app.ticket.print',
    component: TicketPrint,
    meta: {
      requiresLogin: true
    }
  },
  {
    path: '/app/play/:playId/sales/print/:userId?',
    name: 'app.sales.print',
    component: SalesAdjustmentsPrint          
  },
  {
    path: '/app',
    name: 'app',
    redirect: '/app/sell',
    component: AppLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'users',
        name: 'app.users',
        component: Users,
        meta: { 
          requiresRole: true,
          role: 'superdmin'
        }        
      },  
      {
        path: 'users/show/:id',
        name: 'app.users.show',
        component: UserDetails,
        meta: { 
          requiresRole: true,
          role: 'superdmin'
        }   
      }, 
      {
        path: 'users/:id/assign-pos',
        name: 'app.users.assign_pos',
        component: UserAssignPos,
        meta: { 
          requiresRole: true,
          role: 'superdmin'
        }   
      }, 
      {
        path: 'settings',
        name: 'app.settings',
        component: Settings,
        meta: { 
          requiresRole: true,
          role: 'superdmin'
        }   
      },
      {
        path: 'sales',
        name: 'app.sales',
        component: SalesAdjustments          
      },      
      {
        path: 'plays',
        name: 'app.plays',
        component: Plays                 
      },     
      {
        path: 'plays/:id/actualizar-puntos',
        name: 'app.plays.update_points',
        component: PlayRaceResults,        
        meta: { 
          requiresRole: false,
          role: 'superdmin'
        }           
      },     
      {
        path: 'plays/:id/puntuacion',
        name: 'app.plays.ranking',
        component: TicketsRanking                  
      },     
      {
        path: 'plays/:id/create',
        name: 'app.tickets.create',
        component: CreateTicket        
      },     
      {
        path: 'tickets/:id',
        name: 'app.tickets',
        component: Tickets        
      },             
      {
        path: 'sell',
        name: 'app.sell',
        component: ActivePlays        
      },    
    ]
  },  
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      requiresGuest: true
    }
  }, 
  {
    path: '/:pathMatch(.*)',
    name: 'notfound',
    component: NotFound,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (! store.state.user.token) {
    if (localStorage.getItem('TOKEN')) {
      store.state.user.token = localStorage.getItem('TOKEN')
    }
  }

  if (to.meta.requiresAuth && !store.state.user.token) {    
    next({name: 'login'})
  } else if (to.meta.requiresGuest && store.state.user.token) {
    next({name: 'app.sell'})
  } else if (to.meta.requiresRole){
    const userRole = store.state.user.data.role
    const roleRequired = to.meta.role
    if (userRole == 'superadmin') {
      next()
    } else if (roleRequired == 'admin' && userRole != 'admin') {
      next({name: 'app.sell'})      
    } else if (roleRequired == 'pos' && userRole != 'pos') {
      next({name: 'app.sell'})       
    }
    next({name: 'app.sell'})     
  } else {
    next();
    
  }

})

export default router;
