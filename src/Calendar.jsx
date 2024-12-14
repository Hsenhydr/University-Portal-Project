import React, { useEffect } from "react";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";
import { FaCalendarDays } from "react-icons/fa6";
import { BsCursor } from "react-icons/bs";

import { FaList } from "react-icons/fa";

function App() {
  const [tab, setTab] = useState("Tab1");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [token, setToken] = useState(null);
  const [events, setEvents] = useState([]);

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

  const handletab = (tab) => {
    setTab(tab);
  };

  useEffect(() => {
    fetch(
      `https://wshare.sharepoint.com/sites/ReactTrainingSite/_api/Web/Lists/GetByTitle('Calendar')/items?$orderby=EventDate`,
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
        console.log(data.value.e);
        setEvents(data.value);
      })
      .catch((error) => console.error("error:", error));
  }, [token]);

  return (
    <div className="w-100 h-100 p-5">
      <div className="d-flex justify-content-center align-items-center mt-5">
        <button
          className="p-2 m-2 border rounded d-flex justify-content-center align-items-center gap-2"
          style={{
            backgroundColor: tab === "Tab1" ? "var(--yellow)" : "#fff",
            width: "110px",
          }}
          onClick={() => handletab("Tab1")}
        >
          <FaCalendarDays />
          Calendar
        </button>
        <button
          className="p-2 m-2 border rounded d-flex justify-content-center align-items-center gap-2"
          style={{
            backgroundColor: tab === "Tab2" ? "var(--yellow)" : "#fff",
            width: "110px",
          }}
          onClick={() => handletab("Tab2")}
        >
          <FaList />
          List
        </button>
      </div>
      <div className="d-flex justify-content-center align-items-center mt-5">
        {tab === "Tab1" && (
          <div className="d-flex flex-column justify-content-center align-items-center gap-5">
            <Calendar
              className="border rounded"
              value={selectedDate}
              onChange={setSelectedDate}
              tileContent={({ date, view }) => {
                if (view === "month") {
                  const eventForDay = events.some(
                    (event) =>
                      new Date(event.EventDate).toDateString() ===
                      date.toDateString()
                  );
                  return eventForDay ? <div className="dot"></div> : null;
                }
                return null;
              }}
              tileClassName={({ date, view }) => {
                if (view === "month") {
                  //bs la define date parameter
                  const currentDate = new Date(date).setHours(0, 0, 0, 0);
                  //bshuf eza l yom fi event
                  const eventToday = events.some(
                    (event) =>
                      new Date(event.EventDate).setHours(0, 0, 0, 0) ===
                      currentDate
                  );
                  //bshuf eza mberi7 fi event
                  const eventBefore = events.some(
                    (event) =>
                      new Date(event.EventDate).setHours(0, 0, 0, 0) ===
                      currentDate - 86400000
                  );
                  //check if tommorow fi event
                  const eventAfter = events.some(
                    (event) =>
                      new Date(event.EventDate).setHours(0, 0, 0, 0) ===
                      currentDate + 86400000
                  );
                  // if today fi event, check if before or after fi event or both
                  if (eventToday) {
                    if (!eventBefore && eventAfter) {
                      return "bgcalendar first";
                    }
                    if (eventBefore && eventAfter) {
                      return "bgcalendar middle";
                    }
                    if (eventBefore && !eventAfter) {
                      return "bgcalendar last";
                    }
                  }
                }
                return null;
              }}
            />

            <div>
              {events.map((event) => (
                <div key={event.ID}>
                  {new Date(selectedDate).toDateString() ===
                    new Date(event.EventDate).toDateString() && (
                    <>
                      <p className="fs-4">Events:</p>

                      <div
                        className="border my-2 w-100 bg-light d-flex position-relative"
                        style={{ minWidth: "400px", minHeight: "80px" }}
                      >
                        <p className="mx-3 my-2">{event.Title}</p>
                        <p className="position-absolute bottom-0 end-0 px-2">
                          {new Date(event.EventDate).toDateString()}
                        </p>
                        <p className="position-absolute listcorner"></p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {tab === "Tab2" && (
        <>
          <div
            className="d-flex flex-column align-items-center"
            style={{
              maxHeight: "350px",
              overflowY: "scroll",
            }}
          >
            {events.map((event) => (
              <div key={event.ID} className="">
                <div
                  className="border my-2 w-100 bg-light d-flex position-relative"
                  style={{ minWidth: "400px", minHeight: "80px" }}
                >
                  <p className="mx-3 my-2 d-flex align-items-start justify-content-start gap-2">
                    <BsCursor />
                    {event.Title}
                  </p>
                  <p className="position-absolute bottom-0 end-0 px-2">
                    {new Date(event.EventDate).toDateString()}
                  </p>
                  <p className="position-absolute listcorner"></p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
