import React from 'react';
import {ToGoogleMap, FromGoogleMap} from './';
import {Restaurants, Orders, User} from 'api';
import { EventEmitter } from 'base/helpers';
import {Rate} from 'components/sipboo';
import {Link} from 'react-router';

let noAvatar = require('assets/img/avatar-default.png');
let windowPayment = null;
export class Hire extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      shipperId: this.props.params.id,
      from: "",
      to: "",
      lat:0,
      lnt:0,
      address1: null,
      address2: null,
      user: {},
      distance: 0,
      fee: {
        service_fee: 0,
        rate: 0,
        onepay_fee: 0,
        shipping_fee: 0,
        onepay_rate: 0,
        sipboo_rate: 0
      },
      price: {
        total: 0
      },
      paymenttype: {
        local: 0,
        visa: 1,
        type: 0
      },
      paramsOrder: {
        invoice_id: "",
        from: "",
        to: "",
        sipboo_id: "",
        distance: "",
        is_weight: "",
        notes: "",
        lat_from: "",
        lng_from: "",
        lat_to: "",
        lng_to: ""
      }
    }
    this.changePaymentType = this.changePaymentType.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.checkOut = this.checkOut.bind(this);
  }
  checkOut() {
    let params = this.state.paramsOrder
    Orders.actions.invoice.request(null, params).then(res => {
      params.invoice_id = res.data.data.invoice_id;
      this.setState({
        paramsOrder: params
      }, () => {
        if(this.state.paymenttype.type === 0) {
          window.location.href = `http://admin.sipboo.com/api/payment?invoice_id=${params.invoice_id}&type=local_bank_sipboo&redirect=hide_sipboo`;
          // windowPayment = window.open(`http://admin.sipboo.com/api/payment?invoice_id=${params.invoice_id}&type=local_bank_sipboo`, "Local banking", "centerscreen=yes,width=768,height=680");
        }
        if(this.state.paymenttype.type === 1) {
          window.location.href = `http://admin.sipboo.com/api/payment?invoice_id=${params.invoice_id}&type=visa_bank_sipboo&redirect=hide_sipboo`;
          // windowPayment = window.open(`http://admin.sipboo.com/api/payment?invoice_id=${params.invoice_id}&type=visa_bank_sipboo`, "Visa banking", "centerscreen=yes,width=768,height=680");
        }
        windowPayment.onload = function() { 
          windowPayment.RunCallbackFunction = function() {
            console.warn(window)
          }; 
        };
      })
      
      
    
    }).catch( (error) => {
       
	      
    });
  }
    
  changePaymentType(type) {
    this.setState({
      paymenttype: {
        type: type
      }
    }, () => {
      // console.log(this.state.paymenttype)
    })
  }
  init() {
    Restaurants.actions.getCurrentLocation.request(null).then(position => {
      let coords = position.data.location || {
        lat: 0,
        lng:  0
      }
      this.setState({
        lat: coords.lat,
        lng: coords.lng
      });
    });
  }
  getOtherProfile() {
    let params = {
      id: this.props.params.id
    }
    User.actions.otherProfile.request(null, params).then(res => {
      if (res.data && res.data.data) {
        this.setState({
          user: res.data.data
        });
      }
    });
  }

  getDistance() {
    let {address1, address2} = this.state;
    let self = this;
    if(address1 && address2) {
      // console.log(address2);
      let lat1 = address1.geometry.location.lat();
      let lng1 = address1.geometry.location.lng();

      let lat2 = address2.geometry.location.lat();
      let lng2 = address2.geometry.location.lng();
      // let distance = this.calDistance(lat1, lng1, lat2, lng2, "K");
      
      Orders.actions.getDistance.request(null, {
        origin: [lat1, lng1].join(","),
        destination: [lat2, lng2].join(",")
      }).then(res => {
        let distance = 0;
        try{
          let rows = res.data.data.rows
          if(rows.length!=0) {
            let elements = rows[0].elements
            if(elements.length != 0) {
              distance = elements[0].distance.value / 1000
            }
          }
        } catch(e) {

        }
        
        let params = {
          distance: distance
        };
        // let tmp = google.maps.geometry.spherical.computeDistanceBetween ([lat1, lng1].join(","), [lat2, lng2].join(","));
        Orders.actions.preview_invoice.request(null, params).then(res => {
          // console.log(res.data.data)
          // params.order_group_id = res.data.data.id;
          self.setState({
            fee: res.data.data.fee,
            distance: distance,
            price: {
              total: res.data.data.distance[0].price
            },
            paramsOrder: {
              invoice_id: "",
              from: address1.formatted_address,
              to: address2.formatted_address,
              sipboo_id: this.props.params.id,
              distance: distance,
              is_weight: false,
              notes: "",
              lat_from: lat1,
              lng_from: lng1,
              lat_to: lat2,
              lng_to: lng2
            }
          }, () => {
          });
          
        }).catch( (error) => {
          if (error.response && error.response.data) {
            
          //   this.setState({errorMessage: error.response.data.message});
            console.log( error.response.data)
          }
          
        });
        
	  		
	  	}).catch( (error) => {
       
	      
	    });
      
    }
    
  }
  calDistance(lat1, lon1, lat2, lon2, unit) {
    
    return 0;
  }
  componentDidMount(){
    this.init();
    EventEmitter.addListener("from", (from) => {
      this.setState({
        address1: from
      }, () => {
        this.getDistance();
      });
      // console.log(from)
    })
    EventEmitter.addListener("to", (to) => {
      // console.log(to)
      this.setState({
        address2: to
      }, () => {
        this.getDistance();
      });
    });

    this.getOtherProfile();
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    }, () => {
      
    });
    
  }
  render(){
    // let state = this.state
    return(

    <div id="content" className="hire-a-sipboo">

      <section>
        <div className="container">
          <div className="row">
            <div className="col-lg-10 col-sm-push-1  col-md-10 col-xs-12 ">
              
              <div className="col-lg-4  col-md-4 col-xs-12 section-star-coolpals">
                <div className="star-coolpals">
                  <div className="sb-avatar" >
                    <div className="avatar" style={{
                          backgroundImage: `url(${ this.state.user.avatar ? this.state.user.avatar.replace("/upload/","/upload/w_130,h_130,c_thumb/w_130/") : noAvatar } )`
                        }}></div>

                  </div>
                  <p className="name"><strong>{this.state.user.fullname}</strong></p>
                  <p className="small-text">{this.state.user.phone}</p>
                  <Rate star={this.state.user.star}/>
                  
                </div>
              </div>
              
                {/* MyMapComponent */}
            
            <div className="col-lg-6  col-md-6 col-xs-12">
              <div className="text-center">
                <h3>Hire a Sipboo</h3>
                <p className="lead">Please enter fill the fields to hire a Sipboo</p>
              </div>

              <FromGoogleMap>
                <div className="form-group input-icon-left">
                  <i className="fa fa-map-marker text-primary"></i>
                  <input className="form-control" defaultValue={this.state.from} name="from"  placeholder="Nhận hàng của bạn ở đâu?" required />
                </div>
              </FromGoogleMap>

              <ToGoogleMap>
                <div className="form-group input-icon-left">
                  <i className="fa fa-map-marker text-primary"></i>
                  <input className="form-control" defaultValue={this.state.to} name="to"  placeholder="Đi tới đâu..." required />
                </div>
              </ToGoogleMap>
                {
                  this.state.distance != 0 && (
                    <dl className="description-2 mb-5">
                      <dt>Distance</dt>
                      <dd>{this.state.distance}km</dd>
                    </dl>
                  )
                }
                
                
                <dl className="description-2 mb-5">
                  <dt>Shipping detail</dt>
                </dl>
                <div className="form-group">
                  <div className="radio">
                    <input type="checkbox" defaultChecked  disabled id="shipping1"/><label htmlFor="shipping1">Sipboo fee (+{ (this.state.fee.sipboo_rate + this.state.fee.onepay_rate) || 0}%)</label>
                  </div>
                  <div className="radio">
                    <input type="checkbox" defaultChecked disabled id="shipping2"/><label htmlFor="shipping2">Truemoney fee - 1pay 
                    (+{this.state.fee.onepay_fee.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})})</label>
                  </div>
                  
                </div>
              
                
                <dl className="description-2 mb-5">
                  <dt>Payment method</dt>
                </dl>
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
                {
                  this.state.distance != 0 && (
                    <dl className="description-2 mb-5">
                      <dt>Total</dt>
                      <dd style={{
                        fontSize: 26
                      }}>
                      {
                        (
                          (this.state.price.total)
                          + 
                          (this.state.price.total * (this.state.fee.sipboo_rate + this.state.fee.onepay_rate) / 100)
                          +
                          (this.state.fee.onepay_fee)
                        ).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})
                        }
                        </dd>
                    </dl>
                  )
                }
                <hr/>
                <Link onClick={this.checkOut.bind(this)} className="btn btn-filled btn-primary btn-block pull-left">Payment <i className="i-after ti-arrow-right"></i></Link>

              
              </div>
            </div>
            {/* <div className="col-lg-7 col-xs-12">
              <MyMapComponent from={this.state.from} />
            </div> */}
          </div>
        </div>
      </section>
    </div>
    
    
    )
  }
}

