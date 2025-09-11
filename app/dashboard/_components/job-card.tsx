import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Job {
  id: string;
  jobTitle: string;
  location: string;
  exp: string;
  jobType: string;
  ctc: string;
  shortDesciption: string;
  positionDesciption: string;
  companyDesciption: string;
  companyCulture: string;
  Benefits: string;
  responsibilty: string;
  workType: string;
  Tags: string[];
  date: any;
}

export function JobCard({
  job,
  onEdit,
  onDelete,
}: {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Card className="shadow-none border-0">
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold font-Manrope">{job.jobTitle}</h3>

          <div className="flex flex-wrap gap-2 font-Nunito">
            <Badge variant="outline" className="bg-white font-Manrope">
              {job.jobType}
            </Badge>
            <Badge variant="outline" className="bg-white">
              {job.exp}
            </Badge>
            <Badge variant="outline" className="bg-white">
              {job.workType}
            </Badge>
            <Badge variant="outline" className="bg-white">
              {job.ctc}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-gray-700 font-Nunito"> Applicants</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(job.id)}
              >
                Delete
              </Button>
              <Button
                size="sm"
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => onEdit(job)}
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
