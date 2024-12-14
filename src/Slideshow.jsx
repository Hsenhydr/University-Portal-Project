import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Index() {
  const [item, setItem] = useState([]);
  const [token, setToken] = useState("");

  // get token
  useEffect(() => {
    fetch(
      `https://accounts.accesscontrol.windows.net/364345af-301b-47f3-90c1-04222e84e7c0/tokens/oAuth/2`,
      {
        method: "POST",
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id:
            "48365901-75cf-4515-907e-108b3fa87d4a@364345af-301b-47f3-90c1-04222e84e7c0",
          client_secret: "jIbFymZI3PlcqwZpm+7pEFImbwPUzW6WOvDdxQdFRWY=",
          resource:
            "00000003-0000-0ff1-ce00-000000000000/wshare.sharepoint.com@364345af-301b-47f3-90c1-04222e84e7c0",
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setToken(data.access_token);
      })
      .catch((error) => console.error("token error:", error));
  }, []);

  // get data
  useEffect(() => {
    fetch(
      `https://wshare.sharepoint.com/sites/reacttrainingsite/_api/web/lists/getByTitle('SlideShow')/items`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json; odata=verbose",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("data:", data);
        setItem(data.d.results);
      })
      .catch((error) => console.error("error is:", error));
  }, [token]);

  return (
    <div className="d-flex justify-content-center">
      <Carousel
        showThumbs={false}
        showStatus={false}
        interval={3000}
        transitionTime={500}
        infiniteLoop
        className="w-100"
        showIndicators={false}
      >
        {item.map((item, index) => (
          <div key={index} className="d-flex flex-column align-items-center">
            <img src={item.Image} className="position-relative" />
            <div className="fs-1 w-100 position-absolute bottom-0 mb-5 pb-4 shadow">
              {item.Title}
            </div>
            <div
              className=" w-75 position-absolute shadow"
              style={{ bottom: "8px", fontSize: "2rem" }}
            >
              {item.Description}
            </div>
            <Link
              to={`/Bannerdetails/${item.ID}`}
              className="btn position-absolute bottom-0 end-0 btn mx-5 my-2 text-white"
            >
              Read More
            </Link>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
