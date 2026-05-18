import { useState } from "react";

import CryptoJS from "crypto-js";

import {
  doc,
  getDoc
} from "firebase/firestore";

import { useNavigate }
from "react-router-dom";

import { db }
from "../services/firebase";

function Login() {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate = useNavigate();

  const login = async () => {

    try {

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

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="min-h-screen bg-black text-white flex items-center justify-center">

      <div className="bg-gray-900 p-10 rounded-xl w-full max-w-md">

        <h1 className="text-4xl font-bold mb-8 text-center text-green-400">
          VIVA-X ADMIN
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          className="w-full p-4 rounded bg-white text-black mb-5"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full p-4 rounded bg-white text-black mb-5"
        />

        <button
          onClick={login}
          className="w-full bg-green-500 text-black p-4 rounded text-xl font-bold"
        >
          Login
        </button>

      </div>

    </div>

  );

}

export default Login;