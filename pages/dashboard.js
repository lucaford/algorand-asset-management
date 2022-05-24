import { useEffect, useState } from "react";
import algoSdk from "../utils/algoSdk";

import { CreateNftModal, NftCard } from "../components";

export default function Dashboard() {
  const [wallet, setWallet] = useState(null);
  const [parsedAssets, setParsedAssets] = useState([]);
  const [showCreateNftModal, setShowCreateNftModal] = useState(false);

  const toggleCreateNftModal = () =>
    setShowCreateNftModal((prevState) => !prevState);

  const handleCreateNftButtonPress = () => {
    toggleCreateNftModal();
  };

  const fetchAccount = () => {
    const mnemonic = localStorage.getItem("mnemonic");
    var keys = algoSdk.mnemonicToSecretKey(mnemonic);
    algoSdk
      .getAccountInformation(keys.addr)
      .then((payload) => {
        let walletDetails = {
          ...payload,
          secretKey: keys.sk,
          mnemonic,
        };
        setWallet(walletDetails);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchAssets = () => {
    const assetsArray = [];

    wallet.assets.forEach((asst) => {
      const { "asset-id": assetId } = asst;

      // change assetId to retrieve all assetsId's

      const assetPromise = algoSdk.getAssetInformation(assetId);
      assetsArray.push(assetPromise);
    });

    Promise.all(assetsArray).then((payload) => setParsedAssets(payload));
  };

  const onAcceptButtonPress = () => {
    setShowCreateNftModal(false);
  };

  const onCancelButtonPress = () => {
    setShowCreateNftModal(false);
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  useEffect(() => {
    if (wallet) {
      fetchAssets();
    }
  }, [wallet]);

  return (
    <div className="relative">
      <div className="px-10 py-2">
        <div className="flex justify-between">
          <p className="text-gray-50">{wallet?.address}</p>
          <p className="text-gray-50">{wallet?.amount / 1000000} ALGOs</p>
        </div>
        <div className="flex justify-center mt-3">
          <button
            className="text-red-300 rounded border p-2"
            onClick={handleCreateNftButtonPress}
          >
            Crear Asset
          </button>
        </div>
        <div className="flex justify-around align-middle items-center my-10 flex-wrap">
          {parsedAssets.map((asset) => (
            <NftCard key={asset.index} asset={asset} />
          ))}
        </div>
      </div>
      {showCreateNftModal && (
        <CreateNftModal
          wallet={wallet}
          onAcceptButtonPress={onAcceptButtonPress}
          onCancelButtonPress={onCancelButtonPress}
        />
      )}
    </div>
  );
}
