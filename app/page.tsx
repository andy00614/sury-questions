import SurveyApp from "@/components/survey-app";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <SurveyApp />
      <div className="fixed bottom-4 right-4">
        <Link 
          href="/admin" 
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
        >
          数据后台
        </Link>
      </div>
    </>
  );
}
