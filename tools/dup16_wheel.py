import argparse
import os
import sys
from pathlib import Path
from tkinter import filedialog, messagebox
import tkinter as tk
from PIL import Image

def select_image_file():
    """Open file explorer to select an image file."""
    root = tk.Tk()
    root.withdraw()  # Hide the main window
    
    file_path = filedialog.askopenfilename(
        title="Select an image file",
        filetypes=[
            ("Image files", "*.png *.jpg *.jpeg *.bmp *.tiff *.webp"),
            ("PNG files", "*.png"),
            ("JPEG files", "*.jpg *.jpeg"),
            ("All files", "*.*")
        ]
    )
    
    root.destroy()
    return file_path

def confirm_path(file_path):
    """Ask user to confirm the selected path."""
    # Always show absolute path for confirmation
    absolute_path = Path(file_path).resolve()
    print(f"\nSelected file: {absolute_path}")
    while True:
        confirm = input("Confirm this path? (y/n): ").lower().strip()
        if confirm in ['y', 'yes']:
            return True
        elif confirm in ['n', 'no']:
            return False
        else:
            print("Please enter 'y' for yes or 'n' for no.")

def make_square_image(image):
    """Convert image to square by padding with transparent pixels."""
    width, height = image.size
    
    if width == height:
        print("✅ Image is already square!")
        return image
    
    print(f"⚠️  Image is not square ({width}x{height}). Making it square...")
    
    # Find the longest side
    max_size = max(width, height)
    
    # Create a new square image with transparent background
    if image.mode != 'RGBA':
        image = image.convert('RGBA')
    
    square_image = Image.new('RGBA', (max_size, max_size), (0, 0, 0, 0))
    
    # Calculate position to center the original image
    x_offset = (max_size - width) // 2
    y_offset = (max_size - height) // 2
    
    # Paste the original image onto the square canvas
    square_image.paste(image, (x_offset, y_offset))
    
    print(f"✅ Image converted to square ({max_size}x{max_size})")
    return square_image

def resize_image(image, target_size):
    """Resize image to target size."""
    current_size = image.size[0]  # Assuming square image
    if current_size != target_size:
        print(f"🔄 Resizing image from {current_size}x{current_size} to {target_size}x{target_size}")
        image = image.resize((target_size, target_size), Image.Resampling.LANCZOS)
    return image

def create_4x4_grid(image):
    """Create a 4x4 grid with the same image repeated 16 times."""
    single_size = image.size[0]  # Assuming square image
    grid_size = single_size * 4
    
    print(f"🔄 Creating 4x4 grid ({grid_size}x{grid_size})...")
    
    # Create the grid image
    grid_image = Image.new('RGBA', (grid_size, grid_size), (0, 0, 0, 0))
    
    # Paste the image 16 times (4x4 grid)
    for row in range(4):
        for col in range(4):
            x = col * single_size
            y = row * single_size
            grid_image.paste(image, (x, y))
    
    print("✅ 4x4 grid created successfully!")
    return grid_image

def generate_output_path(input_path, custom_name=None):
    """Generate the output file path."""
    input_path = Path(input_path)
    
    if custom_name:
        output_name = f"{custom_name}.png"
    else:
        output_name = f"{input_path.stem}_16_wheel.png"
    
    output_path = input_path.parent / output_name
    return output_path

def main():
    parser = argparse.ArgumentParser(
        description='Create a 4x4 grid from a single image for wheel textures',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python dup16_wheel.py                           # Use file explorer, default 2048x2048
  python dup16_wheel.py --path image.png          # Use specified path
  python dup16_wheel.py --path ../images/wheel.png --size 1024  # Relative path with custom size
  python dup16_wheel.py --size 512 --name custom  # File explorer with custom settings
        """
    )
    
    parser.add_argument(
        '--size', '-s',
        type=int,
        default=2048,
        help='Final size of the output image (must be divisible by 4, default: 2048)'
    )
    
    parser.add_argument(
        '--name', '-n',
        type=str,
        help='Custom name for output file (without extension)'
    )
    
    parser.add_argument(
        '--path', '-p',
        type=str,
        help='Path to the input image file (relative or absolute). If not provided, file explorer will open.'
    )
    
    args = parser.parse_args()
    
    # Validate size parameter
    if args.size % 4 != 0:
        print(f"❌ Error: Size {args.size} is not divisible by 4!")
        print("The size must be divisible by 4 to create a proper 4x4 grid.")
        sys.exit(1)
    
    if args.size <= 0:
        print(f"❌ Error: Size must be positive, got {args.size}")
        sys.exit(1)
    
    # Calculate individual image size
    individual_size = args.size // 4
    print(f"📏 Target grid size: {args.size}x{args.size}")
    print(f"📏 Individual image size: {individual_size}x{individual_size}")
    
    # Get image path
    if args.path:
        # Use provided path
        image_path = args.path
        
        # Check if file exists
        if not Path(image_path).exists():
            print(f"❌ Error: File not found: {image_path}")
            sys.exit(1)
    else:
        # Use file explorer
        print("🗂️  Opening file explorer...")
        image_path = select_image_file()
        
        if not image_path:
            print("❌ No file selected. Exiting.")
            sys.exit(1)
    
    # Confirm path (always show absolute path)
    if not confirm_path(image_path):
        print("❌ Path not confirmed. Exiting.")
        sys.exit(1)
    
    try:
        # Load the image
        print(f"📁 Loading image: {image_path}")
        image = Image.open(image_path)
        print(f"📊 Original image size: {image.size[0]}x{image.size[1]}")
        
        # Make it square
        square_image = make_square_image(image)
        
        # Resize to individual size
        resized_image = resize_image(square_image, individual_size)
        
        # Create 4x4 grid
        grid_image = create_4x4_grid(resized_image)
        
        # Generate output path
        output_path = generate_output_path(image_path, args.name)
        
        # Save the result
        print(f"💾 Saving result to: {output_path}")
        grid_image.save(output_path, 'PNG')
        
        print(f"🎉 Successfully created 4x4 wheel texture!")
        print(f"📁 Output file: {output_path}")
        print(f"📊 Final size: {grid_image.size[0]}x{grid_image.size[1]}")
        
    except Exception as e:
        print(f"❌ Error processing image: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()