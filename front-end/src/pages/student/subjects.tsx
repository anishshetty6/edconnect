import { BookOpen, Calendar, ChevronRight } from "lucide-react"

const subjects = [
  {
    id: "math",
    title: "Mathematics",
    description: "Advanced Mathematics including Algebra, Calculus, and Geometry",
    image: "/math.gif",
    classes: [{ date: "Tomorrow at 5:30 PM", teacher: "Mr. Johnson" }],
  },
  {
    id: "english",
    title: "English",
    description: "Literature, Grammar, and Creative Writing",
    image: "/english.gif",
    classes: [
      { date: "08-04-2025 at 2:00 PM", teacher: null },
      { date: "09-04-2025 at 10:00 AM", teacher: null },
    ],
  },
  {
    id: "science",
    title: "Science",
    description: "Physics, Chemistry, and Biology",
    image: "/science.gif",
    classes: [
      { date: "05-04-2025 at 11:00 AM", teacher: null },
      { date: "08-04-2025 at 9:00 AM", teacher: null },
    ],
  },
]

const SubjectsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <BookOpen className="mr-2 text-purple-600" size={28} />
        <h1 className="text-2xl font-bold">My Subjects</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <div key={subject.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <div className="h-40 bg-gray-100 relative">
              <img
                src={subject.image || "/placeholder.svg"}
                alt={subject.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `/placeholder.svg?height=160&width=320&text=${subject.title}`
                }}
              />
              <div className="absolute top-0 right-0 p-2">
                <div className="bg-purple-600 text-white p-2 rounded-full">
                  <BookOpen size={20} />
                </div>
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-800">{subject.title}</h3>
              <p className="text-gray-600 mt-2 text-sm">{subject.description}</p>

              <div className="mt-4">
                <div className="flex items-center text-purple-600 mb-2">
                  <Calendar size={16} className="mr-2" />
                  <span className="font-medium">Upcoming Classes</span>
                </div>

                <div className="space-y-2">
                  {subject.classes.map((cls, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm border-b pb-2">
                      <span>{cls.date}</span>
                      <span className="text-gray-500">{cls.teacher ? cls.teacher : "( No teacher )"}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={`/student/subjects/${subject.id}`}
                  className="mt-4 flex items-center justify-center w-full py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
                >
                  View Details
                  <ChevronRight size={16} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubjectsPage
