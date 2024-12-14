import React from "react";

function Navbar() {
  return (
    <div className="">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarText"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse " id="navbarText">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 mx-auto gap-3 ">
              <li className="nav-item">
                <a className="nav-link" href="/Index.jsx">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Bannerdetails/1">
                  Banner
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link " href="/AnnouncementDetails">
                  Announcements
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link " href="#Calendar">
                  Calendar
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link " href="/All">
                  News
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link " href="GalleryDetails">
                  Gallery
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
