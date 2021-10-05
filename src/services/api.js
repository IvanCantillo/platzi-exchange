const url = "https://api.coincap.io/v2";

const getAssets = async () => {
  try {
    const req = await fetch(`${url}/assets?limit=20`);
    const res = await req.json();
    return { error: false, data: res.data };
  } catch (error) {
    console.log(error);
    return { error: true, mesage: error };
  }
};

const getAssetByCoin = async (coin) => {
  try {
    const req = await fetch(`${url}/assets/${coin}`);
    const res = await req.json();
    return { error: false, data: res.data };
  } catch (error) {
    console.log(error);
    return { error: true, mesage: error };
  }
};

const getAssetHistory = async (coin) => {
  const now = new Date();
  const end = now.getTime();

  now.setDate(now.getDate() - 1);
  const start = now.getTime();

  try {
    const req = await fetch(
      `${url}/assets/${coin}/history?interval=h1&start=${start}&end=${end}`
    );
    const res = await req.json();
    return { error: false, data: res.data };
  } catch (error) {
    console.log(error);
    return { error: true, mesage: error };
  }
};

const getExchange = async (id) => {
  try {
    const req = await fetch(`${url}/exchanges/${id}`);
    const res = await req.json();
    return { error: false, data: res.data };
  } catch (error) {
    console.log(error);
    return { error: true, mesage: error };
  }
};

const getMarkets = async (coin) => {
  try {
    const req = await fetch(`${url}/assets/${coin}/markets?limit=5`);
    const res = await req.json();
    return { error: false, data: res.data };
  } catch (error) {
    console.log(error);
    return { error: true, mesage: error };
  }
};

export default {
  getAssets,
  getAssetByCoin,
  getAssetHistory,
  getExchange,
  getMarkets,
};
