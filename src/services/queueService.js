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

import { db } from "./firebase";

// Allocate student to available counter
export const allocateStudent = async (
  studentId,
  studentName
) => {

  try {

    const countersSnapshot = await getDocs(
      query(
        collection(db, "counters"),
        where("active", "==", true)
      )
    );

    let allocated = false;

    for (const counterDoc of countersSnapshot.docs) {

      const counter = counterDoc.data();

      // Fill progress slot first
      if (!counter.progressStudent) {

        await updateDoc(
          doc(db, "counters", counterDoc.id),
          {
            progressStudent: {
              id: studentId,
              name: studentName
            }
          }
        );

        await updateDoc(
          doc(db, "students", studentId),
          {
            status: "progress",
            assignedCounter: counter.counterNo,
            assignedFaculty: counter.facultyName
          }
        );

        allocated = true;

        break;

      }

      // Fill waitlist slot next
      else if (!counter.waitlistStudent) {

        await updateDoc(
          doc(db, "counters", counterDoc.id),
          {
            waitlistStudent: {
              id: studentId,
              name: studentName
            }
          }
        );

        await updateDoc(
          doc(db, "students", studentId),
          {
            status: "waitlist",
            assignedCounter: counter.counterNo,
            assignedFaculty: counter.facultyName
          }
        );

        allocated = true;

        break;

      }

    }

    // No slots available
    if (!allocated) {

      await updateDoc(
        doc(db, "students", studentId),
        {
          status: "waiting",
          assignedCounter: null,
          assignedFaculty: ""
        }
      );

    }

  } catch (error) {

    console.log(error);

  }

};

// Complete viva and move queue
export const completeViva = async (
  counterId,
  counterData
) => {

  try {

    // Delete current progress student
    if (counterData.progressStudent) {

      await deleteDoc(
        doc(
          db,
          "students",
          counterData.progressStudent.id
        )
      );

    }

    // Default empty slots
    let newProgress = null;

    let newWaitlist = null;

    // Move waitlist -> progress
    if (counterData.waitlistStudent) {

      newProgress = {
        ...counterData.waitlistStudent
      };

      await updateDoc(
        doc(
          db,
          "students",
          newProgress.id
        ),
        {
          status: "progress"
        }
      );

    }

    // Find one waiting student
    const waitingSnapshot = await getDocs(
      query(
        collection(db, "students"),
        where("status", "==", "waiting"),
        limit(1)
      )
    );

    // Move waiting -> waitlist
    if (!waitingSnapshot.empty) {

      const waitingDoc =
        waitingSnapshot.docs[0];

      const waitingStudent =
        waitingDoc.data();

      newWaitlist = {
        id: waitingDoc.id,
        name: waitingStudent.studentName
      };

      await updateDoc(
        doc(db, "students", waitingDoc.id),
        {
          status: "waitlist",
          assignedCounter:
            counterData.counterNo,
          assignedFaculty:
            counterData.facultyName
        }
      );

    }

    // Update counter
    await updateDoc(
      doc(db, "counters", counterId),
      {
        progressStudent: newProgress,
        waitlistStudent: newWaitlist
      }
    );

  } catch (error) {

    console.log(error);

  }

};