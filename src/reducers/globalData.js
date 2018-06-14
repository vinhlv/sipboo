let initialState = {}

function globalData(state = initialState, action) {
  switch (action.type) {
    case 'INIT_DATA':
      let newState = {
        ...state
      };

      return newState;

    default:
      return state;
  }
}

export { globalData }
