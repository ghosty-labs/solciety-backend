import axios, { AxiosResponse } from 'axios';
import { NftMetadata } from 'src/nft/nft.entity';

export const fetchMetadata = async (uri: string) => {
  try {
    const reference: AxiosResponse = await axios.get(uri);
    const metadata = reference.data;
    if (reference.data !== null && typeof reference.data === 'object') {
      const nftMetadata: NftMetadata = {
        name: metadata.name,
        description: metadata.description,
        attributes: metadata.attributes,
        image: metadata.image,
        symbol: metadata.symbol,
      };

      return nftMetadata;
    }

    return null;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
