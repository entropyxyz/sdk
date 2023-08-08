import { ApiPromise, WsProvider } from '@polkadot/api'


// never used 
// export  const getApi:(endpoint?: string) => Promise<ApiPromise>  = constructGetApiFunction() 


export const getApi:(endpoint?: string) => Promise<ApiPromise> = constructApiGetterFunction() 

export function constructApiGetterFunction(): (endpoint?: string) => Promise<ApiPromise> {
    const apis: { [key: string]: ApiPromise } = {};

    return async (endpoint = 'ws://127.0.0.1:9944'): Promise<ApiPromise> => {
        if (apis[endpoint]) {
            await apis[endpoint].isReady;
            return apis[endpoint];
        }

        const wsProvider = new WsProvider(endpoint);
        const api = new ApiPromise({ provider: wsProvider });

        apis[endpoint] = api;
        await api.isReady;

        return api;
    };
}






