import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBg?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  iconBg = "bg-blue-100",
}: StatsCardProps) {
  return (
    <Card className="shadow-none border-0">
      <CardContent className="p-3">
        <div className="flex items-center gap-4">
          <div className={cn("p-2 rounded-md", iconBg)}>{icon}</div>
          <div>
            <p className="text-2xl font-bold font-Manrope">{value}</p>
            <p className="text-sm text-gray-500">{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
