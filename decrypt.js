const crypto = require('crypto');
const readline = require('readline');

function base64ToBuffer(base64) {
    return Buffer.from(base64, 'base64');
}

function hexToBuffer(hex) {
    return Buffer.from(hex, 'hex');
}

function decryptWithPublicKey(publicKey, base64String) {
    const encryptedData = base64ToBuffer(base64String);
    try {
        return crypto.publicDecrypt(publicKey, encryptedData);
    } catch (error) {
        console.error('解密失败: ', error);
        return null;
    }
}

function decryptAES_CBC(base64Data, keyBuffer, ivHex) {
    if (keyBuffer.length !== 24) {
        console.error('无效的密钥长度: ', keyBuffer.length);
        return null;
    }

    const data = base64ToBuffer(base64Data);
    const iv = hexToBuffer(ivHex);

    try {
        const decipher = crypto.createDecipheriv('aes-192-cbc', keyBuffer, iv);
        let decrypted = decipher.update(data);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString('utf8');
    } catch (error) {
        console.error('AES解密失败: ', error);
        return null;
    }
}

function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const publicKey = '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkimJ+krqfqpMGHWg/F22vNp4ZHQArWxHd220ulMu0xCKC1A5BUg+zT02H1waBprIypJ60jknANO2YOqeAcRM6zuLzCXHKQgDBy5rqeJjabLbFHDE33WsNsp5I4tfMjbUykWGYgCtKmT/b3A4ALvdsj+WJHg44JJ6VeAgyFkHRVW6TSav3zmYD+eJa1GymVpVFUpdwAeK980bNTVrGP5zTL4k1QdiVp85ofE7vGqtsXd6jIiTvHiG6ukY88yegZz3Cu1oVd0Ef5xBZ0XSD6VzLDb7xSbQdn9VLpl6qLq0symjN47hQXe0IUz6PV/noW4Mt649LU3H8ODh+c6PuGD3DQIDAQAB-----END PUBLIC KEY-----';

    rl.question('请输入dataKey: ', (keyBase64) => {
        const keyBuffer = decryptWithPublicKey(publicKey, keyBase64);
        if (!keyBuffer || keyBuffer.length !== 24) {
            console.error('无法解密密钥或密钥长度不正确');
            rl.close();
            return;
        }
        console.log("RSA解密后的密钥为: ",keyBuffer.toString('utf8'));
        rl.question('请输入data: ', (dataBase64) => {
            const ivHex = '00000000000000000000000000000000'; // 16字节全零 IV
            const decryptedMessage = decryptAES_CBC(dataBase64, keyBuffer, ivHex);
            if (decryptedMessage) {
                console.log('解密后的消息: ', decryptedMessage);
            }

            rl.close();
        });
    });
}

main();
