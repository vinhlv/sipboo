import React from 'react';
import $ from 'jquery';
import {User, Restaurants} from 'api';
import {Link, browserHistory} from 'react-router';
import {Modal} from 'react-bootstrap';
import LaddaButton from 'react-ladda';
import moment from 'moment';
import { EventEmitter } from 'base/helpers';
import {Rate} from 'components/sipboo';

let noAvatar = require('assets/img/avatar-default.png');
let corporateBg02 = require('assets/img/home-bg.png');
let avatar01 = 'http://res.cloudinary.com/hmtcloudy/image/upload/v1523093816/1523093719.jpg';
let avatar02 = 'http://res.cloudinary.com/dvrknkd5e/image/upload/v1523241621/30262015_1661898660546410_5404541984905887744_n_i9bfrn.jpg';
let avatar03 = require('assets/img/avatars/avatar03.jpg');
// let corporateBg03 = require('assets/img/photos/corporate_bg03.jpg');

class Home extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      dataList: [],
      ourStarList: [],
      page: 1,
      loading: false,
      pagination: {
        itemCount: 0
      },
      itemDefault: [0,1,2,3,4,5,6,7],
      modalVideo: false,
      isLogin: localStorage.getItem('api_token') ? true : false
    }
  }

  componentDidMount() {
    $('.bg-image').each(function(){
        let src = $(this).children('img').attr('src');
        $(this).css('background-image','url('+src+')').children('img').hide();
    });
    this.getRestaurants();

    this.userEventListener = EventEmitter.addListener("userEvent", (data) => {
      // console.log(data);
      switch(data.type){
        case "login": this.setState({ isLogin: true }); break;
        case "logout": this.setState({ isLogin: false }); break;
      }
    })
  }

  componentWillUnmount() {
    this.userEventListener.remove();
  }

  searchSipboo(lat, lng) {
    let params = {
      lat: lat,
      lng: lng,
      type: "web"
    }
    
    User.actions.getSearchSipboo.request(null, params).then(res => {
      if (res.data && res.data.data) {
        this.setState({
          ourStarList: res.data.data
        });
      }
    });

  }

  getRestaurants(isLoadMore) {
    let self = this;
    let params = {
      page: this.state.page,
      limit: 8,
      lat: 0,
      lng: 0
    }
    self.setState({loading: true});
    Restaurants.actions.getCurrentLocation.request(null).then(position => {
      let coords = position.data.location || {
        lat: 0,
        lng:  0
      }
      params.lat = coords.lat;
      params.lng = coords.lng;
      self.searchSipboo(params.lat, params.lng);

      
      User.actions.getRest.request(null, params).then(res => {
        if (res.data && res.data.data) {
          if (isLoadMore) {
            self.setState({
              dataList: [...self.state.dataList, ...res.data.data],
              pagination: res.data.pagination
            });
          } else {
            self.setState({
              dataList: res.data.data,
              pagination: res.data.pagination
            });
          }
        }
        self.setState({loading: false});
      });
    });



  }

  handleShowAll() {
    this.state.page += 1;
    this.getRestaurants(true);
  }

  toggleModal(name, status) {
    this.setState({[name]: status});
  }

  handleHire(shiper){
    let {isLogin} = this.state;
    console.log(isLogin)
    if(isLogin){
      browserHistory.push(`/sipboo/hire/${shiper.id}`)
    }else {
      EventEmitter.emit("OpenLoginModal");
    }
  }

  render() {
    let childElements = this.state.dataList.map((item, i) => {
      let timeOpen = moment(item.time_open, 'HH:mm');
      let timeClose = moment(item.time_close, 'HH:mm');
      if (moment().isBefore(timeClose) && moment().isAfter(timeOpen)) {
        item.isOnline = true;
      } else {
        item.isOnline = false;
      }
      return (
        <div className="col-md-3 p-10 item-restaurant" key={i}>
          <div className="feature feature-3 animated visible" data-animation="fadeIn">
            <Link to={`/restaurant/${item.id}?alias=${item.alias}`} className="image-rest-item" style={{
                                  backgroundImage: `url(${item.image})`
                                }}>
            </Link>
            <div className="feature-content bg-white">
              <h5 className="mb-5 truncate"><Link to={`/restaurant/${item.id}?alias=${item.alias}`}>{item.name}</Link></h5>
              <p className="mb-5 truncate">{item.address}</p>
              <p className="mb-0 time-wrap">{timeOpen.format('HH:mmA') +' - '+ timeClose.format('HH:mmA')}
                <span className={`dot ${item.isOnline ? 'online' : ''}`}></span>
              </p>
            </div>
          </div>
        </div>
      );
    });
    return (
      <div id="content">

        {/* Section */}
        <section id="home" className="h-lg dark bg-black">

          <div className="bg-image"><img src={corporateBg02} alt=""/></div>

          <div className="container v-center" data-target="local-scroll">
            <div className="row">
              <div className="col-lg-6 col-md-8">
                <h3 className="mb-15">Oh oh! Are you looking a good Sipboo? </h3>
                <h5>We will take care of your self everday...</h5>
                <Link to={"/rest/search?q=&page=1&type=sipboo"} className="btn btn-default" style={{padding: '10px 20px'}}>Try it now <i className="i-after ti-arrow-right"></i></Link>
              </div>
            </div>
          </div>

        </section>

        <section className="section-star-coolpals">
          <div className="container">
            <h3 className="mb-40 text-center">Our Star Sipboo</h3>
            <div className="explore-grid">
              <div className="row">
                {
                  this.state.ourStarList.map((item, i) => {
                    return (
                      (i < 4) ? (
                      <div className="col-sm-3" key={i}>
                      
                        <div className="star-coolpals">
                            <Link to={`/user/${item.id}`}>
                              <div className="sb-avatar" >
                                <div className="avatar" style={{
                                      backgroundImage: `url(${ item.avatar ? item.avatar.replace("/upload/","/upload/w_130,h_130,c_thumb/w_130/") : noAvatar } )`
                                    }}></div>

                              </div>
                            </Link>
                            <p className="name"><strong>{item.fullname}</strong></p>
                            <p className="small-text">{item.phone}</p>
                            <Rate star={item.star}/>
                            <div className="text-center pt-10">
                              <button
                                onClick={this.handleHire.bind(this, item)}
                                className="btn btn-rounder btn-sm btn-primary btn-hire"
                              >
                                Hire
                              </button>
                            </div>
                          </div>
                       
                        
                      </div>
                      ) : null

                    )
                  })
                }

              </div>
            </div>
          </div>
        </section>

        {/* Section*/}
        <section id="services" className="bg-grey">
          <div className="container ">
            <div className="row">
              <div className="col-lg-8 col-lg-push-2">
                <h3 className="mb-40 text-center">Best Restaurants near me</h3>
              </div>
            </div>
            <div className="row">
            
                  
              { this.state.loading ?
                this.state.itemDefault.map((item, i)=> {
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
                :''
              }
              {childElements}
            </div>
            {
              this.state.pagination.itemCount > this.state.page*10 ?
                <div className="row text-center pt-30">
                  <LaddaButton
                    loading={this.state.loading}
                    onClick={this.handleShowAll.bind(this)}
                    data-spinner-size={20}
                    className="btn btn-rounder btn-sm btn-primary"
                  >
                    Show more
                  </LaddaButton>
                </div>
              :''
            }
          </div>
        </section>

        {/* Section*/}
        <section id="clients">
          <div className="container">
            <div className="row mb-40 text-center">
              <div className="col-lg-8 col-lg-push-2">
                <h3>Our clients are very pleased to work with us...</h3>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                {/* Testimonial */}
                <div className="testimonial testimonial-2">
                  <div className="quote">
                    I liked this application. I resolved any problem from my business. I don't waste many money for delivery and any service with big bill. Thank you for good idead of Sipboo app.
                  </div>
                  <div className="author with-image">
                    <img src={avatar01} alt=""/>
                    <div className="name">Hồng Nguyễn</div>
                    <span className="text-muted">Mỹ An, Ngũ Hành Sơn, Đà Nẵng, Việt Nam</span>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                {/* Testimonial */}
                <div className="testimonial testimonial-2 testimonial-primary">
                  <div className="quote">
                    This app resolved many my stuck order every day. Thank you for good idead (y)
                  </div>
                  <div className="author with-image">
                    <img src={avatar02} alt=""/>
                    <div className="name">Phạm Nhung</div>
                    <span className="text-muted">Trường Chinh, Đà Nẵng</span>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="testimonial testimonial-2">
                  <div className="quote">
                    Ứng dụng này đang giúp tôi tăng thu nhập mỗi tháng. Rất tuyệt vời
                  </div>
                  <div className="author with-image">
                    <img src={avatar03} alt=""/>
                    <div className="name">Thành Phúc</div>
                    <span className="text-muted">Quảng Nam</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section*/}
        <section className="section h-md bg-dark dark">

          <div className="bg-image"><img src="https://img.youtube.com/vi/6AiAO9QSvFA/maxresdefault.jpg" alt=""/></div>

          <div className="v-center text-center">
            <button className="btn-link btn-play btn-lg mb-30" onClick={this.toggleModal.bind(this, 'modalVideo', true)}/>
            <h1 className="animated fadeInUp visible" data-animation="fadeInUp">Look how do we work!</h1>
          </div>

        </section>
        <Modal show={this.state.modalVideo} dialogClassName="modal-video" onHide={this.toggleModal.bind(this, 'modalVideo', false)}>
          <iframe width="600" height="339" title="video" src="//www.youtube.com/embed/6AiAO9QSvFA?autoplay=1" allowFullScreen></iframe>
        </Modal>
      </div>
    );
  }
}

export default Home;
