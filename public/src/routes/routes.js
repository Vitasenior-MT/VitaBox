import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../components/GeneralViews/NotFoundPage.vue'

// Admin pages
import Exams from 'src/components/Dashboard/Views/Exams.vue'
import ExamsHist from 'src/components/Dashboard/Views/ExamsHist.vue'
import Home from 'src/components/Dashboard/Views/Home.vue'
import AmbientHist from 'src/components/Dashboard/Views/HistAmbi.vue'
import Warnings from 'src/components/Dashboard/Views/Warnings.vue'
import ShowData from 'src/components/Dashboard/Views/ShowData.vue'
import ShowDataBasic from 'src/components/Dashboard/Views/ShowDataBasic.vue'
import VideoCall from 'src/components/Dashboard/Views/VideoCall.vue'

const routes = [
  {
    path: '/',
    component: Home,
    redirect: '/vitabox/bemvindo'
  }, {
    path: '/vitabox',
    component: DashboardLayout,
    redirect: '/vitabox/home',
    children: [
      {
        path: 'bemvindo',
        name: 'Bem Vindo',
        component: Home
      },
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
        path: 'videocall',
        name: 'videocall',
        component: VideoCall
      }, {
        path: 'showData',
        name: 'showData',
        component: ShowData
      }, {
        path: 'showDataBasic',
        name: 'showDataBasic',
        component: ShowDataBasic
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
