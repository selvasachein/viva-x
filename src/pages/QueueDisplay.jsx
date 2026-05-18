import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot
} from "firebase/firestore";

import { db } from "../services/firebase";

function QueueDisplay() {

  const [counters, setCounters] =
    useState([]);

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "counters"),
      (snapshot) => {

        const counterData = [];

        snapshot.forEach((doc) => {

          const data = doc.data();

          if (data.active) {

            counterData.push({
              id: doc.id,
              ...data
            });

          }

        });

        // Sort counters
        counterData.sort(
          (a, b) =>
            a.counterNo - b.counterNo
        );

        setCounters(counterData);

      }
    );

    return () => unsubscribe();

  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-6xl font-bold text-center mb-16 text-green-400">
        VIVA-X LIVE QUEUE
      </h1>

      {
        counters.length === 0 ? (

          <div className="text-center text-4xl text-gray-400">
            No Active Counters
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {
              counters.map((counter) => (

                <div
                  key={counter.id}
                  className="bg-gray-900 rounded-2xl p-8 border border-gray-700"
                >

                  <div className="text-4xl font-bold mb-6 text-yellow-400">
                    Counter {counter.counterNo}
                  </div>

                  <div className="text-2xl mb-8">
                    Faculty:
                    <span className="text-cyan-400 ml-3 font-bold">
                      {counter.facultyName}
                    </span>
                  </div>

                  <div className="space-y-6">

                    <div className="bg-green-500 text-black p-5 rounded-xl">

                      <div className="text-xl font-bold mb-2">
                        CURRENT STUDENT
                      </div>

                      <div className="text-3xl font-bold">
                        {
                          counter.progressStudent
                            ? counter.progressStudent.name
                            : "Waiting..."
                        }
                      </div>

                    </div>

                    <div className="bg-blue-500 text-black p-5 rounded-xl">

                      <div className="text-xl font-bold mb-2">
                        NEXT STUDENT
                      </div>

                      <div className="text-3xl font-bold">
                        {
                          counter.waitlistStudent
                            ? counter.waitlistStudent.name
                            : "Waiting..."
                        }
                      </div>

                    </div>

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