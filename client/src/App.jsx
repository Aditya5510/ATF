import Navbar from "./component/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { LoadingProvider } from "./contexts/LoadingContext";
import GlobalLoader from "./component/GlobalLoader";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <LoadingProvider>
          <Navbar />
          <GlobalLoader />

          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </LoadingProvider>
      </BrowserRouter>
    </>
  );
}
