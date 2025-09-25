# Control Desktop

<div align="center">
  <img src="images/control-desktop-logo.png" alt="Control Desktop Logo" width="200" />
  <h3>Computer Control and Browser Automation Agent</h3>
  <p>Control your computer and browser with natural language instructions</p>
</div>

<div align="center">
  
  ![License](https://img.shields.io/badge/license-Apache--2.0-blue)
  ![Version](https://img.shields.io/badge/version-0.2.4-green)
  ![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)
  
</div>

## Overview

Control Desktop is a powerful desktop application that allows you to control your computer and browser using natural language instructions. Powered by advanced AI, it can perform a wide range of tasks from simple file operations to complex browser automation workflows.

### Key Features

- **Computer Operator Mode**: Control your desktop environment with natural language commands
- **Browser Operator Mode**: Automate browser tasks with AI-powered navigation and interaction
- **File Attachment Support**: Send files and images to the AI for analysis and processing
- **Multi-platform Support**: Works on Windows, macOS, and Linux
- **Secure Local Processing**: Prioritizes privacy with local processing options
- **Extensible Architecture**: Built on Electron and React for easy customization

## Installation

### Prerequisites

- Node.js (v20.x or later)
- pnpm (v9.x or later)

### From Source

1. Clone the repository:
   ```bash
   git clone https://github.com/Greatness0123/control-desktop.git
   cd control-desktop
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Build for production:
   ```bash
   pnpm build
   ```

### Pre-built Binaries

Download the latest release for your platform from the [Releases](https://github.com/Greatness0123/control-desktop/releases) page.

## Usage

### Computer Operator Mode

1. Launch the application
2. Select "Computer Operator" from the dropdown menu
3. Type your instruction in the input field (e.g., "Open the Documents folder and create a new text file named notes.txt")
4. Press Enter or click the Send button
5. The AI will execute your instruction on your computer

### Browser Operator Mode

1. Launch the application
2. Select "Browser Operator" from the dropdown menu
3. Type your instruction in the input field (e.g., "Go to github.com and search for React repositories")
4. Press Enter or click the Send button
5. The AI will control your browser to complete the task

### File Attachment Feature

1. Click the paperclip icon in the chat input area
2. Choose "Upload Files" or "Upload Photos"
3. Select the file you want to send
4. Type your message (optional)
5. Send your message with the attached file to the AI

## API Integration

Control Desktop can be integrated with various AI models and APIs:

### Configuration

1. Open the Settings panel
2. Navigate to the "AI Provider" section
3. Enter your API key and select the model provider
4. Save your settings

### Supported Providers

- OpenAI
- Anthropic Claude
- Google Gemini
- Alibaba Qwen
- Custom API endpoints

### API Usage Example

```typescript
// Example of integrating with a custom API
const response = await api.runAgent({
  instructions: userInput,
  model: settings.vlmModelName,
  apiKey: settings.vlmApiKey,
  baseURL: settings.vlmBaseUrl,
  file: selectedFile // Optional file attachment
});
```

## Project Structure

```
control-desktop/
├── apps/
│   └── ui-tars/         # Main desktop application
│       ├── src/
│       │   ├── main/    # Electron main process
│       │   ├── preload/ # Electron preload scripts
│       │   └── renderer/ # React frontend
├── multimodal/          # Multimodal processing modules
├── packages/            # Shared packages and libraries
├── docs/                # Documentation
└── scripts/             # Build and utility scripts
```

## Contributing

We welcome contributions to Control Desktop! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Built with [Electron](https://www.electronjs.org/) and [React](https://reactjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

## Contact

For questions, feedback, or support, please:
- Open an [issue](https://github.com/Greatness0123/control-desktop/issues)
- Join our [community discussions](https://github.com/Greatness0123/control-desktop/discussions)