# Favicon Assets - Creation Instructions

**Purpose**: Fix ERR_FILE_NOT_FOUND errors for favicon files

## Required Files

Create the following favicon files with a **"G" letter on #003d7a (KRDS primary blue) background**:

### 1. favicon.ico (16x16 ICO format)
- **Format**: ICO
- **Size**: 16x16 pixels
- **Content**: White "G" letter on #003d7a background
- **Tool**: Use online converter (favicon.io, realfavicongenerator.net) or image editor
- **Max File Size**: ~1KB

### 2. favicon-16x16.png
- **Format**: PNG
- **Size**: 16x16 pixels
- **Content**: White "G" letter on #003d7a background
- **Max File Size**: ~0.5KB

### 3. favicon-32x32.png
- **Format**: PNG
- **Size**: 32x32 pixels
- **Content**: White "G" letter on #003d7a background
- **Max File Size**: ~1KB

### 4. favicon-96x96.png
- **Format**: PNG
- **Size**: 96x96 pixels
- **Content**: White "G" letter on #003d7a background
- **Max File Size**: ~2KB

### 5. android-icon-192x192.png
- **Format**: PNG
- **Size**: 192x192 pixels
- **Content**: White "G" letter on #003d7a background
- **Max File Size**: ~4KB

## Design Specifications

- **Background Color**: #003d7a (KRDS primary blue)
- **Text Color**: #FFFFFF (white)
- **Font**: Noto Sans KR, bold weight
- **Letter**: "G" (representing 경기도의회 Gyeonggi Provincial Council)

## Total Size Budget

**Target**: ≤ 8.5KB total for all 5 files
**Performance Requirement**: Must fit within overall 15KB additions budget

## Creation Tools

### Online Tools (Recommended)
1. **favicon.io/favicon-generator** - Generate all sizes from text
2. **realfavicongenerator.net** - Comprehensive favicon package generator
3. **cloudconvert.com** - Convert PNG to ICO format

### Image Editors
1. **Figma** - Design and export multiple sizes
2. **Photoshop** - Create and optimize PNGs
3. **GIMP** - Free alternative for PNG creation

## Optimization

After creation, optimize file sizes:
```bash
# PNG optimization (if pngcrush installed)
pngcrush -brute input.png output.png

# Or use online tools:
# - tinypng.com
# - compressor.io
```

## Implementation Status

- [X] Directory created: `images/fabicon/`
- [ ] favicon.ico created (Task T004)
- [ ] favicon-16x16.png created (Task T005)
- [ ] favicon-32x32.png created (Task T006)
- [ ] favicon-96x96.png created (Task T007)
- [ ] android-icon-192x192.png created (Task T008)
- [ ] HTML links updated in index.html (Task T009)

## Next Steps

1. Create the 5 favicon files using tools above
2. Place files in this directory
3. Verify total file size ≤ 8.5KB
4. Update HTML links in index.html (automated)

**Note**: Since Claude Code cannot generate binary image files, these must be created manually using the specifications above or by a design tool.
