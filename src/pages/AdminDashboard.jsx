import {
  useState,
  useEffect
} from "react";

import {
  doc,
  setDoc
} from "firebase/firestore";

import {
  useNavigate
} from "react-router-dom";

import {
  QRCodeSVG
} from "qrcode.react";

import {
  Oval
} from "react-loader-spinner";

import { db }
from "../services/firebase";

import {
  getDeviceId
} from "../services/deviceService";

import {
  checkDailyReset
} from "../services/resetService";

function AdminDashboard() {

  const navigate =
    useNavigate();

  const [counterNo, setCounterNo] =
    useState("");

  const [qrToken, setQrToken] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // Protect Admin Page
  useEffect(() => {

    const isAdmin =
      localStorage.getItem(
        "vivaAdmin"
      );

    if (!isAdmin) {

      navigate("/");

    }

  }, []);

  // Daily Reset
  useEffect(() => {

    checkDailyReset();

  }, []);

  // Register Counter Device
  const registerDevice =
    async () => {

      try {

        if (!counterNo) {

          alert(
            "Enter Counter Number"
          );

          return;

        }

        const deviceId =
          getDeviceId();

        await setDoc(
          doc(
            db,
            "counters",
            `counter-${counterNo}`
          ),
          {
            counterNo:
              Number(counterNo),

            deviceId:
              deviceId,

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
  const generateQR =
    async () => {

      try {

        setLoading(true);

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

        setLoading(false);

      } catch (error) {

        console.log(error);

        setLoading(false);

      }

    };

  // QR URL
  const qrUrl =
    `https://viva-x.vercel.app/student-entry?token=${qrToken}`;

  return (

    <div className="min-h-screen bg-black text-white p-6 md:p-10">

      {/* Top Bar */}

      <div className="flex justify-between items-center mb-10">

        <div>

          <h1 className="text-5xl font-extrabold text-green-400">
            VIVA-X
          </h1>

          <p className="text-gray-400 mt-2">
            Smart Queue Management
          </p>

        </div>

        <button
          onClick={() => {

            localStorage.removeItem(
              "vivaAdmin"
            );

            navigate("/");

          }}
          className="bg-red-500 hover:bg-red-400 px-5 py-3 rounded-xl font-bold"
        >
          Logout
        </button>

      </div>

      {/* Register Device */}

      <div className="bg-gray-900 border border-blue-500 rounded-2xl p-8 mb-10 shadow-xl">

        <h2 className="text-3xl font-bold text-blue-400 mb-6">
          Register Counter Device
        </h2>

        <input
          type="number"
          placeholder="Enter Counter Number"
          value={counterNo}
          onChange={(e) =>
            setCounterNo(
              e.target.value
            )
          }
          className="w-full max-w-md p-4 rounded-xl bg-white text-black text-lg mb-5"
        />

        <br />

        <button
          onClick={registerDevice}
          className="bg-blue-500 hover:bg-blue-400 px-6 py-3 rounded-xl text-xl font-bold"
        >
          Register Device
        </button>

      </div>

      {/* QR Generator */}

      <div className="bg-gray-900 border border-green-500 rounded-2xl p-8 shadow-xl">

        <h2 className="text-3xl font-bold text-green-400 mb-6">
          Generate Student QR
        </h2>

        <button
          onClick={generateQR}
          disabled={loading}
          className="bg-green-500 hover:bg-green-400 text-black px-8 py-4 rounded-xl text-xl font-bold flex items-center justify-center min-w-[250px]"
        >

          {
            loading ? (

              <Oval
                height={30}
                width={30}
                color="black"
                secondaryColor="gray"
                strokeWidth={5}
              />

            ) : (

              "Generate New QR"

            )
          }

        </button>

        {

          qrToken && (

            <div className="mt-10 bg-white inline-block p-6 rounded-2xl">

              <QRCodeSVG
                value={qrUrl}
                size={260}
              />

              <div className="text-black mt-5 text-sm break-all max-w-xs">

                {qrUrl}

              </div>

            </div>

          )

        }

      </div>

    </div>

  );

}

export default AdminDashboard;