import React from 'react';
import {Restaurants, Orders} from 'api';
// import moment from 'moment';
import {Link, browserHistory} from 'react-router';
import ReactPaginate from 'react-paginate';
import {Rate} from 'components/sipboo';

// import Emitter from '../base/emitter';
let imageNoDish = require('assets/img/no-dish.png');
let noAvatar = require('assets/img/avatar-default.png');
let windowPayment = null;

class RestaurantOrder extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      prefix: "ORDERS",
      dataList: [],
      orders: [],
      alreadyOrder: 0,
      limit: 12,
      pagination: {
        itemCount: 0,
        page: this.props.location.query.page || 1
      },
      rest_id: this.props.params.id,
      loading: true,
      fee: {
        service_fee: 0,
        rate: 0,
        onepay_fee: 0,
        shipping_fee: 0,
        onepay_rate: 0,
        sipboo_rate: 0
      },
      distance: 0,
      rest: {},
      price: {
        subtotal: 0
      },
      paymenttype: {
        local: 0,
        visa: 1,
        type: 0
      },
      params_save_order: {
        lat: 0,
        lng: 0,
        order_group_id: this.props.location && this.props.location.query ? this.props.location.query.t : '',
        shipper_ids: [],
        content: []
      },
      errorMessage: ''
    }
    this.changePaymentType = this.changePaymentType.bind(this);
    this.checkOut = this.checkOut.bind(this)
  }

  checkOut() {
    let params = this.state.params_save_order;
    let coordsPosition = {
      lat: 0,
      lng: 0
    }
    console.log(params)
    Restaurants.actions.getCurrentLocation.request(null).then(position => {
      coordsPosition = position.data.location;
      params.lat = coordsPosition.lat;
      params.lng = coordsPosition.lng;

      Orders.actions.save.request(null, params).then(res => {
        params.order_group_id = res.data.data.id;
        this.setState({
          params_save_order: params
        }, () => {
          browserHistory.push(`/restaurant/order/${this.props.params.id}?t=${res.data.data.id}&s=${params.shipper_ids}`);
          if(this.state.paymenttype.type === 0) {
            window.location.href = `http://admin.sipboo.com/api/payment?order_id=${params.order_group_id}&type=bank-charging&redirect=order`;
            // windowPayment = window.open(`http://admin.sipboo.com/api/payment?order_id=${params.order_group_id}&type=bank-charging`, "Local banking", "centerscreen=yes,width=768,height=680");
          }
          if(this.state.paymenttype.type === 1) {
            window.location.href = `http://admin.sipboo.com/api/payment?order_id=${params.order_group_id}&type=visa-charging&redirect=order`;
            // windowPayment = window.open(`http://admin.sipboo.com/api/payment?order_id=${params.order_group_id}&type=visa-charging`, "Visa banking", "centerscreen=yes,width=768,height=680");
          }
          windowPayment.onload = function() { 
            windowPayment.RunCallbackFunction = function() {
              console.warn(window)
            }; 
          };
          // 
        });
	  		
	  	}).catch( (error) => {
        if (error.response && error.response.data) {
          
          this.setState({errorMessage: error.response.data.message});
	        console.log( error.response.data)
	      }
	      
	    });
    });
    
  }

  changePaymentType(type) {
    this.setState({
      paymenttype: {
        type: type
      }
    }, () => {
      console.log(this.state.paymenttype)
    })
  }

  handlePageClick(page) {
    
    browserHistory.push(`/restaurant/order/${ this.state.rest_id}?page=${page.selected+1}`);
  };
  getSipboo() {
    let params = {
      rest_id: this.state.rest_id,
      limit: this.state.limit,
      page: this.state.pagination.page
    }
    
    this.setState({loading: true, dataList: []});
    Restaurants.actions.getSipboo.request(null, params).then(res => {
      
      if (res.data && res.data.data) {
        this.setState({
          dataList: res.data.data,
          pagination: res.data.pagination
        });
      } else {
        this.setState({
          dataList: [],
          pagination: {
            itemCount: 0,
            page: 1
          }
        });
      }
      this.setState({loading: false});
    });
  }
  
  chooseASipboo(sipboo) {
    let prefix = this.state.prefix+"_"+window.location.pathname.replace("/restaurant/order/", "");
    let orderCache = localStorage.getItem(prefix) ? JSON.parse(localStorage.getItem(prefix)) : [];
    // console.log(orderCache);
    let subtotal = 0;
    let content = [];
    orderCache.map((item, key)=>{
      content.push({
        "restId":item.rest_id,
        "quantity":item.quantity,
        "dishId":item.dish_id
      })
      subtotal = subtotal + (item.price * item.quantity);
    });
    this.setState({
      alreadyOrder: 1,
      orders: orderCache,
      price: {
        subtotal: subtotal
      },
      params_save_order: {
        lat: 0,
        lng: 0,
        order_group_id: "",
        shipper_ids: sipboo.id,
        content: JSON.stringify(content)
      }
    }, ()=>{
      let t = this.props.location && this.props.location.query ? (this.props.location.query.t || "") : '';
      browserHistory.push(`/restaurant/order/${this.props.params.id}?t=${t}&s=${sipboo.id}`);
    });
  }
 
  getRest() {
    
    let params = {
      id: this.props.params.id,
      lat: 0,
      lng: 0
    }
    let coordsPosition = {
      lat: 0,
      lng: 0
    }
    Restaurants.actions.getCurrentLocation.request(null).then(position => {
      coordsPosition = position.data.location;
      params.lat = coordsPosition.lat;
      params.lng = coordsPosition.lng;
      Restaurants.actions.find.request(null, params).then(res => {
        this.setState({
          fee: res.data.data.fee || {},
          rest: res.data.data,
          distance: (res.data.data.distance) ? res.data.data.distance.toFixed(2) : 0
        }, ()=> {
          // console.log(this.state.fee)
        })
      });
    });
    
    
  }
  componentDidMount() {
    this.getSipboo();
    this.getRest();
    
  }
 

  render() {
    let childElements = this.state.dataList.map((item, i) => {
      return (
        <div className="col-sm-3" key={i}>
          <Link className="star-coolpals" >
            <div className="sb-avatar" >
              <div className="avatar" style={{
                    backgroundImage: `url(${ (item.avatar ) ? item.avatar.replace("/upload/","/upload/w_150,h_150,c_thumb/w_150/") : noAvatar })`
                  }}></div>

            </div>
            <p className="name"><strong>{item.fullname}</strong></p>
            <p className="small-text">{item.phone}</p>
            <Rate star={item.star}/>
            <button onClick={this.chooseASipboo.bind(this, item)}>Select</button>
          </Link>
        </div>
      );
    });
    return (
      <div id="content" className="restaurant_order_page">
      
        <section>

          <div className="container">

            <div className="row">
              <div className="col-md-6 col-md-push-3">
                {
                  this.state.alreadyOrder == 1 ? (
                    <ul className="process-steps">
                      <li className="step active">Choose a Sipboo</li>
                      <li className="step active">Checkout</li>
                    </ul>
                  ) : (
                    <ul className="process-steps">
                      <li className="step active">Choose a Sipboo</li>
                      <li className="step">Checkout</li>
                    </ul>
                  )
                }
                
              </div>
            </div>
            
            { this.state.loading && (
                <div className="row">
                {
                  [0,1,2,3,4,5,6,7].map((item, i)=> {
                    return (
                      <div className="timeline-wrapper col-md-3 p-10" key={i}>
                        <div className="timeline-item">
                          <div className="animated-background facebook header-avatar">
                            <div className="background-masker "></div>
                          </div>
                          <div className="animated-background facebook header-rest">
                            <div className="background-masker"></div>
                            <div className="background-masker"></div>
                            <div className="background-masker"></div>
                            <div className="background-masker"></div>

                            <div className="background-masker"></div>
                            <div className="background-masker"></div>
                            <div className="background-masker"></div>
                            <div className="background-masker"></div>
                            <div className="background-masker"></div>
                            <div className="background-masker"></div>

                          </div>
                        </div>
                      </div>
                    )
                  })
                  
                }  
                </div>
            )
            }
            

            {
              this.state.alreadyOrder === 1 ? (
                <div className="row">
                  <div className="col-md-4 col-xs-12">
                    <div className="rest-item col-sm-12 col-xs-12">
                      
                      <div className="post post-boxed mt-50">
                        <div className="post-image bg-image-rest" style={{
                            backgroundImage: `url(${this.state.rest.image})`
                          }}>
                        </div>
                        <ul className="post-meta pl-0 pr-0">
                          <li className=""><span>Author:</span><a>{this.state.rest.owner.fullname}</a></li>
                        </ul>
                        <div className="post-content pt-10 pl-0 pr-0">
                          <h5>{this.state.rest.name}</h5>
                          <p>{this.state.rest.address}</p>
                          <Link to={`/restaurant/${this.state.rest.id}`} className="read-more">See restaurant</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-8 col-xs-12">
                    <table className="table cart">
                      <tbody>
                        <tr>
                          <th></th>
                          <th>Dish name</th>
                          <th>Price</th>
                          <th>Qty</th>
                          <th>Total</th>
                          <th></th>
                        </tr>
                        {
                          this.state.orders.map( (item, key) => {
                            return (
                              <tr key={key}>
                                <td className="image">
                                  <a >
                                  {
                                      item.image.indexOf("no-image")!=-1 ? (
                                        <div className="logo-dish" style={{
                                          backgroundImage: `url(${imageNoDish})`
                                        }}></div>
                                      ) : (
                                        <div className="logo-dish" style={{
                                          backgroundImage: `url(${item.image || imageNoDish})`
                                        }}></div>
                                      )
                                    }
                                  </a>
                                </td>
                                <td className="title">
                                  <a ><h6>{item.name}</h6></a>
                                </td>
                                <td className="price">
                                {item.price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}
                                </td>
                                <td className="qty"> 
                                  <input type="number" className="form-control input-sm input-qty" defaultValue={item.quantity}/>
                                </td>
                                <td className="total">
                                {
                                  (item.price * item.quantity).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})
                                }
                                </td>
                                <td className="remove">
                                  <a ><i className="ti-close"></i></a>
                                </td>
                              </tr>
                            )
                          })
                        }
                        
                      </tbody>
                      

                    </table>
                  

                    <div className="row">
                      <div className="col-md-6 col-xs-12">
                        <h5>Shipping details:</h5>
                        <form action="#">
                          <div className="form-group select-wrapper">
                            <select name="country" id="country" className="form-control">
                              <option value="" disabled selected>Select your state...</option>
                              <option value="DN_VN">Da Nang, Viet Nam</option>
                              <option value="AF" disabled>Ha Noi, Viet Nam</option>
                              <option value="HCM" disabled>Ho Chi Minh, Viet Nam</option>
                              
                            </select>
                          </div>
                          <div className="form-group">
                            <div className="radio">
                              <input type="checkbox" defaultChecked  disabled id="shipping1"/><label htmlFor="shipping1">Sipboo fee (+{ (this.state.fee.sipboo_rate + this.state.fee.onepay_rate) || 0}%)</label>
                            </div>
                            <div className="radio">
                              <input type="checkbox" defaultChecked disabled id="shipping2"/><label htmlFor="shipping2">Truemoney fee - 1pay (+{this.state.fee.onepay_fee.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})})</label>
                            </div>
                            <div className="radio">
                              <input type="checkbox" defaultChecked disabled id="shipping3"/><label htmlFor="shipping3">
                                Shipping fee ({this.state.distance}km * {this.state.fee.shipping_fee * this.state.fee.rate}/km)</label>
                            </div>
                          </div>
                          {/* <button className="btn btn-filled btn-primary btn-sm">Calculate shipping</button> */}
                        </form>
                      </div>
                      
                      {/* <div className="col-md-4">
                        <h5>Coupon code:</h5>
                        <form action="#">
                          <div className="form-group">
                            <input type="text" disabled className="form-control" placeholder="Coupon code..."/>
                          </div>
                          <button disabled className="btn btn-filled btn-primary btn-sm">Use coupon!</button>
                        </form>
                      </div> */}
                      
                      <div className=" col-md-6 col-xs-12">
                        <h5>Order total:</h5>
                        <table className="table text-md">
                          <tbody>
                          <tr>
                            <td className="text-right"><strong>Cart subtotal:</strong></td>
                            <td>{this.state.price.subtotal.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</td>
                          </tr>
                          <tr>
                            <td className="text-right"><strong>Shipping:</strong></td>
                            <td>
                              
                              {
                                (
                                  (this.state.fee.onepay_fee) + (this.state.fee.shipping_fee * this.state.fee.rate * this.state.distance)
                                  +
                                  (
                                    ((this.state.fee.onepay_fee) + (this.state.fee.shipping_fee * this.state.fee.rate * this.state.distance)) * this.state.fee.service_fee / 100
                                  )
                                
                                ).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})
                              }
                              
                            </td>
                          </tr>
                          <tr>
                            <td className="text-right"><strong>Order total:</strong></td>
                            <td className="text-primary"><strong>
                            {
                                (
                                  (this.state.price.subtotal)
                                  +
                                  (
                                    (this.state.fee.onepay_fee) + (this.state.fee.shipping_fee * this.state.fee.rate * this.state.distance)
                                    +
                                    (
                                      ((this.state.fee.onepay_fee) + (this.state.fee.shipping_fee * this.state.fee.rate * this.state.distance)) * this.state.fee.service_fee / 100
                                    )
                                  
                                  )
                                ).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})
                              }

                              </strong></td>
                              
                          </tr>
                          
                            </tbody>
                        </table>
                        <div className=" col-md-12 col-xs-12 pl-0 pr-0">
                          <h5>Payment method:</h5>
                          {
                            this.state.errorMessage != '' && (
                              <div className="alert alert-danger">{this.state.errorMessage}</div>
                            )
                          }
                          <table className="table text-md">
                            <tbody>
                            <tr>
                              <td colSpan={2}>
                                <div className="form-group">
                                  <div className="radio">
                                    <input type="radio" value={this.state.paymenttype.local} 
                                    onChange={this.changePaymentType.bind(this, 0)} id="paymenttype1"
                                    checked={this.state.paymenttype.type === 0}/><label htmlFor="paymenttype1">Local banking</label>
                                  </div>
                                  <div className="radio">
                                    <input type="radio" value={this.state.paymenttype.visa} 
                                    onChange={this.changePaymentType.bind(this, 1)} id="paymenttype12"
                                    checked={this.state.paymenttype.type === 1} /><label htmlFor="paymenttype12">Visa - creditcard</label>
                                  </div>
                                  
                                </div>
                              </td>
                              </tr>
                          </tbody>
                          </table>
                        </div>
                        <Link onClick={this.checkOut.bind(this)} className="btn btn-filled btn-primary btn-block pull-left">Go to checkout <i className="i-after ti-arrow-right"></i></Link>
                      </div>
                      
                    </div>
                  </div>
                </div>
              ) : (
                
                <div className="row row-h500">
                  <div className="col-md-12">
                    <div className="section-star-coolpals">{childElements}</div>
                    <div className="sidebar-widget sidebar-widget-custom1 sidebar-widget-pagination">
                      <ReactPaginate
                        breakLabel={<a href="javascript:void(0)">...</a>}
                        breakClassName={"break-me"}
                        pageCount={ Math.ceil(this.state.pagination.itemCount / this.state.limit) }
                        pageRangeDisplayed={3}
                        forcePage={this.state.pagination.page-1}
                        onPageChange={this.handlePageClick.bind(this)}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"} />

                    </div>
                  </div>
                  
                </div>
              )
            }
            

          </div>

          </section>
      </div>
    );
  }
}

export default RestaurantOrder;
