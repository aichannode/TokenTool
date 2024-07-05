import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { useCallback } from "react";
import { IDL } from "../idl/idl";
import { LiquidityIDL } from "../idl/locker_manager";

export const ORACLE_SEED = Buffer.from(
    anchor.utils.bytes.utf8.encode("observation")
);
export const POOL_VAULT_SEED = Buffer.from(
    anchor.utils.bytes.utf8.encode("pool_vault")
);
export const AMM_CONFIG_SEED = Buffer.from(
    anchor.utils.bytes.utf8.encode("amm_config")
);

export const POOL_AUTH_SEED = Buffer.from(
    anchor.utils.bytes.utf8.encode("vault_and_lp_mint_auth_seed")
);

export const POOL_SEED = Buffer.from(anchor.utils.bytes.utf8.encode("pool"));
export const POOL_LPMINT_SEED = Buffer.from(
    anchor.utils.bytes.utf8.encode("pool_lp_mint")
);

export function u16ToBytes(num: number) {
    const arr = new ArrayBuffer(2);
    const view = new DataView(arr);
    view.setUint16(0, num, false);
    return new Uint8Array(arr);
}

export async function getAmmConfigAddress(
    index: number,
    programId: PublicKey
): Promise<[PublicKey, number]> {
    const [address, bump] = await PublicKey.findProgramAddress(
        [AMM_CONFIG_SEED, u16ToBytes(index)],
        programId
    );
    return [address, bump];
}

export async function accountExist(
    connection: anchor.web3.Connection,
    account: anchor.web3.PublicKey
) {
    const info = await connection.getAccountInfo(account);
    if (info == null || info.data.length == 0) {
        return false;
    }
    return true;
}

export async function getAuthAddress(
    programId: PublicKey
): Promise<[PublicKey, number]> {
    const [address, bump] = await PublicKey.findProgramAddress(
        [POOL_AUTH_SEED],
        programId
    );
    return [address, bump];
}

export async function getPoolAddress(
    ammConfig: PublicKey,
    tokenMint0: PublicKey,
    tokenMint1: PublicKey,
    programId: PublicKey
): Promise<[PublicKey, number]> {
    const [address, bump] = await PublicKey.findProgramAddress(
        [
            POOL_SEED,
            ammConfig.toBuffer(),
            tokenMint0.toBuffer(),
            tokenMint1.toBuffer(),
        ],
        programId
    );
    return [address, bump];
}

export async function getPoolLpMintAddress(
    pool: PublicKey,
    programId: PublicKey
): Promise<[PublicKey, number]> {
    const [address, bump] = await PublicKey.findProgramAddress(
        [POOL_LPMINT_SEED, pool.toBuffer()],
        programId
    );
    return [address, bump];
}


export async function getPoolVaultAddress(
    pool: PublicKey,
    vaultTokenMint: PublicKey,
    programId: PublicKey
): Promise<[PublicKey, number]> {
    const [address, bump] = await PublicKey.findProgramAddress(
        [POOL_VAULT_SEED, pool.toBuffer(), vaultTokenMint.toBuffer()],
        programId
    );
    return [address, bump];
}

export async function getOrcleAccountAddress(
    pool: PublicKey,
    programId: PublicKey
): Promise<[PublicKey, number]> {
    const [address, bump] = await PublicKey.findProgramAddress(
        [ORACLE_SEED, pool.toBuffer()],
        programId
    );
    return [address, bump];
}

export const useGetProgram = (connection: Connection, anchorWallet: AnchorWallet) => {
    const getProvider = useCallback(
        () =>
            new anchor.AnchorProvider(
                connection,
                anchorWallet,
                anchor.AnchorProvider.defaultOptions(),
            ),
        [connection, anchorWallet],
    );
    const programId = new PublicKey(process.env.nextRaydiumCpSwapMainnet!);

    const getProgram = () => {
        const provider = getProvider()
        return new anchor.Program(IDL, programId, provider);
    }

    return { getProgram }
}

export const useGetLiquidityProgram = (connection: Connection, anchorWallet: AnchorWallet) => {
    const getProvider = useCallback(
        () =>
            new anchor.AnchorProvider(
                connection,
                anchorWallet,
                anchor.AnchorProvider.defaultOptions(),
            ),
        [connection, anchorWallet],
    );
    const programId = new PublicKey(process.env.nextLiquidityLockerMainnet!);

    const getLiquidityProgram = () => {
        const provider = getProvider()
        return new anchor.Program(LiquidityIDL, programId, provider);
    }

    return { getLiquidityProgram }
}

export const isValidSolanaAddress = (address: string): boolean => {
    try {
        // Attempt to create a PublicKey instance from the address.
        new PublicKey(address);
        return true;
    } catch (error) {
        return false;
    }
}

export const getSeconds = (duration: number, unit: "year" | "month" | "week" | "day") => {
    const MILLISECONDS_IN_A_DAY = 24 * 60 * 1000;
    switch (unit) {
        case "year":
            // Assume a year has 365.25 days to account for leap years
            return duration * 365.25 * MILLISECONDS_IN_A_DAY;
        case "month":
            // Assume a month has 30.44 days (average month length over a year)
            return duration * 30.44 * MILLISECONDS_IN_A_DAY;
        case "week":
            return duration * 7 * MILLISECONDS_IN_A_DAY;
        case "day":
            return duration * MILLISECONDS_IN_A_DAY;
        default:
            throw new Error("Unsupported time unit");
    }
}

export const cleanString = (str: string) => {
    return str.replace(/\x00/g, '');
}