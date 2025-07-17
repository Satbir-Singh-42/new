interface ProgressCardProps {
  title: string;
  value: number;
  color: string;
}

export default function ProgressCard({ title, value, color }: ProgressCardProps) {
  return (
    <div className={`bg-gradient-to-br ${color} text-white p-4 rounded-xl`}>
      <h4 className="text-2xl font-bold">{value}</h4>
      <p className="text-sm opacity-90">{title}</p>
    </div>
  );
}
