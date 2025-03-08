# Send It - Instant Messaging PWA

A Progressive Web Application for instant messaging with predefined messages and push notifications.

## Features

- 💬 Quick message sending with predefined templates
- 👤 Simple user authentication
- 🔔 Push notifications support
- 📱 PWA-ready for mobile installation
- 💾 Local storage for message persistence
- 🎨 Modern, responsive UI with Tailwind CSS

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- PWA capabilities with service workers
- Browser Notification API
- Local Storage for data persistence

### Backend (Future Implementation)
- To be implemented
- Will support user authentication
- Real-time message delivery
- Persistent storage

## Project Structure

```
send-it/
├── frontend/          # React frontend application
├── backend/           # Future backend implementation
├── README.md         # This file
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Modern web browser with notifications support

### Development
1. Clone the repository
2. Frontend setup:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Building for Production
```bash
cd frontend
npm run build
```

The built application will be in the `frontend/dist` directory.

## Development Guidelines

- Follow the component-based architecture
- Use Tailwind CSS for styling
- Implement PWA best practices
- Write clean, documented code
- Follow React best practices and hooks guidelines

## Future Enhancements

- [ ] Backend integration with real-time messaging
- [ ] User authentication system
- [ ] Message history persistence
- [ ] Direct replies from notifications
- [ ] User presence indicators
- [ ] Message read receipts
- [ ] Rich media support
- [ ] End-to-end encryption

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT License - feel free to use this project for any purpose. 