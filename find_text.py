import os

def search_text(root_dir, search_patterns):
    results = []
    for root, dirs, files in os.walk(root_dir):
        if 'node_modules' in root or '.next' in root:
            continue
        for file in files:
            file_path = os.path.join(root, file)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    for pattern in search_patterns:
                        if pattern in content:
                            results.append((file_path, pattern))
                            break
            except Exception:
                try:
                    with open(file_path, 'r', encoding='latin-1') as f:
                        content = f.read()
                        for pattern in search_patterns:
                            if pattern in content:
                                results.append((file_path, pattern))
                                break
                except Exception:
                    continue
    return results

# Searching for various fragments of the message shown in the screenshot
patterns = ["DESATIVADO", "PROJETOS", "infraestrutura", "configurado exclusivamente", "rotas de projetos"]
print("Searching for patterns:", patterns)
hits = search_text('.', patterns)
if hits:
    for hit in hits:
        print(f"FOUND: {hit[0]} (hit on: {hit[1]})")
else:
    print("NO HITS FOUND")
