// import AdminLayout from "../layouts/AdminLayout";
// import KPICard from "../components/KPICard";
// import LatestRegistrations from "../components/LatestRegistrations";
// import CommunitiesTable from "../components/CommunitiesTable";
// import NetworkChart from "../components/NetworkChart";

// import { MdPerson, MdHub, MdTrendingUp, MdWarning } from "react-icons/md";

// export default function AdminDashboard() {
//   return (
//     <AdminLayout>

//       <h1 className="text-2xl font-semibold mb-1">Admin Overview</h1>
//       <p className="text-gray-400 mb-8">Welcome back, Admin.</p>

//       {/* KPI */}
//       <div className="grid grid-cols-4 gap-6 mb-10">

//         <KPICard icon={<MdPerson />} value="24,512" label="Total Users" badge="+12%" />
//         <KPICard icon={<MdHub />} value="1,208" label="Communities" badge="+4%" />
//         <KPICard icon={<MdTrendingUp />} value="4,821" label="Active (24h)" badge="Active" />
//         <KPICard icon={<MdWarning />} value="42" label="Flagged" badge="High" />

//       </div>

//       {/* Tables */}
//       <div className="grid grid-cols-2 gap-8 mb-10">
//         <LatestRegistrations />
//         <CommunitiesTable />
//       </div>

//       <NetworkChart />

//     </AdminLayout>
//   );
// }

import AdminLayout from "../layouts/AdminLayout";
import KPICard from "../components/KPICard";
import LatestRegistrations from "../components/LatestRegistrations";
import CommunitiesTable from "../components/CommunitiesTable";
import NetworkChart from "../components/NetworkChart";

export default function AdminDashboard(){
return(
<AdminLayout>

<div className="grid grid-cols-4 gap-6 mb-10">
<KPICard value="24,512" label="Users"/>
<KPICard value="1,208" label="Communities"/>
<KPICard value="4,821" label="Active"/>
<KPICard value="42" label="Flagged"/>
</div>

<div className="grid grid-cols-2 gap-8">
<LatestRegistrations/>
<CommunitiesTable/>
</div>

<NetworkChart/>

</AdminLayout>
)
}