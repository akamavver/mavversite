import os
import json

IMAGES_DIR = "Images/mavver"
OUTPUT_FILE = "images.json"

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def ensure_directory():
    if not os.path.exists(IMAGES_DIR):
        os.makedirs(IMAGES_DIR)
        print(f"[INFO] Папка создана: {IMAGES_DIR}")


def scan_images():
    files = []

    for file in os.listdir(IMAGES_DIR):
        path = os.path.join(IMAGES_DIR, file)

        if not os.path.isfile(path):
            continue

        ext = os.path.splitext(file)[1].lower()

        if ext in ALLOWED_EXTENSIONS:
            files.append(file)

    return sorted(files)


def generate_json(images):
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(images, f, indent=2, ensure_ascii=False)


def main():
    print("[START] Генерация images.json")

    ensure_directory()

    images = scan_images()

    if not images:
        print("[WARN] Изображения не найдены")
    else:
        print(f"[INFO] Найдено изображений: {len(images)}")

    generate_json(images)

    print(f"[DONE] Файл создан: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()