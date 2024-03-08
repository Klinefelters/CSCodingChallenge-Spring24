const { ipcRenderer } = require('electron');

// When the credentials are received, display them
ipcRenderer.on('credentials', (event, credentials) => {
    console.log("creds")
    const credentialsDiv = document.getElementById('credentials');
    credentialsDiv.innerHTML = '';
    credentials.forEach((credential, index) => {
        const credentialDiv = document.createElement('div');

        const button = document.createElement('button');
        button.textContent = credential.email;
        button.addEventListener('click', () => {
            ipcRenderer.send('select-credential', { email: credential.email, password: credential.password });
        });
        credentialDiv.appendChild(button);

        const removeButton = document.createElement('button');
        removeButton.textContent = 'X';
        removeButton.addEventListener('click', () => {
            ipcRenderer.send('remove-credential', index);
        });
        credentialDiv.appendChild(removeButton);

        credentialsDiv.appendChild(credentialDiv);
    });
});

// When the form is submitted, send the new credentials to the main process
document.getElementById('addCredentialsForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    ipcRenderer.send('add-credential', { email, password });
    ipcRenderer.send('select-credential', { email: email, password: password });
});