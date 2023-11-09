const validateConfig = (config) => {
    const requiredProperties = [
        'contractABI',
        'contractAddress',
        'tokenUri',
        'tokenId',
    ];
    for (const property of requiredProperties) {
        if (!config[property]) {
            throw new Error(`The ${property} property is required in the configuration object.`);
        }
    }
}
