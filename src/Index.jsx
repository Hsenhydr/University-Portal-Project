import React from "react";

import Slideshow from "./Slideshow.jsx";
import Announcement from "./Announcement.jsx";
import Calendar from "./Calendar.jsx";
import News from "./News.jsx";
import Gallery from "./Gallery.jsx";
import Navbar from "./Navbar.jsx";

function index() {
  return (
    <div className="pb-2">
      <Navbar />
      <div className="" style={{ minHeight: "50vh" }}>
        <Slideshow />
      </div>
      <div className="d-flex align-items-center" style={{ minHeight: "100vh" }}>
        <div className="ps-5">
          <Announcement />
        </div>
        <div className="ps-5">
          <Calendar />
        </div>
      </div>
      <div className="" style={{ minHeight: "100vh" }}>
        <News />
      </div>
      <Gallery />
    </div>
  );
}

export default index;
