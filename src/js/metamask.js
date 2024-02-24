document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('loginButton');

    if (loginButton) {
        loginButton.addEventListener('click', async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                    const account = accounts[0];
                    console.log('Connected account:', account);

                    // Shorten the account address and update the button text
                    const shortAddress = account.substring(0, 6) + '...' + account.substring(account.length - 4);
                    loginButton.textContent = shortAddress;
                } catch (error) {
                    console.error('Error accessing account:', error);
                }
            } else {
                alert('MetaMask is not installed!');
            }
        });
    }

        // Function to send the user's Ethereum address to the backend
    function sendAddressToBackend(address) {
        fetch('/api/player/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address: address }),
        })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    // Inside your loginButton event listener, after retrieving the account address
    sendAddressToBackend(account);

});
