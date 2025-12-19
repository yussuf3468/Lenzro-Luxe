# Android App Icon Generation Instructions

## Premium Gold Icon Design Created ✨

A luxury gold-themed icon has been designed in `android/app/src/main/res/ic_launcher_gold.svg`

## Required Sizes for Android

You need to generate PNG files at these exact sizes:

- **mdpi** (medium): 48x48 px
- **hdpi** (high): 72x72 px
- **xhdpi** (extra-high): 96x96 px
- **xxhdpi** (extra-extra-high): 144x144 px
- **xxxhdpi** (extra-extra-extra-high): 192x192 px

## Option 1: Online Tool (Easiest)

1. Go to https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html
2. Click "Image" tab
3. Upload `ic_launcher_gold.svg`
4. Select "Trim" option: Yes
5. Select "Padding": 10%
6. Download the ZIP file
7. Extract and copy all mipmap folders to `android/app/src/main/res/`

## Option 2: Using ImageMagick (Command Line)

```powershell
cd "D:\YUSSUF\Projects\Lenzro Luxe\android\app\src\main\res"

# Generate all density sizes
magick convert ic_launcher_gold.svg -resize 48x48 mipmap-mdpi/ic_launcher.png
magick convert ic_launcher_gold.svg -resize 72x72 mipmap-hdpi/ic_launcher.png
magick convert ic_launcher_gold.svg -resize 96x96 mipmap-xhdpi/ic_launcher.png
magick convert ic_launcher_gold.svg -resize 144x144 mipmap-xxhdpi/ic_launcher.png
magick convert ic_launcher_gold.svg -resize 192x192 mipmap-xxxhdpi/ic_launcher.png

# Also generate round versions (same sizes)
magick convert ic_launcher_gold.svg -resize 48x48 mipmap-mdpi/ic_launcher_round.png
magick convert ic_launcher_gold.svg -resize 72x72 mipmap-hdpi/ic_launcher_round.png
magick convert ic_launcher_gold.svg -resize 96x96 mipmap-xhdpi/ic_launcher_round.png
magick convert ic_launcher_gold.svg -resize 144x144 mipmap-xxhdpi/ic_launcher_round.png
magick convert ic_launcher_gold.svg -resize 192x192 mipmap-xxxhdpi/ic_launcher_round.png
```

## Option 3: Using Online Converter

1. Go to https://cloudconvert.com/svg-to-png
2. Upload `ic_launcher_gold.svg`
3. Set width and height for each density
4. Download and rename files
5. Place in appropriate mipmap folders

## Adaptive Icon (API 26+)

For Android 8.0+, you also need foreground and background layers:

### Background Layer (Solid Color)

Create a simple gold gradient background or solid color:

- Color: `#D97706` (amber-600)

### Foreground Layer

Use just the "L" letter with transparent background

The existing XML files will handle the composition:

- `mipmap-anydpi-v26/ic_launcher.xml`
- `mipmap-anydpi-v26/ic_launcher_round.xml`

## Files to Replace

After generating PNGs, replace these files:

```
android/app/src/main/res/
├── mipmap-mdpi/
│   ├── ic_launcher.png (48x48)
│   └── ic_launcher_round.png (48x48)
├── mipmap-hdpi/
│   ├── ic_launcher.png (72x72)
│   └── ic_launcher_round.png (72x72)
├── mipmap-xhdpi/
│   ├── ic_launcher.png (96x96)
│   └── ic_launcher_round.png (96x96)
├── mipmap-xxhdpi/
│   ├── ic_launcher.png (144x144)
│   └── ic_launcher_round.png (144x144)
└── mipmap-xxxhdpi/
    ├── ic_launcher.png (192x192)
    └── ic_launcher_round.png (192x192)
```

## Testing

After replacing the icons:

1. Rebuild the Android app:

   ```bash
   npm run build
   npx cap sync android
   ```

2. Open in Android Studio:

   ```bash
   npx cap open android
   ```

3. Run on device/emulator to see the new icon

4. Check icon in:
   - App drawer
   - Home screen
   - Recent apps screen
   - Settings > Apps

## Design Features

The new icon includes:

- ✨ Luxury 4-stop gold gradient (#B45309 → #D97706 → #F59E0B → #FB923C)
- 💫 Shimmer radial overlay for premium feel
- 📝 White "L" letter with gold gradient stroke
- 💎 Diamond/crown accent at top right
- ⭐ Strategic sparkle elements
- 🌟 Bottom shine effect for depth
- 🎨 115px border radius for rounded corners

Perfect for a luxury fashion brand! 🔥
