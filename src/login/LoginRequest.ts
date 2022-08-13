class LoginRequest {

    constructor(props) {
        this.username = props!.username;
        this.password = props!.password;
        this.captcha = props!.catpcha;
        this.serverId = props!.serverId;
        this.sessionId = props!.sessionId;
        this.includeOthers = props!.includeOthers
    }

    username?:string;
    password?:string;
    captcha?:number;
    sessionId?:string;
    serverId?:string;
    includeOthers?:boolean;
}

export default LoginRequest;