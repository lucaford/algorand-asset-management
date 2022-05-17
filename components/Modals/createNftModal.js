import { ModalTemplate } from "./ModalTemplate";
import algoSdk from "../../utils/algoSdk";

export const CreateNftModal = ({ wallet }) => {
  const onCreateNftSubmit = async (event) => {
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
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ModalTemplate>
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={onCreateNftSubmit}
      >
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="assetName"
          >
            Asset name*
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="assetName"
            type="text"
            placeholder=""
          />
        </div>
        <div className="my-5">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="assetName"
          >
            Unit Name*
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="unitName"
            type="text"
            placeholder=""
          />
        </div>
        <div className="my-5">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="assetName"
          >
            Asset Url*
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="assetUrl"
            type="text"
            placeholder=""
          />
        </div>
        <div className="my-5">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="assetName"
          >
            Metadata Hash*
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="metadataHash"
            type="text"
            placeholder=""
          />
        </div>

        <button className="text-red-300 rounded border p-2 w-max" type="submit">
          Crear NFT
        </button>
      </form>
    </ModalTemplate>
  );
};
