
const fileSignatures = {
    jpeg: [
        Uint8Array.from([0xff, 0xd8, 0xff, 0xe0]),
        Uint8Array.from([0xff, 0xd8, 0xff, 0xe2]),
        Uint8Array.from([0xff, 0xd8, 0xff, 0xe3]),
    ],
    jpg: [
        Uint8Array.from([0xff, 0xd8, 0xff, 0xe0]),
        Uint8Array.from([0xff, 0xd8, 0xff, 0xe1]),
        Uint8Array.from([0xff, 0xd8, 0xff, 0xe8]),
    ],
    pdf: [Uint8Array.from([0x25, 0x50, 0x44, 0x46])],
    png: [Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])],
    docx: [
        Uint8Array.from([0x50, 0x4B, 0x03, 0x04]),
        Uint8Array.from([0x50, 0x4B, 0x05, 0x06]),
        Uint8Array.from([0x50, 0x4B, 0x07, 0x08]),
    ],
    xlsx: [
        Uint8Array.from([0x50, 0x4B, 0x03, 0x04]),
        Uint8Array.from([0x50, 0x4B, 0x05, 0x06]),
        Uint8Array.from([0x50, 0x4B, 0x07, 0x08]),
    ],
    htm: [Uint8Array.from([0x3C, 0x21, 0x44, 0x4F, 0x43, 0x54, 0x59, 0x50, 0x45, 0x20, 0x68, 0x74, 0x6D, 0x6C, 0x3E])],
    html: [Uint8Array.from([0x3C, 0x21, 0x44, 0x4F, 0x43, 0x54, 0x59, 0x50, 0x45, 0x20, 0x68, 0x74, 0x6D, 0x6C, 0x3E])]

};

function getFileExtension(fileName: any): string {
    const matches = fileName && fileName.match(/\.([^.]+)$/);
    if (matches) {
        return matches[1].toLowerCase();
    }
    return '';
}

function compareSignature(signature: any, actual: any): boolean {
    for (let index = 0; index < signature.length; index++) {
        if (
            signature[index] !== actual[index] &&
            typeof signature[index] !== 'undefined'
        ) {
            return false;
        }
    }
    return true;
}

function getRequiredBytes(signatures: any): number {
    const bytesNeeded = signatures.reduce((previous: any, current: any) => {
        return Math.max(previous, current.length);
    }, 0);
    return bytesNeeded;
}


export const validateFile = async (file: any, extension: any, maxFileSize: any) => {
    const result = {
        valid: false,
        message: `You're trying to upload an unsupported file type. Supported formats ${[...extension].join(', ')}`,
    };

    const ext = getFileExtension(file.name);
    if (!ext) {
        return result;
    }

    const size = Number((file.size / 1024 / 1024).toFixed(2));
    if (size > maxFileSize) {
        result.message = `File size exceeded. Maximum allowed size is ${maxFileSize} MB`;
        return result;
    }

    let required: any = fileSignatures;
    if (extension) {
        required = Object.keys(required)
            .filter((key) => extension.includes(key))
            .reduce((obj, key) => {
                obj[key] = required[key];
                return obj;
            }, {});
    }

    const signatures = required[ext];
    if (signatures) {
        const bytesNeeded = getRequiredBytes(signatures);

        const arrayBuffer = await file.arrayBuffer();
        const actual = new Uint8Array(arrayBuffer, 0, bytesNeeded);
        const valid = validateSignature(signatures, actual);
        if (valid) {
            result.valid = true;
            result.message = 'Valid';
        }
    }

    return result;
};

function validateSignature(signatures: any, actual: any): boolean {
    let valid = false;
    signatures.every((signature: any) => {
        if (signature.length === actual.length) {
            valid = compareSignature(signature, actual);
            if (valid) {
                return false; //break
            }
        }
        return true; //continue
    });
    return valid;
} 