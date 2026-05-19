import { useState } from "react";

import CryptoJS from "crypto-js";

import {
  doc,
  getDoc
} from "firebase/firestore";

import {
  useNavigate
} from "react-router-dom";

import {
  Oval
} from "react-loader-spinner";

import {
  signInWithEmailAndPassword
} from "firebase/auth";

import {
  db,
  auth
} from "../services/firebase";

function Login() {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  const login = async () => {

    try {

      setLoading(true);

      const docRef = await getDoc(
        doc(
          db,
          "adminConfig",
          "credentials"
        )
      );

      if (!docRef.exists()) {

        alert(
          "Admin config missing"
        );

        setLoading(false);

        return;

      }

      const data = docRef.data();

      const hashedPassword =
        CryptoJS.SHA256(password)
          .toString();

      if (
        username === data.username &&
        hashedPassword ===
          data.passwordHash
      ) {

        // FIREBASE AUTH LOGIN
        await signInWithEmailAndPassword(
          auth,
          "admin@vivax.com",
          "Admin@123"
        );

        localStorage.setItem(
          "vivaAdmin",
          "true"
        );

        navigate("/admin");

      } else {

        alert(
          "Invalid Credentials"
        );

      }

      setLoading(false);

    } catch (error) {

      console.log(error);

      alert(error.message);

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-black flex items-center justify-center p-5">

      <div className="w-full max-w-md bg-gray-900 border border-green-500 rounded-2xl shadow-2xl p-10">

        <h1 className="text-5xl font-extrabold text-center text-green-400 mb-3">
          VIVA-X
        </h1>

        <p className="text-center text-gray-400 mb-10">
          Smart Queue Management
        </p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
          className="w-full p-4 rounded-xl bg-white text-black mb-5 outline-none text-lg"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full p-4 rounded-xl bg-white text-black mb-8 outline-none text-lg"
        />

        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 transition-all duration-300 text-black font-bold text-xl p-4 rounded-xl flex items-center justify-center"
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

              "Login"

            )
          }

        </button>

      </div>

    </div>

  );

}

export default Login;