import { Connection, PublicKey } from "@solana/web3.js";
import axios from 'axios';
import isUrl from 'is-url';
import {
  getParsedNftAccountsByOwner
} from "@nfteyez/sol-rayz";
import { SOLANA_MAINNET } from "./config/constant";

/**
 * Determine NFTs on wallet
 *
 * Fetch only metadata for each NFT
 * @param address Wallet address to determine
 * @returns Fetched NFT Accounts with data
 */
async function getNftRec(url: any, mint: any) {
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      let ColName = '';
      let collectionName = '';
      let familyName = '';
      if (response.data.collection) {
        if (typeof (response.data.collection) === 'string') {
          collectionName = response.data.collection;
        } else if (response.data.collection.name) {
          collectionName = response.data.collection.name;
        }
        if (response.data.collection.family) {
          familyName = response.data.collection.family;
        }
      }

      if (ColName === '') {
        const colArray = response.data.name.split(" #");
        ColName = colArray['0'];
      }

      const nftArray = response.data.name.split("#");
      const nftName = nftArray['1'] ? nftArray['1'] : response.data.name;

      return {
        mint,
        projectname: ColName ? ColName : '',
        collectionname: collectionName,
        familyname: familyName,
        nftname: nftName,
        image: response.data.image,
        symbol: response.data.symbol,
        url
      };
    }
  } catch (error) {
    console.error(error);
  }

}
export const fetchWalletForNFTs = async (address: string) => {
  const wallet = new PublicKey(address);
  const connection = new Connection(SOLANA_MAINNET, "confirmed");
  const nftAccounts = await getParsedNftAccountsByOwner({ publicAddress: wallet, connection });

  const result = await nftAccounts.filter(d => isUrl(d.data.uri)).map(async nfts => {
    return await getNftRec(nfts.data.uri, nfts.mint);
  });

  return await Promise.all(result);

}
