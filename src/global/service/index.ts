import axios from 'axios';


export const fetchSolPrice: any = async () => {
    const res = await axios.get(`https://api.diadata.org/v1/assetQuotation/Solana/0x0000000000000000000000000000000000000000`);
    return res;
}

