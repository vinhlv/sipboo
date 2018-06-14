import reduxApi from 'redux-api';
import customFetch from 'api/axios';
import { API_URL } from 'config';
// import Cookies from 'universal-cookie';

// const cookies = new Cookies();

export default reduxApi({

  restaurants: {
    url: `${API_URL}/admins/rest`,
    options: (url, _params = {}, getState) => {
      return {
        method: 'GET',
        params: _params
      };
    }
  },
  users: {
    url: `${API_URL}/admins/users`,
    options: (url, _params = {}, getState) => {
      return {
        method: 'GET',
        params: _params
      };
    }
  },
  delUser: {
    url: `${API_URL}/admins/delete_users`,
    options: (url, _params = {}, getState) => {
      return {
        method: 'DELETE',
        params: _params
      };
    }
  },
  delRestaurants: {
    url: `${API_URL}/admins/delete_rest`,
    options: (url, _params = {}, getState) => {
      return {
        method: 'DELETE',
        params: _params
      };
    }
  },
  sendAPN: {
    url: `${API_URL}/admins/send_notification`,
    options: (url, _params = {}, getState) => {
      return {
        method: 'POST',
        params: _params
      };
    }
  },
  sendSMS: {
    url: `${API_URL}/send_sms`,
    options: (url, _params = {}, getState) => {
      return {
        method: 'POST',
        params: _params
      };
    }
  }
}).use('fetch', customFetch);
