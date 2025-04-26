const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Ensure the assets directory exists
const assetsDir = path.join(__dirname, 'extension', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Path to the SVG file
const svgPath = path.join(assetsDir, 'ghost-logo.svg');

// Icon sizes to generate
const sizes = [16, 48, 128];

// Generate PNG icons for each size
async function generateIcons() {
  try {
    // Read the SVG file
    const svgBuffer = fs.readFileSync(svgPath);
    
    // Generate each icon size
    for (const size of sizes) {
      const outputPath = path.join(assetsDir, `icon${size}.png`);
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`Generated ${outputPath}`);
    }
    
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

// Run the icon generation
generateIcons();
