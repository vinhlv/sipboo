import React from 'react';
// import {Restaurants} from 'api';
// import moment from 'moment';
// import {Link, browserHistory} from 'react-router';
// import ReactPaginate from 'react-paginate';

// import Emitter from '../base/emitter';


class Rate extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

 

  render() {
    let star = this.props.star;
    return (
      <div className="template-rating">
        {
          star == 5 ? 
          (
            <div className="rate">
            <i className="fa fa-star active"></i>
            <i className="fa fa-star active"></i>
            <i className="fa fa-star active"></i>
            <i className="fa fa-star active"></i>
            <i className="fa fa-star active"></i>
          </div>
          ) : (null)
        }
        {
          star == 4 ? 
          (
            <div className="rate">
            <i className="fa fa-star active"></i>
            <i className="fa fa-star active"></i>
            <i className="fa fa-star active"></i>
            <i className="fa fa-star active"></i>
            <i className="fa fa-star "></i>
          </div>
          ) : (null)
        }
        {
          star == 3 ? 
          (
            <div className="rate">
            <i className="fa fa-star active"></i>
            <i className="fa fa-star active"></i>
            <i className="fa fa-star active"></i>
            <i className="fa fa-star "></i>
            <i className="fa fa-star "></i>
          </div>
          ) : (null)
        }
        {
          star == 2 ? 
          (
            <div className="rate">
            <i className="fa fa-star active"></i>
            <i className="fa fa-star active"></i>
            <i className="fa fa-star "></i>
            <i className="fa fa-star "></i>
            <i className="fa fa-star "></i>
          </div>
          ) : (null)
        }
        {
          star == 1 ? 
          (
            <div className="rate">
            <i className="fa fa-star active"></i>
            <i className="fa fa-star "></i>
            <i className="fa fa-star "></i>
            <i className="fa fa-star "></i>
            <i className="fa fa-star "></i>
          </div>
          ) : (null)
        }
        {
          star == 0 ? 
          (
            <div className="rate">
            <i className="fa fa-star "></i>
            <i className="fa fa-star "></i>
            <i className="fa fa-star "></i>
            <i className="fa fa-star "></i>
            <i className="fa fa-star "></i>
          </div>
          ) : (null)
        }
        </div>
    );
  }
}

export default Rate;
