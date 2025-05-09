import { User, Calendar, BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";


interface VolunteerUser {
  name: string;
  email: string;
  subjects: string[];
  availability: string[];
  experience: string;
}

const VolunteerProfile = () => {
  const { user } = useAuth();

 

  if (!user) {
    return <div>Please log in to view your profile</div>;
  }

  const volunteerUser = user as VolunteerUser;

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <User className="mr-2 text-blue-600" size={28} />
        <h1 className="text-2xl font-bold">Volunteer Profile</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-blue-600 h-32"></div>
        <div className="px-6 py-4 relative">
          <div className="absolute -top-16 left-6 bg-white p-1 rounded-full">
            <img
              src="/placeholder.svg?height=120&width=120"
              alt="Profile"
              className="h-32 w-32 rounded-full object-cover border-4 border-white"
            />
          </div>
          <div className="mt-16">
            <h2 className="text-2xl font-bold">{volunteerUser.name}</h2>
            <p className="text-gray-600">{volunteerUser.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BookOpen className="mr-2 text-blue-600" size={20} />
            Subjects
          </h3>
          <div className="space-y-2">
            {volunteerUser.subjects.map((subject: string) => (
              <div
                key={subject}
                className="px-3 py-2 bg-blue-50 text-blue-700 rounded-md"
              >
                {subject}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="mr-2 text-blue-600" size={20} />
            Availability
          </h3>
          <div className="space-y-2">
            {volunteerUser.availability.map((day: string) => (
              <div
                key={day}
                className="px-3 py-2 bg-blue-50 text-blue-700 rounded-md"
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Experience</h3>
          <p className="text-gray-700">{volunteerUser.experience}</p>
        </div>
      </div>
    </div>
  );
};

export default VolunteerProfile;
