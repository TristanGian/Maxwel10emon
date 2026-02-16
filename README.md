# Maxwell's Demon: Thermodynamics Simulation

<img align="center" src="assets/asepritebanner.png">


<div align="center">

![Physics](https://img.shields.io/badge/Physics-Thermodynamics-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![p5.js](https://img.shields.io/badge/p5.js-1.4.0-red)
![Chart.js](https://img.shields.io/badge/Chart.js-3.9.1-ff6384)
![License](https://img.shields.io/badge/License-MIT-green)

An interactive web-based simulation exploring Maxwell's Demon, the Second Law of Thermodynamics, and Landauer's Principle through real-time particle physics and entropy visualization.

[**Web Application**](https://bepissbepisss.github.io/bepiss.bepisss.github.io/index.html)
</div>
<div align="center">
  <table>
    <tr>
      <td width="128" align="center">
        <img src="assets/asperitenetropy.png" alt="Entropy catagory" width="128" height="128">
      </td>
      <td>
        <h1>Entropy category winner - McGill hackathon 10</h1>
      </td>
    </tr>
  </table>
</div>

---

## 📖 Overview

Maxwell's Demon is a thought experiment that challenges the Second Law of Thermodynamics. This simulation brings that concept to life, demonstrating how information theory and thermodynamics intersect. Watch as neon atoms move, collide, and interact with a "demon" that can sort them between chambers—but at a thermodynamic cost.

Built for the McGill Physics Hackathon on entropy, this project provides an educational and visually stunning exploration of:
- **Statistical Mechanics** - Particle distributions and speed classifications
- **Information Theory** - Landauer's Principle and measurement costs
- **Thermodynamics** - Entropy, temperature, and energy conservation
- **Collision Physics** - Elastic collisions with momentum conservation

---

## ✨ Features

### 🎮 Interactive Controls
- **Space Bar** - Toggle the demon's door open/closed
- **Perfect Demon Mode** - Automatic sorting (shows theoretical ideal)
- **Particle Sliders** - Add 0-100 blue (slow) or red (fast) neon atoms
- **Speed Multiplier** - Adjust simulation speed from 0.1x to 3.0x

### 📊 Real-Time Analytics
- **Entropy Tracking**
  - System entropy (configurational + combinatorial)
  - Demon entropy (accumulated measurement costs)
  - Gauge bar with max entropy marker
  
- **Energy & Temperature**
  - Total kinetic energy (displayed in eV)
  - System temperature from equipartition theorem
  - Per-chamber temperature analysis
  
- **Chamber Statistics**
  - Particle counts by color and chamber
  - Speed distribution monitoring
  - Temperature differentials

### 📈 Data Visualization
- **Entropy Over Time** - Track system and demon entropy evolution
- **Temperature Chart** - Compare left vs right chamber temperatures
- **Multiplicity Curve** - Binomial distribution with current state marker
- **Toggle Charts** - Show/hide graphs for performance optimization

### 🎨 Visual Design
- Modern dark theme with glassmorphism effects
- Neon particle rendering with glow and gradient effects
- Speed-based color coding (blue = slow, red = fast)
- Animated demon overlays responding to door state
- "Perfect Demon" banner for automatic mode

---

## 🔬 Physics Concepts

### Kinetic Energy
Each particle's kinetic energy is calculated as:

$$E = \frac{1}{2}mv^2$$

Where velocity is converted from pixels/frame to m/s, and mass scales with particle radius.

### Temperature Calculation
Temperature derives from the equipartition theorem:

$$T = \frac{2E}{3Nk_B}$$

Where $E$ is total kinetic energy, $N$ is particle count, and $k_B$ is Boltzmann's constant.

### Entropy Formula
Total entropy combines spatial and combinatorial components:

$$S = S_{\text{spatial}} + S_{\text{combinatorial}}$$

$$S_{\text{comb}} = \ln\left(\frac{k!}{b!(k-b)!}\right)$$

Using Stirling's approximation for large factorials:

$$\ln(n!) \approx n\ln(n) - n + \frac{1}{2}\ln(2\pi n)$$

### Landauer's Principle
Every time the demon measures a particle at the door, entropy increases by:

$$\Delta S_{\text{demon}} = k_B T \ln(2) \approx 0.693$$

This is the fundamental cost of information processing.

### Szilard Engine
The demon operates with an entropy budget equal to the system's maximum entropy at equilibrium. When the budget is exhausted, the demon can no longer sort particles without violating thermodynamics.

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No installation or build process required!

### Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/maxwell-demon-simulation.git
   cd maxwell-demon-simulation
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   # Or use a local server:
   python -m http.server 8000
   # Then navigate to http://localhost:8000
   ```

3. **Start experimenting!**
   - Press `SPACE` to open/close the door
   - Adjust particle counts with sliders
   - Watch entropy, energy, and temperature evolve
   - Toggle charts for performance

---

## 🎯 Usage

### Basic Operation
1. **Setup** - Use sliders to add blue (slow) and red (fast) particles
2. **Observe** - Watch particles move and collide elastically
3. **Control** - Press `SPACE` to toggle the door in the center wall
4. **Analyze** - Monitor entropy, temperature, and energy in real-time

### Advanced Features
- **Perfect Demon Mode** - Enable to see automatic sorting (blue ← left | right → red)
- **Speed Multiplier** - Increase to watch faster dynamics, decrease for detailed observation
- **Chart Toggles** - Disable charts you don't need for better performance
- **How It Works** - Click the educational guide for detailed physics explanations

### Experiment Ideas
- Start with equal particles, open the door, observe entropy increase
- Enable Perfect Demon and watch the banner: "When I'm in charge Entropy shivers"
- Compare demon entropy costs in manual vs automatic mode
- Observe temperature equilibration between chambers
- Watch the multiplicity curve shift as distribution changes

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **p5.js** | Canvas rendering & physics simulation (60 FPS) |
| **Chart.js** | Real-time data visualization |
| **JavaScript ES6+** | Core logic & calculations |
| **HTML5 Canvas** | Particle rendering & animation |
| **CSS3** | Glassmorphism UI & responsive design |
| **KaTeX** | Mathematical equation rendering |

### Key Libraries
- [p5.js 1.4.0](https://p5js.org/) - Creative coding framework
- [Chart.js 3.9.1](https://www.chartjs.org/) - Chart rendering
- [KaTeX 0.16.9](https://katex.org/) - LaTeX math rendering

---

## 📁 Project Structure

```
maxwell-demon-simulation/
├── index.html              # Main simulation page
├── how-it-works.html       # Educational documentation
├── README.md               # This file
├── description.md          # Project planning notes
├── scripts/
│   ├── main.js            # Core simulation loop & UI
│   ├── ball.js            # Particle class (neon atoms)
│   ├── entropyCalculator.js  # Entropy calculations
│   ├── demon.js           # Demon behavior
│   └── [other modules]
├── style/
│   └── style.css          # Glassmorphism theme
└── assets/
    ├── demon_open.png     # Demon image (door open)
    ├── demon_closed.png   # Demon image (door closed)
    └── short-pop.mp3      # Sound effects
```

---

## 🧮 Physics Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `k_B` | 1.380649×10⁻²³ J/K | Boltzmann's constant |
| `SPEED_THRESHOLD` | 3.5 px/frame | Divides slow (blue) from fast (red) |
| `SPEED_SCALE` | 0.01 | Converts px/frame → m/s |
| `MASS_SCALE` | 10⁻²⁴ kg | Particle mass scaling |
| `J_TO_EV` | 6.242×10¹⁸ | Joules to electronvolts |
| `kBT_ln2` | 0.693 | Landauer measurement cost |

---

## 🎓 Educational Value

This simulation is perfect for:
- **Physics Students** - Visualize abstract thermodynamic concepts
- **Educators** - Demonstrate the Second Law and information theory
- **Computer Science** - See collision detection and particle physics
- **Curious Minds** - Explore the Maxwell's Demon paradox interactively

### Learning Outcomes
- Understand why entropy increases in isolated systems
- See how information has a thermodynamic cost (Landauer's Principle)
- Observe the connection between temperature and kinetic energy
- Experience elastic collision physics in real-time
- Grasp statistical mechanics through particle distributions

---

## 🐛 Known Issues

- At very high particle counts (>150), performance may degrade
- Chart rendering can impact FPS (use toggles to disable)
- Particle tunneling possible at extreme speeds (>10x multiplier)

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs or suggest features via Issues
- Submit pull requests with improvements
- Share educational resources or experiment ideas
- Improve documentation

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **McGill Physics Hackathon** - Original project inspiration
- **James Clerk Maxwell** - For the thought experiment (1867)
- **Rolf Landauer** - For connecting information and thermodynamics (1961)
- **Leo Szilard** - For the single-particle engine analysis (1929)

---

## 📬 Contact

Questions? Suggestions? Reach out!

- **GitHub Issues** - For bugs and feature requests
- **Discussions** - For questions and ideas

---

<div align="center">

**⭐ Star this repo if you find it helpful! ⭐**

Made with ❤️ for physics education

</div>
