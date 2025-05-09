import { Outlet } from "react-router-dom";
import SchoolLayout from "@/components/layout/SchoolLayout";

const SchoolHome = () => {
  return (
    <div>
      <SchoolLayout>
        <Outlet />
      </SchoolLayout>
    </div>
  );
};

export default SchoolHome;
