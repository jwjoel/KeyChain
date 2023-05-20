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

## Banner
<img src="https://github.com/jwjoel/KeyChain/blob/main/assets/banner.png" alt="banner"/>

## Roadmap

- [x] Basic interface implimentation
- [x] Encrypted export and import of API keys
- [ ] Integration with Google Drive, OneDrive, and Amazon S3 for cloud syncing
- [ ] Generate anonymous replacement API

## Installation

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

## Usage

1. Click the KeyChain icon in your browser's toolbar to open the extension popup.

2. Use the "Key List" tab to view your stored keys. If no keys are stored, an "empty message" will be displayed.

3. Click the "Add Key" tab to add a new API key.

## Contributing

Feel free to open issues or submit pull requests for bug fixes or feature requests.

### Contributors
<a href="https://github.com/jwjoel/KeyChain/graphs/contributors">
<img src="https://contrib.rocks/image?repo=jwjoel/KeyChain" />
</a>

## License

This project is released under the [MIT License](https://opensource.org/licenses/MIT).

