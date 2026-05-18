import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc
} from "firebase/firestore";

import { db } from "../services/firebase";

import { getDeviceId } from "../services/deviceService";

import { completeViva } from "../services/queueService";

function CounterScreen() {

  const [counter, setCounter] = useState(null);

  const [facultyName, setFacultyName] = useState("");

  // Check authorization
  useEffect(() => {

    checkAuthorization();

  }, []);

  // Refresh counter data every 2 seconds
  useEffect(() => {

    if (!counter) return;

    const interval = setInterval(() => {

      checkAuthorization();

    }, 2000);

    return () => clearInterval(interval);

  }, [counter]);

  const checkAuthorization = async () => {

    try {

      const deviceId = getDeviceId();

      const snapshot = await getDocs(
        collection(db, "counters")
      );

      snapshot.forEach((document) => {

        const data = document.data();

        if (data.deviceId === deviceId) {

          setCounter({
            id: document.id,
            ...data
          });

        }

      });

    } catch (error) {

      console.log(error);

    }

  };

  // Activate counter
  const activateCounter = async () => {

    if (!facultyName) {

      alert("Enter Faculty Name");

      return;

    }

    try {

      await updateDoc(
        doc(db, "counters", counter.id),
        {
          facultyName: facultyName,
          active: true
        }
      );

      alert("Counter Activated");

      setCounter({
        ...counter,
        facultyName: facultyName,
        active: true
      });

    } catch (error) {

      console.log(error);

    }

  };

  // End session
  const endSession = async () => {

    try {

      // Delete progress student
      if (counter.progressStudent) {

        await deleteDoc(
          doc(
            db,
            "students",
            counter.progressStudent.id
          )
        );

      }

      // Delete waitlist student
      if (counter.waitlistStudent) {

        await deleteDoc(
          doc(
            db,
            "students",
            counter.waitlistStudent.id
          )
        );

      }

      // Delete all waiting students
      const studentsSnapshot = await getDocs(
        collection(db, "students")
      );

      for (const studentDoc of studentsSnapshot.docs) {

        await deleteDoc(
          doc(db, "students", studentDoc.id)
        );

      }

      // Reset counter
      await updateDoc(
        doc(db, "counters", counter.id),
        {
          facultyName: "",
          active: false,
          progressStudent: null,
          waitlistStudent: null
        }
      );

      alert("Session Ended");

      setCounter({
        ...counter,
        facultyName: "",
        active: false,
        progressStudent: null,
        waitlistStudent: null
      });

      setFacultyName("");

    } catch (error) {

      console.log(error);

    }

  };

  // Unauthorized device
  if (!counter) {

    return (
      <div className="min-h-screen bg-black text-red-500 flex items-center justify-center text-3xl font-bold">

        Unauthorized Device

      </div>
    );

  }

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-bold mb-5">
        VIVA-X Counter
      </h1>

      <div className="text-2xl mb-10">
        Counter Number:
        <span className="text-green-400 ml-3">
          {counter.counterNo}
        </span>
      </div>

      {
        counter.active ? (

          <div>

            <div className="bg-green-500 text-black p-5 rounded text-2xl font-bold inline-block mb-10">
              Active Faculty: {counter.facultyName}
            </div>

            <div className="space-y-5 text-2xl">

              <div>
                Progress Student:
                <span className="text-yellow-400 ml-3">
                  {
                    counter.progressStudent
                      ? counter.progressStudent.name
                      : "None"
                  }
                </span>
              </div>

              <div>
                Waitlist Student:
                <span className="text-cyan-400 ml-3">
                  {
                    counter.waitlistStudent
                      ? counter.waitlistStudent.name
                      : "None"
                  }
                </span>
              </div>

            </div>

            <div className="flex gap-5 mt-10">

              <button
                onClick={() =>
                  completeViva(
                    counter.id,
                    counter
                  )
                }
                className="bg-red-500 px-6 py-3 rounded text-2xl font-bold"
              >
                Complete Viva
              </button>

              <button
                onClick={endSession}
                className="bg-gray-700 px-6 py-3 rounded text-2xl font-bold"
              >
                Session Over
              </button>

            </div>

          </div>

        ) : (

          <div className="max-w-md">

            <input
              type="text"
              placeholder="Enter Faculty Name"
              value={facultyName}
              onChange={(e) =>
                setFacultyName(e.target.value)
              }
              className="w-full p-4 rounded bg-white text-black mb-5"
            />

            <button
              onClick={activateCounter}
              className="bg-blue-500 px-6 py-3 rounded text-xl"
            >
              Activate Counter
            </button>

          </div>

        )
      }

    </div>
  );
}

export default CounterScreen;