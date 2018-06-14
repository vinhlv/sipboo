import React from 'react';
import {Restaurants} from 'api';
import moment from 'moment';
import {Link} from 'react-router';

import Emitter from '../base/emitter';

let branch = require('branch-sdk');
let imageNoDish = require('assets/img/no-dish.png');

class RestaurantDetail extends React.Component {
  constructor(props, context) {
    super(props, context);
    window.scrollTo(0, 0);
    this.state = {
      prefix: "ORDERS",
      orders: [],
      data: {
        dishes: [],
        distance: 0,
        fee: {
          shipping_fee: 0
        }
      }
    }
  }

  addDish(item) {
    let prefix = this.state.prefix+"_"+this.state.data.id;
    let quantity = 1;
    let orderCache = localStorage.getItem(prefix) ? JSON.parse(localStorage.getItem(prefix)) : [];
    let hasDish = false;
    orderCache.map((o) => {
      if(o.dish_id == item.id) {
        o.quantity = o.quantity + 1;
        hasDish = true;
      }
    });
    if(!hasDish) {
      let order = {
        rest_id: this.state.data.id,
        quantity: quantity,
        image: item.image,
        name: item.name,
        price: item.price,
        dish_id: item.id
      }
      
      orderCache.push(order);
      
    } else {
      
    }
    localStorage.setItem(prefix, JSON.stringify(orderCache));
    Emitter.emit(prefix, orderCache); // nothing is logged
    // console.log(orderCache, prefix);
    this.showNumberQuantity();

  }
  showNumberQuantity() {
    // notification-number
    let prefix = this.state.prefix+"_"+window.location.pathname.replace("/restaurant/", "");
    let orderCache = localStorage.getItem(prefix) ? JSON.parse(localStorage.getItem(prefix)) : [];
    Emitter.emit(prefix, orderCache); // nothing is logged
    let quantity = 0;
		orderCache.map((order)=>{
			quantity = quantity + order.quantity;
    });
    // console.log(quantity)
		document.getElementById("notification-number").innerHTML = quantity;
	
  }
  componentDidMount() {
    this.getRest();
    this.showNumberQuantity();
    
  }
  makeid(n) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < n; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
  shareFacebook() {
    branch.init('key_live_bfDOr8Xwu4z4D4dlTUkfrcmoEzcs60mB');
    let data = this.state.data;
    let dishes = data.dishes;
    let tags = dishes.map((dish)=>{
      return dish.keyword;
    });
    
    let linkData = {
      campaign: data.name,
      channel: 'facebook',
      feature: 'rest_detail',
      stage: data.name,
      tags: tags,
      alias: '',
      title: data.name,
      image: data.image,
      address: data.address,
      og_image_url: data.image,
      data: {
        'custom_bool': true,
        'custom_int': Date.now(),
        'custom_string': data.name,
        '$og_title': data.name,
        '$og_description': data.address,
        'address': data.address,
        'title': data.name,
        'image': data.image,
        'og_image_url': data.image,
        '$og_image_url': data.image
      }
    };
    
    branch.link(linkData, function(err, link) {
      if(!err) {
        window.open("https://www.facebook.com/sharer/sharer.php?u="+link, "shareFacebook", "width=420,height=300");
      }
      // console.log(link, err)
      
    });
    
    
  }

  getRest(isLoadMore) {
    let self = this;
    let params = {
      id: this.props.params.id,
      lat: 0,
      lng: 0
    }
    let coordsPosition = {
      lat: 0,
      lng: 0
    }
    self.setState({loading: true});
    Restaurants.actions.getCurrentLocation.request(null).then(position => {
      coordsPosition = position.data.location;
      params.lat = coordsPosition.lat;
      params.lng = coordsPosition.lng;
      
      Restaurants.actions.find.request(null, params).then(res => {
        
        let timeOpen = moment(res.data.data.time_open, 'HH:mm');
        let timeClose = moment(res.data.data.time_close, 'HH:mm');
        if (moment().isBefore(timeClose) && moment().isAfter(timeOpen)) {
          res.data.data.isOnline = true;
        } else {
          res.data.data.isOnline = false;
        }
        self.setState({
          loading: false,
          data: res.data.data
        });
      });
    });
    
  }
 

  render() {
    const isOnlone = this.state.data.isOnline ? (
      <span className="online"><span ></span> Shop is online</span>
    ) : (
      <span className="offline"><span ></span> Shop is offline</span>
    );
    return (
      <div id="content">
        <section>
          <div className="container rest-detail">
            <div className="row">
              <div className="product col-md-10 col-md-push-1">
                <div className="row mb-50">
                  <div className="col-sm-6 bg-image-rest" style={{
                    backgroundImage: `url(${this.state.data.image})`
                  }}>
                    { 
                      this.state.loading ?
                        <div className="rest-image-loading"></div>    
                      :''
                    }
                  </div>
                  <div className="col-sm-6">
                    <h4 className="font-secondary mb-0 rest-title">{this.state.data.name}</h4>
                    { 
                      this.state.loading ?
                      <div className="rest-detail-line name"></div>    
                      :''
                    }
                    { 
                      this.state.loading ?
                      <div className="rest-detail-line address1"></div>    
                      :''
                    }
                    <p className="address">{this.state.data.address}</p>
                    
                    <div className="row">
                      <div className="col-md-6">
                        <dl className="description-2">
                          <dt>Activity Time</dt>
                          <dd>{this.state.data.time_range}
                            { 
                              this.state.loading ?
                              <div className="rest-detail-line address1"></div>    
                              :''
                            }
                          </dd>
                          <dt>Delivery time</dt>
                          <dd>30 minutes
                            
                          </dd>
                          <dt>Distance</dt>
                          <dd>{this.state.data.distance.toFixed(2)}km
                          { 
                              this.state.loading ?
                              <div className="rest-detail-line address1"></div>    
                              :''
                            }
                          </dd>
                        </dl>
                      </div>
                      <div className="col-md-6">
                        <dl className="description-2">
                          <dt>Status</dt>
                          <dd>
                            {isOnlone}
                            { 
                              this.state.loading ?
                              <div className="rest-detail-line address1"></div>    
                              :''
                            }
                          </dd>
                          <dt>Shipping Fee</dt>
                          <dd>
                          
                          {this.state.data.fee.shipping_fee.toLocaleString('it-IT', {style : 'currency', currency : 'VND'}).replace("₫","")} VNĐ/km</dd>
                        </dl>
                      </div>
                      
                      <div className="col-md-12 nav-rest-detail ">
                        <hr className="mt-0"/>
                        { 
                          !this.state.loading ?
                            <ul>
                              <li>
                                <Link className="facebook" href="javascript:void(0)" onClick={this.shareFacebook.bind(this)}><i className="ti-facebook mr-5"></i>Share via Facebook</Link>
                              </li>
                            </ul>  
                          :''
                        }
                        
                      </div>
                    </div>
                    {/* <p></p> */}
                    {/* <hr className="sep-line sep-2 mb-30 mt-30"/> */}
                    
                  </div>
                </div>

                <ul className="nav nav-tabs mb-30" role="tablist">
                  <li className="active"><a href="#description" role="tab" data-toggle="tab">Main menu</a></li>
                  {/* <li><a href="#additional-info" role="tab" data-toggle="tab">Additional Informations</a></li>
                  <li><a href="#reviews" role="tab" data-toggle="tab">Reviews</a></li> */}
                </ul>

                <div className="tab-content">
                  <div role="tabpanel" className="tab-pane active fade in" id="description">

                    { 
                      this.state.loading ?
                        [0,1,2,3,4,5,6,7,8,9,10,11].map((item, i)=> {
                          return (
                            <li className="col-sm-6 loading-dish" key={i}>
                              <p>
                                <span></span>
                                <span>
                                  <span></span>
                                </span>
                              </p>
                            </li>
                          )
                        })
                      :''
                    }
                  
                    <ul className="menu-dish">
                    {
                      this.state.data.dishes.map((item, i) => {
                        return (
                          <li className="col-sm-6" key={i}>
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
                            <p>
                              {item.name}
                              <span className="price">{item.price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'}).replace("₫","") }<label>VNĐ</label></span>
                            </p>
                            <Link onClick={this.addDish.bind(this, item)} className="add-dish">
                            <i className="ti-plus"></i>
                            </Link>
                            
                          </li>
                        )
                      })
                    }
                    </ul>                    
                  </div>
                  
                </div>

              </div>

            </div>
          </div>

        </section>

      </div>
    );
  }
}

export default RestaurantDetail;
