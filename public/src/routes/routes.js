import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../components/GeneralViews/NotFoundPage.vue'

// Admin pages
import Home from 'src/components/Dashboard/Views/Home.vue'
import Overview from 'src/components/Dashboard/Views/Overview.vue'
import UserProfile from 'src/components/Dashboard/Views/UserProfile.vue'
import Notifications from 'src/components/Dashboard/Views/Notifications.vue'
import Icons from 'src/components/Dashboard/Views/Icons.vue'
import Maps from 'src/components/Dashboard/Views/Maps.vue'
import Typography from 'src/components/Dashboard/Views/Typography.vue'
import TableList from 'src/components/Dashboard/Views/TableList.vue'
import Warnings from 'src/components/Dashboard/Views/Warnings.vue'
import Warnings2 from 'src/components/Dashboard/Views/Warnings2.vue'
import Warnings3 from 'src/components/Dashboard/Views/Warnings3.vue'
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
      },
      {
        path: 'overview',
        name: 'overview',
        component: Overview
      },
      {
        path: 'stats',
        name: 'stats',
        component: UserProfile
      },
      {
        path: 'notifications',
        name: 'notifications',
        component: Notifications
      },
      {
        path: 'icons',
        name: 'icons',
        component: Icons
      },
      {
        path: 'maps',
        name: 'maps',
        component: Maps
      },
      {
        path: 'typography',
        name: 'typography',
        component: Typography
      },
      {
        path: 'table-list',
        name: 'table-list',
        component: TableList
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
