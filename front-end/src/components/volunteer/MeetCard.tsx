import { Link } from "react-router-dom";

interface Meeting {
  _id: string; // Changed from id to _id to match your schema
  title: string;
  startTime: string;
  endTime: string;
  standard: number;
  location?: string;
  description?: string;
}

interface MeetCardProps {
  meeting: Meeting;
}

const MeetCard = ({ meeting }: MeetCardProps) => {


  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-md shadow-sm p-2 h-full flex flex-col">
      <div className="font-medium text-blue-800 truncate">{meeting.title}</div>
      <div className="text-xs text-gray-600 truncate">{meeting.location}</div>

      <div className="mt-auto pt-2">
        <Link
          to={`/meet/${meeting._id}`}
          className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded transition-colors text-center"
        >
          Join Meeting
        </Link>
      </div>
    </div>
  );
};

export default MeetCard;
