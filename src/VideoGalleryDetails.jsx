import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { BsChevronLeft, BsChevronRight, BsXLg } from "react-icons/bs";

function VideoGalleryDetails() {
  const [token, setToken] = useState("");
  const [vidalbums, setvidAlbums] = useState([]); //retrieve video albums
  const [selectedAlbum, setSelectedAlbum] = useState(""); //to know which images to fetch
  const [video, setVideo] = useState([]); //retrieve videos
  const [videonb, setvideonb] = useState(1); //number of videos
  const [videostart, setvideostart] = useState(1);
  const [totalVideos, setTotalVideos] = useState(1); //total number of videos

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

  const handleAlbumClick = (albumName, totalVideos) => {
    setSelectedAlbum(albumName);
    setVideo([]); // Reset videos when a new album is selected.
    setvideonb(1); // Reset pagination.
    setvideostart(1);
    setTotalVideos(totalVideos);
  };

  //Get Video Albums
  useEffect(() => {
    token &&
      fetch(
        `https://wshare.sharepoint.com/sites/reacttrainingsite/_api/web/GetFolderByServerRelativeUrl('/sites/reacttrainingsite/Gallery/Videos')/Folders`,
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
          setvidAlbums(data.d.results);
        })
        .catch((error) => console.error("error:", error));
  }, [token]);

  //fake fetch to get total number of videos
  useEffect(() => {
    fetch(
      `https://wshare.sharepoint.com/sites/reacttrainingsite/_api/web/GetFolderByServerRelativeUrl('/sites/reacttrainingsite/Gallery/Videos/${selectedAlbum}')/Files`,
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
        setTotalVideos(data.d.results.length);
      })
      .catch((error) => console.error("error:", error));
  }, [token, selectedAlbum]);

  //Retrieve Videos
  useEffect(() => {
    fetch(
      `https://wshare.sharepoint.com/sites/reacttrainingsite/_api/web/GetFolderByServerRelativeUrl('/sites/reacttrainingsite/Gallery/Videos/${selectedAlbum}')/Files?$top=${videonb}`,
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
        const rendervideo = data.d.results.slice(videostart - 1, videonb);
        console.log(rendervideo);
        setVideo(rendervideo);
      })
      .catch((error) => console.error("error:", error));
  }, [videostart, videonb, token, vidalbums, selectedAlbum]);

  return (
    <div className="my-5">
      <p
        className="d-flex align-items-center justify-content-center gap-5 my-5 mx-auto"
        style={{ maxWidth: "60vw" }}
      >
        {vidalbums.map((album) => (
          <div className="col-12 col-sm-6 col-md-4 mb-3" key={album.ID}>
            <div
              style={{ height: "300px", width: "300px" }}
              className="position-relative"
            >
              <p
                className="position-absolute bottom-0 fs-3 text-white albumname"
                style={{ paddingLeft: "50px" }}
              >
                {album.Name}
              </p>
              <Popup
                trigger={<img src="public/videos.jpg" width={"300px"} />}
                modal
                overlayStyle={{
                  backdropFilter: "blur(10px)",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0)",
                  border: "none",
                }}
                onOpen={() => handleAlbumClick(album.Name, totalVideos)}
              >
                {(close) => (
                  <>
                    <BsXLg
                      className="btn"
                      style={{
                        position: "fixed",
                        top: "10px",
                        right: "10px",
                        color: "white",
                        fontSize: "50px",
                      }}
                      onClick={close}
                    >
                      X
                    </BsXLg>

                    {/* modal content */}
                    <div
                      style={{
                        minHeight: "350px",
                      }}
                      className="d-flex flex-column gap-5 flex-wrap justify-content-center align-items-center "
                    >
                      <div className="d-flex flex-column gap-5 flex-wrap justify-content-center align-items-center">
                        {video.map((video) => (
                          <div
                            className="card-footer d-flex justify-content-center"
                            key={video.ID}
                          >
                            <p className="text-center">
                              <video
                                src={`https://wshare.sharepoint.com${video.ServerRelativeUrl}`}
                                style={{ width: "220px" }}
                                controls
                                alt={video.Name}
                              />
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn"
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid white",
                          color: "white",
                          borderRadius: "50%",
                        }}
                        onClick={() => {
                          setvideostart(videostart > 1 ? videostart - 1 : 1);
                          setvideonb(videonb > 1 ? videonb - 1 : 1);
                        }}
                      >
                        <BsChevronLeft className="fs-4" />
                      </button>
                      <button
                        className="btn"
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid white",
                          color: "white",
                          borderRadius: "50%",
                        }}
                        onClick={() => {
                          if (videonb < totalVideos) {
                            setvideostart(videostart + 1);
                            setvideonb(videonb + 1);
                          }
                        }}
                      >
                        <BsChevronRight className="fs-4" />
                      </button>
                    </div>
                  </>
                )}
              </Popup>
            </div>
          </div>
        ))}
      </p>
    </div>
  );
}

export default VideoGalleryDetails;
