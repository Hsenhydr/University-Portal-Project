import { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";

function App() {
  const [token, setToken] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [annnum, setAnnNum] = useState(1);
  const [annstart, setAnnStart] = useState(0);
  const [annend, setAnnEnd] = useState(1);
  const [fadein, setFadein] = useState(false);
  const [fadeout, setFadeout] = useState(false);

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
    fetch(
      `https://wshare.sharepoint.com/sites/ReactTrainingSite/_api/Web/Lists/GetByTitle('Announcements')/items?$orderby=Date&$top=${annnum}`,
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
        console.log(data.value);
        setAnnouncements(data.value.slice(annstart, annend));
        setFadein(true);
      })
      .catch((error) => console.error("error:", error));
  }, [token, annnum, annstart, annend]);

  const handleArrowClick = (direction) => {
    // Start the fade-out animation
    setFadeout(true);

    setTimeout(() => {
      // Once the fade-out animation completes, update the announcements
      if (direction === "left" && annnum > 1) {
        setAnnNum(annnum - 1);
        setAnnStart(annstart - 1);
        setAnnEnd(annend - 1);
      } else if (direction === "right" && annnum < 4) {
        setAnnNum(annnum + 1);
        setAnnStart(annstart + 1);
        setAnnEnd(annend + 1);
      }

      // Immediately stop the fade-out after content change
      setFadeout(false);
      setFadein(false);
    }, 800);
  };

  return (
    <main className="w-75">
      <div className="d-flex justify-content-evenly gap-5">
        <div className="">
          <div className="image-border position-relative">
            <div className="position-relative">
              <img
                src="public/announcement.avif"
                width={"200px"}
                height={"200px"}
                alt="image"
                className="image "
              />
              <div
                className="leftarrow"
                onClick={() => handleArrowClick("left")}
              >
                <BsArrowLeft style={{ color: "var(--yellow)" }} />
              </div>
              <div
                className="rightarrow"
                onClick={() => handleArrowClick("right")}
              >
                <BsArrowRight style={{ color: "var(--yellow)" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="content ms-5 d-flex flex-column position-relative ">
          <p className="dash fs-1 ">Announcement</p>
          {announcements.map((announcement) => (
            <div
              style={{ maxWidth: "800px" }}
              className={`${fadeout ? "fadeout active" : "fadein active"}`}
              key={announcement.ID}
            >
              <p className="display-6 pt-3 fw-semibold">{announcement.Title}</p>
              <p className="pt-3 fw-light fs-5 w-100">
                {announcement.Description}
              </p>
              <p className="pt-3 fw-light fs-2">
                {announcement.Date.slice(0, 10)}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Link to="/AnnouncementDetails" className="text-decoration-none btn">
        View All Announcements
      </Link>
    </main>
  );
}

export default App;
