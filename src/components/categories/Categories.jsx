import React from 'react';
import {User} from 'api';
import {Link} from 'react-router';

class Categories extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      dataList: [],
      dataSubList: [],
      loading: false,
      loadingSub: false
    }
  }

  componentDidMount() {
    this.getCategories();
    this.getSubCategories();
  }

  getSubCategories() {
    this.setState({loadingSub: true});
    User.actions.getSubCategories.request().then(res => {
      if (res.data && res.data.data) {
        this.setState({
          dataSubList: res.data.data
        });
      }
      this.setState({loadingSub: false});
    });
  }

  getCategories() {

    User.actions.getCategories.request().then(res => {
      if (res.data && res.data.data) {
        this.setState({
          dataList: res.data.data
        });
      }

    });
  }


  render() {
    return (
      <div id="content">
        <section id="services" className="bg-grey">
          <div className="container text-center">
            <div className="row">
              <div className="col-md-12">
                <h3 className="mb-10 ">Popular Categories</h3>
                <hr className="break-sm"/>
                <p>See the search trends</p>
              </div>
            </div>
            <div className="row">
            { this.state.loading ?
                <svg className="loader-1 loader-primary" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle className="circle" fill="none" strokeWidth="3" strokeLinecap="round" cx="33" cy="33" r="30"></circle></svg>
              :''
            }
            {
              this.state.dataList.map((item, i) => {
                return (
                  <div key={i} className="col-md-2 pt-35 mb-45 pl-25 pr-25">
                    <Link to={`/rest/search?q=&page=1&category=${item.id}&type=restaurant`} className="categories-link">
                      <img src={item.icon} alt={item.name} className="categories-icon"/>
                      <h5 className="categories-name">{item.name}</h5>
                    </Link>
                  </div>
                )
              })
            }
            </div>
            <div className="row">
              <div className="col-md-12">
                <h3 className="mb-10 ">Categories</h3>
                <hr className="break-sm"/>
                <p>There's a lot of information online, kind of daunting if you don't know exactly what you're looking for. IKAG has put together it's categories, in an easy to follow page, as a helpful guide. Below you can browse a pretty exhaustive category list. Alternatively, if you know exactly what you're after use the search box above</p>
              </div>
            </div>
            <div className="row mt-30">
            {
              this.state.dataSubList.map((item, i) => {
                return (
                  <div key={i} className="col-md-3 text-left">
                    <Link to={`/rest/search?q=${item.name}&page=1`} className="categories-link">
                      <h5 className="categories-name mb-5"><i className="dot min mr-5"></i> {item.name}</h5>
                    </Link>
                  </div>
                )
              })
            }
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Categories;
