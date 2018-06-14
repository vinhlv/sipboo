import reduxApi from 'redux-api';
import customFetch from 'api/axios';
import { API_URL } from 'config';
// import Cookies from 'universal-cookie';

// const cookies = new Cookies();

export default reduxApi({
  login: {
    url: `${API_URL}/auth/login`,
    options: (url, params, getState) => {
      return {
        method: 'POST',
        data: params
      };
    }
  },
  forgotPassword: {
    url: `${API_URL}/auth/forgot_password`,
    options: (url, params, getState) => {
      return {
        method: 'POST',
        data: params
      };
    }
  },
  changeNewPassword: {
    url: `${API_URL}/auth/new_password`,
    options: (url, params, getState) => {
      return {
        method: 'POST',
        data: params
      };
    }
  },
  signup: {
    url: `${API_URL}/auth/register`,
    options: (url, params, getState) => {
      return {
        method: 'POST',
        data: params
      };
    }
  },
  sendCode: {
    url: `${API_URL}/auth/get_code_signup`,
    options: (url, params, getState) => {
      return {
        method: 'POST',
        data: params
      };
    }
  },
  otherProfile: {
    url: `${API_URL}/user_info`,
    options: (url, _params = {}, getState) => {
      // _params.api_token = cookies.get('api_token');
      return {
        method: 'GET',
        params: _params
      };
    }
  },
  logout: {
    url: `${API_URL}/auth/logout`,
    options: (url, _params = {}, getState) => {
      // _params.api_token = cookies.get('api_token');
      return {
        method: 'GET',
        params: _params
      };
    }
  },
  getRest: {
    url: `${API_URL}/rest`,
    options: (url, _params = {}, getState) => {
      // _params.api_token = cookies.get('api_token') || '';
      return {
        method: 'GET',
        params: _params
      };
    }
  },
  getCategories: {
    url: `${API_URL}/categories`,
    options: (url, _params, getState) => {
      return {
        method: 'GET',
        data: _params
      };
    }
  },
  getSubCategories: {
    url: `${API_URL}/interests`,
    options: (url, _params, getState) => {
      return {
        method: 'GET',
        data: _params
      };
    }
  },
  getSearchSipboo: {
    url: `${API_URL}/sipboo/our_star`,
    options: (url, _params = {}, getState) => {
      return {
        method: 'GET',
        data: _params
      };
    }
  }
}).use('fetch', customFetch);
