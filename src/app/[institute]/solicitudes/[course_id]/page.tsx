import AccountRequestList from "@/domains/users/components/ListAccountRequest";
import { fetchAccountRequests } from "@/domains/users/services/fetchListAccountRequest";
import { institutes } from "@/shared/config/institutes";

interface SolicitudesPageProps {
  params: {
    course_id: string;
    institute: string;
  };
}

// Temporal
type Account = {
  id: string;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
};

interface ListAccountRequestProps {
  data: Account[];
  message?: string;
}

export default async function SolicitudesPage({ params }: SolicitudesPageProps) {
  const { course_id, institute } = await params;
  const accountRequests = await fetchAccountRequests({ course_id });

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-bold">{institutes[institute].name}</h1>
        <h2 className="text-xl">Solicitudes para el curso {course_id}</h2>
      </div>

      <AccountRequestList accountRequests={accountRequests as ListAccountRequestProps} />
    </div>
  );
}
