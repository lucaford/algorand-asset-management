import { useEffect } from "react";

import { ModalTemplate } from "./ModalTemplate";
import algoSdk from "../../utils/algoSdk";

export const CreateNftModal = ({
  wallet,
  onAcceptButtonPress,
  onCancelButtonPress,
}) => {
  const onFormSubmit = async (event) => {
    event.preventDefault();
    const assetName = event.target[0].value;
    const unitName = event.target[1].value;
    const assetUrl = event.target[2].value;
    const metadataHash = event.target[3].value;
    const supply = 1;
    const decimals = 0;

    const holderAccount = wallet.address;
    const managerAddress = holderAccount;
    const reserveAddress = holderAccount;
    const freezeAddress = holderAccount;
    const clawbackAddress = holderAccount;

    try {
      const { txId } = await algoSdk.createAsset(
        wallet,
        assetName,
        unitName,
        supply,
        assetUrl,
        metadataHash,
        managerAddress,
        reserveAddress,
        freezeAddress,
        clawbackAddress,
        decimals
      );
      await algoSdk.waitForConfirmation(txId);
      onAcceptButtonPress();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ModalTemplate onCrossButtonPress={onCancelButtonPress}>
      <form className="px-8" onSubmit={onFormSubmit}>
        <div>
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="assetName"
          >
            Asset name*
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
            id="assetName"
            type="text"
            placeholder=""
          />
        </div>
        <div className="my-5">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="assetName"
          >
            Unit Name*
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
            id="unitName"
            type="text"
            placeholder=""
          />
        </div>
        <div className="my-5">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="assetName"
          >
            Asset Url*
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
            id="assetUrl"
            type="text"
            placeholder=""
          />
        </div>
        <div className="my-5">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="assetName"
          >
            Metadata Hash*
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
            id="metadataHash"
            type="text"
            placeholder=""
          />
        </div>
        <div className="flex items-center py-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Crear NFT
          </button>
        </div>
      </form>
    </ModalTemplate>
  );
};
