


import Preloader from '@/components/common/Preloader'
// import DashboardOne from '@/components/dashboard/DashboardOne'
import Settings from '@/components/dashboard/SettingsClient/Settings'

import Sidebar from '@/components/dashboard/SidebarClient'
import HeaderDashboard from '@/components/layout/headers/HeaderDashboard'
import React from 'react'

export const metadata = {
  title: 'Cashboard || Educrat - Professional LMS Online Education Course NextJS Template',
  description:
    'Elevate your e-learning content with Educrat, the most impressive LMS template for online courses, education and LMS platforms.',
  
}

export default function page() {
  return (
    <div  className="barba-container" data-barba="container">
        <main  className="main-content">
        <Preloader/>
            <HeaderDashboard/>
            <div  className="content-wrapper js-content-wrapper overflow-hidden">
              <div id='dashboardOpenClose'  className="dashboard -home-9 js-dashboard-home-9">
                <div  className="dashboard__sidebar scroll-bar-1">
                    <Sidebar/>

                </div>
                {/* <DashboardOne/> */}
                <Settings/>
              </div>
          </div>
        </main>
    </div>
  )
}
