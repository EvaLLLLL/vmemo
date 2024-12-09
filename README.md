# Vmemo

A modern web application designed to enhance your English reading and vocabulary learning experience.

## Screenshots

<img src="https://raw.githubusercontent.com/EvaLLLLL/x/main/vmemo01.png" />
<img src="https://raw.githubusercontent.com/EvaLLLLL/x/main/vmemo02.png" />
<img src="https://raw.githubusercontent.com/EvaLLLLL/x/main/vmemo03.png" />
<img src="https://raw.githubusercontent.com/EvaLLLLL/x/main/vmemo04.png" />
<img src="https://raw.githubusercontent.com/EvaLLLLL/x/main/vmemo05.png" />
<img src="https://raw.githubusercontent.com/EvaLLLLL/x/main/vmemo06.png" />

## Features

### 📚 Seamless Reading Experience

- Built-in dictionary for instant word lookup
- Interactive text highlighting
- Auto rerange reading content

### 📝 Smart Vocabulary Management

- One-click word saving while reading
- Automatic word tracking
- Progress tracking and statistics

### 🔄 Spaced Repetition Learning

- Interactive flashcard system
- Smart review scheduling
- Progress tracking with visual analytics

### 🎯 Learning Analytics

- Detailed progress tracking
- Study streak monitoring
- Visual learning progress charts

### 🌐 Community and Posts Wall

- Engage with the community of learners
- Share your reading thoughts and experiences
- Like, comment, and interact with posts

## TODO

- [ ] Customizable flashcards review interval
- [ ] Posts comments
- [ ] User profile
- [ ] User settings
- [ ] Support for both plain text and formatted content for reading, flashcards and posts

## Tech Stack

- **Framework**: Next.js 15.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **State Management**: Zustand
- **Database**: PostgreSQL with Prisma
- **Authentication**: NextAuth.js
- **Charts**: Recharts
- **Package Manager**: pnpm

## Development

1. Clone the repository:

```bash
git clone https://github.com/yourusername/vmemo.git
cd vmemo
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

Configure the environment variables according to the `.env.example` file

4. Run database migrations:

```bash
pnpm prisma migrate dev
```

5. Start the development server:

```bash
pnpm dev
```

## Demo Account

Since registration is currently limited, you can use the following test account:

```
Email: test@vmemo.com
Password: test@vmemo.com
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

This project was created to help English learners efficiently manage their vocabulary learning journey.

Preparing for TOEFL and GRE, I was overwhelmed by vocabulary. I needed a way to save and review words quickly. While reading English articles, I wanted a faster method to look up and track words without switching apps. So, I designed this application to list and save words instantly.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
