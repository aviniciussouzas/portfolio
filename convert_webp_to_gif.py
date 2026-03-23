from PIL import Image

def webp_to_gif(input_path, output_path):
    im = Image.open(input_path)
    im.info.pop('background', None)
    im.save(output_path, 'gif', save_all=True)

webp_to_gif('C:/Users/avini/.gemini/antigravity/brain/fabd3e6c-c50e-44d4-b03c-10892bd429ce/hero_section_recording_1774235374254.webp', r'C:\Users\avini\OneDrive\Desktop\portfolio\hero_scramble_15s.gif')
print("Converted to GIF")
