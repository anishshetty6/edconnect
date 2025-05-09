import { Outlet } from "react-router-dom"
import StudentLayout from "../../components/layout/StudentLayout"

const StudentHome = () => {
  return (
    <StudentLayout>
      <Outlet />
    </StudentLayout>
  )
}

export default StudentHome
