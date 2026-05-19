import { useState } from "react";

import {
  signInWithEmailAndPassword
} from "firebase/auth";

import {
  useNavigate
} from "react-router-dom";

import {
  Oval
} from "react-loader-spinner";

import {
  auth
} from "../services/firebase";

function Login() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  const login = async () => {

    try {

      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigate("/admin");

    } catch (error) {

      console.log(error);

      alert("Invalid Login Credentials");

    }

    setLoading(false);

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
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full p-4 rounded-xl bg-white text-black mb-5 outline-none text-lg"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
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