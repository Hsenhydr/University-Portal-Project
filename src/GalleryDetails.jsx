import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { BsChevronLeft, BsChevronRight, BsXLg } from "react-icons/bs";

function GalleryDetails() {
  const [token, setToken] = useState();
  const [imalbums, setimAlbums] = useState([]); //retrieve image albums
  const [selectedAlbum, setSelectedAlbum] = useState(""); //to know which images to fetch
  const [image, setImage] = useState([]); //retrieve images
  const [imagenb, setimagenb] = useState(1); //number of images
  const [imagestart, setimagestart] = useState(1);
  const [totalImages, setTotalImages] = useState(1); //total number of images

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

  //Get Image Albums
  useEffect(() => {
    token &&
      fetch(
        `https://wshare.sharepoint.com/sites/reacttrainingsite/_api/web/GetFolderByServerRelativeUrl('/sites/reacttrainingsite/Gallery/Images')/Folders`,
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
          setimAlbums(data.d.results);
        })
        .catch((error) => console.error("error:", error));
  }, [token]);

  //fake fetch to get total number of images
  useEffect(() => {
    fetch(
      `https://wshare.sharepoint.com/sites/reacttrainingsite/_api/web/GetFolderByServerRelativeUrl('/sites/reacttrainingsite/Gallery/Images/${selectedAlbum}')/Files`,
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
        setTotalImages(data.d.results.length);
      })
      .catch((error) => console.error("error:", error));
  }, [token, selectedAlbum]);

  const handleAlbumClick = (albumName, totalVideos) => {
    setSelectedAlbum(albumName);
    setImage([]); // Reset images when a new album is selected.
    setimagenb(1); // Reset pagination.
    setimagestart(1);
    setTotalImages(1);
  };

  //Retrieve Images
  useEffect(() => {
    fetch(
      `https://wshare.sharepoint.com/sites/reacttrainingsite/_api/web/GetFolderByServerRelativeUrl('/sites/reacttrainingsite/Gallery/Images/${selectedAlbum}')/Files?$top=${imagenb}`,
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
        const renderimage = data.d.results.slice(imagestart - 1, imagenb);
        setImage(renderimage);
      })
      .catch((error) => console.error("error:", error));
  }, [imagestart, imagenb, token, imalbums, selectedAlbum]);

  return (
    <div style={{ marginTop: "20px" }} className="text-center">
      <div className="my-5">
        <p
          className="d-flex align-items-center justify-content-center gap-5 my-5 mx-auto"
          style={{ maxWidth: "60vw" }}
        >
          {imalbums.map((album) => (
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
                  trigger={<img src="public/image.jpg" width={"300px"} />}
                  modal
                  overlayStyle={{
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  }}
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    border: "none",
                  }}
                  onOpen={() => handleAlbumClick(album.Name, totalImages)}
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
                          {image.map((image) => (
                            <div
                              className="card-footer d-flex justify-content-center"
                              key={image.ID}
                            >
                              <p className="text-center">
                                <img
                                  src={`https://wshare.sharepoint.com${image.ServerRelativeUrl}`}
                                  alt={image.Name}
                                  style={{
                                    width: "80%", // Make the image take full width of the popup
                                    height: "80%", // Make the image take full height of the popup
                                    objectFit: "contain",
                                  }}
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
                            setimagestart(imagestart > 1 ? imagestart - 1 : 1);
                            setimagenb(imagenb > 1 ? imagenb - 1 : 1);
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
                            if (imagenb < totalImages) {
                              setimagestart(imagestart + 1);
                              setimagenb(imagenb + 1);
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
    </div>
  );
}

export default GalleryDetails;
