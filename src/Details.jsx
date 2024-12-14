import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoClock } from "react-icons/go";

export default function Details() {
  const { id } = useParams();

  const [news, setNews] = useState([]);
  const [token, setToken] = useState("");

  // Get token
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

  // Get news
  useEffect(() => {
    if (token) {
      fetch(
        `https://wshare.sharepoint.com/sites/reacttrainingsite/_api/web/lists/getByTitle('news')/items(${id})?$select=ID,Title,description,DatePosted,Category/Title&$expand=Category`,
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
          console.log(data);
          setNews([data.d]);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [token]);

  return (
    <div style={{ maxHeight: "100vh" }} className="position-relative">
      <div>
        <img
          src="https://picsum.photos/id/24/1500/400"
          alt="news"
          style={{ width: "100%", height: "45vh" }}
        />
      </div>

      {news.map((x) => (
        <div
          className="position-absolute start-50 translate-middle"
          style={{
            width: "80vw",
            height: "65vh",
            top: "450px",
            backgroundColor: "white",
          }}
        >
          <p className="d-flex align-items-center gap-2 p-5">
            <GoClock
              style={{
                fontSize: "20px",
                color: "#528AAE",
              }}
            />
            {x.DatePosted.slice(0, 10)}
          </p>
          <h1 className="text-center lead" style={{ fontSize: "70px" }}>
            {x.Title}
          </h1>
          <p className="mx-5 text-center">{x.description}</p>
        </div>
      ))}
    </div>
  );
}
