import Logger from "./Logger";

export class WebDatabase {
    url: string;
    connected: boolean = false;
    connection: any;
    
    constructor(url: string) {
        this.url = url;
    }

    connect(): Promise<any> {
        return new Promise((resolve, reject) => {
            if(this.connected) {
                Logger.error('Error: Already connected to the database.');
                return;
            }
    
            const self = this;
            const xhr = new XMLHttpRequest();
            xhr.open("GET", this.url, true);
            xhr.onload = function (e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        self.connected = true;
                        self.connection = JSON.parse(xhr.responseText);
                        resolve(self.connection);
                    }
                    else {
                        self.connected = false;
                        reject();
                        Logger.error('Error when connecting to database:', xhr.statusText);
                    }
                }
            };
            xhr.onerror = function (e) {
                self.connected = false;
                reject();
                Logger.error('Error when connecting to database:', xhr.statusText);
            };
            xhr.send(null); 
        })
    }

    getConnection(): any {
        if(!this.connected) {
            Logger.error('Error: Not connected to the database');
            return null;
        }
        return this.connection;
    }

    disconnect() {
        this.connection = null;
        this.connected = false;
    }

    async reconnect(): Promise<any> {
        this.disconnect();
        return this.connect();
    }
}