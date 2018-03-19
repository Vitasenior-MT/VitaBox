import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../components/GeneralViews/NotFoundPage.vue'

// Admin pages
import Home from 'src/components/Dashboard/Views/Home.vue'
import History from 'src/components/Dashboard/Views/History.vue'
import Warnings from 'src/components/Dashboard/Views/Warnings.vue'
import Warnings2 from 'src/components/Dashboard/Views/Warnings2.vue'
import Warnings3 from 'src/components/Dashboard/Views/Warnings3.vue'
import Warnings4 from 'src/components/Dashboard/Views/Warnings4.vue'
import ShowData from 'src/components/Dashboard/Views/ShowData.vue'
import VidOnly from 'src/components/Dashboard/Views/VidOnly.vue'

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/vitabox/home'
  },
  {
    path: '/vitabox',
    component: DashboardLayout,
    redirect: '/vitabox/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: Home
      },{
        path: 'history',
        name: 'history',
        component: History
      },
      {
        path: 'warnings',
        name: 'warnings',
        component: Warnings
      },
      {
        path: 'warnings2',
        name: 'warnings2',
        component: Warnings2
      },
      {
        path: 'warnings3',
        name: 'warnings3',
        component: Warnings3
      },
      {
        path: 'warnings4',
        name: 'warnings4',
        component: Warnings4
      },
      {
        path: 'show-data',
        name: 'show-data',
        component: ShowData
      },
      {
        path: 'vid-only',
        name: 'vid-only',
        component: VidOnly
      }
    ]
  },
  { path: '*', component: NotFound }
]

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes
