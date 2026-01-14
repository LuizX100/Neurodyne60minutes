import os
from PIL import Image

def convert_to_webp(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                file_path = os.path.join(root, file)
                file_name, _ = os.path.splitext(file)
                output_path = os.path.join(root, f"{file_name}.webp")
                
                try:
                    with Image.open(file_path) as img:
                        img.save(output_path, 'WEBP', quality=85)
                    print(f"Converted: {file} -> {file_name}.webp")
                except Exception as e:
                    print(f"Failed to convert {file}: {e}")

if __name__ == "__main__":
    target_directory = "/home/ubuntu/neuromax_vsl/client/public/images"
    convert_to_webp(target_directory)
