import {
  useState,
  useEffect
} from "react";

import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc
} from "firebase/firestore";

import {
  Oval
} from "react-loader-spinner";

import { db }
from "../services/firebase";

import {
  getDeviceId
} from "../services/deviceService";

import {
  completeViva
} from "../services/queueService";

function CounterScreen() {

  const [facultyName, setFacultyName] =
    useState("");

  const [counterData, setCounterData] =
    useState(null);

  const [counterId, setCounterId] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const deviceId =
    getDeviceId();

  // Find Registered Counter
  useEffect(() => {

    const q = query(
      collection(db, "counters"),
      where("deviceId", "==", deviceId)
    );

    const unsubscribe =
      onSnapshot(q, (snapshot) => {

        if (!snapshot.empty) {

          const counterDoc =
            snapshot.docs[0];

          setCounterId(
            counterDoc.id
          );

          setCounterData({
            id: counterDoc.id,
            ...counterDoc.data()
          });

        }

      });

    return () => unsubscribe();

  }, []);

  // Activate Counter
  const activateCounter =
    async () => {

      try {

        if (!facultyName) {

          alert(
            "Enter Faculty Name"
          );

          return;

        }

        await updateDoc(
          doc(
            db,
            "counters",
            counterId
          ),
          {
            facultyName,
            active: true
          }
        );

      } catch (error) {

        console.log(error);

      }

    };

  // Complete Viva
  const handleComplete =
    async () => {

      try {

        setLoading(true);

        await completeViva(
          counterId,
          counterData
        );

        setLoading(false);

      } catch (error) {

        console.log(error);

        setLoading(false);

      }

    };

  // Session Over
  const sessionOver =
    async () => {

      try {

        await updateDoc(
          doc(
            db,
            "counters",
            counterId
          ),
          {
            facultyName: "",

            active: false,

            progressStudent: null,

            waitlistStudent: null
          }
        );

        alert(
          "Session Closed"
        );

      } catch (error) {

        console.log(error);

      }

    };

  // Counter Not Registered
  if (!counterData) {

    return (

      <div className="min-h-screen bg-black text-white flex items-center justify-center p-5">

        <div className="bg-gray-900 border border-red-500 rounded-2xl p-10 text-center">

          <h1 className="text-4xl font-bold text-red-500 mb-5">
            Device Not Registered
          </h1>

          <p className="text-gray-300 text-lg">
            Register this device from Admin Dashboard.
          </p>

        </div>

      </div>

    );

  }

  // Activate Screen
  if (!counterData.active) {

    return (

      <div className="min-h-screen bg-black flex items-center justify-center p-5">

        <div className="w-full max-w-md bg-gray-900 border border-blue-500 rounded-2xl p-10 shadow-2xl">

          <h1 className="text-5xl font-extrabold text-center text-blue-400 mb-3">
            VIVA-X
          </h1>

          <p className="text-center text-gray-400 mb-10">
            Activate Counter
          </p>

          <div className="text-center text-2xl mb-8 text-white">

            Counter No :
            {" "}
            <span className="text-green-400 font-bold">
              {counterData.counterNo}
            </span>

          </div>

          <input
            type="text"
            placeholder="Enter Faculty Name"
            value={facultyName}
            onChange={(e) =>
              setFacultyName(
                e.target.value
              )
            }
            className="w-full p-4 rounded-xl bg-white text-black text-lg mb-8 outline-none"
          />

          <button
            onClick={activateCounter}
            className="w-full bg-blue-500 hover:bg-blue-400 text-black font-bold text-xl p-4 rounded-xl"
          >
            Activate Counter
          </button>

        </div>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-black text-white p-6 md:p-10">

      {/* Header */}

      <div className="flex justify-between items-center mb-10">

        <div>

          <h1 className="text-5xl font-extrabold text-green-400">
            VIVA-X
          </h1>

          <p className="text-gray-400 mt-2">
            Smart Viva Counter
          </p>

        </div>

        <button
          onClick={sessionOver}
          className="bg-red-500 hover:bg-red-400 px-6 py-3 rounded-xl font-bold text-lg"
        >
          Session Over
        </button>

      </div>

      {/* Counter Info */}

      <div className="bg-gray-900 border border-green-500 rounded-2xl p-8 mb-8 shadow-2xl">

        <div className="grid md:grid-cols-2 gap-5 text-2xl">

          <div>

            Counter :
            {" "}
            <span className="text-green-400 font-bold">
              {counterData.counterNo}
            </span>

          </div>

          <div>

            Faculty :
            {" "}
            <span className="text-blue-400 font-bold">
              {counterData.facultyName}
            </span>

          </div>

        </div>

      </div>

      {/* Progress Student */}

      <div className="bg-gray-900 border border-blue-500 rounded-2xl p-8 mb-8 shadow-2xl">

        <h2 className="text-3xl font-bold text-blue-400 mb-6">
          In Progress
        </h2>

        {

          counterData.progressStudent ? (

            <div className="text-4xl font-bold text-white">

              {
                counterData.progressStudent.name
              }

            </div>

          ) : (

            <div className="text-gray-400 text-2xl">

              No Student

            </div>

          )

        }

      </div>

      {/* Waitlist Student */}

      <div className="bg-gray-900 border border-yellow-500 rounded-2xl p-8 mb-8 shadow-2xl">

        <h2 className="text-3xl font-bold text-yellow-400 mb-6">
          Waitlist
        </h2>

        {

          counterData.waitlistStudent ? (

            <div className="text-4xl font-bold text-white">

              {
                counterData.waitlistStudent.name
              }

            </div>

          ) : (

            <div className="text-gray-400 text-2xl">

              Waiting...

            </div>

          )

        }

      </div>

      {/* Complete Button */}

      <button
        onClick={handleComplete}
        disabled={
          !counterData.progressStudent ||
          loading
        }
        className="w-full bg-green-500 hover:bg-green-400 text-black font-bold text-2xl p-5 rounded-2xl flex items-center justify-center"
      >

        {

          loading ? (

            <Oval
              height={35}
              width={35}
              color="black"
              secondaryColor="gray"
              strokeWidth={5}
            />

          ) : (

            "Complete Viva"

          )

        }

      </button>

    </div>

  );

}

export default CounterScreen;