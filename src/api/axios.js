import axios from 'axios';

var Promise = require('es6-promise').Promise;
export default function customFetch(url, options) {
  // return a promise of axios
  let lang = localStorage.getItem('lang') || 'en';
  axios.defaults.headers.common['lang'] = lang;
  if (localStorage.getItem('api_token')) {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+localStorage.getItem('api_token');
  }

  return new Promise((resolve, reject) => {
    axios(url, options).then(response => {
      resolve(response);
    }).catch(error => {
      reject(error);
    });
  });
}
