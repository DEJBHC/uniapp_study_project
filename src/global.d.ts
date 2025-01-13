declare namespace UniApp {
    interface Uni {
        $u: {
            globalData: {
                appid: string;
                appsecret: string;
                [key: string]: any;
            }
        }
    }
}