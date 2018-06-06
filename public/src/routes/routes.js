import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../components/GeneralViews/NotFoundPage.vue'

// Admin pages
import Exams from 'src/components/Dashboard/Views/Exams.vue'
import ExamsHist from 'src/components/Dashboard/Views/ExamsHist.vue'
import AmbientHist from 'src/components/Dashboard/Views/HistAmbi.vue'
import Warnings from 'src/components/Dashboard/Views/Warnings.vue'
import Warnings2 from 'src/components/Dashboard/Views/Warnings2.vue'
import ShowData from 'src/components/Dashboard/Views/ShowData.vue'

const routes = [
  {
    path: '/',
    component: Exams,
    redirect: '/vitabox/exames'
  }, {
    path: '/vitabox',
    component: DashboardLayout,
    redirect: '/vitabox/home',
    children: [
      {
        path: 'exames',
        name: 'Exames / Diagnósticos',
        component: Exams
      }, {
        path: 'exameshistorico',
        name: 'Hist. de Diagnósticos',
        component: ExamsHist
      }, {
        path: 'ambientehistorico',
        name: 'Hist. Sen. Ambientais',
        component: AmbientHist
      }, {
        path: 'warnings',
        name: 'warnings',
        component: Warnings
      }, {
        path: 'warnings2',
        name: 'warnings2',
        component: Warnings2
      }, {
        path: 'showData',
        name: 'showData',
        component: ShowData
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
