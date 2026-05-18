import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  deleteDoc,
  limit
} from "firebase/firestore";

import { db }
from "./firebase";

// Allocate Student
export const allocateStudent =
  async (
    studentId,
    studentName
  ) => {

    try {

      const countersSnapshot =
        await getDocs(
          query(
            collection(
              db,
              "counters"
            ),
            where(
              "active",
              "==",
              true
            )
          )
        );

      let allocated =
        false;

      for (
        const counterDoc
        of countersSnapshot.docs
      ) {

        const counter =
          counterDoc.data();

        // Progress Slot
        if (
          !counter.progressStudent
        ) {

          await updateDoc(
            doc(
              db,
              "counters",
              counterDoc.id
            ),
            {
              progressStudent: {
                id: studentId,
                name: studentName
              }
            }
          );

          await updateDoc(
            doc(
              db,
              "students",
              studentId
            ),
            {
              status:
                "progress",

              assignedCounter:
                counter.counterNo,

              assignedFaculty:
                counter.facultyName
            }
          );

          allocated = true;

          break;

        }

        // Waitlist Slot
        else if (
          !counter.waitlistStudent
        ) {

          await updateDoc(
            doc(
              db,
              "counters",
              counterDoc.id
            ),
            {
              waitlistStudent: {
                id: studentId,
                name: studentName
              }
            }
          );

          await updateDoc(
            doc(
              db,
              "students",
              studentId
            ),
            {
              status:
                "waitlist",

              assignedCounter:
                counter.counterNo,

              assignedFaculty:
                counter.facultyName
            }
          );

          allocated = true;

          break;

        }

      }

      // No Slot Available
      if (!allocated) {

        await updateDoc(
          doc(
            db,
            "students",
            studentId
          ),
          {
            status:
              "waiting",

            assignedCounter:
              null,

            assignedFaculty:
              ""
          }
        );

      }

    } catch (error) {

      console.log(error);

    }

};

// Complete Viva
export const completeViva =
  async (
    counterId,
    counterData
  ) => {

    try {

      // Delete Progress Student
      if (
        counterData.progressStudent
      ) {

        await deleteDoc(
          doc(
            db,
            "students",
            counterData
              .progressStudent.id
          )
        );

      }

      // Default Empty
      let newProgress =
        null;

      let newWaitlist =
        null;

      // Waitlist -> Progress
      if (
        counterData.waitlistStudent
      ) {

        newProgress = {
          ...counterData
            .waitlistStudent
        };

        await updateDoc(
          doc(
            db,
            "students",
            newProgress.id
          ),
          {
            status:
              "progress"
          }
        );

      }

      // Get Waiting Student
      const waitingSnapshot =
        await getDocs(
          query(
            collection(
              db,
              "students"
            ),
            where(
              "status",
              "==",
              "waiting"
            ),
            limit(1)
          )
        );

      // Waiting -> Waitlist
      if (
        !waitingSnapshot.empty
      ) {

        const waitingDoc =
          waitingSnapshot.docs[0];

        const waitingStudent =
          waitingDoc.data();

        newWaitlist = {
          id: waitingDoc.id,
          name:
            waitingStudent.studentName
        };

        await updateDoc(
          doc(
            db,
            "students",
            waitingDoc.id
          ),
          {
            status:
              "waitlist",

            assignedCounter:
              counterData.counterNo,

            assignedFaculty:
              counterData.facultyName
          }
        );

      }

      // Update Counter
      await updateDoc(
        doc(
          db,
          "counters",
          counterId
        ),
        {
          progressStudent:
            newProgress,

          waitlistStudent:
            newWaitlist
        }
      );

    } catch (error) {

      console.log(error);

    }

};