
import '../styles/globals.css'
import "../styles/survey.css"
import { Orbis, OrbisProvider } from "@orbisclub/components";
import "@orbisclub/components/dist/index.modern.css";
import React from 'react';
import { GlobalContext } from "../contexts/GlobalContext";

/**
 * Set the global forum context here (you can create categories using the dashboard by clicking on "Create a sub-context"
 * from your main forum context)
 */
global.orbis_context = "kjzl6cwe1jw149r6wq7kmn47sush5q5jf4w5xd04w082gvubcjduw4kozhdpbk1";

/**
 * Set the global chat context here (the chat displayed when users click on the "Community Chat" button).
 * The Community Chat button will be displayed only if this variable is set
 */
global.orbis_chat_context = "kjzl6cwe1jw149r6wq7kmn47sush5q5jf4w5xd04w082gvubcjduw4kozhdpbk1";

let orbis = new Orbis({
  useLit: true,
  node: "https://node2.orbis.club",
  PINATA_GATEWAY: process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL,
});

export default function App({ Component, pageProps }) {
  return (
    <OrbisProvider defaultOrbis={orbis} authMethods={["metamask", "wallet-connect", "email"]}>
      <GlobalContext.Provider value={{ orbis: orbis }}>
        <Component {...pageProps} />
      </GlobalContext.Provider>
    </OrbisProvider>
  )
}
