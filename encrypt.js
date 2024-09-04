const crypto = require('crypto');
const readline = require('readline');

// 使用RSA公钥加密数据
function encryptWithPublicKey(publicKey, data) {
    try {
        // 公钥的格式必须正确
        const encryptedData = crypto.publicEncrypt({
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_PADDING // 确保使用正确的填充方式
        }, Buffer.from(data));
        return encryptedData.toString('base64'); // 返回Base64编码的加密数据
    } catch (error) {
        console.error('RSA加密失败: ', error.message);
        return null;
    }
}

// 创建命令行接口
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 公钥
const publicKey = '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkimJ+krqfqpMGHWg/F22vNp4ZHQArWxHd220ulMu0xCKC1A5BUg+zT02H1waBprIypJ60jknANO2YOqeAcRM6zuLzCXHKQgDBy5rqeJjabLbFHDE33WsNsp5I4tfMjbUykWGYgCtKmT/b3A4ALvdsj+WJHg44JJ6VeAgyFkHRVW6TSav3zmYD+eJa1GymVpVFUpdwAeK980bNTVrGP5zTL4k1QdiVp85ofE7vGqtsXd6jIiTvHiG6ukY88yegZz3Cu1oVd0Ef5xBZ0XSD6VzLDb7xSbQdn9VLpl6qLq0symjN47hQXe0IUz6PV/noW4Mt649LU3H8ODh+c6PuGD3DQIDAQAB-----END PUBLIC KEY-----';

// 提示用户输入待加密的数据
rl.question('请输入要加密的data: ', (data) => {
    const encryptedBase64 = encryptWithPublicKey(publicKey, data);
    if (encryptedBase64) {
        console.log('加密后的data: ', encryptedBase64);
    }

    rl.close();
});
