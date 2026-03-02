/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Admin from './pages/Admin';
import AdminMCQs from './pages/AdminMCQs';
import AdminSubjects from './pages/AdminSubjects';
import AdminUsers from './pages/AdminUsers';
import Competition from './pages/Competition';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Leaderboard from './pages/Leaderboard';
import PastPapers from './pages/PastPapers';
import Practice from './pages/Practice';
import Premium from './pages/Premium';
import Profile from './pages/Profile';
import Quiz from './pages/Quiz';


export const PAGES = {
    "Admin": Admin,
    "AdminMCQs": AdminMCQs,
    "AdminSubjects": AdminSubjects,
    "AdminUsers": AdminUsers,
    "Competition": Competition,
    "Dashboard": Dashboard,
    "Landing": Landing,
    "Leaderboard": Leaderboard,
    "PastPapers": PastPapers,
    "Practice": Practice,
    "Premium": Premium,
    "Profile": Profile,
    "Quiz": Quiz,
}

export const pagesConfig = {
    mainPage: "Landing",
    Pages: PAGES,
};
