import os
import subprocess
import glob
from PIL import Image

def main():
    video_path = "/Users/fatih/Desktop/Journeo/Journeo-Web/Simulator Screen Recording - iPhone 17 - 2026-08-23 at 01.55.49.mov"
    temp_dir = "/Users/fatih/Desktop/Journeo/Journeo-Web/public/frames_temp"
    output_dir = "/Users/fatih/Desktop/Journeo/Journeo-Web/public/frames"
    
    os.makedirs(temp_dir, exist_ok=True)
    os.makedirs(output_dir, exist_ok=True)
    
    print("Step 1: Extracting JPEG frames using FFmpeg...")
    # Select 1 frame every 53 frames to get approx 300 frames from the 15861 frames.
    # Resizing width to 480px, keeping height proportional (will be 480x1042).
    ffmpeg_cmd = [
        "ffmpeg",
        "-y",
        "-i", video_path,
        "-vf", "scale=480:-1,select='not(mod(n,53))'",
        "-fps_mode", "vfr",
        "-q:v", "2",
        os.path.join(temp_dir, "frame_%04d.jpg")
    ]
    
    subprocess.run(ffmpeg_cmd, check=True)
    print("FFmpeg extraction completed successfully.")
    
    print("Step 2: Converting JPEG frames to WebP using Pillow...")
    jpg_files = sorted(glob.glob(os.path.join(temp_dir, "frame_*.jpg")))
    
    total_files = len(jpg_files)
    print(f"Found {total_files} extracted frames to convert.")
    
    for i, jpg_path in enumerate(jpg_files, start=1):
        filename = f"frame_{i:04d}.webp"
        webp_path = os.path.join(output_dir, filename)
        
        with Image.open(jpg_path) as img:
            # Save as WebP with optimized compression
            img.save(webp_path, "WEBP", quality=80, method=4)
            
        if i % 50 == 0 or i == total_files:
            print(f"Converted {i}/{total_files} frames...")
            
    print("Step 3: Cleaning up temporary JPEG files...")
    for jpg_path in jpg_files:
        try:
            os.remove(jpg_path)
        except OSError:
            pass
            
    try:
        os.rmdir(temp_dir)
    except OSError:
        pass
        
    print(f"Successfully created {total_files} WebP frames in {output_dir}.")

if __name__ == "__main__":
    main()
