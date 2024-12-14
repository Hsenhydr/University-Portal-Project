import { Link } from "react-router-dom";
import "./App.css";
import NewsCard from "./newsCard";
import { useEffect, useState } from "react";
import { Riple } from "react-loading-indicators";
import { GoArrowUpRight } from "react-icons/go";
import { CiCalendarDate } from "react-icons/ci";

function Loading() {
  return (
    <>
      <Riple color="#7950f2" size="large" text="" textColor="" />
    </>
  );
}

export default function App() {
  const [token, setToken] = useState("");
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  // Fetch the 3
  useEffect(() => {
    if (token) {
      setIsLoading(true);
      fetch(
        `https://wshare.sharepoint.com/sites/reacttrainingsite/_api/web/lists/getByTitle('news')/items?$top=4&$select=ID,Title,description,DatePosted,Imagetemp,Category/Id,Category/Title&$expand=Category`,
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
          const slicedNews = data.d.results.slice(1, 4);
          setNews(slicedNews);
          setIsLoading(false);
        })
        .catch((error) => console.error(error));
    }
  }, [token]);

  return (
    <div className="pt-5">
      <div
        className="d-flex flex-column mx-auto position-relative"
        style={{
          maxWidth: "700px",
          minWidth: "700px",
        }}
      >
        <div className="text-end">
          <Link
            to="/All"
            className="btn fw-semibold"
            style={{ color: "#ffaf00" }}
          >
            All News
          </Link>
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          news.map((news) => (
            <>
              <div
                className="d-flex gap-5 flex-wrap justify-content-center align-items-center mb-1"
                key={news.ID}
              >
                <NewsCard>
                  <div className="d-flex justify-content-evenly align-items-center">
                    <div className="">
                      <img
                        src="public/news.jpg"
                        width={"80px"}
                        style={{ borderRadius: "10px" }}
                      />
                    </div>
                    <div className="content">
                      <div className="d-flex align-items-center justify-content-start px-3 gap-2">
                        <CiCalendarDate />
                        {news.DatePosted.slice(0, 10)}
                      </div>
                      <div className="title">{news.Title}</div>
                      <div className="description lead ms-3">
                        {news.description}
                      </div>
                    </div>
                    <div className="fs-1 px-5">
                      <Link to={`/details/${news.ID}`}>
                        <GoArrowUpRight color="var(--yellow)" />
                      </Link>
                    </div>
                  </div>
                </NewsCard>
              </div>
            </>
          ))
        )}
      </div>
    </div>
  );
}
