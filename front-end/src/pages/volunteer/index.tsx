import { Outlet } from "react-router-dom"
import VolunteerLayout from "../../components/layout/VolunteerLayout";

const VolunteerHome = () => {
  return (
    <VolunteerLayout>
      <Outlet />
    </VolunteerLayout>
  )
}

export default VolunteerHome
