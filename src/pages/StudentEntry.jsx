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

import {
  getCurrentSlot,
  increaseSlotBooking
} from "../services/slotService";

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

        // Current Slot
        const slot =
          await getCurrentSlot();

        if (!slot) {

          alert(
            "No Active Viva Slot"
          );

          return;

        }

        // Slot Full
        if (
          slot.booked >=
          slot.capacity
        ) {

          alert(
            `${slot.slot} Slot Full`
          );

          return;

        }

        setJoining(true);

        // Create Student
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

              slot:
                slot.slot,

              joinedAt:
                Date.now()
            }
          );

        // Queue Allocation
        await allocateStudent(
          studentRef.id,
          studentName
        );

        // Increase Slot Count
        await increaseSlotBooking(
          slot.id,
          slot.booked
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

  // Loading
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
  <div className="min-h-screen bg-black flex flex-col items-center justify-between p-5">

    {/* TOP SECTION */}
    <div className="w-full flex flex-col items-center justify-center">

      <div className="w-full max-w-md bg-gray-900 border border-green-500 rounded-2xl shadow-2xl p-10">

        <h1 className="text-5xl font-extrabold text-center text-green-400 mb-3">
          VIVA-X
        </h1>

        <p className="text-center text-gray-400 mb-8">
          Student Queue Entry
        </p>

        {/* Current Slot Info */}
        <div className="bg-black border border-blue-500 rounded-xl p-4 mb-6 text-center">

          <div className="text-blue-400 text-lg font-bold mb-2">
            Current Viva Slot
          </div>

          <div className="text-white text-2xl font-bold">
            Auto Detected by System Time
          </div>

        </div>

        <input
          type="text"
          placeholder="Enter Your Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="w-full p-4 rounded-xl bg-white text-black text-lg mb-8 outline-none"
        />

        <button
          onClick={joinQueue}
          disabled={joining}
          className="w-full bg-green-500 hover:bg-green-400 transition-all duration-300 text-black font-bold text-xl p-4 rounded-xl flex items-center justify-center"
        >
          {joining ? (
            <Oval
              height={30}
              width={30}
              color="black"
              secondaryColor="gray"
              strokeWidth={5}
            />
          ) : (
            "Join Queue"
          )}
        </button>

      </div>
    </div>

    {/* FOOTER */}
    <div className="w-full flex flex-col items-center justify-center text-center border-t border-gray-700 pt-6 relative overflow-hidden px-4 sm:px-6 mt-8">

      {/* Floating background glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-2 left-1/4 w-20 h-20 sm:w-32 sm:h-32 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-2 right-1/4 w-20 h-20 sm:w-32 sm:h-32 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg">

        <h2 className="text-lg sm:text-2xl font-extrabold tracking-wide bg-gradient-to-r from-green-400 via-white to-green-400 bg-clip-text text-transparent animate-pulse">
          VIVA-X Smart Queue System
        </h2>

        <p className="text-gray-400 mt-2 text-xs sm:text-sm">
          Seamless • Fast • Intelligent Viva Management
        </p>

        <p className="text-gray-500 mt-3 italic text-xs sm:text-sm">
          Designed & Developed with precision by
        </p>

        <p className="text-green-300 font-bold text-base sm:text-lg mt-1 tracking-wider animate-pulse break-words">
          Dr. R. Selvakumar
        </p>

        <div className="mt-4 flex flex-col sm:flex-row gap-1 sm:gap-2 items-center justify-center text-[10px] sm:text-xs text-gray-500">
          <span>⚡ Real-time Queue</span>
          <span>📡 Live Sync</span>
        </div>

      </div>
    </div>

  </div>
);

}

export default StudentEntry;