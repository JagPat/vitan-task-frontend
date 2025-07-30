import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import CreateTask from "./CreateTask";

import MyTasks from "./MyTasks";

import Team from "./Team";

import Analytics from "./Analytics";

import Templates from "./Templates";

import WhatsAppTest from "./WhatsAppTest";

import TaskDetails from "./TaskDetails";

import TeamTaskView from "./TeamTaskView";

import WhatsAppAdmin from "./WhatsAppAdmin";

import AIAdminDashboard from "./AIAdminDashboard";

import Projects from "./Projects";

import ProjectDetails from "./ProjectDetails";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    CreateTask: CreateTask,
    
    MyTasks: MyTasks,
    
    Team: Team,
    
    Analytics: Analytics,
    
    Templates: Templates,
    
    WhatsAppTest: WhatsAppTest,
    
    TaskDetails: TaskDetails,
    
    TeamTaskView: TeamTaskView,
    
    WhatsAppAdmin: WhatsAppAdmin,
    
    AIAdminDashboard: AIAdminDashboard,
    
    Projects: Projects,
    
    ProjectDetails: ProjectDetails,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/CreateTask" element={<CreateTask />} />
                
                <Route path="/MyTasks" element={<MyTasks />} />
                
                <Route path="/Team" element={<Team />} />
                
                <Route path="/Analytics" element={<Analytics />} />
                
                <Route path="/Templates" element={<Templates />} />
                
                <Route path="/WhatsAppTest" element={<WhatsAppTest />} />
                
                <Route path="/TaskDetails" element={<TaskDetails />} />
                
                <Route path="/TeamTaskView" element={<TeamTaskView />} />
                
                <Route path="/WhatsAppAdmin" element={<WhatsAppAdmin />} />
                
                <Route path="/AIAdminDashboard" element={<AIAdminDashboard />} />
                
                <Route path="/Projects" element={<Projects />} />
                
                <Route path="/ProjectDetails/:projectId" element={<ProjectDetails />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}