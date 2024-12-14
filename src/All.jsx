import React, { useEffect } from "react";
import { useState } from "react";
import NewsCard from "./newsCard";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

export default function All() {
  const [token, setToken] = useState("");
  const [news, setNews] = useState([]);
  const [pagenumber, setPagenumber] = useState(1);
  const [newsnb, setnewsnb] = useState(5);
  const [newstart, setnewstart] = useState(0);
  const [count, setCount] = useState(0);
  const [length, setLength] = useState(0);

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
    fetch(
      `https://wshare.sharepoint.com/sites/reacttrainingsite/_api/web/lists/getByTitle('news')/items?$top=${newsnb}`,
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
        const datanews = data.d.results.slice(newstart, newsnb);
        setNews(datanews);
        console.log(data.d.results);
        setCount(data.d.results);
      })
      .catch((error) => console.error(error));
  }, [token, newsnb, newstart]);

  //fake fetch
  useEffect(() => {
    fetch(
      `https://wshare.sharepoint.com/sites/reacttrainingsite/_api/web/lists/getByTitle('news')/items`,
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
        setLength(data.d.results.length);
        console.log(data.d.results.length);
      })
      .catch((error) => console.error(error));
  }, [token]);

  return (
    <div>
      <Link
        to="/"
        className="btn m-3"
        style={{ backgroundColor: "var(--yellow)" }}
      >
        <BsArrowLeft /> Back
      </Link>
      <div className="container">
        <div className="row g-3 justify-content-center">
          {news.map((item) => (
            <div className="col-12 col-sm-6 col-md-4 " key={item.ID}>
              <NewsCard id={item.ID} className="card h-100 ">
                <div className="cardh">
                  <img
                    src="public/news.jpg"
                    width="1200px"
                    height="400px"
                    className="card-img-top"
                    alt="image"
                  />
                </div>
                <div className="card-body d-flex flex-column text-center">
                  <h5 className="card-title title ">{item.Title}</h5>
                  <p className="card-text description text-center w-100">
                    {item.description}
                  </p>
                  <p className="card-text">
                    <small className="text-muted date">
                      {item.DatePosted.slice(0, 10)}
                    </small>
                  </p>
                </div>
              </NewsCard>
            </div>
          ))}
        </div>
      </div>

      <div className="d-flex justify-content-center align-items-center">
        <button
          className="btn m-3 btn-sm "
          style={{ backgroundColor: "var(--yellow)" }}
          onClick={() => {
            setnewstart(newstart > 0 ? newstart - 5 : 0);
            setnewsnb(newsnb > 5 ? newsnb - 5 : 5);
            if (newstart > 0) {
              setPagenumber(pagenumber - 1);
            }
          }}
        >
          <BsArrowLeft className="fs-4" />
        </button>
        {pagenumber}
        <button
          className="btn m-3 btn-sm"
          style={{ backgroundColor: "var(--yellow)" }}
          onClick={() => {
            if (newstart < length - 1) {
              setPagenumber(pagenumber + 1);
              setnewsnb(newsnb + 5);
              setnewstart(newstart + 5);
            }
          }}
        >
          <BsArrowRight className="fs-4" />
        </button>
      </div>
    </div>
  );
}
