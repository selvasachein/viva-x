import {
  collection,
  getDocs,
  setDoc,
  updateDoc,
  doc
} from "firebase/firestore";

import { db }
from "./firebase";

// Create Default Slots
export const createDefaultSlots =
  async () => {

    try {

      const defaultSlots = [

        {
          id: "slot1",
          slot: "8-9 AM",
          startHour: 8,
          endHour: 9
        },

        {
          id: "slot2",
          slot: "9-10 AM",
          startHour: 9,
          endHour: 10
        },

        {
          id: "slot3",
          slot: "10-11 AM",
          startHour: 10,
          endHour: 11
        },

        {
          id: "slot4",
          slot: "11-12 PM",
          startHour: 11,
          endHour: 12
        },

        {
          id: "slot5",
          slot: "1-2 PM",
          startHour: 13,
          endHour: 14
        },

        {
          id: "slot6",
          slot: "2-3 PM",
          startHour: 14,
          endHour: 15
        },

        {
          id: "slot7",
          slot: "3-4 PM",
          startHour: 15,
          endHour: 16
        }

      ];

      for (
        const slot
        of defaultSlots
      ) {

        await setDoc(
          doc(
            db,
            "slots",
            slot.id
          ),
          {
            slot:
              slot.slot,

            startHour:
              slot.startHour,

            endHour:
              slot.endHour,

            capacity: 25,

            booked: 0,

            active: true
          }
        );

      }

      console.log(
        "Slots Created Successfully"
      );

    } catch (error) {

      console.log(
        "Create Slot Error:",
        error
      );

    }

};

// Get Current Active Slot
export const getCurrentSlot =
  async () => {

    try {

      const currentHour =
        new Date().getHours();

      console.log(
        "Current Hour:",
        currentHour
      );

      const snapshot =
        await getDocs(
          collection(
            db,
            "slots"
          )
        );

      const slots =
        snapshot.docs.map(
          (docItem) => ({

            id:
              docItem.id,

            ...docItem.data()

          })
        );

      const activeSlot =
        slots.find(
          (slot) =>

            slot.active === true &&

            slot.startHour <=
              currentHour &&

            slot.endHour >
              currentHour
        );

      console.log(
        "Matched Slot:",
        activeSlot
      );

      if (!activeSlot) {

        return null;

      }

      return activeSlot;

    } catch (error) {

      console.log(
        "Get Slot Error:",
        error
      );

      return null;

    }

};

// Increase Slot Booking Count
export const increaseSlotBooking =
  async (
    slotId,
    booked
  ) => {

    try {

      await updateDoc(
        doc(
          db,
          "slots",
          slotId
        ),
        {
          booked:
            booked + 1
        }
      );

      console.log(
        "Slot Booking Increased"
      );

    } catch (error) {

      console.log(
        "Booking Update Error:",
        error
      );

    }

};