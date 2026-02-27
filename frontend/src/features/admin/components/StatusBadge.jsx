const StatusBadge = ({ label }) => (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
      label === 'Active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
      'bg-orange-500/20 text-orange-400 border border-orange-500/30'
    }`}>
      {label}
    </span>
  );
  export default StatusBadge;
  