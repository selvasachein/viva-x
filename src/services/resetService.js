import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  setDoc
} from "firebase/firestore";

import { db } from "./firebase";

export const checkDailyReset =
  async () => {

    try {

      const today =
        new Date()
          .toISOString()
          .split("T")[0];

      const resetDoc = await getDoc(
        doc(
          db,
          "system",
          "dailyReset"
        )
      );

      let lastReset = "";

      if (resetDoc.exists()) {

        lastReset =
          resetDoc.data().lastReset;

      }

      // Already reset today
      if (lastReset === today) {

        return;

      }

      // Delete all students
      const studentsSnapshot =
        await getDocs(
          collection(db, "students")
        );

      for (const studentDoc of studentsSnapshot.docs) {

        await deleteDoc(
          doc(
            db,
            "students",
            studentDoc.id
          )
        );

      }

      // Reset counters
      const countersSnapshot =
        await getDocs(
          collection(db, "counters")
        );

      for (const counterDoc of countersSnapshot.docs) {

        await updateDoc(
          doc(
            db,
            "counters",
            counterDoc.id
          ),
          {
            active: false,
            facultyName: "",
            progressStudent: null,
            waitlistStudent: null
          }
        );

      }

      // Expire QR
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

      // Update reset date
      await setDoc(
        doc(
          db,
          "system",
          "dailyReset"
        ),
        {
          lastReset: today
        }
      );

      console.log(
        "Daily Reset Completed"
      );

    } catch (error) {

      console.log(error);

    }

};