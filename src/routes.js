import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import NotFoundView from './views/errors/NotFoundView';
import Home from "./views/home";
import Search from "./views/search";
import AboutView from "./views/about/AboutView";
import ContactView from "./views/contact/ContactView";
import TermsServiceView from "./views/terms/TermsServiceView";
import PrivacyPolicyView from "./views/privacy/PrivacyPolicyView";
import SupportView from "./views/support/SupportView";
import DisclaimerView from "./views/disclaimer/DisclaimerView";
import RestaurantView from "./views/restaurant/RestaurantView";
import Logout from "./views/auth/LogOut";
import DashboardView from "./views/dashboard/DashboardView";
import MyReservation from "./views/dashboard/DashboardView/customer/MyReservation";
import MyOrders from "./views/dashboard/DashboardView/customer/MyOrders";
import MyProfile from "./views/dashboard/DashboardView/MyProfile";
import Settings from "./views/dashboard/DashboardView/Settings";
import MyFavourite from "./views/dashboard/DashboardView/customer/MyFavourite";
import Dashboard from "./views/dashboard/DashboardView/owner/Dashboard";
import Reservations from "./views/dashboard/DashboardView/owner/Reservations";
import RestaurantProfile from "./views/dashboard/DashboardView/owner/RestaurantProfile";
import LogoBanner from "./views/dashboard/DashboardView/owner/LogoBanner";
import Specials from "./views/dashboard/DashboardView/owner/Specials";
import Menus from "./views/dashboard/DashboardView/owner/Menus";
import Reviews from "./views/dashboard/DashboardView/owner/Reviews";
import ReviewImages from "./views/dashboard/DashboardView/owner/ReviewImages";
import Todays from "./views/dashboard/DashboardView/owner/reservation/todays";
import Confirmed from "./views/dashboard/DashboardView/owner/reservation/confirmed";
import Cancelled from "./views/dashboard/DashboardView/owner/reservation/cancelled";
import Pending from "./views/dashboard/DashboardView/owner/reservation/pending";
import Report from "./views/dashboard/DashboardView/owner/reservation/report";
import ClaimMyBusiness from "./views/ClaimMyBusiness/ClaimMyBusinessView";
import OwnerActivation from "./views/dashboard/DashboardView/admin/OwnerActivation";
import UserActivation from "./views/dashboard/DashboardView/admin/UserActivation";
import AdminReservations from "./views/dashboard/DashboardView/admin/reservations";

const SimpleRoutes = ({isAuthenticated, type}) => {
    // 2 = admin (owner), 1 = general user, 3 = customer
    return (
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/search' element={<Search/>}/>
            <Route path='/restaurant/:id/:slug' element={<RestaurantView/>}/>
            <Route path='/about' element={<AboutView/>}/>
            <Route path='/contact' element={<ContactView/>}/>
            <Route path='/disclaimer' element={<DisclaimerView/>}/>
            <Route
                path='/dashboard/customer/'
                element={(isAuthenticated && type === '3') ? <DashboardView/> : <Navigate to='/'/> }
            >
                <Route path='my-reservation' element={<MyReservation/>}/>
                <Route path='my-orders' element={<MyOrders/>}/>
                <Route path='my-favourite' element={<MyFavourite/>}/>
                <Route path='my-profile' element={<MyProfile/>}/>
                <Route path='settings' element={<Settings/>}/>
            </Route>
            <Route
                path='/dashboard/owner/'
                element={(isAuthenticated && type === '2') ? <DashboardView/> : <Navigate to='/'/> }
            >
                <Route path='dashboard' element={<Dashboard/>}/>
                <Route path='reservations' element={<Reservations/>}>
                    <Route path='todays' element={<Todays/>}/>
                    <Route path='confirmed' element={<Confirmed/>}/>
                    <Route path='cancelled' element={<Cancelled/>}/>
                    <Route path='pending' element={<Pending/>}/>
                    <Route path='report' element={<Report/>}/>
                </Route>
                <Route path='restaurant-profile' element={<RestaurantProfile/>}/>
                <Route path='logo-banner' element={<LogoBanner/>}/>
                <Route path='specials' element={<Specials/>}/>
                <Route path='menus' element={<Menus/>}/>
                <Route path='reviews' element={<Reviews/>}/>
                <Route path='review-images' element={<ReviewImages/>}/>
                <Route path='my-profile' element={<MyProfile/>}/>
                <Route path='settings' element={<Settings/>}/>
            </Route>
            <Route
                path='/dashboard/admin/'
                element={(isAuthenticated && type === '1') ? <DashboardView/> : <Navigate to='/'/> }
            >
                <Route path='owner-activation' element={<OwnerActivation/>}/>
                <Route path='user-activation' element={<UserActivation/>}/>
                <Route path='reservations' element={<AdminReservations/>}/>
                <Route path='my-profile' element={<MyProfile/>}/>
                <Route path='settings' element={<Settings/>}/>
            </Route>
            <Route path='/terms-services' element={<TermsServiceView/>}/>
            <Route path='/privacy-policy' element={<PrivacyPolicyView/>}/>
            <Route path='/support-faq' element={<SupportView/>}/>
            <Route path='/claim' element={<ClaimMyBusiness/>}/>
            <Route path='/logout' element={<Logout/>}/>
            <Route path='404' element={<NotFoundView/>}/>
            <Route path='*' element={<Navigate to='/404'/>}/>
        </Routes>
    );
};

export default SimpleRoutes;
