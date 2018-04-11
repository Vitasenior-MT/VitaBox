import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../components/GeneralViews/NotFoundPage.vue'

// Admin pages
import Home from 'src/components/Dashboard/Views/Home.vue'
import History from 'src/components/Dashboard/Views/History.vue'
import History2 from 'src/components/Dashboard/Views/History2.vue'
import History3 from 'src/components/Dashboard/Views/History3.vue'
import Exams from 'src/components/Dashboard/Views/Exams.vue'
import Wizard from 'src/components/Dashboard/Views/Wizard.vue'
import Warnings from 'src/components/Dashboard/Views/Warnings.vue'
import Warnings2 from 'src/components/Dashboard/Views/Warnings2.vue'
import ShowData from 'src/components/Dashboard/Views/ShowData.vue'
import ShowData2 from 'src/components/Dashboard/Views/ShowData2.vue'
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
      }, {
        path: 'history',
        name: 'history',
        component: History
      }, {
        path: 'historicosensoresambientais',
        name: 'Historico Sensores Ambientais',
        component: History2
      }, {
        path: 'historicosensoresambientaisv2',
        name: 'Historico Sensores Ambientais V2',
        component: History3
      }, {
        path: 'exames',
        name: 'Exames / Diagnósticos',
        component: Exams
      }, {
        path: 'wizard',
        name: 'wizard',
        component: Wizard
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
        path: 'show-data',
        name: 'Sensores distrimuidos por Divisão',
        component: ShowData
      },
      {
        path: 'show-data2',
        name: 'Sensores distrimuidos por Divisão',
        component: ShowData2
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
