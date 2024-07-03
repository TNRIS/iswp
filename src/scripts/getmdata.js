//@ts-nocheck
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

let link = 'https://tnris-droc.s3.amazonaws.com/iswp/2022/cache.json';
const client = new S3Client({});

const uploadS3 = async (itemname, object) => {
    const command = new PutObjectCommand({
        Bucket: 'tnris-droc',
        Key: itemname,
        Body: object,
        ContentEncoding: 'utf-8',
        ContentType: 'text/json'
    });

    try {
        const response = await client.send(command);
        console.log(response);
    } catch (err) {
        console.error(err);
    }
};

let runthis = async () => {
    let db23 = await fetch(link, {
        decompress: true
    });
    let db23_json = await db23.json();

    let tableobj = {};
    for (let db in db23_json) {
        tableobj[db] = db23_json[db].length;
    }

    await uploadS3('iswp/2022/checksum.json', JSON.stringify(tableobj));
};

runthis();
