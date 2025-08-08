import React, { Suspense, lazy } from 'react';
import Layout from "./Layout.jsx";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

// Lazy-loaded pages for faster initial load
const Dashboard = lazy(() => import('./Dashboard'));
const CreateTask = lazy(() => import('./CreateTask'));
const MyTasks = lazy(() => import('./MyTasks'));
const Team = lazy(() => import('./Team'));
const Analytics = lazy(() => import('./Analytics'));
const Templates = lazy(() => import('./Templates'));
const WhatsAppTest = lazy(() => import('./WhatsAppTest'));
const TaskDetails = lazy(() => import('./TaskDetails'));
const TeamTaskView = lazy(() => import('./TeamTaskView'));
const WhatsAppAdmin = lazy(() => import('./WhatsAppAdmin'));
const AIAdminDashboard = lazy(() => import('./AIAdminDashboard'));
const Projects = lazy(() => import('./Projects'));
const ProjectDetails = lazy(() => import('./ProjectDetails'));
const DeletedTasks = lazy(() => import('./DeletedTasks'));
const UnifiedTaskView = lazy(() => import('./UnifiedTaskView'));

const PAGES = {
    
    Dashboard: Dashboard,
    
    UnifiedTaskView: UnifiedTaskView,
    
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
    
    DeletedTasks: DeletedTasks,
    
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
            <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading...</div>}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/UnifiedTaskView" element={<UnifiedTaskView />} />
                
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
                
                <Route path="/DeletedTasks" element={<DeletedTasks />} />
                
            </Routes>
            </Suspense>
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