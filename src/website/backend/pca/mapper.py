import os
import json

def create_artist_mapping(pictures_folder, audio_folder, output_json="mapper.json"):
    artist_mapping = {}

    
    picture_artists = sorted(os.listdir(pictures_folder))

    # Map artist folders
    for artist in picture_artists:
        picture_path = os.path.join(pictures_folder, artist)
        audio_path = os.path.join(audio_folder, artist)

        if os.path.isdir(picture_path) and os.path.isdir(audio_path):
            artist_mapping[artist] = {
                "image_folder": picture_path,
                "audio_folder": audio_path
            }

    # Save sebagai JSON
    with open(output_json, "w") as json_file:
        json.dump(artist_mapping, json_file, indent=4)

    print(f"Artist mapping saved to {output_json}")


pictures4 = "src/website/uploads/pictures/pictures4"
audio4 = "src/website/uploads/audios/audio4"
create_artist_mapping(pictures4, audio4)
