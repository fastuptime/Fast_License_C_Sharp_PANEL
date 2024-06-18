# Fast License - License Management System

![image](https://github.com/fastuptime/Fast_License_C_Sharp_PANEL/assets/63351166/ec9c15a5-d738-49b6-a55d-c2d0f5c31f40)
![image](https://github.com/fastuptime/Fast_License_C_Sharp_PANEL/assets/63351166/0a854d5a-b55e-49e2-bdb4-d37b327a1219)
![image](https://github.com/fastuptime/Fast_License_C_Sharp_PANEL/assets/63351166/bc34c70b-7388-4e6d-970b-4ebf19f5543d)
![image](https://github.com/fastuptime/Fast_License_C_Sharp_PANEL/assets/63351166/d386300a-5e27-4398-9f9d-d2e8a6d0833e)
![image](https://github.com/fastuptime/Fast_License_C_Sharp_PANEL/assets/63351166/cb4a1480-a094-4f1b-bb84-904ee8ab56b6)
![image](https://github.com/fastuptime/Fast_License_C_Sharp_PANEL/assets/63351166/21056f8c-1dbf-4493-ad0b-904fe5a9fbac)


🚀 **Welcome to Fast License!** 🚀

Fast License is a free licensing system that allows you to manage software licenses easily and efficiently. This project provides a comprehensive panel for creating, editing, and managing licenses, along with an API for license validation.

💻 [C# Sample Integration](https://github.com/fastuptime/Fast_License_C_Sharp_Program) 💻

## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Panel](#panel)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **License Management**: Create, edit, and deactivate licenses.
- **API Integration**: Validate licenses via API.
- **Automated Checks**: Periodically check and update license statuses.
- **Admin Panel**: User-friendly panel to manage licenses and view logs.
- **Reports**: Track and review license-related reports.

## 🛠️ Installation

1. **Clone the Repository**:
    ```sh
    git clone https://github.com/fastuptime/Fast_License_C_Sharp_PANEL.git
    ```

2. **Install Dependencies**:
    ```sh
    cd Fast_License_C_Sharp_PANEL
    npm install
    ```

3. **Configure the Application**:
    - Edit the `config.js` file to match your MongoDB configuration and other settings.

4. **Run the Application**:
    ```sh
    node index.js
    ```

## 🎮 Usage

1. **Start the Application**:
    - Run the application using `node index.js`.

2. **Access the Admin Panel**:
    - Open your browser and navigate to `http://localhost/panel`.

3. **Login**:
    - Use the default admin credentials provided in the `config.js` file.

![Admin Panel Screenshot](path_to_your_screenshot.png)

## ⚙️ Configuration

Configuration settings are managed in the `config.js` file:

```js
module.exports = {
    site: {
        name: 'Fast License',
        title: 'Fast License - Lisanslama Sistemi',
        description: 'Fast License ücretsiz bir lisanslama sistemidir.',
        keywords: 'fast, license, fast license, fastlicense, fastuptime, fast uptime, fastuptime.com',
        url: 'https://fastlicense.com',
    },
    admins: [
        {
            username: 'admin',
            password: 'admin',
            avatar: "https://i.hizliresim.com/gy1ppnp.jpg",
        },
        {
            username: 'admin2',
            password: 'admin2',
            avatar: "https://i.hizliresim.com/gy1ppnp.jpg",
        }
    ],
    mongodb: "mongodb://127.0.0.1:27017/fastlicense", // NodeJs v18 localhost --> 127.0.0.1 
    port: 80,
};
```

## 🛣️ API Endpoints

### `/api/v1`

- **POST**: Validate license information.
  - **Parameters**: `ip`, `key`, `action`, `computerName`, `processorName`, `osName`, `diskName`, `localIP`, `script`
  - **Responses**:
    - Success: `{ status: "success", message: "Lisans aktif." }`
    - Error: `{ status: "error", message: "Lisans bulunamadı." }`

## 🖥️ Panel

The admin panel allows you to manage licenses, view logs, and handle reports. Here are some key routes:

- **Panel**: `/panel` - View all licenses and scripts.
- **Create License**: `/create_license` - Create a new license.
- **Edit License**: `/edit_license/:id` - Edit an existing license.
- **Reports**: `/reports` - View and manage reports.

## 🤝 Contributing

Contributions are welcome! Please fork this repository and submit pull requests.

1. **Fork the Repository**
2. **Create a Feature Branch**:
    ```sh
    git checkout -b feature-branch
    ```
3. **Commit Your Changes**:
    ```sh
    git commit -m 'Add some feature'
    ```
4. **Push to the Branch**:
    ```sh
    git push origin feature-branch
    ```
5. **Open a Pull Request**
