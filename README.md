# KeyChain
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE)

> Keep your API Keys organized and secure.

With the growing popularity of GPT and the increasing importance of APIs, many applications rely on API keys to function. However, people may struggle with managing their API keys effectively, which is time-consuming and susceptible to leaks.

That's where KeyChain comes into play - it serves as a reliable and well-structured solution for users to securely store and efficiently manage their API keys.

## Features

- 🛡️ **Securely store API keys** in your browser's local storage
- ⚡ **Fetch API keys quickly** with just a simple click
- 📅 **Easily view key expiration dates** at a glance
- ☁️ **Seamless sync** with Google Drive, OneDrive, and Amazon S3
- 🔒 **Robust encryption** using Web Crypto API for maximum security

## Example

<img src="https://github.com/jwjoel/KeyChain/blob/main/assets/banner.png" alt="banner" width="50%"/>

## Roadmap

- [x] Basic interface implementation
- [x] Encrypted export and import of API keys
- [ ] Integration with Google Drive, OneDrive, and Amazon S3 for cloud syncing
- [ ] Generate anonymous replacement API

## Installation

Search for KeyChain in the Google Chrome App Store or

1. Clone the repository or download the source code:

   ```
   git clone https://github.com/yourusername/keychain.git
   ```

2. In your browser, open the Extensions page:

   - In Chrome, navigate to `chrome://extensions/`
   - In Firefox, navigate to `about:addons`

3. Enable developer mode (usually a toggle in the top-right corner of the Extensions page).

4. Click "Load unpacked extension" (Chrome) or "Load Temporary Add-on" (Firefox) and select the `keychain` directory that you cloned or downloaded.

5. The KeyChain extension should now be installed and visible in your browser's toolbar.

## Data Security

Data security is at the core of KeyChain. Using AES-GCM encryption, API keys are stored as ciphertext in IndexedDB. All keys are saved locally, so make sure to export your API keys before changing environments. The exported file format is:
``` json
{
    "keys":[
        {
            "id":1,
            "source":"Github",
            "key":{
                "ciphertext":"6DR7vprpOw5C78kaTRLT7p1eIQ==",
                "iv":"w5JOmjtrvfcpo+JH"
            },
            "expiration":1687167800822
        }
    ],
    "encryptionKey":{
        "alg":"A256GCM",
        "ext":true,
        "k":"HyrZg2KSkBCBVbl3n6qxgb2MwRIX8l6EBCBstkhITCQ",
        "key_ops":[
            "encrypt",
            "decrypt"
        ],
        "kty":"oct"
    }
}
```
API keys are stored as encrypted ciphertext in base64 format. You can separate the encryption key and API keys as needed to ensure maximum security. Additionally, keys added to KeyChain are not directly displayed on the interface and cannot be edited. To modify a key, you must first delete the original API key and then add a new one.

## Usage

https://github.com/jwjoel/KeyChain/assets/25562443/85afd114-52c0-4862-b57d-715b834ed0a8

### Add API Key

1. Click the KeyChain icon in your browser's toolbar to open the extension popup.

2. Use the "Chain" tab to view your stored keys. If no keys are stored, an "empty message" will be displayed.

3. Click the "AddKey" tab to add a new API key.

### Export and Import

1. Click the settings icon in the top-right corner of the interface to enter the settings page.

2. Choose the Export option, and the system will automatically download the file after the export is complete.

3. On the device where you want to import the keys, choose Import.

## Contributing

Feel free to open issues or submit pull requests for bug fixes or feature requests.

### Contributors

<a href="https://github.com/jwjoel/KeyChain/graphs/contributors">
<img src="https://contrib.rocks/image?repo=jwjoel/KeyChain" />
</a>

## License

This project is released under the [MIT License](https://opensource.org/licenses/MIT).
