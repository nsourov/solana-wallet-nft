import express from 'express';
import http from 'http';
import cors from 'cors';
import { fetchWalletForNFTs } from './wallet';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
const server = http.createServer(app);

app.get('/', async (req, res) => {
  try {
    const address = req.query.address as string;
    console.log(`Requested wallet address ${address}`);
    const result = await fetchWalletForNFTs(address);
    return res.send(JSON.stringify(result));
  } catch (e) {
    console.log(`Request isn't process: ${e}`);
    return res.send(e);
  }
});

server.listen(port, () => {
  console.log(`server is listening on ${port}`);
});