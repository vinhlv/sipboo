import reduxApi from 'redux-api';
import customFetch from 'api/axios';
import { API_URL } from 'config';
// import Cookies from 'universal-cookie';

// const cookies = new Cookies();

export default reduxApi({
  getCurrentLocation: {
    url: `https://www.googleapis.com/geolocation/v1/geolocate`,
    options: (url, getState) => {
      return {
        method: 'POST',
        params: {
          key: "AIzaSyBsIgrSYbiTC6Gtqob7TU6NTL9onTXFE0Y"
        }
      };
    }
  },
  getSipboo: {
    url: `${API_URL}/rest/get_sipber`,
    options: (url, _params = {}, getState) => {
      return {
        method: 'GET',
        params: _params
      };
    }
  },
  find: {
    url: `${API_URL}/get_rest`,
    options: (url, _params = {}, getState) => {
      return {
        method: 'GET',
        params: _params
      };
    }
  }
}).use('fetch', customFetch);
