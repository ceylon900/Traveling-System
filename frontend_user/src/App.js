import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import "./App.css";
import NaviBar from "./components/NaviBar";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import BusinessTools from "./pages/BusinessTools";
import AddPackage from "./pages/AddPackage";
import ManagePackages from "./pages/ManagePackages";
import ExplorePage from "./pages/ExplorePage";
import ViewPackage from "./pages/ViewPackage";
import BusinessPlace from "./pages/BusinessPlace";
import TripPlanner from "./pages/TripPlanner";
import Profile from "./pages/UserProfile";
import MyTripPlans from "./pages/MyTripPlans";
import PaymentPage from "./pages/PaymentPage";
import MyBookings from "./pages/MyBookings";
import SellerBookings from "./pages/SellerBookings";


function App() {
  return (
    <BrowserRouter>
    <NaviBar />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/services" element={<Services/>}/>
        <Route path="/businesstools" element={<BusinessTools/>}/>
        <Route path="/addpackage" element={<AddPackage/>}/>
        <Route path="/managepackages" element={<ManagePackages/>}/>
        <Route path="/packages" element={<ExplorePage/>}/>
        <Route path="/viewpackage/:id" element={<ViewPackage/>}/>
        <Route path="/businessplace" element={<BusinessPlace/>}/>
        <Route path="/tripplan" element={<TripPlanner/>}/>
        <Route path="/userprofile" element={<Profile/>}/>
        <Route path="/mytripplans" element={<MyTripPlans/>}/>
        <Route path="/payment/:bookingId" element={<PaymentPage/>}/>
        <Route path="/mybooking" element={<MyBookings/>}/>
        <Route path="/seller-bookings" element={<SellerBookings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
