import React from 'react';
import Header from 'components/header';
import {Footer} from 'components/footer';
import $ from 'jquery';

class App extends React.Component {
  componentDidMount() {
    $('#page-loader').fadeOut(1000, function(){

    });
    // window.addEventListener('scroll', this.handleScroll.bind(this));
    $(window).scroll(() => {
      this.setHeader();
      if($('#filter-bar').length > 0) this.setFilterBar();

    });
    $(document).keyup(function(e) {
      if (e.keyCode == 27) {
        $('body').removeClass('search-bar-open');
      }
    });
    $(window).resize(() => {
      this.setNavPrimary();
      if($('#filter-bar').length > 0) this.setFilterSelector();
    });
    this.videoBox();
    this.navPrimary();
  }

  navPrimary() {
    var $body = $("body");
    var $nav = $('#nav-primary'),
        $toggleItem = $nav.find('.has-dropdown, .has-megamenu').children('a');

    $('[data-toggle="mobile-menu"]').on('click', function() {
        $body.toggleClass('mobile-nav-open');
        $nav.slideToggle(300);

        return false;
    });

    $toggleItem.on('click', function(){

        if($(window).width() < 992) {
            $(this).next('ul, .megamenu').slideToggle(300);
        }

        return false;
    });

    window.setNavPrimary = function() {
        if($(window).width() >= 992) {
            $nav.show();
            $toggleItem.next('ul, .megamenu').each(function(){
                $(this).show();
            })
        }
        if($(window).width() < 992) {
            $nav.hide();
            $body.removeClass('mobile-nav-open');
        }
    }
  }

  videoBox() {

  }

  setFilterSelector() {
    let $filterBar = $('#filter-bar');
    let $selector = $filterBar.find('.selector');
    let $activeFilter = $filterBar.find('.filter li.active');
    $selector.css({
        'width': $activeFilter.width()+'px',
        'left': $activeFilter.offset().left+'px'
    });
  }

  setNavPrimary() {
    if($(window).width() >= 992) {
      $('#nav-primary').show();
      let $toggleItem = $('#nav-primary').find('.has-dropdown, .has-megamenu').children('a');
      $toggleItem.next('ul, .megamenu').each(function(){
        $(this).show();
      })
    }
    if($(window).width() < 992) {
      $('#nav-primary').hide();
      $('body').removeClass('mobile-nav-open');
    }
  }

  setFilterBar() {
    let scrolled = $(window).scrollTop();
    let offsetTop = $('#filter-bar').offset().top;
    if(scrolled > offsetTop) {
        $('#filter-bar').addClass('fixed');
    }
    if(scrolled <= offsetTop) {
        $('#filter-bar').removeClass('fixed');
    }
  }

  setHeader() {
    let scrolled = $(window).scrollTop();
    let $header = $('#header');
    let headerHeight = $header.height();
    let $body = $('body');
    let $navBar = $('#nav-bar');
    let stickyBarrier = /*$(window).height()-*/ $navBar.height()-2;
    let outBarrier = $header.height()*2;

    if(scrolled > headerHeight && !$header.hasClass('fixed')) {
        $header.addClass('fixed');
        if(!$header.hasClass('absolute')) { $body.css('padding-top',headerHeight+'px'); }
    } else if(scrolled <= headerHeight && $header.hasClass('fixed')) {
        $header.removeClass('fixed');
        if(!$header.hasClass('absolute')) { $body.css('padding-top',0); }
    }

    if(scrolled > outBarrier && !$header.hasClass('out')) {
        $header.addClass('out');
    } else if(scrolled <= outBarrier && $header.hasClass('out')) {
        $header.removeClass('out');
    }

    if(scrolled > stickyBarrier && !$header.hasClass('sticky')) {
        $header.addClass('sticky');
        $body.addClass('sticky-header');
    } else if(scrolled <= stickyBarrier && $header.hasClass('sticky')) {
        $header.removeClass('sticky');
        $body.removeClass('sticky-header');
    }
  }
  render() {
    let routeName = this.props.routes[1] && this.props.routes[1].name ? this.props.routes[1].name : '';
    return (
      <div>
      	<div id="page-loader">
          { routeName == 'home' ?
              <svg className="loader-1 loader-primary" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle className="circle" fill="none" strokeWidth="3" strokeLinecap="round" cx="33" cy="33" r="30"></circle></svg>
            :''
          }
        </div>
        <Header routeName = {routeName}/>
        {this.props.children}
        <Footer/>
      </div>
    );
  }
}

export default App;
