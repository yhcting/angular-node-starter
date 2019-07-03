export interface Config {
    prod: boolean;
    server: {
        host: string,
        port: number
    };
}


const dev: Config = {
    prod: false,
    server: {
        host: '0.0.0.0',
        port: 8020
    },
};


export const cfg: Config = ('production' === process.env['NODE_ENV']
         ? {...dev, ...require('./prod')}
         : dev);

export default cfg;

