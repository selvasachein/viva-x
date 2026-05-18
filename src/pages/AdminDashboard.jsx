import {
  useState,
  useEffect
} from "react";

import {
  doc,
  setDoc
} from "firebase/firestore";

import { QRCodeSVG } from "qrcode.react";

import { db } from "../services/firebase";

import { getDeviceId } from "../services/deviceService";

import {
  checkDailyReset
} from "../services/resetService";

function AdminDashboard() {

  useEffect(() => {

  checkDailyReset();

}, []);

  const [counterNo, setCounterNo] =
    useState("");

  const [qrToken, setQrToken] =
    useState("");

  // Register device
  const registerDevice = async () => {

    try {

      const deviceId = getDeviceId();

      await setDoc(
        doc(
          db,
          "counters",
          `counter-${counterNo}`
        ),
        {
          counterNo: Number(counterNo),
          deviceId: deviceId,
          facultyName: "",
          active: false,
          progressStudent: null,
          waitlistStudent: null
        },
        { merge: true }
      );

      alert(
        "Device Registered Successfully"
      );

    } catch (error) {

      console.log(error);

    }

  };

  // Generate QR
  const generateQR = async () => {

    try {

      const token =
        Math.random()
          .toString(36)
          .substring(2, 10);

      const expiresAt =
        Date.now() +
        2 * 60 * 60 * 1000;

      await setDoc(
        doc(
          db,
          "qrSessions",
          "currentSession"
        ),
        {
          token,
          expiresAt,
          active: true
        }
      );

      setQrToken(token);

      alert(
        "QR Generated Successfully"
      );

    } catch (error) {

      console.log(error);

    }

  };

  const qrUrl =
    `http://localhost:5173/student-entry?token=${qrToken}`;

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-bold mb-10">
        VIVA-X Admin Dashboard
      </h1>

      {/* Device Registration */}

      <div className="mb-16">

        <h2 className="text-3xl font-bold mb-5">
          Register Counter Device
        </h2>

        <input
          type="number"
          placeholder="Enter Counter Number"
          value={counterNo}
          onChange={(e) =>
            setCounterNo(e.target.value)
          }
          className="w-full max-w-md p-4 rounded bg-white text-black mb-5 border border-gray-400"
        />

        <br />

        <button
          onClick={registerDevice}
          className="bg-blue-500 px-6 py-3 rounded text-xl"
        >
          Register This Device
        </button>

      </div>

      {/* QR Generator */}

      <div>

        <h2 className="text-3xl font-bold mb-5">
          Generate Student QR
        </h2>

        <button
          onClick={generateQR}
          className="bg-green-500 text-black px-6 py-3 rounded text-xl font-bold"
        >
          Generate New QR
        </button>

        {
          qrToken && (

            <div className="mt-10 bg-white p-5 inline-block rounded">

              <QRCodeSVG value={qrUrl} size={256} />

            </div>

          )
        }

      </div>

    </div>
  );
}

export default AdminDashboard;