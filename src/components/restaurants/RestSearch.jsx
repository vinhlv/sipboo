import React from 'react';
import {User} from 'api';
import moment from 'moment';
import {Link, browserHistory} from 'react-router';
import ReactPaginate from 'react-paginate';
import {Rate} from 'components/sipboo';
import { EventEmitter } from 'base/helpers';

let noAvatar = require('assets/img/avatar-default.png');

class RestSearch extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      limit: 12,
      dataList: [],
      categories: [],
      loading: false,
      type: this.props.location && this.props.location.query ? this.props.location.query.type : 'restaurant',
      pagination: {
        itemCount: 0,
        page: this.props.location.query.page || 1
      },
      isLogin: localStorage.getItem('api_token') ? true : false,
      category: this.props.location.query.category || '',
      itemDefault: [0,1,2,3,4,5,6,7,8,9,10,11]
    }
  }
  handlePageClick(page) {
    let keyword = this.props.location && this.props.location.query ? this.props.location.query.q.trim() : '';
    let newType = this.props.location && this.props.location.query ? this.props.location.query.type : 'restaurant';
    browserHistory.push(`/rest/search?q=${keyword}&page=${page.selected+1}&type=${newType}`);
  };
  componentDidMount() {
    let _keyword = this.props.location && this.props.location.query ? this.props.location.query.q.trim() : '';
    // if (_keyword)
    this.getRestByKeyword(_keyword);
    this.getCategories();

    window.scrollTo(0, 0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location) {
      // let oldKeyword = this.props.location && this.props.location.query ? this.props.location.query.q.trim() : '';
      let newKeyword = nextProps.location && nextProps.location.query ? nextProps.location.query.q.trim() : '';
      // let oldPage = this.props.location && this.props.location.query ? this.props.location.query.page : 1;
      let newPage = nextProps.location && nextProps.location.query ? nextProps.location.query.page : 1;
      // let oldCat = this.props.location && this.props.location.query ? this.props.location.query.category : '';
      let newCat = nextProps.location && nextProps.location.query ? nextProps.location.query.category : '';
      
      let newType = nextProps.location && nextProps.location.query ? nextProps.location.query.type : 'restaurant';
      this.setState({
        type: newType
      }, () => {
        this.state.pagination.page = newPage;
        this.state.category = newCat;
        this.getRestByKeyword(newKeyword);
      })
      // if (newKeyword != oldKeyword || oldPage != newPage || oldCat != newCat) {
        
      // }
    }
  }

  getRestByKeyword(_keyword) {
    if(this.state.type == "sipboo") {
      let params = {
        keyword: _keyword,
        limit: this.state.limit,
        page: this.state.pagination.page
      }
      
      this.setState({loading: true, dataList: []});
      User.actions.getSearchSipboo.request(null, params).then(res => {
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
    if(this.state.type == "restaurant") {
      let params = {
        keyword: _keyword,
        limit: this.state.limit,
        page: this.state.pagination.page
      }
      if (this.state.category) {
        params.cat = this.state.category;
      }
      this.setState({loading: true, dataList: []});
      User.actions.getRest.request(null, params).then(res => {
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
    
  }
  getCategories() {

    User.actions.getCategories.request().then(res => {
      if (res.data && res.data.data) {
        this.setState({
          categories: res.data.data
        });
      }

    });
  }
  handleHire(shiper){
    let {isLogin} = this.state;
    // console.log(isLogin)
    if(isLogin){
      browserHistory.push(`/sipboo/hire/${shiper.id}`)
    }else {
      EventEmitter.emit("OpenLoginModal");
    }
  }
  render() {
    let childElements = null;
    if(this.state.type == "sipboo") {
      childElements = this.state.dataList.map((item, i) => {
        return (
          <div className="col-sm-4" key={i}>
            <div className="star-coolpals" >
              <Link to={`/user/${item.id}`}>
                <div className="sb-avatar" >
                  <div className="avatar" style={{
                        backgroundImage: `url(${ item.avatar ? item.avatar.replace("/upload/","/upload/w_130,h_130,c_thumb/w_130/") : noAvatar })`
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
        );
      });
    }
    if(this.state.type == "restaurant") {
      childElements = this.state.dataList.map((item, i) => {
        let timeOpen = moment(item.time_open, 'HH:mm');
        let timeClose = moment(item.time_close, 'HH:mm');
        if (moment().isBefore(timeClose) && moment().isAfter(timeOpen)) {
          item.isOnline = true;
        } else {
          item.isOnline = false;
        }
        return (
          <div className="col-md-4 item-restaurant item-restaurant-searchpage text-left" key={i}>
            <div className="feature feature-3 animated visible" data-animation="fadeIn">
              <Link to={`/restaurant/${item.id}?alias=${item.alias}`} className="image-rest-item" style={{
                                    backgroundImage: `url(${item.image})`
                                  }}>
              </Link>
              <div className="feature-content bg-white">
                <h5 className="text-left mb-5 truncate"><Link to={`/restaurant/${item.id}`}>{item.name}</Link></h5>
                <p className="mb-5 truncate">{item.address}</p>
                <p className="mb-0 time-wrap">{timeOpen.format('HH:mmA') +' - '+ timeClose.format('HH:mmA')}
                  <span className={`dot ${item.isOnline ? 'online' : ''}`}></span>
                </p>
              </div>
            </div>
          </div>
        );
      });
    }
    
    
    let startNum = ((this.state.pagination.page-1)*this.state.limit)+1;
    let endNum = this.state.pagination.page*this.state.limit;
    return (
      <div id="content">
        <section id="services" className="bg-grey search-page">
          <div className="container text-center">

            <div className="row">
              <div className="sidebar col-md-3 sidebar-left">
                <div className="sidebar-widget sidebar-widget-custom1">

                    <div className="spacer-15"></div>
                    <h5>What are looking for? </h5>
                    <div className="widget-search text-center">
                      <div className="btn-group btn-groupggt" role="group" aria-label="...">
                      <ul className="nav nav-pills mt-20" role="tablist">
                      {
                        this.state.type == 'restaurant' ? (
                          <li className="active"><Link to={`/rest/search?q=&page=1&type=restaurant`} role="tab" data-toggle="tab" aria-expanded="true">Best Restaurant</Link></li>
                        ) : (
                          <li className=""><Link to={`/rest/search?q=&page=1&type=restaurant`} role="tab" data-toggle="tab" aria-expanded="true">Best Restaurant</Link></li>
                        )
                      }
                      {
                        this.state.type == 'sipboo' ? (
                          <li className="active"><Link to={`/rest/search?q=&page=1&type=sipboo`} role="tab" data-toggle="tab" aria-expanded="false">Star Sipboo</Link></li>
                        ) : (
                          <li className=""><Link to={`/rest/search?q=&page=1&type=sipboo`} role="tab" data-toggle="tab" aria-expanded="false">Star Sipboo</Link></li>
                        )
                      }
                        
                        
                      </ul>
                      </div>
                    </div>
                </div>
                {
                  this.state.type == 'restaurant' ? (
                    <div className="sidebar-widget sidebar-widget-custom1 sidebar-widget-custom123">

                        <h5>Categories</h5>

                        <hr className="mt-5 mb-10"/>
                        <ul className="widget-tag">
                          {
                            this.state.categories.map((item, i) => {
                              return (
                                <li key={i}>
                                  <Link to={`/rest/search?q=&page=1&category=${item.id}`} className="categories-link">{item.name}</Link>
                                </li>
                              )
                            })
                          }

                        </ul>

                    </div>
                  ) : (
                    null
                  )
                }
                
              </div>
              <div className="content col-md-9">
                <div className="sidebar-widget sidebar-widget-custom1">
                  <div className="widget-search-label ng-binding">
                  {
                    this.state.type == 'restaurant' ? (
                      <span>Best Restaurants </span>
                    ): ( 
                      <span>Our Star Sipboo </span>
                    )
                  }
                    
                    in Da Nang city
                  </div>
                  <div className="widget-search ng-binding">
                    Show {startNum}-{endNum} of <span>{this.state.pagination.itemCount}</span> results

                  </div>

                </div>
                { this.state.loading ?
                  this.state.itemDefault.map((item, i)=> {
                    return (
                      <div className="timeline-wrapper col-md-4 p-10" key={i}>
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
          </div>
        </section>
      </div>
    );
  }
}

export default RestSearch;
