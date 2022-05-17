import { useRouter } from "next/router";

import algoSdk from "../utils/algoSdk";

export default function Home() {
  const router = useRouter();

  const logIn = (event) => {
    event.preventDefault();
    const mnemonic = event.target[0].value;
    var keys = algoSdk.mnemonicToSecretKey(mnemonic);
    algoSdk
      .getAccountInformation(keys.addr)
      .then((payload) => {
        let walletDetails = {
          ...payload,
          secretKey: keys.sk,
          mnemonic,
        };
        const jsonWallet = JSON.stringify(walletDetails);
        localStorage.setItem("wallet", jsonWallet);
        router.push("dashboard");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex justify-center align-middle items-center h-screen bg-gray-900">
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
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href="#"
            >
              Crear cuenta
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
