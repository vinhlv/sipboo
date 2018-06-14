import App from 'app';
import Home from 'components/home';
import Hire from 'components/hire';
import {Categories} from 'components/categories';
import {UserProfile} from 'components/users';
import {RestaurantDetail, RestSearch, RestaurantOrder} from 'components/restaurants';
import {Terms, Privacy} from 'components/footer';
import {RestaurantsManage, UsersManage, ManageSMS, ManageAPN} from 'components/manage';

export default function routes({ dispatch }) {
  return [{
    path: "/",
    component: App,
    indexRoute: {
      component: Home,
      name: 'home'
    },
    childRoutes: [{
    	path: "sipboo/hire/:id",
      component: Hire,
      name: 'hire'
    },
    {
    	path: "user/:id",
      component: UserProfile,
      name: 'user_profile'
    },
    {
    	path: "categories",
      component: Categories,
      name: 'categories'
    },
    {
    	path: "restaurant/:id",
      component: RestaurantDetail,
      name: 'rest_detail'
    },
    {
    	path: "restaurant/order/:id",
      component: RestaurantOrder,
      name: 'restaurant_order'
    },

    {
    	path: "terms",
      component: Terms,
      name: 'terms'
    },{
    	path: "privacy",
      component: Privacy,
      name: 'privacy'
    },
    {
      path: "manage/restaurants",
      component: RestaurantsManage,
      name: 'restaurants_manage'
    },
    {
      path: "manage/sms/send",
      component: ManageSMS,
      name: 'sms_manage_send'
    },
    {
      path: "manage/apn_firebase",
      component: ManageAPN,
      name: "apn_firebase"
    },
    {
      path: "manage/users",
      component: UsersManage,
      name: 'users_manage'
    },{
      path: "rest/search",
      component: RestSearch,
      name: 'rest_search'
    }]
  }];
}
