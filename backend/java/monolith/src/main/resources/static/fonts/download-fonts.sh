#!/bin/bash
# Script to download required fonts for report generation

# Exit on any error
set -e

# Set the directory for downloads
TEMP_DIR=$(mktemp -d)
SCRIPT_DIR=$(dirname "$(realpath "$0")")
FONTS_DIR="${SCRIPT_DIR}"

# If you want to use a different target directory, you can pass it as an argument
if [ $# -gt 0 ]; then
    FONTS_DIR="$1"
fi

# Create fonts directory if it doesn't exist
mkdir -p "$FONTS_DIR"

echo "Downloading fonts to temporary directory: $TEMP_DIR"
echo "Fonts will be installed to: $FONTS_DIR"

# Download DejaVu fonts
echo "Downloading DejaVu fonts..."
wget -q https://github.com/dejavu-fonts/dejavu-fonts/releases/download/version_2_37/dejavu-fonts-ttf-2.37.tar.bz2 -O "$TEMP_DIR/dejavu.tar.bz2"
tar -xf "$TEMP_DIR/dejavu.tar.bz2" -C "$TEMP_DIR"
cp "$TEMP_DIR"/dejavu-fonts-ttf-2.37/ttf/DejaVuSans.ttf "$FONTS_DIR/"
cp "$TEMP_DIR"/dejavu-fonts-ttf-2.37/ttf/DejaVuSans-Bold.ttf "$FONTS_DIR/"

# Download Roboto fonts
echo "Downloading Roboto fonts..."
wget -q https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Regular.ttf -O "$FONTS_DIR/Roboto-Regular.ttf"
wget -q https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Bold.ttf -O "$FONTS_DIR/Roboto-Bold.ttf"
wget -q https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Light.ttf -O "$FONTS_DIR/Roboto-Light.ttf"

# Clean up
echo "Cleaning up temporary files..."
rm -rf "$TEMP_DIR"

echo -e "\nAll fonts have been downloaded to: $FONTS_DIR"
ls -la "$FONTS_DIR"
echo "Done!"