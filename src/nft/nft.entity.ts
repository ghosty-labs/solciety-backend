export class NftAttribute {
  trait_type: string;
  value: string;
}

export class NftMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  attributes: any;
}

export class NftPostPayloadData {
  signature: string;
  tokenAddress: string;
  mintAddress: string;
  collectionAddress: string;
  name: string;
  uri: string;
}

export class CreateNftPayloadData {
  signature: string;
  user: string;
  candy_machine_id: string;
  mint_address: string;
  collection_address: string;
  token_address: string;
  name: string;
  description: string;
  image: string;
  attributes: string;
  symbol: string;
}
