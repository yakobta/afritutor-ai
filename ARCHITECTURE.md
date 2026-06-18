# ARCHITECTURE

High-level architecture for AfriTutor Metaverse v2.0.0 prototype.

- Client: TypeScript + React (Vite), PWA, Three.js + A-Frame scenes, WebXR hooks
- Offline: Service Worker (Workbox), IndexedDB via idb
- Voice: Web Speech API adapters + provider adapter stubs (Deepgram/Google/Azure/ElevenLabs)
- AI: curriculum engine + content generator (local simulation + pluggable cloud adapters)
- Social: WebRTC real-time voice + data channels, signaling server stub
- Blockchain: Polygon templates for verifiable credentials (Hardhat + Ethers)
- Economy: client-side learn-to-earn simulation with tokenomics stubs

Security & privacy: local-first persistence; cloud integrations gated behind secrets.
