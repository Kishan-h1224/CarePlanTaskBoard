import { Badge } from "@/components/ui/badge";
import { Role } from "@/types";
import { Stethoscope, Utensils, Users } from "lucide-react";

const ROLE_CONFIG = {
  nurse: {
    label: 'Nurse',
    icon: Stethoscope,
    className: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200',
  },
  dietician: {
    label: 'Dietician',
    icon: Utensils,
    className: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200',
  },
  social_worker: {
    label: 'Social Worker',
    icon: Users,
    className: 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200',
  },
};

export function RoleBadge({ role }: { role: Role }) {
  const config = ROLE_CONFIG[role];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.className} flex items-center gap-1.5 font-medium px-2 py-0.5`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}