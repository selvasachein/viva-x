import {
  useState,
  useEffect
} from "react";

import {
  useNavigate,
  useSearchParams
} from "react-router-dom";

import {
  collection,
  addDoc,
  doc,
  getDoc
} from "firebase/firestore";

import {
  Oval
} from "react-loader-spinner";

import { db }
from "../services/firebase";

import {
  allocateStudent
} from "../services/queueService";

function StudentEntry() {

  const [studentName, setStudentName] =
    useState("");

  const [validQR, setValidQR] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [joining, setJoining] =
    useState(false);

  const navigate =
    useNavigate();

  const [searchParams] =
    useSearchParams();

  const token =
    searchParams.get("token");

  // Validate QR
  useEffect(() => {

    validateQR();

  }, []);

  const validateQR =
    async () => {

      try {

        const qrDoc =
          await getDoc(
            doc(
              db,
              "qrSessions",
              "currentSession"
            )
          );

        if (!qrDoc.exists()) {

          setValidQR(false);

          setLoading(false);

          return;

        }

        const data =
          qrDoc.data();

        if (
          data.token === token &&
          data.active &&
          Date.now() <
            data.expiresAt
        ) {

          setValidQR(true);

        } else {

          setValidQR(false);

        }

        setLoading(false);

      } catch (error) {

        console.log(error);

        setLoading(false);

      }

    };

  // Join Queue
  const joinQueue =
    async () => {

      try {

        if (!studentName) {

          alert(
            "Enter Student Name"
          );

          return;

        }

        setJoining(true);

        // Create student
        const studentRef =
          await addDoc(
            collection(
              db,
              "students"
            ),
            {
              studentName,

              status:
                "waiting",

              assignedCounter:
                null,

              assignedFaculty:
                "",

              joinedAt:
                Date.now()
            }
          );

        // Allocate
        await allocateStudent(
          studentRef.id,
          studentName
        );

        setJoining(false);

        // Navigate
        navigate(
          `/student-status/${studentRef.id}`
        );

      } catch (error) {

        console.log(error);

        setJoining(false);

      }

    };

  // Loading Screen
  if (loading) {

    return (

      <div className="min-h-screen bg-black flex items-center justify-center">

        <Oval
          height={60}
          width={60}
          color="#22c55e"
          secondaryColor="gray"
          strokeWidth={5}
        />

      </div>

    );

  }

  // Invalid QR
  if (!validQR) {

    return (

      <div className="min-h-screen bg-black text-white flex items-center justify-center p-5">

        <div className="bg-gray-900 border border-red-500 rounded-2xl p-10 text-center max-w-md w-full">

          <h1 className="text-4xl font-bold text-red-500 mb-5">
            Invalid QR
          </h1>

          <p className="text-gray-300 text-lg">
            QR expired or invalid.
          </p>

        </div>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-black flex items-center justify-center p-5">

      <div className="w-full max-w-md bg-gray-900 border border-green-500 rounded-2xl shadow-2xl p-10">

        <h1 className="text-5xl font-extrabold text-center text-green-400 mb-3">
          VIVA-X
        </h1>

        <p className="text-center text-gray-400 mb-10">
          Student Queue Entry
        </p>

        <input
          type="text"
          placeholder="Enter Your Name"
          value={studentName}
          onChange={(e) =>
            setStudentName(
              e.target.value
            )
          }
          className="w-full p-4 rounded-xl bg-white text-black text-lg mb-8 outline-none"
        />

        <button
          onClick={joinQueue}
          disabled={joining}
          className="w-full bg-green-500 hover:bg-green-400 transition-all duration-300 text-black font-bold text-xl p-4 rounded-xl flex items-center justify-center"
        >

          {

            joining ? (

              <Oval
                height={30}
                width={30}
                color="black"
                secondaryColor="gray"
                strokeWidth={5}
              />

            ) : (

              "Join Queue"

            )

          }

        </button>

      </div>

    </div>

  );

}

export default StudentEntry;