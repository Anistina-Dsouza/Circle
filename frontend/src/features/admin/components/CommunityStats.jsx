export default function CommunityStats({ newCircles = 0, engagement = '0', reportedItems = 0 }) {
    return (
      <div className="grid md:grid-cols-3 gap-8 mt-10">
  
        <StatCard
          title="New Circles Today"
          value={`+${newCircles}`}
          positive
        />
  
        <StatCard
          title="Avg. Members per Circle"
          value={engagement}
          positive
        />
  
        <StatCard
          title="Reported Items"
          value={reportedItems}
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