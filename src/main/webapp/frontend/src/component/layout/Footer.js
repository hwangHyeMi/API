import React from 'react';

//          component: Footer 컴포넌트          //
function Footer() {
  return (
    <footer className="py-4 mt-auto m-3" id="footer">
      <div className="container-fluid px-4">
        <div className="d-flex align-items-center justify-content-between small">
          <div className="text-muted">Copyright &copy; Your Website 2025</div>
          <div>
            <a href="#">Privacy Policy</a>
            &middot;
            <a href="#">Terms &amp; Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
