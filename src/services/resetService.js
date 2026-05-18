import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc
} from "firebase/firestore";

import { db }
from "./firebase";

export const checkDailyReset =
  async () => {

    try {

      const today =
        new Date()
          .toDateString();

      const lastReset =
        localStorage.getItem(
          "vivaLastReset"
        );

      // Already Reset Today
      if (
        lastReset === today
      ) {

        return;

      }

      // Reset Counters
      const counterSnapshot =
        await getDocs(
          collection(
            db,
            "counters"
          )
        );

      for (
        const counterDoc
        of counterSnapshot.docs
      ) {

        await updateDoc(
          doc(
            db,
            "counters",
            counterDoc.id
          ),
          {
            facultyName: "",

            active: false,

            progressStudent: null,

            waitlistStudent: null
          }
        );

      }

      // Delete Students
      const studentSnapshot =
        await getDocs(
          collection(
            db,
            "students"
          )
        );

      for (
        const studentDoc
        of studentSnapshot.docs
      ) {

        await deleteDoc(
          doc(
            db,
            "students",
            studentDoc.id
          )
        );

      }

      // Disable QR
      await updateDoc(
        doc(
          db,
          "qrSessions",
          "currentSession"
        ),
        {
          active: false
        }
      );

      // Save Reset Date
      localStorage.setItem(
        "vivaLastReset",
        today
      );

      console.log(
        "Daily Reset Completed"
      );

    } catch (error) {

      console.log(error);

    }

};