import React from 'react';

class Terms extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    return (
      <div id="content" className="container">
        <section className="stt-block">
          <p>

            <i>Ngày updated lần sau cuối 02-04-2018</i>
            <br/>
            Xung quanh các điều khoản và điều kiện của một người muốn trở thành một Sipboo trên hệ thống bao gồm các điều mục sau:
          </p>
          <h3 className="smst-tt"><font><font>NỘI DUNG CHÍNH</font></font></h3>
          <ol>
            <li><a href="#one" >Chúng tôi cần bạn cung cấp tài khoản ngân hàng.</a></li>
            <li><a href="#two">Chúng tôi sử dụng dịch vụ thanh toán của 1pay (truemoney.com.vn)</a></li>
            <li><a href="#three">Kỳ hạn chuyển khoản cho Sipboo</a></li>
            <li><a href="#four" >Liên lạc với chúng tôi</a></li>
            <li><a href="#five" >Sửa đổi chính sách</a></li>
          </ol>
          <h3 className="smst-tt" id="one"><font><font>1. Chúng tôi cần bạn cung cấp tài khoản ngân hàng.</font></font></h3>
          <p> Chúng tôi cần thông tin tài khoản ngân hàng của bạn để thanh hoàn trả số tiền bạn kiếm được từ các dịch vụ của Sipboo.
          Chúng tôi sử dụng thông tin để thực hiện yêu cầu của bạn, cung cấp các chức năng của Dịch vụ, nâng cao chất lượng dịch vụ, cá nhân hóa trải nghiệm của bạn,
          theo dõi việc sử dụng Dịch vụ, cung cấp phản hồi cho các doanh nghiệp bên thứ ba được liệt kê trên Dịch vụ, cung cấp hỗ trợ khách hàng, thông báo cho bạn,
          sao lưu hệ thống của chúng tôi và cho phép khắc phục thảm họa, tăng cường bảo mật Dịch vụ và tuân thủ các nghĩa vụ pháp lý. </p>
        </section>
        <section className="stt-block">
          <h3 className="smst-tt" id="two"><font><font>2. Chúng tôi sử dụng dịch vụ thanh toán của 1pay (truemoney.com.vn)</font></font></h3>
          <p>
          Chúng tôi đang thực hiện 1 giao dịch thuương mại điện tử với truemoney.com.vn . Bạn có thể xem đầy đủ thông tin của truemoney.com.vn tại đây https://truemoney.com.vn/about

          </p>
        </section>
        <section className="stt-block">
          <h3 className="smst-tt" id="three"><font><font>3. Kỳ hạn chuyển khoản cho Sipboo</font></font></h3>
          <p>
              Chúng tôi sẽ chuyển khoản hoàn trả số tiền bạn nhận được dựa vào các điều khoản sau:
          </p><ol>
          <li>Chúng tôi sẽ gởi cho bạn số tiền bạn nhận được khi có giá trị lên tới 500.000 VND</li>
          <li>Nếu trong vòng 1 tháng bạn vẫn không có đủ số tiền tối thiếu là 500.000 VND thì Sipboo vẫn phải hoàn trả số tiền mà bạn đã kiếm được.</li>

          </ol>
          <p></p>
        </section>
        <section className="stt-block">
          <h3 className="smst-tt" id="four"><font><font>4. Liên hệ với chúng tôi</font></font></h3>
          <p> Nếu bạn tin rằng Sipboo đã không tuân thủ Chính sách Bảo mật này, bạn có thể liên hệ trực tiếp với chúng tôi theo &amp; nbsp;
            <a  href="http://sipboo.con/contact"> đây </a>.
          </p>
        </section>
        <section className="stt-block">
          <h3 className="smst-tt" id="five"><font><font>5. Sửa đổi chính sách</font></font></h3>
          <p>
          Chúng tôi có thể sửa đổi Chính sách Bảo mật này theo thời gian.
          Phiên bản Chính sách Bảo mật hiện hành nhất sẽ điều chỉnh việc thu thập, sử dụng và tiết lộ thông tin về bạn và sẽ được đặt tại đây.
           Nếu chúng tôi thực hiện thay đổi quan trọng đối với Chính sách Bảo mật này, chúng tôi sẽ thông báo cho bạn bằng email hoặc bằng cách đăng một thông báo trên
           Dịch vụ trước ngày có hiệu lực của những thay đổi này.
           Bằng cách tiếp tục truy cập hoặc sử dụng Dịch vụ sau khi các thay đổi này có hiệu lực, bạn đồng ý với Chính sách Bảo mật đã được sửa đổi.
          </p>
        </section>
      </div>
    );
  }
}

export default Terms;
