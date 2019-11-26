export function mapData(res) {
  return res.data;
}

export function mapError(err) {
  if (err && err.response && err.response.status === 401) {
    console.log('error fetch api ');
  }

  throw err;
}
