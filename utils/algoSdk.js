import sdk from "algosdk";

const token = {
  "X-API-Key": "BTkQHVyTpFapjKos2koeZCequkXYYcC3slsQfPCi",
};
const port = "";

class AlgoSdk {
  client;
  network;
  networks = [
    {
      name: "testnet",
      server: "https://testnet-algorand.api.purestake.io/ps2",
      label: "TESTNET",
      explorer: "https://goalseeker.purestake.io/algorand/testnet",
    },
    {
      name: "mainnet",
      server: "https://mainnet-algorand.api.purestake.io/ps1",
      label: "MAINNET",
      explorer: "https://goalseeker.purestake.io/algorand/mainnet",
    },
  ];

  constructor() {
    this.selectNetwork("testnet");
  }

  selectNetwork(name) {
    const networks = this.getNetworks();
    networks.forEach((network) => {
      if (network.name === name) {
        this.network = network;
        this.setClient(network.server);
      }
    });
  }

  getExplorer() {
    const network = this.getCurrentNetwork();
    return this.network.explorer;
  }

  getAssetUrl(id) {
    return this.getExplorer() + "/asset/" + id;
  }

  getCurrentNetwork() {
    return this.network;
  }

  setClient(server) {
    this.client = new sdk.Algodv2(token, server, port);
  }

  getClient() {
    return this.client;
  }

  mnemonicToSecretKey(mnemonic) {
    return sdk.mnemonicToSecretKey(mnemonic);
  }

  async getAccountInformation(address) {
    return await this.getClient().accountInformation(address).do();
  }

  async getAssetInformation(assetID) {
    return await this.getClient().getAssetByID(assetID).do();
  }

  async getChangingParams() {
    const cp = {
      fee: 0,
      firstRound: 0,
      lastRound: 0,
      genID: "",
      genHash: "",
    };

    let params = await this.getClient().getTransactionParams().do();
    cp.firstRound = params.firstRound;
    cp.fee = params.fee;
    cp.lastRound = cp.firstRound + parseInt(1000);
    cp.genID = params.genesisID;
    cp.genHash = params.genesisHash;

    return cp;
  }

  async waitForConfirmation(txId) {
    console.log("wait for confirmation");
    let confirmedTxn = await sdk.waitForConfirmation(this.getClient(), txId, 4);

    console.log(
      "Transacción " +
        txId +
        " confirmada en el round " +
        confirmedTxn["confirmed-round"]
    );
  }

  async createAsset(
    wallet,
    assetName,
    unitName,
    supply,
    assetURL,
    metadataHash,
    managerAddress,
    reserveAddress,
    freezeAddress,
    clawbackAddress,
    decimals
  ) {
    let cp = await this.getChangingParams();

    let note = new Uint8Array(Buffer.from("algodesk", "base64"));
    let addr = wallet.address;
    let defaultFrozen = false;

    if (decimals == undefined || decimals == null || decimals == "") {
      decimals = 0;
    }
    const txn = sdk.makeAssetCreateTxn(
      addr,
      cp.fee,
      cp.firstRound,
      cp.lastRound,
      note,
      cp.genHash,
      cp.genID,
      supply,
      decimals,
      defaultFrozen,
      managerAddress,
      reserveAddress,
      freezeAddress,
      clawbackAddress,
      unitName,
      assetName,
      assetURL,
      metadataHash
    );

    const keys = sdk.mnemonicToSecretKey(wallet.mnemonic);
    let rawSignedTxn = txn.signTxn(keys.sk);
    let transaction = await this.getClient()
      .sendRawTransaction(rawSignedTxn, {
        "Content-Type": "application/x-binary",
      })
      .do();
    return transaction;
  }

  async modifyAsset(
    wallet,
    assetId,
    managerAddress,
    reserveAddress,
    freezeAddress,
    clawbackAddress
  ) {
    let cp = await this.getChangingParams();

    let note = new Uint8Array(Buffer.from("algodesk", "base64"));
    let addr = wallet.address;
    let txn;
    try {
      txn = sdk.makeAssetConfigTxn(
        addr,
        cp.fee,
        cp.firstRound,
        cp.lastRound,
        note,
        cp.genHash,
        cp.genID,
        assetId,
        managerAddress,
        reserveAddress,
        freezeAddress,
        clawbackAddress
      );
    } catch (e) {
      console.log(e);
    }

    let rawSignedTxn = txn.signTxn(wallet.secretKey);

    let transaction = await this.getClient().sendRawTransaction(rawSignedTxn, {
      "Content-Type": "application/x-binary",
    });
    return transaction;
  }

  async pendingTransactionInformation(txId) {
    return await this.getClient().pendingTransactionInformation(txId);
  }

  async destroyAsset(wallet, assetId) {
    let cp = await this.getChangingParams();
    const addr = wallet.address;
    let note = new Uint8Array(Buffer.from("algodesk", "base64"));

    let txn = sdk.makeAssetDestroyTxn(
      addr,
      cp.fee,
      cp.firstRound,
      cp.lastRound,
      note,
      cp.genHash,
      cp.genID,
      assetId
    );
    let rawSignedTxn = txn.signTxn(wallet.secretKey);

    let transaction = await this.getClient().sendRawTransaction(rawSignedTxn, {
      "Content-Type": "application/x-binary",
    });
    return transaction;
  }

  async freezeAsset(wallet, assetId, freezeAddress, freezeState) {
    let cp = await this.getChangingParams();
    const addr = wallet.address;
    let note = new Uint8Array(Buffer.from("algodesk", "base64"));
    if (!freezeState) {
      freezeState = false;
    }

    let txn = sdk.makeAssetFreezeTxn(
      addr,
      cp.fee,
      cp.firstRound,
      cp.lastRound,
      note,
      cp.genHash,
      cp.genID,
      assetId,
      freezeAddress,
      freezeState
    );

    let rawSignedTxn = txn.signTxn(wallet.secretKey);

    let transaction = await this.getClient().sendRawTransaction(rawSignedTxn, {
      "Content-Type": "application/x-binary",
    });
    return transaction;
  }

  async sendAssets(wallet, assetId, recipient, amount) {
    let cp = await this.getChangingParams();

    let note = new Uint8Array(Buffer.from("algodesk", "base64"));
    let sender = wallet.address;
    const revocationTarget = undefined;
    const closeRemainderTo = undefined;

    const txn = sdk.makeAssetTransferTxn(
      sender,
      recipient,
      closeRemainderTo,
      revocationTarget,
      cp.fee,
      amount,
      cp.firstRound,
      cp.lastRound,
      note,
      cp.genHash,
      cp.genID,
      assetId
    );

    let rawSignedTxn = txn.signTxn(wallet.secretKey);

    let transaction = await this.getClient().sendRawTransaction(rawSignedTxn, {
      "Content-Type": "application/x-binary",
    });
    return transaction;
  }

  async revokeAssets(
    wallet,
    assetId,
    revokeAddress,
    revokeReceiverAddress,
    revokeAmount
  ) {
    let cp = await this.getChangingParams();

    let note = new Uint8Array(Buffer.from("algodesk", "base64"));
    let sender = wallet.address;
    const revocationTarget = revokeAddress;
    const closeRemainderTo = undefined;

    const txn = sdk.makeAssetTransferTxn(
      sender,
      revokeReceiverAddress,
      closeRemainderTo,
      revocationTarget,
      cp.fee,
      revokeAmount,
      cp.firstRound,
      cp.lastRound,
      note,
      cp.genHash,
      cp.genID,
      assetId
    );

    let rawSignedTxn = txn.signTxn(wallet.secretKey);

    let transaction = await this.getClient().sendRawTransaction(rawSignedTxn, {
      "Content-Type": "application/x-binary",
    });
    return transaction;
  }

  isValidAddress(addr) {
    return sdk.isValidAddress(addr);
  }

  getNetworks() {
    return this.networks;
  }
}

export default new AlgoSdk();
