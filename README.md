# 🐸 Doggerel Random

**Doggerel Random** is a lightweight web-based Vietnamese poetry generator that creates random poems based on classical and modern Vietnamese verse forms. It uses a comprehensive dataset of Vietnamese syllables organized by rhyme and tone to produce poems that follow traditional prosodic rules.

🔗 **Live Demo:** [https://xn--msiu-goa8b.vn/j4f/doggerel-random](https://xn--msiu-goa8b.vn/j4f/doggerel-random)

📦 **GitHub:** [https://github.com/lemasieu/doggerel-random](https://github.com/lemasieu/doggerel-random)

---

## ✨ Features

- **Six poetic forms** supported:
  - *Lục bát* (6–8 syllable couplets)
  - *Song thất lục bát* (7–7–6–8 syllable stanzas)
  - *Thất ngôn tứ tuyệt* (4-line, 7-syllable quatrains)
  - *Ngũ ngôn tứ tuyệt* (4-line, 5-syllable quatrains)
  - *Thất ngôn bát cú* (8-line, 7-syllable regulated verse)
  - *Thơ tự do* (free verse, 4 lines of 5–8 syllables each)

- **Proper tone and rhyme rules** – each form respects Vietnamese *bằng/trắc* (level/oblique) tone patterns and rhyme schemes as defined in classical poetry.

- **Dark theme** – easy on the eyes, suitable for night-time reading and creative sessions.

- **Fully client-side** – no server required; all logic runs in your browser.

- **Instant generation** – click a button and get a new poem every time.

---

## 🛠️ Tech Stack

- **HTML5** – structure
- **CSS3** – dark-themed styling, responsive layout
- **Vanilla JavaScript (ES6)** – poetry generation logic
- **JSON** – syllable dataset (rhyme and tone inventory)

---


## 📂 Project Structure

```
doggerel-random/
├── index.html   # Main page
├── style.css    # Dark theme styles
├── script.js    # Poetry generator logic
├── data.json    # Syllable dataset (rhyme × tone)
└── README.md    # This file
```


---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (recommended for fetching `data.json`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lemasieu/doggerel-random.git
   cd doggerel-random
   ```
2. Open `index.html` in your browser.
> **Note**: Due to CORS restrictions when using `fetch()` on local files, it is recommended to serve the project with a local development server (e.g., Live Server for VS Code, or Python's http.server).

### Running with Python

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

---

## 🧠 How It Works

### Data Source

The `data.json` file contains Vietnamese syllables grouped by rhyme (e.g., "AI", "AN", "ONG") and further subdivided by tone (`khác`, `huyền`, `hỏi`, `ngã`, `sắc`, `nặng`). Each entry is a list of actual words/syllables that fit that rhyme–tone combination.

### Generation Logic

1. The user selects a poetic form from the dropdown.
2. The script identifies the required tone pattern and rhyme positions for that form.
3. For each syllable position, it randomly picks a word from the dataset that matches the required tone (and rhyme, if applicable).
4. If the exact rhyme–tone combination is unavailable, the script falls back to another rhyme with the same tone, minimizing `?` placeholders.
5. The generated poem is displayed with the first letter of each line capitalized.

### Tone Classification

| Tone      | Category |
|-----------|----------|
| `khác`    | Level (bằng) |
| `huyền`   | Level (bằng) |
| `hỏi`     | Oblique (trắc) |
| `ngã`     | Oblique (trắc) |
| `sắc`     | Oblique (trắc) |
| `nặng`    | Oblique (trắc) |

## 📜 Poetic Forms in Detail

| Form                     | Lines | Syllables per Line | Rhyme Scheme                          | Tone Rules                          |
|--------------------------|-------|--------------------|---------------------------------------|-------------------------------------|
| Lục bát                  | 2 (couplet) | 6, 8               | 6th of line 1 rhymes with 6th or 8th of line 2 | Line 1: * B * T * B <br> Line 2: * B * T * B * B |
| Song thất lục bát        | 4     | 7, 7, 6, 8         | 5th of line 1 ↔ 7th of line 2 (trắc); <br> end of line 2 ↔ end of line 3 ↔ 6th of line 4 (bằng) | Mixed; follows classical rules |
| Thất ngôn tứ tuyệt       | 4     | 7                  | End of lines 1, 2, 4 (bằng)           | Lines 1 & 4: * T * B * T * <br> Lines 2 & 3: * B * T * B * |
| Ngũ ngôn tứ tuyệt        | 4     | 5                  | End of lines 2, 4 (bằng)              | Lines 1 & 4: * T * B * <br> Lines 2 & 3: * B * T * |
| Thất ngôn bát cú         | 8     | 7                  | End of lines 1, 2, 4, 6, 8 (bằng)     | Lines 1,4,5,8: * T * B * T * <br> Lines 2,3,6,7: * B * T * B * |
| Thơ tự do                | 4     | 5–8 (random)       | None (free)                           | Free (random tones)                 |

> `*` = any tone (free) · `B` = level tone (bằng) · `T` = oblique tone (trắc)

---

## 🤝 Contributing

Contributions are welcome! If you have ideas for new features, improved tone/rhyme logic, or additional syllable data, feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgements

- Syllable data sourced from [lemasieu/findwordfromshuffleletters01](https://github.com/lemasieu/findwordfromshuffleletters01)
- Inspired by Vietnamese classical poetry and the joy of random creativity

Made by Deepseek with my idea.
