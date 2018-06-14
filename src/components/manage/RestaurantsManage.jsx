import React from 'react';
import {Admin} from 'api';
import {Link, browserHistory} from 'react-router';
import ReactPaginate from 'react-paginate';
import moment from 'moment';
let noAvatar = require('assets/img/avatar-default.png');


class RestaurantsManage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      dataList: [],
      limit: 20,
      loading: false,
      pagination: {
        itemCount: 0,
        page: this.props.location.query.page || 1
      }
    }
  }

  componentDidMount() {
    this.getRests();
  }

  getRests() {
    let params = {
      // keyword: _keyword,
      limit: this.state.limit,
      page: this.state.pagination.page
    }
    
    this.setState({loading: true, dataList: []});
    Admin.actions.restaurants.request(null, params).then(res => {
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
  handlePageClick(page) {
    // let keyword = this.props.location && this.props.location.query ? this.props.location.query.q.trim() : '';
    browserHistory.push(`/manage/restaurants?page=${page.selected+1}`);
  };

  delRest(rest_id) {
    var r = window.confirm("Are you sure you want to delete this restaurant?");
    if (r == true) {
      Admin.actions.delRestaurants.request(null, {
        rest_id: rest_id
      }).then(res => {
        
        browserHistory.push(`/manage/restaurants?page=${1}`);
      });
    } 
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location) {
      let newPage = nextProps.location && nextProps.location.query ? nextProps.location.query.page : 1;
      this.state.pagination.page = newPage;
      this.getRests();
      // if (newKeyword != oldKeyword || oldPage != newPage || oldCat != newCat) {
        
      // }
    }
  }

  render() {
    return (
      <div id="content">
        <section id="services" className="bg-grey">
          <div className="container text-center">
            <div className="row">
              <div className="col-md-12">
                <h3 className="mb-10 text-left">Restaurants</h3>
                <hr className="break-sm ml-0"/>
                <p className="text-left">Just admin or owner can be see restaurant manage by them.</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <table className="table table-sipboo">
                  <thead>
                  <tr>
                    <th className="table-40"> # </th>
                    <th className="table-240">Name </th>
                    <th className="table-200">Restaurant Info</th>
                    <th className="table-150 text-center">Owner</th>
                    <th className="table-200">Report/Flag</th>
                    <th>Updated At</th>
                    <th className="table-100">Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  { this.state.loading ?
                    [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map((item, i)=> {
                      return (
                        <tr key={i}>
                          <td><p className="animated-background"></p></td>
                          <td><p className="animated-background"></p></td>
                          <td><p className="animated-background"></p></td>
                          <td><p className="animated-background"></p></td>
                          <td><p className="animated-background"></p></td>
                          <td><p className="animated-background"></p></td>
                          <td><p className="animated-background"></p></td>
                        </tr>
                      )
                    })
                    : null
                  }
                    {
                      this.state.dataList.map((item, i) => {
                        return (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>
                              <div className="table-rest">
                                <div style={{
                                  backgroundImage: `url(${item.image})`
                                }}></div>
                                <Link to={`/restaurant/${item.rest_id}?alias=${item.alias}`} >
                                  {item.name}
                                </Link>
                              </div>
                            </td>
                            <td>
                              <dl>
                                <dt>ADDRESS</dt>
                                <dd>{item.address}</dd>
                              </dl>
                              <dl>
                                <dt>ACTIVITY TIME</dt>
                                <dd>{item.time_range}</dd>
                              </dl>
                            </td>
                            <td>
                              <div className="table-avatar text-center">
                                <div style={{
                                  backgroundImage: `url(${ item.avatar ? item.avatar.replace("/upload/","/upload/w_90,h_90,c_thumb/w_90/") : noAvatar })`
                                }}></div>
                                <span className="font-bold">{item.fullname} </span><span> {item.user_phone}</span>
                              </div>
                            </td>
                            <td className="table-report">
                              {
                                item.date_report ? (
                                  null
                                ) : (
                                  <i className="ti-flag-alt silver"></i>
                                )
                              }
                              {
                                item.date_report ? (
                                  <dl className="text-left">
                                    <dt className="text-center"><i className="ti-flag-alt red"></i> </dt>
                                    <dd><b>Reason:</b> {item.title_en}</dd>
                                    <dd><b>Report by:</b> {item.reporter_name}</dd>
                                    <dd><b>Date:</b> {item.date_report}</dd>
                                  </dl>
                                ) : null
                              }

                              
                            </td>
                            <td>{moment(item.last_updated_rest).format("YYYY-MM-DD hh:mm:ss A")}</td>
                            <td>
                              <Link onClick={this.delRest.bind(this, item.rest_id)}><i className="ti ti-trash delete"></i></Link>
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
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

export default RestaurantsManage;
