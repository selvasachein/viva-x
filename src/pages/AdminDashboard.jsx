import {
  useState,
  useEffect
} from "react";

import {
  createDefaultSlots
} from "../services/slotService";

import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  onSnapshot,
  query,
  where
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

import { db } from "../services/firebase";

import {
  getDeviceId
} from "../services/deviceService";

import {
  checkDailyReset
} from "../services/resetService";

import {
  onAuthStateChanged
} from "firebase/auth";

import { auth } from "../services/firebase";

function AdminDashboard() {

  const navigate = useNavigate();

  const [counterNo, setCounterNo] = useState("");
  const [qrToken, setQrToken] = useState("");
  const [loading, setLoading] = useState(false);

  const [baseCapacity, setBaseCapacity] = useState(25);
  const [increment, setIncrement] = useState(0);
  const [capacity, setCapacity] = useState(25);

  const [activeCount, setActiveCount] = useState(0);

  // 🔥 NEW ANALYTICS STATE
  const [todayStudents, setTodayStudents] = useState(0);
  const [peakLoad, setPeakLoad] = useState(0);

  useEffect(() => {

    const loadCapacity = async () => {

      const snap = await getDoc(doc(db, "settings", "queueConfig"));

      if (snap.exists()) {
        const data = snap.data();

        setBaseCapacity(data.baseCapacity || 25);
        setCapacity(data.baseCapacity || 25);
      }

    };

    loadCapacity();

  }, []);

  useEffect(() => {

    const unsub = onAuthStateChanged(auth, async (user) => {

      if (!user) {
        navigate("/");
        return;
      }

      const token = await user.getIdTokenResult();

      if (!token.claims.admin) {
        navigate("/");
      }

    });

    return () => unsub();

  }, []);

  useEffect(() => {

    checkDailyReset();
    createDefaultSlots();
    fetchActiveCount();

  }, []);

  // 🔥 REALTIME ANALYTICS
  useEffect(() => {

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, "students"),
      where("joinedAt", ">=", startOfDay.getTime())
    );

    const unsub = onSnapshot(q, (snapshot) => {

      setTodayStudents(snapshot.size);

      const map = {};

      snapshot.docs.forEach(doc => {
        const slot = doc.data().slot;
        map[slot] = (map[slot] || 0) + 1;
      });

      const peak = Math.max(...Object.values(map), 0);
      setPeakLoad(peak);

    });

    return () => unsub();

  }, []);

  const fetchActiveCount = async () => {

    const snap = await getDocs(collection(db, "slots"));

    const count = snap.docs.filter(
      (d) => d.data().status === "active"
    ).length;

    setActiveCount(count);
  };

  const updateCapacity = async () => {

    const add = Number(increment || 0);

    if (add <= 0) return;

    const newBase = baseCapacity + add;

    setBaseCapacity(newBase);
    setCapacity(newBase);
    setIncrement(0);

    await setDoc(doc(db, "settings", "queueConfig"), {
      baseCapacity: newBase
    }, { merge: true });

  };

  const registerDevice = async () => {

    try {

      if (!counterNo) {
        alert("Enter Counter Number");
        return;
      }

      const deviceId = getDeviceId();

      await setDoc(
        doc(db, "counters", `counter-${counterNo}`),
        {
          counterNo: Number(counterNo),
          deviceId,
          facultyName: "",
          active: false,
          progressStudent: null,
          waitlistStudent: null
        },
        { merge: true }
      );

      alert("Device Registered Successfully");

    } catch (error) {
      console.log(error);
    }

  };

  const generateQR = async () => {

    try {

      setLoading(true);

      const slotSnap = await getDocs(collection(db, "slots"));

      let totalBooked = 0;

      slotSnap.docs.forEach((d) => {
        totalBooked += d.data().booked || 0;
      });

      if (totalBooked >= capacity) {
        alert("Capacity FULL");
        setLoading(false);
        return;
      }

      const token = Math.random().toString(36).substring(2, 10);

      const expiresAt = Date.now() + 2 * 60 * 60 * 1000;

      await setDoc(
        doc(db, "qrSessions", "currentSession"),
        {
          token,
          expiresAt,
          active: true,
          usedBy: null,
          usedAt: null
        },
        { merge: true }
      );

      setQrToken(token);
      setLoading(false);

    } catch (error) {

      console.log(error);
      setLoading(false);

    }

  };

  const qrUrl =
    `https://viva-x.vercel.app/student-entry?token=${qrToken}`;

  return (

    <div className="min-h-screen bg-black text-white p-6 md:p-10">

      {/* 🔥 NEW ANALYTICS UI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

        <div className="bg-gray-900 border border-green-500 rounded-2xl p-6">
          <h2 className="text-green-400 font-bold">Today Usage</h2>
          <p className="text-3xl font-bold mt-2">{todayStudents}</p>
        </div>

        <div className="bg-gray-900 border border-yellow-500 rounded-2xl p-6">
          <h2 className="text-yellow-400 font-bold">Peak Load</h2>
          <p className="text-3xl font-bold mt-2">{peakLoad}</p>
        </div>

      </div>

      {/* EVERYTHING BELOW UNCHANGED */}

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
            localStorage.removeItem("vivaAdmin");
            navigate("/");
          }}
          className="bg-red-500 px-5 py-3 rounded-xl font-bold"
        >
          Logout
        </button>

      </div>

      {/* QR FIRST */}
      <div className="bg-gray-900 border border-green-500 rounded-2xl p-8 shadow-xl mb-10">

        <h2 className="text-3xl font-bold text-green-400 mb-6">
          Generate Student QR
        </h2>

        <button
          onClick={generateQR}
          disabled={loading}
          className="bg-green-500 px-8 py-4 rounded-xl font-bold"
        >
          {loading ? <Oval height={30} width={30} color="black" /> : "Generate New QR"}
        </button>

        {qrToken && (
          <div className="mt-10 bg-white inline-block p-6 rounded-2xl">
            <QRCodeSVG value={qrUrl} size={260} />
          </div>
        )}

      </div>

      {/* CAPACITY SECOND */}
      <div className="bg-gray-900 border border-yellow-500 rounded-2xl p-8 shadow-xl mb-10">

        <h2 className="text-3xl font-bold text-yellow-400 mb-6">
          Capacity Control
        </h2>

        <p className="mb-4 text-gray-300">
          Current Capacity: {capacity}
        </p>

        <input
          type="number"
          value={increment}
          onChange={(e) => setIncrement(Number(e.target.value))}
          className="w-full max-w-md p-4 rounded-xl bg-white text-black mb-5"
        />

        <button
          onClick={updateCapacity}
          className="bg-yellow-500 px-6 py-3 rounded-xl font-bold"
        >
          Increase Capacity
        </button>

      </div>

      {/* REGISTER LAST */}
      <div className="bg-gray-900 border border-blue-500 rounded-2xl p-8 shadow-xl">

        <h2 className="text-3xl font-bold text-blue-400 mb-6">
          Register Counter Device
        </h2>

        <input
          type="number"
          value={counterNo}
          onChange={(e) => setCounterNo(e.target.value)}
          className="w-full max-w-md p-4 rounded-xl bg-white mb-5"
        />

        <button
          onClick={registerDevice}
          className="bg-blue-500 px-6 py-3 rounded-xl font-bold"
        >
          Register Device
        </button>

      </div>

    </div>

  );

}

export default AdminDashboard;