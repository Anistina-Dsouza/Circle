export default function CommunityStats() {
    return (
      <div className="grid md:grid-cols-3 gap-8 mt-10">
  
        <StatCard
          title="New Circles Today"
          value="+24"
          trend="+12%"
          positive
        />
  
        <StatCard
          title="Avg. Engagement"
          value="84.2%"
          trend="+4%"
          positive
        />
  
        <StatCard
          title="Reported Items"
          value="12"
          subtitle="Pending Review"
          danger
        />
  
      </div>
    );
  }
  
  function StatCard({ title, value, trend, subtitle, positive, danger }) {
    return (
      <div className="bg-[#240046]/60 border border-purple-900/40 p-8 rounded-3xl">
  
        <p className="text-purple-300 text-sm uppercase tracking-widest mb-4">
          {title}
        </p>
  
        <div className="flex items-end gap-4">
          <span className={`text-4xl font-bold ${danger ? "text-red-400" : ""}`}>
            {value}
          </span>
  
          {trend && (
            <span className="text-green-400 text-sm">
              {trend}
            </span>
          )}
  
          {subtitle && (
            <span className="text-purple-300 text-sm">
              {subtitle}
            </span>
          )}
        </div>
  
      </div>
    );
  }