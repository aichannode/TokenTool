import axios from 'axios';


export const fetchSolPrice: any = async () => {
    const res = await axios.get(`https://api.diadata.org/v1/assetQuotation/Solana/0x0000000000000000000000000000000000000000`);
    return res;
}


export const fetchPoolInfo: any = async (tokenMintAddress: string) => {
    const res = await axios.get(`https://api-v3.raydium.io/pools/info/mint?mint1=` + tokenMintAddress + `&mint2=So11111111111111111111111111111111111111112&poolType=standard&poolSortField=default&sortType=desc&pageSize=1&page=1`);
    return res;
}

