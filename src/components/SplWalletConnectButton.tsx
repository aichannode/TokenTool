import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

const SplWalletConnectButton = () => {
    const { setVisible } = useWalletModal();
    const { publicKey, connecting, connected } = useWallet();
    const connect = () => {
        console.log("🚀 ~ SplWalletConnectButton ~ publicKey:", publicKey)
        setVisible(true)
    }

    return (
        <button onClick={connect}>{
            connecting ? "Connecting" : connected ? "Connected" : "Connect wallet"}</button>
    )
}

export default SplWalletConnectButton;