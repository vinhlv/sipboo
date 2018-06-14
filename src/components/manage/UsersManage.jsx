import React from 'react';
import {Admin} from 'api';
import {Link, browserHistory} from 'react-router';
import ReactPaginate from 'react-paginate';
import moment from 'moment';

let noAvatar = require('assets/img/avatar-default.png');


class UsersManage extends React.Component {
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
    this.getUsers();
  }

  getUsers() {
    let params = {
      // keyword: _keyword,
      limit: this.state.limit,
      page: this.state.pagination.page
    }

    this.setState({loading: true, dataList: []});
    Admin.actions.users.request(null, params).then(res => {
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
    browserHistory.push(`/manage/users?page=${page.selected+1}`);
  };

  delUser(user_id) {
    var r = window.confirm("Are you sure you want to delete this user?");
    if (r == true) {
      Admin.actions.delUser.request(null, {
        user_id: user_id
      }).then(res => {

        browserHistory.push(`/manage/users?page=${1}`);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location) {
      let newPage = nextProps.location && nextProps.location.query ? nextProps.location.query.page : 1;
      this.state.pagination.page = newPage;
      this.getUsers();
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
                <h3 className="mb-10 text-left">Users</h3>
                <hr className="break-sm ml-0"/>
                <p className="text-left">Just admin can see user manage by them.</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <table className="table table-sipboo">
                  <thead>
                  <tr>
                    <th className="table-40"> # </th>
                    <th className="table-150 text-center">User Info</th>
                    <th>Address</th>
                    <th className="table-200 text-center">Report/Flag</th>
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
                              <div className="table-avatar text-center">
                                <div style={{
                                  backgroundImage: `url(${ item.avatar ? item.avatar.replace("/upload/","/upload/w_90,h_90,c_thumb/w_90/") : noAvatar })`
                                }}></div>
                                <span className="font-bold">{item.fullname} </span><span> {item.user_phone}</span>
                              </div>
                            </td>
                              <td>(Latitude: {item.user_lat}, Longtitude: {item.user_lng}) {item.user_address || ""}</td>
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
                              <Link onClick={this.delUser.bind(this, item.user_id)}><i className="ti ti-trash delete"></i></Link>
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

export default UsersManage;
