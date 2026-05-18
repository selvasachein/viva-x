import {
  useState,
  useEffect
} from "react";

import {
  useParams
} from "react-router-dom";

import {
  doc,
  onSnapshot
} from "firebase/firestore";

import { db }
from "../services/firebase";

function StudentStatus() {

  const { id } =
    useParams();

  const [student, setStudent] =
    useState(null);

  // Live Student Status
  useEffect(() => {

    const unsubscribe =
      onSnapshot(
        doc(db, "students", id),
        (snapshot) => {

          // Viva completed
          if (!snapshot.exists()) {

            setStudent({
              completed: true
            });

            return;

          }

          setStudent({
            id: snapshot.id,
            ...snapshot.data()
          });

        }
      );

    return () => unsubscribe();

  }, [id]);

  // Loading
  if (!student) {

    return (

      <div className="min-h-screen bg-black flex items-center justify-center">

        <div className="text-green-400 text-4xl font-bold animate-pulse">

          Loading...

        </div>

      </div>

    );

  }

  // Completed
  if (student.completed) {

    return (

      <div className="min-h-screen bg-black flex items-center justify-center p-5">

        <div className="bg-gray-900 border border-green-500 rounded-3xl p-10 shadow-2xl text-center max-w-lg w-full">

          <h1 className="text-5xl font-extrabold text-green-400 mb-6">

            Viva Completed

          </h1>

          <p className="text-2xl text-gray-300">

            Thank you.

          </p>

        </div>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-black flex items-center justify-center p-5">

      <div className="w-full max-w-2xl bg-gray-900 border border-green-500 rounded-3xl shadow-2xl p-10">

        {/* Header */}

        <div className="text-center mb-10">

          <h1 className="text-6xl font-extrabold text-green-400 mb-3">

            VIVA-X

          </h1>

          <p className="text-2xl text-gray-400">

            Live Student Status

          </p>

        </div>

        {/* Student Name */}

        <div className="bg-black border border-blue-500 rounded-2xl p-8 mb-8 text-center">

          <div className="text-blue-400 text-2xl font-bold mb-4">

            STUDENT

          </div>

          <div className="text-5xl font-extrabold text-white break-words">

            {student.studentName}

          </div>

        </div>

        {/* Status */}

        <div className="bg-black border border-yellow-500 rounded-2xl p-8 mb-8 text-center">

          <div className="text-yellow-400 text-2xl font-bold mb-4">

            STATUS

          </div>

          <div className="text-5xl font-extrabold text-white uppercase">

            {student.status}

          </div>

        </div>

        {/* Faculty */}

        <div className="bg-black border border-green-500 rounded-2xl p-8 mb-8 text-center">

          <div className="text-green-400 text-2xl font-bold mb-4">

            FACULTY

          </div>

          <div className="text-4xl font-extrabold text-white break-words">

            {

              student.assignedFaculty
                ? student.assignedFaculty
                : "Waiting..."

            }

          </div>

        </div>

        {/* Counter */}

        <div className="bg-black border border-pink-500 rounded-2xl p-8 text-center">

          <div className="text-pink-400 text-2xl font-bold mb-4">

            COUNTER

          </div>

          <div className="text-5xl font-extrabold text-white">

            {

              student.assignedCounter
                ? student.assignedCounter
                : "--"

            }

          </div>

        </div>

      </div>

    </div>

  );

}

export default StudentStatus;