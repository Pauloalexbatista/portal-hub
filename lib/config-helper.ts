import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_CONFIG_PATH = path.join(DATA_DIR, "config.json");
const DEFAULT_CONFIG_PATH = path.join(process.cwd(), "lib", "config.json");

export function getConfig() {
    if (fs.existsSync(DATA_CONFIG_PATH)) {
        return JSON.parse(fs.readFileSync(DATA_CONFIG_PATH, "utf8"));
    }
    // Fallback to default bundled config
    return JSON.parse(fs.readFileSync(DEFAULT_CONFIG_PATH, "utf8"));
}

export function saveConfig(config: any) {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_CONFIG_PATH, JSON.stringify(config, null, 4), "utf8");
}
