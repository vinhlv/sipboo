import reduxApi from 'redux-api';
import customFetch from 'api/axios';
import { API_URL } from 'config';
// import Cookies from 'universal-cookie';

// const cookies = new Cookies();

export default reduxApi({

  save: {
    url: `${API_URL}/orders/save`,
    options: (url, _params = {}, getState) => {
      return {
        method: 'POST',
        data: _params
      };
    }
  },
  invoice: {
    url: `${API_URL}/sipboo/hire`,
    options: (url, _params = {}, getState) => {
      return {
        method: 'POST',
        data: _params
      };
    }
  },
  getDistance: {
    url: `${API_URL}/sipboo/distance`,
    options: (url, _params = {}, getState) => {
      return {
        method: 'POST',
        data: _params
      };
    }
  },

  preview_invoice: {
    url: `${API_URL}/sipboo/preview_invoice`,
    options: (url, _params = {}, getState) => {
      return {
        method: 'POST',
        data: _params
      };
    }
  }
}).use('fetch', customFetch);
