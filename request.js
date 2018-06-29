/**
 * 使用方法：首先创建一个全局变量，然后将给的js文件内容复制到变量中 
 * 复制本页面代码，修改参数为对应值，发送请求即可进行测试
 */
eval(postman.getGlobalVariable("forgeJS"));
_ = require('lodash');

/**
 * 实际只需要修改下面这部分参数内容
 * 实际只需要修改下面这部分参数内容
 */
const exampleApp = {
	apiPath: '/api/bankcard/type/list',
	appId: 'API_AUTH_ANDROID',
	appSecret: '6bd6d141-20a5-4d96-894d-845b75d8eefd'
};

// 实际请求的业务参数
let params = {
	"codes":['BANKCARD_MS']
};

/**
 * 实际只需要修改上面这部分参数内容
 * 实际只需要修改上面这部分参数内容
 */

/**
 * 下面的内容无需更改
 */ 
 // 签名认证参数和业务参数，实际只需要修改这部分内容
let authParams = {
	appId: exampleApp.appId,
	apiPath: encodeURIComponent(exampleApp.apiPath),
	timestamp: Date.now(),
};
 
let fullParams = Object.assign(authParams, params);
let paramsArr = [];
for (let paramKey in fullParams) {
	if (paramKey != 'signature') {
	    let paramValue = fullParams[paramKey];
	    if (_.isObjectLike(paramValue)) {
	        paramsArr.push(paramKey + '=' + JSON.stringify(paramValue));
	        
	    }else{
	        paramsArr.push(paramKey + '=' + paramValue);}
	}
}

let signature = CryptoJS.HmacMD5(paramsArr.sort().join('&'), exampleApp.appSecret).toString(CryptoJS.enc.Hex);
fullParams.signature = signature;

//定义公钥
const android_rsa_public_key = '-----BEGIN PUBLIC KEY-----\n'+
'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCGoClGBQzXd2qSV5jsK7VIrO6d\n'+
'dzAURSAU2uSZv3fDJ31rT86WLa5bOodUNoZtw2aXB27nxcQ+97bhRuj7VIJK5aoV\n'+
'VdoQNCC1uaowncTVRgbQInl/Z8zVc7slR/oWibmF0ydTTzjqOiBfxuDR6PQXwTWO\n'+
'GSD7zeKw/AyNiuLzGwIDAQAB\n'+
'-----END PUBLIC KEY-----'

// 明文
let originData = JSON.stringify(fullParams);
// 随机秘钥
let aes_encrypt_randStr = 'aaaaaaaaaaaaaaaa';
// 明文加密

var key = CryptoJS.enc.Utf8.parse("aaaaaaaaaaaaaaaa"); //16位
var iv = CryptoJS.enc.Utf8.parse(new Buffer([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
var srcs = CryptoJS.enc.Utf8.parse(originData);
var config = {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
encrypted = CryptoJS.AES.encrypt(srcs,key,config).toString()

// 秘钥加密
var publicKey = forge.pki.publicKeyFromPem(android_rsa_public_key);
var encryptedKey = forge.util.encode64(publicKey.encrypt("aaaaaaaaaaaaaaaa", 'RSA-OAEP', {
  md: forge.md.sha1.create(),
  mgf1: {
    md: forge.md.sha1.create()
  }
}))

var requestData = {
    "data":encrypted,
    "key":encryptedKey
}

pm.globals.set("mid_request_data", JSON.stringify(requestData));