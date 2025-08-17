from pathlib import Path
from typing import Iterable, Generator

def yield_decal_folders(root: Path | str, marker_name: str = ".decal.yaml") -> Generator[Path, None, None]:
    """
    Depth-first (height-first) recursive generator that yields decal folders.
    A folder is considered a decal folder if it contains any of the marker files
    specified by `marker_name`. Once a decal folder is found, recursion stops
    for that branch (we assume decals do not contain nested decals).

    Args:
        root: Path or string pointing to the directory to scan.
        marker_name: Name of the marker filename to detect a decal folder.

    Yields:
        Path objects pointing to decal folders (where a marker file exists).
    """
    root_path = Path(root)

    if not root_path.exists():
        return

    def _dfs(dirp: Path):
        # If current folder contains a marker file => this is a decal folder
        if (dirp / marker_name).is_file():
            yield dirp
            return  # stop exploring this branch further

        # Otherwise, explore children depth-first (sorted for deterministic order)
        try:
            children = sorted(p for p in dirp.iterdir() if p.is_dir())
        except (PermissionError, FileNotFoundError):
            return

        for child in children:
            yield from _dfs(child)

    yield from _dfs(root_path)