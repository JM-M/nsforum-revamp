// Replace this with your app's required chains
import { createConfig } from "@privy-io/wagmi";
import { base } from "viem/chains";
import { http } from "wagmi";

const config = createConfig({
  chains: [base], // Pass your required chains as an array
  transports: {
    [base.id]: http(),
    // For each of your required chains, add an entry to `transports` with
    // a key of the chain's `id` and a value of `http()`
  },
});

export default config;
