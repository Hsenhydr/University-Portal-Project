import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { CiCalendarDate } from "react-icons/ci";
import { useEffect, useState } from "react";

function AnnouncementDetails() {
  const [token, setToken] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  //Get token
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
        // console.log(data.access_token);
        setToken(data.access_token);
      })
      .catch((error) => console.error("token error:", error));
  }, []);

  //fetch announcements
  useEffect(() => {
    if (token) {
      fetch(
        `https://wshare.sharepoint.com/sites/ReactTrainingSite/_api/Web/Lists/GetByTitle('Announcements')/items?$orderby=Date`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          // console.log(data.d);
          setAnnouncements(data.value);
        })
        .catch((error) => console.error("error:", error));
    }
  }, [token]);

  return (
    <div className="d-flex justify-content-start align-items-start flex-wrap gap-3">
      {announcements.map((announcements) => (
        <div
          className="d-flex justify-content-start align-items-start mb-3 mx-auto mt-3 position-relative"
          style={{ width: "40vw" }}
          key={announcements.ID}
        >
          <div className="d-flex justify-content-evenly align-items-center border-1 bg-white p-2">
            <div className="">
              <img
                src="public/announcement.avif"
                width={"150px"}
                className="px-2"
                style={{ borderRadius: "15px" }}
              />
            </div>
            <div className="content">
              <div className="d-flex align-items-center justify-content-start p-3 gap-2 fs-4">
                <CiCalendarDate />
                {announcements.Date.slice(0, 10)}
              </div>
              <div className="lead fw-bold position-relative anndash px-2">
                {announcements.Title}
              </div>
              <div className="lead text-wrap px-2">
                {announcements.Description}
              </div>
              <p className="position-absolute listcorner"></p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AnnouncementDetails;
