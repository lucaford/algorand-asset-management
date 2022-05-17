import { useEffect, useState } from "react";
import algoSdk from "../utils/algoSdk";

import { CreateNftModal, NftCard } from "../components";

export default function Dashboard() {
  const [wallet, setWallet] = useState();
  const [parsedAssets, setParsedAssets] = useState([]);
  const [showCreateNftModal, setShowCreateNftModal] = useState(false);
  const [asset, setAsset] = useState(null);

  const toggleCreateNftModal = () =>
    setShowCreateNftModal((prevState) => !prevState);

  const handleCreateNftButtonPress = () => {
    toggleCreateNftModal();
  };

  const fetchAssets = async () => {
    // change assetId to retrieve all assetsId's
    const parsedAsset = await algoSdk.getAssetInformation(89329739);
    setAsset(parsedAsset);
  };

  useEffect(() => {
    const json = localStorage.getItem("wallet");
    const savedWallet = JSON.parse(json);
    setWallet(savedWallet);
    fetchAssets(savedWallet.assets);
  }, []);

  return (
    <div className="relative">
      <div className="px-10 py-2">
        <div className="flex justify-between">
          <p className="text-gray-50">{wallet?.address}</p>
          <p className="text-gray-50">{wallet?.amount / 1000000} ALGOs</p>
        </div>

        <button
          className="text-red-300 rounded border p-2"
          onClick={handleCreateNftButtonPress}
        >
          Crear NFT
        </button>
        <div className="flex justify-around align-middle items-center my-10 flex-wrap">
          {asset !== null && <NftCard asset={asset} />}
        </div>
      </div>
      {showCreateNftModal && <CreateNftModal wallet={wallet} />}
    </div>
  );
}
