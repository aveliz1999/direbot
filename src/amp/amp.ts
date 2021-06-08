import ampApi from '@cubecoders/ampapi';
import MinecraftServer from "../models/MinecraftServer";

function ampLog(value: string) {
    console.log(`[AMP Logs] ${value}`);
}

async function getLoggedInClient(server: MinecraftServer) {
    const API = new ampApi.AMPAPI(server.ampServerEndpoint);

    let APIInitOK = await API.initAsync();
    if(!APIInitOK) {
        ampLog('API Init failed');
        return null;
    }

    const loginResult = await API.Core.LoginAsync(server.ampServerUsername, server.ampServerPassword, '', false);
    if(loginResult.success) {
        ampLog('Login success');
        API.sessionId = loginResult.sessionID;

        APIInitOK = await API.initAsync();
        if(!APIInitOK) {
            ampLog('API Stage 2 Init failed');
            return null;
        }

        return API;
    }
    else {
        ampLog('Login failed');
        ampLog(loginResult);
        return null;
    }
}


export const startServer = async function (server: MinecraftServer) {
    const API = await getLoggedInClient(server);
    await API.Core.StartAsync();
}

export const killServer = async function (server: MinecraftServer) {
    const API = await getLoggedInClient(server);
    await API.Core.KillAsync();
}