
const metaMaskNotExistMessage = 'MetaMask is not installed or not connected.'
async function loginAdmin(){
    const pwd =  document.getElementById('adminPwd').value.trim();
    if(pwd === 'admin123' &&  (await getAdminAddress() !== metaMaskNotExistMessage)) {
        document.getElementById('adminPane').style.display = 'block'
    }else{
        document.getElementById('adminPane').style.display = 'none'
    }
}

/**
 *  Get the admin address as the first account in the users MetaMask metamask waller
 * @returns {Promise<string|*>}
 */
async function getAdminAddress(){
    try {
        // Check if MetaMask is installed and connected
        if (typeof window.ethereum !== 'undefined') {
            // retrieve the accounts known to the MetaMask plugin ...
            const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
            // ... and choose the first one
            const address = accounts[0];
            return address;
        } else {
            return metaMaskNotExistMessage;
        }
    } catch (error) {
        console.error(error);
        document.getElementById("loginResponse").innerText = "An error occurred while logging in with MetaMask.";
    }
}

