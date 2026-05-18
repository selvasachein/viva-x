import { useEffect, useState } from "react";

import {
  doc,
  onSnapshot
} from "firebase/firestore";

import { useParams } from "react-router-dom";

import { db } from "../services/firebase";

function StudentStatus() {

  const { id } = useParams();

  const [student, setStudent] = useState(null);

  useEffect(() => {

    const unsubscribe = onSnapshot(
      doc(db, "students", id),
      (snapshot) => {

        if (snapshot.exists()) {

          setStudent(snapshot.data());

        }

      }
    );

    return () => unsubscribe();

  }, [id]);

  if (!student) {

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-3xl">

        Loading...

      </div>
    );

  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-5">

      <div className="bg-gray-900 p-10 rounded-xl w-full max-w-lg">

        <h1 className="text-4xl font-bold mb-8 text-center">
          Student Status
        </h1>

        <div className="space-y-5 text-2xl">

          <div>
            Name:
            <span className="text-green-400 ml-3">
              {student.studentName}
            </span>
          </div>

          <div>
            Status:
            <span className="text-yellow-400 ml-3">
              {student.status}
            </span>
          </div>

          <div>
            Faculty:
            <span className="text-cyan-400 ml-3">
              {
                student.assignedFaculty ||
                "Not Assigned"
              }
            </span>
          </div>

          <div>
            Counter:
            <span className="text-pink-400 ml-3">
              {
                student.assignedCounter ||
                "Not Assigned"
              }
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default StudentStatus;