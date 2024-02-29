"use strict";

import algosdk from "algosdk";
//import { PeraWalletConnect } from "@perawallet/connect";
import * as pwcsdk from "@perawallet/connect";
import $ from "jquery";

const working = "Status: Working";
const done = "Status: Done";

const peraWallet = new pwcsdk.PeraWalletConnect();

const token = "";
const server = "https://testnet-api.algonode.cloud";
const port = 443;
const client = new algosdk.Algodv2(token, server, port);

let accountAddress = "";
const sinkAddress = "Y76M3MSY6DKBRHBL7C3NNDXGS5IIMQVQVUAB6MP4XEMMGVF2QWNPL226CA";


$(window.document).ready(function () {
  console.log("document ready");
  addEventListeners();
  reconnectSession();
});

function addEventListeners() {
$("#connect_pera_wallet").on("click", function () {
  handleConnectWallet();
});

$("#disconnect_pera_wallet").on("click", function () {
  handleDisconnectWallet();
});

$("#make_payment_pera_wallet").on("click", function () {
  handlePayment();
})
}

function reconnectSession() {
  setStatus(working);
  clearError();
  // Reconnect to the session when the component is mounted
  peraWallet
    .reconnectSession()
    .then((accounts) => {
      if (peraWallet.connector !== null) {
        peraWallet.connector.on("disconnect", handleDisconnectWallet);
      }
      if (accounts.length) {
        accountAddress = accounts[0];
        setButtonState(true);
      }
      else {
        setButtonState(false);
      }
      setStatus(done);
    })
    .catch((error) => {
      console.log('Error in reconnectSession: ' + error.name + ' ' + error.message);
      setStatus(done);
      setError(error);
    });
}

function setButtonState(connected) {
  if (connected) {
    $("#connect_pera_wallet").prop('disabled', true);
    $("#disconnect_pera_wallet").prop('disabled', false);
    $("#make_payment_pera_wallet").prop('disabled', false);
  }
  else {
    $("#connect_pera_wallet").prop('disabled', false);
    $("#disconnect_pera_wallet").prop('disabled', true);
    $("#make_payment_pera_wallet").prop('disabled', true);
  }
}

function setStatus(msg) {
  $("#wallet_connect_status").text(msg);
}

function setError(error) {
  const error_name = error.name;
  const error_message = error.message.replace(/\n/g, '<br/>');
  if (error_message != "") {
    $("#wallet_connect_error").html('Error: ' + error_name + ' ' + error_message);
    $("#wallet_connect_error").show(0);
  }
  else {
    $("#wallet_connect_error").text('No errors');
    $("#wallet_connect_error").hide();
  }
}

function clearError() {
  setError({ name: '', message: '' })
}

function handleConnectWallet() {
  setStatus(working);
  clearError();
  peraWallet
    .connect()
    .then((newAccounts) => {
      peraWallet.connector.on("disconnect", handleDisconnectWallet);
      accountAddress = newAccounts[0];
      setButtonState(true);
      setStatus(done);
    })
    .catch((error) => {
      if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
        console.log('Error in handleConnectWallet: ' + error.name + ' ' + error.message);
        setStatus(done);
        setError(error);
      }
    });
}

function handleDisconnectWallet() {
  setStatus(working);
  clearError();
  peraWallet
    .disconnect()
    .then(() => {
      setButtonState(false);
      setStatus(done);
    })
    .catch((error) => {
      console.log('Error in handleDisconnectWallet: ' + error.name + ' ' + error.message);
      setStatus(done);
      setError(error);
    });
  accountAddress = "";
}

async function handlePayment() {
  setStatus(working);
  clearError();
  const params = await client.getTransactionParams().do();
  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: accountAddress,
    to: sinkAddress,
    amount: algosdk.algosToMicroalgos(0.001),
    suggestedParams: params
  });
  let txGroup = [{ txn, signers: [accountAddress] }];
  try {
    const signedTxnGroup = await peraWallet.signTransaction([txGroup]);
    const { txId } = await client.sendRawTransaction(signedTxnGroup).do();
    console.log('Info in handlePayment: ', 'Payment txn sent to Algorand network');
    console.log('Info in handlePayment: ', 'txId: ', txId);
    setStatus(done);
  } catch (error) {
    console.log('Error in handlePayment: ' + error.name + ' ' + error.message);
    setStatus(done);
    setError(error);
  }
}
