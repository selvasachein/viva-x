import {
  useState,
  useEffect
} from "react";

import {
  collection,
  onSnapshot
} from "firebase/firestore";

import { db }
from "../services/firebase";

function QueueDisplay() {

  const [counters, setCounters] =
    useState([]);

  // Live Counter Updates
  useEffect(() => {

    const unsubscribe =
      onSnapshot(
        collection(db, "counters"),
        (snapshot) => {

          const counterList =
            snapshot.docs
              .map((doc) => ({
                id: doc.id,
                ...doc.data()
              }))
              .filter(
                (counter) =>
                  counter.active
              )
              .sort(
                (a, b) =>
                  a.counterNo -
                  b.counterNo
              );

          setCounters(counterList);

        }
      );

    return () => unsubscribe();

  }, []);

  return (

    <div className="min-h-screen bg-black text-white p-6 md:p-10">

      {/* Header */}

      <div className="text-center mb-12">

        <h1 className="text-6xl font-extrabold text-green-400 mb-3 tracking-wider">

          VIVA-X

        </h1>

        <p className="text-2xl text-gray-400">

          Live Queue Display

        </p>

      </div>

      {

        counters.length === 0 ? (

          <div className="flex items-center justify-center h-[60vh]">

            <div className="bg-gray-900 border border-red-500 rounded-2xl p-10 text-center shadow-2xl">

              <h2 className="text-4xl text-red-500 font-bold mb-4">

                No Active Counters

              </h2>

              <p className="text-gray-400 text-xl">

                Waiting for faculty activation...

              </p>

            </div>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

            {

              counters.map((counter) => (

                <div
                  key={counter.id}
                  className="bg-gray-900 border border-green-500 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-all duration-300"
                >

                  {/* Counter Header */}

                  <div className="flex justify-between items-center mb-8">

                    <div>

                      <h2 className="text-4xl font-extrabold text-green-400">

                        Counter
                        {" "}
                        {counter.counterNo}

                      </h2>

                      <p className="text-xl text-blue-400 mt-2 font-semibold">

                        {counter.facultyName}

                      </p>

                    </div>

                    <div className="w-5 h-5 rounded-full bg-green-400 animate-pulse"></div>

                  </div>

                  {/* Progress Section */}

                  <div className="bg-black rounded-2xl p-6 border border-blue-500 mb-6">

                    <div className="text-blue-400 text-2xl font-bold mb-4">

                      IN PROGRESS

                    </div>

                    {

                      counter.progressStudent ? (

                        <div className="text-4xl font-extrabold text-white break-words">

                          {
                            counter.progressStudent.name
                          }

                        </div>

                      ) : (

                        <div className="text-2xl text-gray-500">

                          No Student

                        </div>

                      )

                    }

                  </div>

                  {/* Waitlist Section */}

                  <div className="bg-black rounded-2xl p-6 border border-yellow-500">

                    <div className="text-yellow-400 text-2xl font-bold mb-4">

                      WAITLIST

                    </div>

                    {

                      counter.waitlistStudent ? (

                        <div className="text-4xl font-extrabold text-white break-words">

                          {
                            counter.waitlistStudent.name
                          }

                        </div>

                      ) : (

                        <div className="text-2xl text-gray-500">

                          Waiting...

                        </div>

                      )

                    }

                  </div>

                </div>

              ))

            }

          </div>

        )

      }

    </div>

  );

}

export default QueueDisplay;