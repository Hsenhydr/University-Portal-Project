import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./index";
import Details from "./Details";
import All from "./All";
import AnnouncementDetails from "./AnnouncementDetails";
import GalleryDetails from "./GalleryDetails";
import VideoGalleryDetails from "./VideoGalleryDetails";
import Bannerdetails from "./Bannerdetails";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/All" element={<All />} />
          <Route
            path="/AnnouncementDetails"
            element={<AnnouncementDetails />}
          />
          <Route path="/GalleryDetails" element={<GalleryDetails />} />
          <Route
            path="/VideoGalleryDetails"
            element={<VideoGalleryDetails />}
          />
          <Route path="/Bannerdetails/:id" element={<Bannerdetails />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
