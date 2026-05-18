import { useEffect, useState } from "react";

import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc
} from "firebase/firestore";

import {
  useNavigate,
  useSearchParams
} from "react-router-dom";

import { db } from "../services/firebase";

import {
  allocateStudent
} from "../services/queueService";

function StudentEntry() {

  const [studentName, setStudentName] =
    useState("");

  const [authorized, setAuthorized] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  useEffect(() => {

    validateQR();

  }, []);

  const validateQR = async () => {

    try {

      const token =
        searchParams.get("token");

      if (!token) {

        setLoading(false);

        return;

      }

      const sessionDoc = await getDoc(
        doc(
          db,
          "qrSessions",
          "currentSession"
        )
      );

      if (!sessionDoc.exists()) {

        setLoading(false);

        return;

      }

      const session =
        sessionDoc.data();

      const currentTime =
        Date.now();

      if (
        session.active &&
        session.token === token &&
        currentTime < session.expiresAt
      ) {

        setAuthorized(true);

      }

      setLoading(false);

    } catch (error) {

      console.log(error);

      setLoading(false);

    }

  };

  const joinQueue = async () => {

    if (!studentName) {

      alert("Enter Student Name");

      return;

    }

    try {

      const docRef = await addDoc(
        collection(db, "students"),
        {
          studentName,
          status: "waiting",
          assignedCounter: null,
          assignedFaculty: "",
          createdAt: serverTimestamp()
        }
      );

      await allocateStudent(
        docRef.id,
        studentName
      );

      navigate(
        `/student-status/${docRef.id}`
      );

    } catch (error) {

      console.log(error);

    }

  };

  // Loading
  if (loading) {

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-3xl">

        Loading...

      </div>
    );

  }

  // Unauthorized
  if (!authorized) {

    return (
      <div className="min-h-screen bg-black text-red-500 flex items-center justify-center text-3xl font-bold">

        Invalid or Expired QR

      </div>
    );

  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-5">

      <div className="bg-gray-900 p-10 rounded-xl w-full max-w-md">

        <h1 className="text-4xl font-bold mb-8 text-center">
          VIVA-X
        </h1>

        <input
          type="text"
          placeholder="Enter Your Name"
          value={studentName}
          onChange={(e) =>
            setStudentName(e.target.value)
          }
          className="w-full p-4 rounded bg-white text-black mb-5"
        />

        <button
          onClick={joinQueue}
          className="w-full bg-green-500 text-black p-4 rounded text-xl font-bold"
        >
          Join Queue
        </button>

      </div>

    </div>
  );
}

export default StudentEntry;