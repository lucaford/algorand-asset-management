import { useRouter } from "next/router";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  const logIn = (event) => {
    event.preventDefault();
    const mnemonic = event.target[0].value;
    localStorage.setItem("mnemonic", mnemonic);
    router.push("dashboard");
  };

  return (
    <div className="flex flex-col justify-center align-middle items-center h-screen bg-gray-900">
      <div className="w-full max-w-xs">
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={logIn}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="mnemonic"
            >
              Mnemonic
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="mnemonic"
              type="text"
              placeholder=""
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              LogIn
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm text-stone-500"
              href="#"
            >
              Crear cuenta
            </a>
          </div>
        </form>
      </div>
      <div className="flex items-center">
        <div className="w-5 h-5">
          <Image
            src={require("../images/exclamation-mark.png")}
            alt="exclamation mark"
          />
        </div>
        <p className="text-white text-lg">TestNet Only</p>
      </div>
    </div>
  );
}
